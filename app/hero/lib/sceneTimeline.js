/**
 * Single source of truth for the hero's scroll-scrubbed 3D narrative.
 *
 * Every stage window below is a [start, end] pair on the pinned hero's 0→1
 * scroll progress (`heroState.sceneProgress`). CameraRig, FloorCutaway,
 * PipeNetwork and ScrollController all read from this one map, which is what
 * keeps the camera's framing, the floor's motion and the text's exit honest
 * about the same moment in the scroll — the failure mode when each owns its
 * own hard-coded numbers is a camera move that answers a floor reveal that
 * hasn't happened yet.
 *
 * The story, in order: establish the room cold → descend toward the floor →
 * the floor separates → the pipe network is fully exposed → thermal energy
 * ignites and races through it, warming the whole room → the floor closes
 * elegantly over the now-live system → the camera rises and settles → the
 * scene goes calm for the closing shot → the hero hands off into the next
 * section.
 */
export const STAGE = {
  establish: [0, 0.16],
  descend: [0.12, 0.34],
  split: [0.2, 0.4],
  reveal: [0.34, 0.5],
  ignite: [0.4, 0.66],
  close: [0.62, 0.8],
  resolve: [0.76, 0.9],
  /** The closing shot: camera sway and thermal flow both decay toward
   *  stillness across this window, so the last thing on screen is calm
   *  rather than still visibly *doing* something when the heading arrives. */
  settle: [0.85, 1],
  handoff: [0.92, 1],
};

/**
 * The four acts, as [reveal-start, reveal-end, retire-start, retire-end]
 * windows on the same 0→1 scroll progress. Strictly sequential — every
 * window ends with the previous act already fully hidden (`--t: 0`, not
 * mid-crossfade) before the next one starts revealing, with a small gap
 * between them. An earlier pass here overlapped retire and reveal windows
 * for a soft crossfade; on screen that read as ghosting, two ideas visible
 * at once, which is exactly what this hero is trying not to be. One scene
 * ends, the frame goes quiet, the next scene begins.
 *
 *   1 — typography only        badge + headline
 *   2 — the physical product    the paragraph, as the camera settles on the exhibit
 *   3 — the hidden engineering  the climate line, as the floor opens
 *   (quiet — the pipes ignite with no text competing for the frame; a former
 *    Act 4, the trust line, lived here and was removed by explicit direction)
 *   4 — the closing shot        a new line + the CTAs, once everything has settled
 *
 * Act 1 reveals at load (see `IgnitionTimeline`), not on scroll, so it has no
 * reveal window here — only a retire one, at the moment Act 2 needs the frame.
 * Act 4 has no retire window of its own: it holds until the handoff dissolve
 * (`ScrollController`'s `EXIT` map) takes it down along with everything else.
 */
export const ACT = {
  typography: { retire: [0.08, 0.13] },
  product: { reveal: [0.14, 0.19], retire: [0.26, 0.31] },
  engineering: { reveal: [0.32, 0.37], retire: [0.44, 0.49] },
  finale: { reveal: [0.78, 0.85] },
};

/**
 * Warmth as a function of scroll progress, independent of the load-time
 * ignition. The room re-cools slightly is deliberately *not* modelled here —
 * once the system has fired it stays fired, the way a real slab holds heat —
 * so warmth only ever rises across the scrub and then holds through the
 * handoff.
 */
export function warmthAt(progress) {
  const [a, b] = STAGE.ignite;
  if (progress <= a) return 0;
  if (progress >= b) return 1;
  const t = (progress - a) / (b - a);
  return t * t * (3 - 2 * t);
}

/**
 * 0 through most of the scroll, ramping to 1 across `STAGE.settle` — the
 * closing shot's "everything is calming down" factor. `CameraRig` scales its
 * idle sway by `1 - calmAt`, `PipeNetwork` scales its flow speed the same
 * way, and `HeroScene`'s lighting rig dims by it, so the three read as one
 * decision (the room settling) rather than three unrelated animations that
 * happen to end around the same time.
 */
export function calmAt(progress) {
  const [a, b] = STAGE.settle;
  if (progress <= a) return 0;
  if (progress >= b) return 1;
  const t = (progress - a) / (b - a);
  return t * t * (3 - 2 * t);
}
