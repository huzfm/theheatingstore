'use client';

import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  ROLL_WIDTH,
  ROLL_LENGTH,
  ROLL_FLAT,
  ROLL_CORE,
  ROLL_THICKNESS,
  MAT_SPACING_150,
  MAT_CABLE_RADIUS,
  TAPE_WIDTH,
} from './constants';
import { buildMatCable, matTapes } from './mat-layout';
import { createRoll, rolledStrip } from './mat-roll';
import {
  matScrimAlpha,
  matScrimAlbedo,
  matTapeAlbedo,
  matCableSheath,
} from '@/lib/textures';

/**
 * A ProWarm 150 W sticky mat, part unrolled, as a product rather than a diagram.
 *
 * Everything is checked against public/PDFs/prowarm.pdf: a 500 mm roll of
 * self-adhesive black glass-fibre scrim, a 2 mm orange-red FEP element bonded
 * on at 65 mm pitch (the pitch p.42's output table gives for 150 W/m²), and
 * three cream reinforcement strips down the length.
 *
 * The black three-core cold lead is deliberately not shown. It is on the real
 * product, but it is a coil of mains flex a metre across at this scale: it took
 * up as much frame as the mat, dragged the composition off to one side, and the
 * camera had to pull back far enough to fit it that the element - the thing
 * actually worth looking at - lost most of its size. The element is capped at
 * both ends instead, so nothing reads as cut off.
 *
 * Reuse, and where it stops:
 *
 *  - The serpentine comes straight from buildMatCable() in mat-layout.js. That
 *    generator already models the thing that decides whether a render reads as a
 *    mat or as hatching: the element runs *across* the 500 mm width and turns
 *    back on itself with a true half-circle at both long edges. Rebuilding it
 *    would have been the one genuinely wasteful thing to redo. It gained a
 *    `warp` hook so the flat run can be wound onto the roll, which is four
 *    lines and leaves its existing callers byte-identical.
 *  - CableModel is deliberately not reused. It is an emissive orange tube with
 *    an additive glow shell and a scrolling heat map - right for the scroll
 *    scene's "this is what makes the warmth" beat, wrong here, where a mat you
 *    can put in a basket is red, matte and unlit. Its *approach* is kept:
 *    TubeGeometry, a braided sheath map, and a segment count driven by arc
 *    length so the return bends never go faceted.
 */

/** One weave tile spans this much sheet, i.e. ~18 mm cells at 8 per tile. */
const SCRIM_TILE = 0.25;

/** Reinforcement tape print recurs every ~160 mm along the roll. */
const TAPE_TILE = 0.28;

/** Where the element sits above the scrim: one cable radius, as bonded. */
const CABLE_LIFT = MAT_CABLE_RADIUS + 0.0015;

/** Tape goes over the cable, so it clears the element's full diameter. */
const TAPE_LIFT = MAT_CABLE_RADIUS * 2 + 0.003;

/**
 * Stand the mat up, face to camera.
 *
 * createRoll builds it lying down - length along X, width along Z, face up -
 * because that is the natural frame for a winding transform. Presenting it is
 * one quarter turn about X, which tips that face upright without touching the
 * length: the sheet ends up parallel to the screen with the cable side looking
 * out of it, the 500 mm width standing vertical, the roll on the right and the
 * flap unrolled away to the left. Held like a page, in other words.
 *
 * Turning about X rather than Z is the whole difference between this and the
 * mat lying flat, and it is easy to get backwards: +90° sends the face normal
 * from +Y to +Z (out of the screen), -90° sends it to -Z and quietly presents
 * the *back* of the mat - the bare mesh, with the cable hidden behind it.
 */
const UPRIGHT = [Math.PI / 2, 0, 0];

/**
 * A short rigid sleeve across a splice.
 *
 * Both joints on a real mat are moulded lumps rather than bare cable, and both
 * installation guides in this repo shout about them - Fastwarm's is in capitals
 * ("DO NOT BEND THE COLD TAIL JOINT AT ANY POINT"). Fatter than either cable it
 * bridges, so it hides the transition instead of sitting next to it.
 */
