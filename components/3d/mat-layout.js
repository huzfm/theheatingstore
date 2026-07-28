import * as THREE from 'three';
import {
  MAT_W,
  MAT_L,
  MAT_BANDS,
  BAND_SEAM,
  CABLE_SPACING,
  CABLE_INSET,
  CABLE_MARGIN,
} from './constants';

/**
 * Geometry of a laid electric heating mat.
 *
 * See constants.js for the product facts this encodes. The short version:
 * the mat is a 500 mm roll, it is laid as parallel strips with the mesh cut
 * and turned at each end, and the cable inside a strip runs *across* the
 * 500 mm width, not along the room. That last point is the one that decides
 * whether a render reads as a heating mat or as hatching, because it is what
 * puts a rhythm of tight 180° return bends along both edges of every strip.
 *
 * Kept out of the components so the scrim strips in HeatingSheetModel and the
 * cable in CableModel are laid out from one source of truth, rather than two
 * files agreeing by coincidence.
 */

/**
 * Control points per straight pass. Enough that the Catmull-Rom through them
 * cannot bow between the return bends at either end, and close enough to the
 * arc's point spacing that the junction between the two stays clean.
 */
const STRAIGHT_STEPS = 6;

/** Control points per 180° bend. The tube is resampled by arc length later,
 *  so this only has to describe the arc, not resolve it. */
const ARC_STEPS = 8;

function line(points, x0, z0, x1, z1, steps) {
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    points.push(new THREE.Vector3(x0 + (x1 - x0) * t, 0, z0 + (z1 - z0) * t));
  }
}

/**
 * The return bend joining one pass to the next, a true half-circle of radius
 * spacing/2 swinging out past the end of the pass. This is the single most
 * recognisable feature of a mat and the thing the old path did not have: it
 * stepped over with a straight jog and let the spline round the corner, which
 * at 1.7 tube segments per turn rendered as a faceted kink.
 */
function hairpin(points, xFrom, xTo, z, zDir) {
  const cx = (xFrom + xTo) / 2;
  const r = Math.abs(xTo - xFrom) / 2;
  const sx = Math.sign(xTo - xFrom);

  for (let i = 1; i <= ARC_STEPS; i += 1) {
    const th = (Math.PI * i) / ARC_STEPS;
    points.push(
      new THREE.Vector3(cx - Math.cos(th) * r * sx, 0, z + Math.sin(th) * r * zDir)
    );
  }
}

/**
 * The longer loop where the run crosses from one strip of mesh into the next.
 * On a real floor this is the slack left after the mesh is cut and the roll
 * turned, so it bulges out past the end of the strip rather than cutting the
 * corner. Two of these are the only places the cable leaves a strip.
 */
function seamLoop(points, x, zFrom, zTo, bulge) {
  const mz = (zFrom + zTo) / 2;
  const r = Math.abs(zTo - zFrom) / 2;
  const sz = Math.sign(zTo - zFrom);
  const steps = ARC_STEPS * 2;

  for (let i = 1; i <= steps; i += 1) {
    const th = (Math.PI * i) / steps;
    points.push(
      new THREE.Vector3(x + Math.sin(th) * r * bulge, 0, mz - Math.cos(th) * r * sz)
    );
  }
}

/**
 * The strips of scrim, as { z, width } in the mat's local space. The cable
 * path below walks these same strips.
 */
export function matBands({ length = MAT_L, bands = MAT_BANDS, seam = BAND_SEAM } = {}) {
  const pitch = length / bands;

  return Array.from({ length: bands }, (_, index) => ({
    index,
    z: -length / 2 + pitch / 2 + index * pitch,
    width: pitch - seam,
  }));
}

/**
 * The full cable run: one continuous curve through every strip, which is
 * physically what a mat is (the cable is never cut, only the mesh).
 *
 * Returns the curve plus its free start, so the cold tail can be joined to
 * where the heating cable actually begins instead of a hardcoded corner.
 */
export function buildMatCable({
  width = MAT_W,
  length = MAT_L,
  bands = MAT_BANDS,
  seam = BAND_SEAM,
  spacing = CABLE_SPACING,
  inset = CABLE_INSET,
  margin = CABLE_MARGIN,
} = {}) {
  const pitch = length / bands;
  const meshHalf = (pitch - seam) / 2;
  const turnR = spacing / 2;

  // Half-length of a straight pass: the mesh edge, less the border the cable
  // is held in by, less the room the return bend needs to swing through
  // without overhanging the scrim.
  const zHalf = Math.max(spacing, meshHalf - inset - turnR);

  let passes = Math.floor((width - margin * 2) / spacing) + 1;
  /**
   * Forced odd, which makes the whole run tidy: with an odd pass count each
   * strip starts at the edge nearest the previous strip and ends at the edge
   * nearest the next one. The seam loops stay short and local, and the cable
   * never has to double back across a strip it has already covered, which is
   * exactly the constraint a real installer is working under.
   */
  if (passes % 2 === 0) passes -= 1;

  const span = (passes - 1) * spacing;
  const points = [];
  let start = null;

  for (let b = 0; b < bands; b += 1) {
    const zc = -length / 2 + pitch / 2 + b * pitch;
    // Alternate direction per strip: the roll is turned 180° at the wall, so
    // consecutive strips are laid in opposite directions.
    const forward = b % 2 === 0;
    const xFirst = forward ? -span / 2 : span / 2;
    const step = forward ? spacing : -spacing;

    // Pass i runs in direction (-1)^i. Starting at +1 with an odd pass count
    // lands the final pass on the +z edge, against the next strip.
    let zDir = 1;

    for (let i = 0; i < passes; i += 1) {
      const x = xFirst + step * i;
      const zA = zc - zHalf * zDir;
      const zB = zc + zHalf * zDir;

      if (points.length === 0) {
        start = new THREE.Vector3(x, 0, zA);
        points.push(start.clone());
      }
      line(points, x, zA, x, zB, STRAIGHT_STEPS);

      if (i < passes - 1) hairpin(points, x, x + step, zB, zDir);
      zDir = -zDir;
    }

    if (b < bands - 1) {
      // Bulge away from the middle of the mat, i.e. past whichever end this
      // strip finished at, so the loop sits on bare substrate.
      seamLoop(points, xFirst + step * (passes - 1), zc + zHalf, zc + pitch - zHalf, forward ? 1 : -1);
    }
  }

  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
  /**
   * three.js defaults to 200 arc-length divisions regardless of control point
   * count. Across ~1000 points that is five points per division, so getPointAt
   * distributes tube segments unevenly and the return bends get starved. The
   * table is built once at mount.
   */
  curve.arcLengthDivisions = Math.min(4000, points.length * 3);

  return {
    curve,
    start,
    end: points[points.length - 1].clone(),
    passes,
    zHalf,
  };
}
