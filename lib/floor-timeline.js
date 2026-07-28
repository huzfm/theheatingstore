/**
 * Single source of truth for the floor-reveal sequence.
 *
 * The scene and the overlay copy both read these windows, so a caption can
 * never drift out of sync with the geometry it describes, the failure mode
 * when each half owns its own hard-coded numbers.
 *
 * Every value is a [start, end] window on the section's 0→1 scroll progress.
 */
/**
 * Share of the scroll owned by the carpet, the layer added on top of the
 * original five.
 *
 * Everything below it keeps its original tuning: the five windows were hand
 * balanced against each other, so rather than re-tuning six numbers by eye,
 * `below()` compresses the original 0→1 range into what's left after the
 * carpet and shifts it down. Each existing layer therefore keeps its relative
 * duration and its relative overlap with its neighbours exactly.
 */
const CARPET_SPAN = 0.13;

/** Original progress value → its position in the timeline after the carpet. */
const after = (t) => CARPET_SPAN + t * (1 - CARPET_SPAN);
const below = ([start, end]) => [after(start), after(end)];

/**
 * Section height, in vh.
 *
 * Derived rather than written down, because compressing the original five
 * layers into 87% of the scroll would otherwise make every one of them 13%
 * quicker in actual pixels scrolled. Growing the section by the reciprocal
 * gives the carpet its own scroll distance and leaves the pace of the layers
 * beneath it identical to before it existed. 340 was the original height.
 */
export const SECTION_VH = Math.round(340 / (1 - CARPET_SPAN));

export const TIMELINE = {
  /* Layers peel away one at a time, top to bottom. The windows overlap
     slightly so the stack never sits completely motionless between them. */

  /* The rug lifts off the finished floor first, it is the only layer that
     isn't part of the build-up. Starts at 0.03 for the same reason `tile`
     used to start at 0.06: the section must open on an intact floor. */
  /* Ends just past where `tile` begins, so the rug is still clearing frame as
     the first tile lifts. Written against tile's own start rather than as a
     constant, so the two can't drift apart into a beat where nothing moves. */
  carpet: [0.03, after(0.06) + 0.01],

  /* Starts at 0.06, not 0: the section must open on an intact floor. Peeling
     from scroll 0 meant the floor was already shattered before the visitor
     had scrolled at all, which destroys the reveal. */
  tile: below([0.06, 0.22]),
  screed: below([0.2, 0.34]),

  /* The mat lifts clear of the build-up for inspection. */
  matRise: below([0.34, 0.52]),

  /* Insulation and subfloor recede once the mat is the subject. */
  baseRecede: below([0.5, 0.66]),

  /* Full 360° turn with the feature callouts. */
  rotate: below([0.56, 1.0]),
};

/**
 * Overlay captions, each pinned to the moment its layer starts moving.
 * `at` is the progress value where this caption takes over.
 */
export const STAGES = [
  {
    id: 'carpet',
    at: 0.0,
    // Numbered 00 rather than renumbering everything below it: the five
    // build-up layers are the system, and the rug is what gets laid on top of
    // a finished one. The numbering says which is which.
    eyebrow: 'Layer 00',
    title: 'The Kashmiri carpet',
    body: 'Hand-woven wool, the only thing between bare feet and the heat below.',
  },
  {
    id: 'tile',
    at: after(0.0),
    eyebrow: 'Layer 01',
    title: 'Tile, stone or wood',
    body: 'The finished floor, the only part of the system anyone ever sees.',
  },
  {
    id: 'screed',
    at: after(0.14),
    eyebrow: 'Layer 02',
    title: 'Levelling screed',
    body: 'A thin bed that encases the cable and spreads its heat evenly into the floor above.',
  },
  {
    id: 'mat',
    at: after(0.3),
    eyebrow: 'Layer 03',
    title: 'The heating mat',
    body: 'Self-regulating cable on a fibreglass mesh. Just 5 mm thick, this is the layer doing the work.',
  },
  {
    id: 'insulation',
    at: after(0.44),
    eyebrow: 'Layer 04',
    title: 'Insulation board',
    body: 'Sits under the mat and forces the heat upward instead of letting it sink into the slab.',
  },
  {
    id: 'subfloor',
    at: after(0.52),
    eyebrow: 'Layer 05',
    title: 'Concrete subfloor',
    body: 'The structural base. Below this line, nothing needs to change during installation.',
  },
  {
    id: 'rotate',
    at: after(0.62),
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
