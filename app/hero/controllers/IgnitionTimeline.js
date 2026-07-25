'use client';

import gsap from 'gsap';
import { heroState } from '../lib/signals';
import { EASE, TIME } from '../lib/ease';

/**
 * FIRST HEAT — the load sequence.
 *
 * The room opens cold: desaturated, blue-shifted, coils dark. Then the system
 * energises. Current runs the coil bed, the grade warms, and the heat reaches
 * the typography, which does not fade in but *warms* into existence.
 *
 * The one rule the whole hero obeys: heat originates at the coils in the
 * bottom-right of the plate and travels outward and upward. Every reveal in
 * here inherits its direction from that.
 *
 * Note what the rule does *not* govern. The order elements arrive in is reading
 * order, not distance-from-heat-source — sequencing the value proposition last
 * because it sits furthest from the coils would serve the metaphor and lose the
 * customer. Physics decides how things move; editorial hierarchy decides what
 * moves first.
 *
 * This module is deliberately free of React. It takes a DOM subtree, reads its
 * `data-*` contract, and returns a timeline. That makes the whole load sequence
 * legible in one file instead of smeared across eight components.
 */

/**
 * When each group begins, in seconds. This map is the load sequence — retiming
 * the hero means editing these numbers and nothing else.
 *
 * Every duration overlaps its neighbours. Sequential reveals read as a list
 * being checked off; overlapping ones read as a single event with depth.
 *
 * On `cinematic` (tier 2), only Act 1 — badge and headline — arrives here.
 * Everything else is a *later act* in a four-act scroll story (see
 * `lib/sceneTimeline.js`'s `ACT` windows and `ScrollController`), and
 * showing it now would mean the visitor has already read the paragraph, the
 * climate line and the CTA before they have scrolled a pixel — there would
 * be nothing left for the story to reveal. On every other tier there is no
 * scroll narrative to hand these off to, so the full set still arrives here,
 * exactly as it always has.
 */
const CUE_CINEMATIC = {
  badge: 0.3,
  headline: 0.38,
};

const CUE_FULL = {
  ...CUE_CINEMATIC,
  paragraph: 1.1,
  cta: 1.4,
  trust: 1.6,
  climate: 1.72,
};

/** How long after a copper line lands before the firelight sweeps across it. */
const SWEEP_DELAY = 0.5;
const SWEEP_DURATION = 2.5;

export function createIgnitionTimeline(root, { reduced = false, cinematic = false } = {}) {
  const CUE = cinematic ? CUE_CINEMATIC : CUE_FULL;
  const q = gsap.utils.selector(root);

  const reveals = q('[data-reveal]');
  const sweeps = q('[data-sweep]');
  const ctas = q('[data-cta]');

  /**
   * Tier 0. Everything is placed at its final state in one synchronous set —
   * no tweens, no ticker work. A visitor who asked for reduced motion gets a
   * finished photograph, which is a legitimate way to see this hero rather
   * than a broken version of it.
   */
  if (reduced) {
    heroState.warmth = 1;
    heroState.ignite = 1;
    heroState.fire = 1;
    heroState.bloom = 0.07;
    heroState.boot = 1;
    gsap.set([...reveals, ...sweeps], { '--t': 1, '--sweep': 1 });
    gsap.set(ctas, { '--charge': 1 });
    return gsap.timeline({ paused: true });
  }

  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.thermal } });

  /* ── the cold open ───────────────────────────────────────────────────── */

  // Set synchronously so the browser's first paint is already the cold state.
  // Doing this in a layout effect rather than a passive one is what stops the
  // finished hero flashing for a frame before the sequence starts.
  heroState.warmth = 0;
  heroState.ignite = 0;
  heroState.bloom = 0;

  // On cinematic, only Act 1 (badge + headline) uses the travelling mask —
  // its scroll-driven siblings are hidden by their wrapper's `--scene-t`
  // instead (see `ScrollController`), so their own mask is just set straight
  // to its finished, fully-open state and never touched again. Two things
  // animating "arriving" at once — the wrapper fading in and the mask
  // travelling across the text inside it — would be reading as one arrival
  // fighting itself.
  if (cinematic) {
    const act1 = reveals.filter((el) => el.dataset.reveal === 'badge' || el.dataset.reveal === 'headline');
    const rest = reveals.filter((el) => !act1.includes(el));
    gsap.set(act1, { '--t': 0 });
    gsap.set(rest, { '--t': 1 });
  } else {
    gsap.set(reveals, { '--t': 0 });
  }

  gsap.set(sweeps, { '--sweep': 0 });
  gsap.set(ctas, { '--charge': 0 });

  /* ── ignition ────────────────────────────────────────────────────────── */

  // The current running the circuit. Eased in-out, because a real thermal load
  // neither starts nor stops instantly.
  tl.to(
    heroState,
    { ignite: 1, duration: TIME.ignition, ease: 'power1.inOut' },
    TIME.coldHold,
  );

  // The grade warming behind it. Outlasts the sweep so the room keeps gaining
  // temperature after the current has finished its pass — heat has thermal
  // mass, and the lag is what sells that.
  tl.to(
    heroState,
    { warmth: 1, duration: 1.7, ease: 'power2.inOut' },
    TIME.coldHold,
  );

  /* ── camera ──────────────────────────────────────────────────────────── */

  // A long exponential settle, overlapping ignition. `CameraRig` reads this
  // to resolve its own establishing shot in from a wider, higher overscan —
  // this is a camera coming to rest, not a zoom: by the time the eye notices
  // it is moving, it has almost stopped. `heroState.boot` rather than a DOM
  // tween because there is no DOM element for a 3D camera to own a transform
  // on; the 3D scene reads the same number the old plate wrapper used to.
  heroState.boot = 0;
  tl.to(heroState, { boot: 1, duration: TIME.camera, ease: EASE.settle }, 0);

  /* ── typography receives the heat ────────────────────────────────────── */

  // Grouped by their `data-reveal` value so each block can be cued
  // independently while sharing one reveal primitive.
  const byGroup = new Map();
  for (const el of reveals) {
    const group = el.dataset.reveal;
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group).push(el);
  }

  for (const [group, els] of byGroup) {
    const at = CUE[group];
    if (at === undefined) continue;

    const stagger = group === 'headline' ? TIME.lineStagger : 0;

    tl.to(
      els,
      { '--t': 1, duration: TIME.line, stagger, ease: EASE.thermal },
      at,
    );
  }

  /* ── firelight crossing the copper lines ─────────────────────────────── */

  // Once, well after the line has landed, and never again. A loop here would
  // undo the whole effect: a light that keeps sweeping is a decoration, a light
  // that crosses once is the fire in the room.
  const headlineAt = CUE.headline;
  sweeps.forEach((el, i) => {
    tl.to(
      el,
      { '--sweep': 1, duration: SWEEP_DURATION, ease: 'power1.inOut' },
      headlineAt + TIME.line + SWEEP_DELAY + i * 0.18,
    );
  });

  // On cinematic, the CTA is Act 4 — it hasn't arrived yet, so the charge
  // that fills the buttons belongs to `ScrollController` instead, cued to
  // the same moment the CTA reveals rather than to the load sequence.
  if (!cinematic) {
    /* ── the CTAs energising ────────────────────────────────────────────── */

    // `--charge` fills each button from its leading edge, like current
    // filling a bar. Nothing scales, nothing bounces.
    tl.to(
      ctas,
      { '--charge': 1, duration: 0.9, stagger: 0.1, ease: EASE.charge },
      CUE.cta,
    );
  }

  return tl;
}
