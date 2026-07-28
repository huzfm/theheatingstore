/**
 * Single source of truth for the floor-reveal sequence.
 *
 * The scene and the overlay copy both read these windows, so a caption can
 * never drift out of sync with the geometry it describes, the failure mode
 * when each half owns its own hard-coded numbers.
 *
 * Every value is a [start, end] window on the section's 0→1 scroll progress.
 *
 * The stack is four layers: carpet, the finished floor, the heating mat, and
 * insulation. It was six, with a combed adhesive bed between floor and mat and
 * a structural slab under the insulation, and the windows were written as
 * offsets into an older five-layer tuning because each revision wanted to
 * preserve the pacing of the one before it. With two layers gone that
 * indirection described a stack that no longer exists, so the windows are back
 * to being plain numbers you can read straight off the page.
 */

/**
 * Section height, in vh.
 *
 * Four layers rather than six, but the turn at the end is what actually needs
 * the room: `rotate` owns the last 40% of progress, which at 340vh is ~136vh
 * of scroll for a full revolution, the same distance it had before.
 */
export const SECTION_VH = 340;

export const TIMELINE = {
  /* Layers peel away one at a time, top to bottom. The windows overlap
     slightly so the stack never sits completely motionless between them. */

  /* The rug rolls off the finished floor first, it is the only layer that
     isn't part of the build-up. Starts just past 0, not at it: the section
     must open on an intact floor, and peeling from scroll 0 means the floor
     is already coming apart before the visitor has scrolled at all. */
  carpet: [0.04, 0.24],

  /* The finished floor, lifting slab by slab. */
  tile: [0.21, 0.42],

  /* The mat lifts clear of the build-up for inspection. */
  matRise: [0.4, 0.56],

  /* Insulation drops away once the mat is the subject. */
  baseRecede: [0.54, 0.7],

  /* Full 360° turn with the feature callouts. */
  rotate: [0.6, 1.0],
};

/**
 * Overlay captions, each pinned to the moment its layer starts moving.
 * `at` is the progress value where this caption takes over.
 */
export const STAGES = [
  {
    id: 'carpet',
    at: 0.0,
    eyebrow: 'Layer 01',
    title: 'The Kashmiri carpet',
    body: 'Hand-woven wool, the only thing between bare feet and the heat below.',
  },
  {
    id: 'tile',
    at: 0.2,
    eyebrow: 'Layer 02',
    title: 'Tile, stone or wood',
    body: 'The finished floor, the only part of the system anyone ever sees.',
  },
  {
    id: 'mat',
    at: 0.39,
    eyebrow: 'Layer 03',
    title: 'The heating mat',
    body: 'Self-regulating cable on a fibreglass mesh. Just 5 mm thick, this is the layer doing the work.',
  },
  {
    id: 'insulation',
    at: 0.53,
    eyebrow: 'Layer 04',
    title: 'Insulation board',
    body: 'Sits under the mat and forces the heat upward instead of letting it sink into the slab.',
  },
  {
    id: 'rotate',
    at: 0.68,
    eyebrow: 'The mat',
    title: 'Built to be walked on',
    body: 'A full turn around the mat, the cable, the spacing and the coverage that make the floor even underfoot.',
  },
];

/** Which caption is active at a given scroll progress. */
export function stageAt(progress) {
  let index = 0;
  for (let i = 0; i < STAGES.length; i += 1) {
    if (progress >= STAGES[i].at) index = i;
  }
  return index;
}
