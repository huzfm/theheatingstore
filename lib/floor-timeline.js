/**
 * Single source of truth for the floor-reveal sequence.
 *
 * The scene and the overlay copy both read these windows, so a caption can
 * never drift out of sync with the geometry it describes, the failure mode
 * when each half owns its own hard-coded numbers.
 *
 * Every value is a [start, end] window on the section's 0→1 scroll progress.
 */
export const TIMELINE = {
  /* The carpet holds still, then rolls and folds away from one end. Starts
     at 0.08, not 0: the section must open on an intact carpet, and long
     enough that the medallion/pile detail and its intro sheen (see
     FloorLayers' envMapIntensity ramp) actually register before the roll
     takes over. Rolling from scroll 0 meant the carpet was already mid-roll
     before the visitor had scrolled at all, which destroys the reveal. */
  carpetRoll: [0.08, 0.28],

  /* The mat lifts clear of the build-up for inspection. Begins while the
     base is still fully opaque underneath it, an empty gap before the mat
     had visibly caught up. */
  matRise: [0.34, 0.54],

  /* Insulation and subfloor recede once the mat is the subject. */
  baseRecede: [0.4, 0.58],

  /* Camera-only window, no mesh reads this: the beat where the subfloor
     briefly holds the frame on its own, after the carpet has cleared and
     before the mat has risen enough to take over. */
  subfloorFocus: [0.26, 0.42],

  /* Full 360° turn with the feature callouts. */
  rotate: [0.58, 1.0],
};

/**
 * Overlay captions, each pinned to the moment its layer starts moving (or,
 * for the two carpet beats, the moment the copy should turn over mid-roll).
 * `at` is the progress value where this caption takes over.
 */
export const STAGES = [
  {
    id: 'carpet',
    at: 0.0,
    eyebrow: 'Layer 01',
    title: 'A Kashmiri carpet',
    body: 'Hand-knotted wool in the paisley and medallion motifs of the valley. The finished floor, and the only part of the system anyone ever sees.',
  },
  {
    id: 'lift',
    at: 0.08,
    eyebrow: 'Every layer, considered',
    title: 'Rolled back, not torn up',
    body: 'A heated floor doesn’t mean losing the carpet. It means knowing exactly what’s built beneath it.',
  },
  {
    id: 'subfloor',
    at: 0.26,
    eyebrow: 'Layer 02',
    title: 'The engineered base',
    body: 'Insulation board over a concrete subfloor, forcing every watt of heat up into the room instead of down into the slab.',
  },
  {
    id: 'mat',
    at: 0.32,
    eyebrow: 'Layer 03',
    title: 'The ProWarm heating mat',
    body: 'Self-regulating cable on a fibreglass mesh, just 5 mm thick. The UK’s best-selling electric underfloor system, backed by a Lifetime Warranty and the CableSafe™ Guarantee.',
  },
  {
    id: 'rotate',
    at: 0.6,
    eyebrow: 'The ProWarm mat',
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
