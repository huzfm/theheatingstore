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
  /* Layers peel away one at a time, top to bottom. The windows overlap
     slightly so the stack never sits completely motionless between them. */
  /* Starts at 0.06, not 0: the section must open on an intact floor. Peeling
     from scroll 0 meant the floor was already shattered before the visitor
     had scrolled at all, which destroys the reveal. */
  tile: [0.06, 0.22],
  screed: [0.2, 0.34],

  /* The mat lifts clear of the build-up for inspection. */
  matRise: [0.34, 0.52],

  /* Insulation and subfloor recede once the mat is the subject. */
  baseRecede: [0.5, 0.66],

  /* Full 360° turn with the feature callouts. */
  rotate: [0.56, 1.0],
};

/**
 * Overlay captions, each pinned to the moment its layer starts moving.
 * `at` is the progress value where this caption takes over.
 */
export const STAGES = [
  {
    id: 'tile',
    at: 0.0,
    eyebrow: 'Layer 01',
    title: 'Tile, stone or wood',
    body: 'The finished floor, the only part of the system anyone ever sees.',
  },
  {
    id: 'screed',
    at: 0.14,
    eyebrow: 'Layer 02',
    title: 'Levelling screed',
    body: 'A thin bed that encases the cable and spreads its heat evenly into the floor above.',
  },
  {
    id: 'mat',
    at: 0.3,
    eyebrow: 'Layer 03',
    title: 'The heating mat',
    body: 'Self-regulating cable on a fibreglass mesh. Just 5 mm thick, this is the layer doing the work.',
  },
  {
    id: 'insulation',
    at: 0.44,
    eyebrow: 'Layer 04',
    title: 'Insulation board',
    body: 'Sits under the mat and forces the heat upward instead of letting it sink into the slab.',
  },
  {
    id: 'subfloor',
    at: 0.52,
    eyebrow: 'Layer 05',
    title: 'Concrete subfloor',
    body: 'The structural base. Below this line, nothing needs to change during installation.',
  },
  {
    id: 'rotate',
    at: 0.62,
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
