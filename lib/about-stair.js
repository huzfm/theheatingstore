import { MILESTONES } from '@/components/sections/About/data';

/**
 * Single source of truth for the About timeline's spiral staircase.
 *
 * Same contract as lib/story-rail.js and lib/floor-timeline.js: the layout and
 * the scroll animation both read these numbers, so the geometry can never
 * drift out of sync with the rotation that's meant to reveal it.
 *
 * Nothing here is authored content. The steps ARE the milestones, so adding or
 * removing one in components/sections/About/data.js re-derives the step angle,
 * the total rotation, the wedge clip and the section's scroll length with no
 * other edit. That is the whole reason this file exists rather than a handful
 * of constants sitting in the component.
 */

const DEG = Math.PI / 180;

export const STEPS = MILESTONES;
export const STEP_COUNT = STEPS.length;

/** One full revolution shared between the steps. 72° at five milestones. */
export const STEP_ANGLE = 360 / STEP_COUNT;

/**
 * How far the whole structure turns across the section, in degrees.
 *
 * Deliberately NOT a full 360°. Step i is front-facing when the container has
 * turned -i × STEP_ANGLE, so a literal 360° would bring step 0 back to the
 * front at the end and the section would close on 2011 rather than on the last
 * milestone. Stopping one step short means each milestone faces the visitor
 * exactly once and the final one is the resting state.
 *
 * Negative because the container turns anticlockwise, which walks the steps
 * towards the camera in ascending order rather than descending.
 */
export const TOTAL_ROTATION = -STEP_ANGLE * (STEP_COUNT - 1);

/* ── Geometry, in px. The stage is only built at lg+ (≥1024px), where these
      fixed sizes always fit, so nothing here needs to be responsive. ── */

/** Vertical gain per step, and therefore the riser height. */
export const RISE = 78;

/** Radius to the outer edge of a tread. */
export const OUTER_R = 240;

/** The central post the treads spring from. */
export const NEWEL_R = 38;
export const NEWEL_W = NEWEL_R * 2;

/** Tread depth: from the face of the newel out to the nosing. */
export const TREAD_D = OUTER_R - NEWEL_R;

/**
 * Tread width, measured across the outer edge. A wedge subtending STEP_ANGLE
 * with straight sides has half-width r·tan(STEP_ANGLE/2) at radius r, so this
 * is the width at r = OUTER_R and the clip below tapers it back to the newel.
 */
export const TREAD_W = 2 * OUTER_R * Math.tan((STEP_ANGLE / 2) * DEG);

/**
 * The wedge itself. The unrotated tread div runs inner-edge (top) to
 * outer-edge (bottom), so the taper is on the top edge only.
 */
const INNER_PCT = (NEWEL_R / OUTER_R) * 100;
export const TREAD_CLIP = `polygon(${(100 - INNER_PCT) / 2}% 0%, ${
  (100 + INNER_PCT) / 2
}% 0%, 100% 100%, 0% 100%)`;

/** Balusters and the helical handrail they carry. */
export const BALUSTER_H = 96;
export const BALUSTER_W = 7;
export const RAIL_R = OUTER_R - 16;
export const RAIL_T = 8;

/**
 * The handrail segment linking one baluster top to the next.
 *
 * Expressed in a step's OWN local frame rather than the container's, which is
 * what makes it identical for every step: the frame is rotated by that step's
 * angle and dropped by its rise, so the neighbour always sits at the same
 * relative offset. One transform string, reused STEP_COUNT - 1 times.
 *
 *   from (0, -BALUSTER_H, RAIL_R)
 *   to   (RAIL_R·sinΔ, -RISE - BALUSTER_H, RAIL_R·cosΔ)
 *
 * A div's length runs along its local +X. Under CSS's left-handed axes
 * (screen Y points down) `rotateY(φ) rotateZ(ψ)` sends that axis to
 * (cosφ·cosψ, sinψ, -sinφ·cosψ), so matching it to the chord gives
 * φ = atan2(-dz, dx) and ψ = asin(dy / L).
 */
