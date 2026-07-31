import * as THREE from 'three';
import {
  MAT_W,
  MAT_L,
  MAT_BANDS,
  BAND_SEAM,
  CABLE_SPACING,
  CABLE_INSET,
  CABLE_MARGIN,
  TAPE_WIDTH,
  TAPE_OFFSETS,
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
 */
export function buildMatCable({
  width = MAT_W,
  length = MAT_L,
  bands = MAT_BANDS,
  seam = BAND_SEAM,
  spacing = CABLE_SPACING,
  inset = CABLE_INSET,
  margin = CABLE_MARGIN,
  /**
   * Optional point-by-point remap applied just before the spline is fitted, so
   * a caller can lay the run out flat here and then bend the result - which is
   * how the product viewer winds it onto a roll without this file needing to
   * know anything about rolls. Warping the control points rather than the
   * finished curve matters: the spline is then fitted *through* the bent path,
   * so the return bends stay bends instead of being chords across a curve.
   */
  warp = null,
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
   * nearest the next one. That is what lets the crossing between strips be a
   * straight link rather than a detour, and it means the cable never doubles
   * back across a strip it has already covered, which is exactly the
   * constraint a real installer is working under.
   */
  if (passes % 2 === 0) passes -= 1;

  const span = (passes - 1) * spacing;
  const points = [];

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

      // Seed the very first point; every later pass already begins on the end
      // of the bend or link that led into it.
      if (points.length === 0) points.push(new THREE.Vector3(x, 0, zA));
      line(points, x, zA, x, zB, STRAIGHT_STEPS);

      if (i < passes - 1) hairpin(points, x, x + step, zB, zDir);
      zDir = -zDir;
    }

    if (b < bands - 1) {
      /**
       * Crossing into the next strip. A straight link, square across the seam.
       *
       * This was a curved loop bulging out past the end of the strip, on the
       * reasoning that a real cable is left slack where the mesh is cut. But
       * the odd pass count already leaves this strip finishing on the edge
       * that faces the next one, so the curve was a detour with nothing to
       * avoid: it read as a stray bend breaking an otherwise square grid.
       * Straight is both tidier and the shorter path the cable would take.
       */
      const xLast = xFirst + step * (passes - 1);
      line(points, xLast, zc + zHalf, xLast, zc + pitch - zHalf, STRAIGHT_STEPS);
    }
  }

  const path = warp ? points.map((p) => warp(p)) : points;

  const curve = new THREE.CatmullRomCurve3(path, false, 'centripetal', 0.5);
  /**
   * three.js defaults to 200 arc-length divisions regardless of control point
   * count. Across ~1000 points that is five points per division, so getPointAt
   * distributes tube segments unevenly and the return bends get starved. The
   * table is built once at mount.
   */
  curve.arcLengthDivisions = Math.min(4000, path.length * 3);

  return curve;
}

/**
 * The cream reinforcement tape, as { z, width } per strip.
 *
 * Three strips per 500 mm band, laid along the roll rather than across it, and
 * rendered *above* the cable, because on the real mat that is what pins the
 * cable to the scrim (see the roll on p.40 of the ProWarm guide, where each
 * strip visibly bridges every pass it crosses).
 */
export function matTapes({
  length = MAT_L,
  bands = MAT_BANDS,
  seam = BAND_SEAM,
  width = TAPE_WIDTH,
  offsets = TAPE_OFFSETS,
} = {}) {
  const pitch = length / bands;
  const strip = pitch - seam;
  const out = [];

  for (let band = 0; band < bands; band += 1) {
    const zc = -length / 2 + pitch / 2 + band * pitch;
    offsets.forEach((offset, i) => {
      out.push({ key: `${band}-${i}`, z: zc + offset * strip, width });
    });
  }

  return out;
}
