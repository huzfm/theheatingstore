import { PRINCIPLES } from '@/components/sections/About/data';

/**
 * Single source of truth for the About story rail, the pinned section where
 * the three principles scroll past a sticky 3D heating mat.
 *
 * The origin narrative used to lead this rail. It now has its own section,
 * components/sections/About/OriginGallery, so the rail is the principles
 * alone: three blocks instead of five, which is why every threshold and
 * keyframe below was re-derived rather than trimmed.
 *
 * Same contract as lib/floor-timeline.js: the copy blocks and the scene both
 * read these numbers, so a paragraph can never drift out of sync with the
 * camera state that's meant to accompany it.
 *
 * No copy is authored here. Every string is pulled from the About data file
 * so there is still exactly one place to edit the words, including the
 * figures flagged NEEDS-REAL-INFO there.
 */

/**
 * Where each block takes over, as a fraction of the section's 0→1 scroll.
 *
 * These are not evenly spaced: they're derived from the actual layout. Each
 * block is 85vh tall and the sticky panel is 100vh, so with three blocks and a
 * 60vh tail the scrubbed range is 3*85 + 60 - 100 = 215vh, and block i reaches
 * viewport centre at (i*85 + 42.5 - 50) / 215. Deriving them this way is what
 * keeps the camera state changing at the moment a paragraph lands, rather than
 * a fifth of the way past it.
 *
 * BLOCK_VH / TAIL_VH below are exported so StoryRail can't silently change
 * the layout these were calculated from.
 */
export const BLOCK_VH = 85;
export const TAIL_VH = 60;

export const RAIL_BLOCKS = [
  {
    id: 'principle-01',
    // Block 0's true centre lands marginally before the scrub starts, so it is
    // clamped to 0 rather than carrying a negative threshold.
    at: 0.0,
    kicker: `Principle ${PRINCIPLES[0].num}`,
    title: PRINCIPLES[0].title,
    body: PRINCIPLES[0].desc,
  },
  {
    id: 'principle-02',
    at: 0.36,
    kicker: `Principle ${PRINCIPLES[1].num}`,
    title: PRINCIPLES[1].title,
    body: PRINCIPLES[1].desc,
  },
  {
    id: 'principle-03',
    at: 0.756,
    kicker: `Principle ${PRINCIPLES[2].num}`,
    title: PRINCIPLES[2].title,
    body: PRINCIPLES[2].desc,
  },
];

/** Which block is active at a given scroll progress. */
export function blockAt(progress) {
  let index = 0;
  for (let i = 0; i < RAIL_BLOCKS.length; i += 1) {
    if (progress >= RAIL_BLOCKS[i].at) index = i;
  }
  return index;
}

/**
 * Camera / mat / cable keyframes, interpolated with smoothstep between
 * neighbours (see sampleRail). Keys land on the block boundaries above, with
 * two extra in-between keys where a state needs to change *within* a block
 * rather than at its edge.
 *
 *  y, z, camera height and distance (it always looks at the mat's centre)
 *  yaw, the mat's own rotation.y, so the studio speculars travel across it
 *  tilt, the mat's rotation.z, a few degrees of attitude
 *  level, cable emissive multiplier. 0 is a genuinely cold, unpowered mat.
 */
export const RAIL_KEYS = [
  // Opening frame. Wide and already lit, the cold-mat ignition beat that used
  // to sit here belonged to the origin copy and left with it; opening on a
  // dead cable under "Experts of the Trade" would read as a fault, not a
  // narrative.
  { at: 0.0, y: 3.6, z: 5.4, yaw: -0.06, tilt: 0.03, level: 0.85 },

  // Principle 01, Experts of the Trade, near-overhead inspection framing,
  // where the cold tail and factory splice are legible.
  { at: 0.14, y: 4.7, z: 2.7, yaw: 0.18, tilt: 0.0, level: 0.95 },

  // Principle 02, Built for the Blackout, camera settles back, glow still
  // at full.
  { at: 0.36, y: 3.35, z: 4.55, yaw: 0.42, tilt: 0.04, level: 0.98 },

  // ...then decays mid-block. This is the whole argument of that paragraph
  // made visually: the power is gone and the floor is still warm.
  { at: 0.648, y: 3.05, z: 5.3, yaw: 0.3, tilt: 0.03, level: 0.42 },

  // Principle 03, Customers Then Sales, pull back to a calm hero framing,
  // glow recovering to a steady resting level.
  { at: 0.756, y: 2.9, z: 6.3, yaw: 0.14, tilt: 0.02, level: 0.62 },
  { at: 1.0, y: 2.9, z: 6.9, yaw: -0.02, tilt: 0.02, level: 0.9 },
];

/**
 * Anchored callouts.
 *
 * `band` deliberately starts ~0.06 *after* its block's `at`, which at this
 * scroll length is a beat of roughly a third of a second, the label arrives
 * once the paragraph has settled rather than racing it.
 *
 * Neither carries a numeric spec. The retention figure lives in
 * PRINCIPLES[1].desc and is flagged NEEDS-REAL-INFO; repeating it inside the
 * canvas would mean two places to correct before launch instead of one.
 *
 * Anchors are held inside the mat's footprint (±1.8 x, ±1.3 z) rather than out
 * on the cold tail where the splice physically sits. drei's <Html center>
 * centres the whole card on the anchor, so a point near the edge of frame puts
 * half the card outside the panel's overflow:hidden, the leader line does the
 * job of pointing outward instead.
 */
export const RAIL_CALLOUTS = [
  {
    id: 'splice',
    band: [0.06, 0.34],
    anchor: [-1.55, 0.06, 1.0],
    kicker: 'Certified install',
    title: 'Cold tail & factory splice',
    body: 'The join every mat needs and the one an installer can never make on site.',
  },
  {
    id: 'retention',
    band: [0.42, 0.74],
    anchor: [1.2, 0.08, -0.8],
    kicker: 'After the cut',
    title: 'The floor keeps the heat',
    body: 'Warmth is stored in the mass above the cable, not in the cable itself.',
  },
];

/**
 * Interpolate the keyframes at a given progress.
 *
 * Writes into a caller-supplied object rather than allocating: this runs
 * every frame inside useFrame.
 */
export function sampleRail(progress, out) {
  const keys = RAIL_KEYS;
  const last = keys[keys.length - 1];

  if (progress <= keys[0].at) return Object.assign(out, keys[0]);
  if (progress >= last.at) return Object.assign(out, last);

  let i = 0;
  while (i < keys.length - 1 && progress > keys[i + 1].at) i += 1;

  const a = keys[i];
  const b = keys[i + 1];
  const span = b.at - a.at || 1;
  const raw = (progress - a.at) / span;
  // Smoothstep on the segment, so the joins between keyframes have no kink 
  // this is what stops each state change reading as a cut.
  const t = raw * raw * (3 - 2 * raw);

  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  out.yaw = a.yaw + (b.yaw - a.yaw) * t;
  out.tilt = a.tilt + (b.tilt - a.tilt) * t;
  out.level = a.level + (b.level - a.level) * t;
  return out;
}
