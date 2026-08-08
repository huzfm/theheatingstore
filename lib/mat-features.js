/**
 * The six feature callouts shown while the mat turns, and the geometry that
 * decides when each one faces the camera.
 *
 * This lives in lib/ rather than inside the 3D component because two very
 * different renderers now read it: the anchored cards inside the WebGL scene,
 * and the docked caption the overlay draws on narrow screens. The overlay is
 * part of the page's initial bundle, so it must be able to import this copy
 * without dragging three.js in behind it, everything below is plain numbers
 * and strings, and the only imports are two other data modules.
 */

import { MAT_W, MAT_L } from '@/components/3d/constants';
import { TIMELINE } from '@/lib/floor-timeline';

/** Anchor ring, held inside the mat's edge so leader lines land on scrim. */
const ANCHOR_X = MAT_W / 2 - 0.36;
const ANCHOR_Z = MAT_L / 2 - 0.3;

/**
 * Where in the 360° turn the first and last callout face the camera, as a
 * fraction of the rotation window. The first is held back a little so the turn
 * is visibly under way before anything is asked to be read, and the last stops
 * short of a full revolution so that it, rather than the first coming back
 * around, is what holds the frame at the end of the section.
 */
const FIRST_BEAT = 0.1;
const LAST_BEAT = 0.94;

/**
 * Copy is deliberately terse: a title of three or four words and a body of
 * one short line. These are read while the mat is turning underneath them, so
 * anything longer is a paragraph the visitor has to choose between reading and
 * watching. The spec band carries the number, the title carries the claim, the
 * body carries the single reason it is true, and nothing carries more.
 */
const COPY = [
  {
    id: 'profile',
    kicker: 'Profile',
    title: 'Barely there',
    body: 'No door trimming, no step between rooms.',
    spec: '5 mm',
    specLabel: 'build height',
  },
  {
    id: 'roll',
    kicker: 'The roll',
    title: 'Cut, turned, repeated',
    body: 'The mesh is cut at the wall. The cable never is.',
    spec: '500 mm',
    specLabel: 'roll width',
  },
  {
    id: 'spacing',
    kicker: 'Coverage',
    title: 'Even, edge to edge',
    body: 'Fixed pitch, so no hot stripes and no cold patches.',
    spec: '75 mm',
    specLabel: 'cable pitch',
  },
  {
    id: 'output',
    kicker: 'Output',
    title: 'Sized to the room',
    body: 'Matched to the heat the space actually loses.',
    spec: '150 W',
    specLabel: 'per m²',
  },
  {
    id: 'cable',
    kicker: 'The cable',
    title: 'Self-regulating',
    body: 'Cold spots draw more, warm spots less.',
    spec: 'Auto',
    specLabel: 'per zone',
  },
  {
    id: 'warranty',
    kicker: 'Assurance',
    title: 'Ten-year cover',
    body: 'Cable and mat, behind certified installation.',
    spec: '10 yr',
    specLabel: 'warranty',
  },
];

const [ROTATE_START, ROTATE_END] = TIMELINE.rotate;
const ROTATE_SPAN = ROTATE_END - ROTATE_START;

/**
 * Each callout owns an `azimuth`: the direction, in the mat's local space, that
 * its anchor points. Visibility uses that rather than per-face normals and
 * camera dot products, because the mat is flat, every face normal points
 * straight up, and a dot-product test returns the same answer for all of them.
 * A local point (a·sinφ, 0, a·cosφ) rotated by θ about Y has world
 * z = a·cos(θ + φ), so an anchor swings toward the camera exactly when
 * cos(θ + φ) → 1, which is the entire visibility test.
 *
 * Everything positional is derived from that one number rather than written out
 * per feature. The hand-authored version had azimuths and anchor corners that
 * disagreed about which way was which, so half the callouts drew a leader line
 * to the far edge of the mat; worse, two of the four sat on corners that faced
 * away for the whole of their unlock window and so never appeared at all.
 */
export const FEATURES = COPY.map((feature, i) => {
  const beat =
    COPY.length === 1
      ? FIRST_BEAT
      : FIRST_BEAT + (i * (LAST_BEAT - FIRST_BEAT)) / (COPY.length - 1);

  // The mat's rotation is spin·2π, so an anchor that faces the camera on
  // `beat` is one whose azimuth cancels that angle out.
  const azimuth = -beat * Math.PI * 2;

  return {
    ...feature,
    index: String(i + 1).padStart(2, '0'),
    ordinal: i,
    total: COPY.length,
    azimuth,
    anchor: [ANCHOR_X * Math.sin(azimuth), 0.06, ANCHOR_Z * Math.cos(azimuth)],
    // Eligible slightly before it swings into view, so it is already the
    // front-most candidate by the time it gets there. Never before the turn
    // starts: nothing should be legible while the mat is still lifting.
    unlock: ROTATE_START + Math.max(0, beat - 0.08) * ROTATE_SPAN,
  };
});

/** Lookup by id, for the overlay that is handed only the active id. */
export const FEATURES_BY_ID = Object.fromEntries(FEATURES.map((f) => [f.id, f]));