const RAIL = (() => {
  const d = STEP_ANGLE * DEG;
  const dx = RAIL_R * Math.sin(d);
  const dy = -RISE;
  const dz = RAIL_R * Math.cos(d) - RAIL_R;

  const length = Math.hypot(dx, dy, dz);
  const yaw = Math.atan2(-dz, dx) / DEG;
  const pitch = Math.asin(dy / length) / DEG;

  // Midpoint of the chord, where the segment's own centre has to land.
  const mx = dx / 2;
  const my = -BALUSTER_H - RISE / 2;
  const mz = RAIL_R + dz / 2;

  const place = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, ${mz.toFixed(
    2
  )}px) rotateY(${yaw.toFixed(3)}deg) rotateZ(${pitch.toFixed(3)}deg)`;

  return {
    length,
    transform: place,
    // Second plane through the same axis, giving the rail a cross-section so
    // it doesn't vanish when it turns edge-on to the camera.
    transformCross: `${place} rotateX(90deg)`,
  };
})();

export const RAIL_LENGTH = RAIL.length;
export const RAIL_TRANSFORM = RAIL.transform;
export const RAIL_TRANSFORM_CROSS = RAIL.transformCross;

/* ── The newel ────────────────────────────────────────────────────────
   A turned post rather than a bare tube: a shaft, a banded collar under
   the cap, a moulded plinth at the foot, and a flange at every tread
   junction. Each cylindrical part is four planes through the axis, so
   one is always well off edge-on however far the structure has turned;
   each disc is a single circle, which is rotation-invariant by
   definition and costs nothing to keep facing up. ── */

/** Runs from just under the bottom tread to above the top one. */
export const NEWEL_TOP = -(STEP_COUNT - 1) * RISE - 56;
export const NEWEL_H = (STEP_COUNT - 1) * RISE + 82;
export const NEWEL_BOTTOM = NEWEL_TOP + NEWEL_H;

/** Angles of the planes making up each cylindrical part. */
export const POST_PLANES = [0, 45, 90, 135];

/** Banded collar directly under the cap. */
export const COLLAR_W = NEWEL_W + 22;
export const COLLAR_H = 16;

/** Flat cap closing the top of the collar. Seen from above at TILT. */
export const CAP_D = COLLAR_W + 8;

/** Ball finial standing on the cap. */
export const FINIAL_D = 30;

/** Moulded plinth at the foot, and the disc that tops it. */
export const PLINTH_W = NEWEL_W + 52;
export const PLINTH_H = 26;

/**
 * The bracket each tread bolts to. Slightly proud of the shaft so it reads
 * around the post at every level, and dropped a few px so it does not sit
 * coplanar with the tread it carries and z-fight against it.
 */
export const FLANGE_D = NEWEL_W + 20;
export const FLANGE_DROP = 5;

/**
 * The helix climbs from y = 0 to y = -(n-1)·RISE, so it has to be pushed back
 * down by half its height to sit centred in the stage.
 */
export const CENTER_Y = ((STEP_COUNT - 1) * RISE) / 2;

/** Fixed camera pitch, so we look down onto the treads rather than edge-on. */
export const TILT = 15;

/**
 * Far enough that the far side of the structure doesn't fisheye, near enough
 * that the near tread is visibly larger than the far one.
 */
export const PERSPECTIVE = 1500;

/**
 * Section height in vh. The sticky stage is 100vh, so the scrubbed distance is
 * SECTION_VH - 100 = 220vh, split across STEP_COUNT - 1 turns, i.e. ~55vh per
 * milestone. Enough to read a sentence at a normal scroll speed without the
 * section feeling stuck.
 */
export const SECTION_VH = 320;

/** Container rotation, in degrees, at a given 0→1 scroll progress. */
export function rotationAt(progress) {
  return TOTAL_ROTATION * progress;
}

/**
 * Which milestone is front-facing.
 *
 * Because step i faces the camera at exactly p = i / (n-1), rounding the
 * progress onto that grid IS "the step whose angle is nearest front-facing".
 * The two definitions coincide, so there's no second source of truth.
 */
export function stepAt(progress) {
  const i = Math.round(progress * (STEP_COUNT - 1));
  return Math.min(STEP_COUNT - 1, Math.max(0, i));
}

/** cos of a step's angle off front: 1 facing the camera, -1 directly behind. */
export function facingAt(progress, index) {
  return Math.cos((index * STEP_ANGLE + rotationAt(progress)) * DEG);
}

/** Lighting term, 0 (fully turned away) → 1 (square to the camera). */
export function litAt(progress, index) {
  return 0.5 + 0.5 * facingAt(progress, index);
}

/**
 * Label visibility. Held at 0 until a step is within ~53° of front, so only
 * one year is ever legible and the ones swinging past the sides don't compete
 * with it. Smoothstepped so it arrives without a hard edge.
 */
export function labelFadeAt(progress, index) {
  const t = Math.min(1, Math.max(0, (facingAt(progress, index) - 0.2) / 0.6));
  return t * t * (3 - 2 * t);
}