function Joint({ curve, t, length, radius, color = '#1b1a1d' }) {
  const { position, quaternion } = useMemo(() => {
    const tangent = curve.getTangentAt(t).normalize();
    return {
      position: curve.getPointAt(t),
      // A CylinderGeometry's axis is +Y, so aligning it with the run is one
      // rotation from up to the local tangent.
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        tangent
      ),
    };
  }, [curve, t]);

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 12, 1]} />
      <meshStandardMaterial color={color} roughness={0.42} metalness={0.08} envMapIntensity={1.1} />
    </mesh>
  );
}

function HeatingMatModel() {
  const scrimAlpha = useMemo(() => matScrimAlpha(), []);
  const scrimAlbedo = useMemo(() => matScrimAlbedo(), []);
  const tapeAlbedo = useMemo(() => matTapeAlbedo(), []);
  const sheath = useMemo(() => matCableSheath(), []);

  const roll = useMemo(
    () =>
      createRoll({
        width: ROLL_WIDTH,
        length: ROLL_LENGTH,
        flat: ROLL_FLAT,
        core: ROLL_CORE,
        thickness: ROLL_THICKNESS,
      }),
    []
  );

  const tapes = useMemo(() => matTapes({ length: ROLL_WIDTH, bands: 1, seam: 0 }), []);

  /**
   * The element, laid out flat and then wound on.
   *
   * buildMatCable centres its passes on x = 0, so shifting by half the length
   * turns that into the roll's own arc coordinate. Because the passes run along
   * Z at constant X, each one lands at a single position on the wind - so the
   * cable spirals up the roll with its return bends stacked neatly along both
   * edges, which is exactly what the real product does and is not something
   * that had to be arranged.
   */
  const cable = useMemo(
    () =>
      buildMatCable({
        width: ROLL_LENGTH,
        length: ROLL_WIDTH,
        bands: 1,
        seam: 0,
        spacing: MAT_SPACING_150,
        warp: (p) => roll.map(p.x + ROLL_LENGTH / 2, CABLE_LIFT, p.z),
      }),
    [roll]
  );

  /**
   * Tube density is set by the tightest feature on the run, which is the 180°
   * return bend: half a circle of radius 32 mm, so ~0.1 units of arc that needs
   * ten-odd segments before it stops looking chamfered. Radial segments go to 8
   * rather than the scroll scene's 6, because here the cable's silhouette is a
   * couple of pixels wide and a hexagonal tube would show on it.
   */
  const cableGeometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        cable,
        Math.min(3600, Math.max(600, Math.round(cable.getLength() * 48))),
        MAT_CABLE_RADIUS,
        8,
        false
      ),
    [cable]
  );

  const scrimGeometry = useMemo(
    () => rolledStrip(roll, { width: ROLL_WIDTH, lift: 0 }),
    [roll]
  );

  const tapeGeometries = useMemo(
    () =>
      tapes.map((tape) => ({
        key: tape.key,
        geometry: rolledStrip(roll, { z: tape.z, width: tape.width, lift: TAPE_LIFT }),
      })),
    [roll, tapes]
  );

  // three.js does not garbage collect GPU buffers. Textures are shared through
  // the cache in lib/textures.js and released by its refcount, not here.
  useEffect(
    () => () => {
      cableGeometry.dispose();
      scrimGeometry.dispose();
      tapeGeometries.forEach((t) => t.geometry.dispose());
    },
    [cableGeometry, scrimGeometry, tapeGeometries]
  );

  /**
   * The offset that puts the standing product on the turn axis.
   *
   * Measured off the real geometry rather than worked out from the constants, so
   * it stays correct if the roll's length, the coil or the cable's margins are
   * ever changed - an off-centre product does not look wrong standing still, it
   * looks wrong the moment it starts turning, which is the harder bug to spot.
   *
   * Three composes a node as T·R, so the translation has to cancel the *rotated*
   * centre. UPRIGHT sends (x, y, z) to (x, -z, y), hence the shuffle.
   */
  const centre = useMemo(() => {
    const box = new THREE.Box3();
    [scrimGeometry, cableGeometry, ...tapeGeometries.map((t) => t.geometry)].forEach(
      (geometry) => {
        geometry.computeBoundingBox();
        box.union(geometry.boundingBox);
      }
    );

    const mid = box.getCenter(new THREE.Vector3());
    return [-mid.x, mid.z, -mid.y];
  }, [scrimGeometry, cableGeometry, tapeGeometries]);

  return (
    <group position={centre}>
      <group rotation={UPRIGHT}>
        {/* ── Scrim ──────────────────────────────────────────────────
            Alpha blending, not alphaTest. A hard cutout keeps crisp strands up
            close, but the moment the map minifies, the mid-grey alpha sitting at
            the threshold makes whole strands blink out; blending degrades to an
            even grey wash instead. depthWrite is off, as any blended surface
            needs, and costs nothing here because the scrim is the bottom of the
            stack - the cable and tape above it are opaque and depth-test
            against it correctly. */}
        <mesh geometry={scrimGeometry}>
          <meshStandardMaterial
            map={scrimAlbedo}
            map-repeat={[1 / SCRIM_TILE, 1 / SCRIM_TILE]}
            alphaMap={scrimAlpha}
            alphaMap-repeat={[1 / SCRIM_TILE, 1 / SCRIM_TILE]}
            transparent
            roughness={0.84}
            metalness={0}
            // Up a little from 0.5. The scrim is black, so the environment is
            // the only thing that can put an edge on the strands - without some
            // of it the mesh turns into a flat silhouette against the light
            // backdrop the moment it rotates away from the key. Kept modest, or
            // the reflected studio greys the black out.
            envMapIntensity={0.62}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ── Cardboard core ────────────────────────────────────────
            Open-ended and double-sided, so looking into the end of the roll you
            see through the bore to the far inside wall. That read is what makes
            it a tube rather than a peg. */}
        <mesh position={[roll.tangentX, roll.centreY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry
            args={[roll.core - 0.002, roll.core - 0.002, ROLL_WIDTH * 1.03, 40, 1, true]}
          />
          {/* Desaturated from #8b6b45. Recycled board is a greyed buff, not a
              tan leather; the old value was the colour of the cardboard in a
              stock illustration and it read as the brightest thing on the
              product. */}
          <meshStandardMaterial
            color="#9c8a6e"
            roughness={0.96}
            metalness={0}
            envMapIntensity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ── Element ────────────────────────────────────────────────
            Matte satin. FEP has a slight sheen but it is not a polished
            surface, and nothing about a mat in a box is emissive.

            No colour tint any more. The tint was multiplying the sheath map,
            and two reds multiplied are not a red - #a82e21 through #d24a33
            landed near #8a0d07, a near-black maroon that only looked like cable
            because the old backdrop was darker still. The jacket's colour now
            lives in the map alone, where it can be judged against the product
            photo instead of against whatever the tint happened to do to it. */}
        <mesh geometry={cableGeometry}>
          <meshStandardMaterial
            map={sheath}
            roughness={0.38}
            metalness={0.04}
            envMapIntensity={1.1}
          />
        </mesh>

        {/* Sealed terminations at both ends of the run. One finishes inside the
            roll, which is where a real one is - out of sight, and correct; the
            other caps the end the cold lead used to leave from, so the element
            reads as terminated rather than as a tube that stops. */}
        <Joint curve={cable} t={1} length={0.028} radius={MAT_CABLE_RADIUS * 2.2} />
        <Joint curve={cable} t={0} length={0.034} radius={MAT_CABLE_RADIUS * 2.4} />

        {/* ── Reinforcement tape ────────────────────────────────────
            Above the cable, because that is where it is: the strips bridge every
            pass they cross and hold the element down. Running them under the
            cable is the tell that separates a render from the product photo, and
            on the roll they read as the cream bands wrapping its circumference. */}
        {tapeGeometries.map((tape) => (
          <mesh key={tape.key} geometry={tape.geometry}>
            {/* rolledStrip writes UVs in world units, so one tile across the
                tape's width is repeat = 1/width, and the print never stretches
                however wide the tape is set. */}
            <meshStandardMaterial
              map={tapeAlbedo}
              map-repeat={[1 / TAPE_TILE, 1 / TAPE_WIDTH]}
              roughness={0.8}
              metalness={0}
              envMapIntensity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default memo(HeatingMatModel);
