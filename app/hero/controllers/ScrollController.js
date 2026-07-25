'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroState } from '../lib/signals';
import { EASE, mapRange } from '../lib/ease';
import { STAGE, ACT } from '../lib/sceneTimeline';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The scroll driver, two modes sharing one exit vocabulary.
 *
 * `cinematic` (tier 2, desktop-class + WebGL): `root` is a tall wrapper
 * (`.hero` at `height: 250vh` in `hero.css`) with a `position: sticky` inner
 * stage. No `pin: true`, a sticky element needs no pin-spacer, so nothing
 * about it has to be recalculated on resize, which is exactly where GSAP-
 * pinned sections tend to break (the same trade `FloorRevealSection` already
 * makes for the WhyElectricHamam scene). Scrolling the wrapper's extra height
 * drives `heroState.sceneProgress` 0→1 across the entire floor-opens →
 * ignites → closes narrative; `sceneTimeline.js`'s `STAGE` windows are what
 * the 3D scene reads to turn that single number into camera moves, a floor
 * hinging open, and pipes lighting up.
 *
 * The copy column is choreographed against the same number via `ACT`: four
 * scenes, cut like film rather than crossfaded like a website. Each
 * `.hero__act` wrapper carries its own `--scene-t` (see `hero.css`, section
 * 7): opacity, blur and a lift all answer that one value, and `visibility`
 * is toggled, not just opacity, at the start of a reveal and the end of a
 * retire. Visibility is the guarantee: an element at `opacity: 0` is still
 * hit-testable and still in the tab order, so a purely opacity-driven fade
 * cannot promise "never two content groups on screen" the way this does.
 * Only one act is ever `visibility: visible` at a time.
 *
 * Act 1 (badge + headline) has already arrived by the time this controller
 * runs, its line-by-line ignition is the load sequence's job, not the
 * scroll's, so this file only retires its wrapper, then reveals and retires
 * Acts 2 and 3 in turn, leaving a quiet beat with no text while the pipes
 * ignite, then reveals Act 4, the closing shot, once the scene has settled 
 * and leaves it for the handoff dissolve below to take down. Act 4's own
 * entrance (a split title, the CTAs on a delay) is a separate, real-time
 * timeline, `splitTl`, further down, rather than another scrub-driven
 * `--scene-t`; see the comment where it's built for why.
 *
 * `simple` (everyone else): `root` is the ordinary compact hero. There is no
 * 3D scene to scrub, so this is the old photographic hero's plain exit, the
 * text dissolves as the hero scrolls out of view, once, over the hero's own
 * natural height. Forcing 140vh of extra scroll on a visitor who is only
 * going to see a static poster background would be dead weight on a lead-gen
 * page's most important section.
 *
 * Both modes converge on the same `heroState.exit`: the fraction of the
 * *handoff*, the final dissolve into the next section, regardless of how
 * long a scroll produced it. Every CSS rule that reads `--h-exit` (the
 * vignette closing down, the scroll cue retiring) therefore needs no branch
 * of its own for which mode is active.
 */

/**
 * Exit order: the furthest, smallest lines go first and the headline holds
 * longest. Positions are normalised 0..1 across the handoff, not seconds.
 */
const EXIT = {
  finale: [0.0, 0.3],
  climate: [0.02, 0.3],
  cta: [0.08, 0.38],
  paragraph: [0.12, 0.42],
  badge: [0.2, 0.5],
  headline: [0.26, 0.62],
};

export function createScrollController(root, { reduced = false, cinematic = false } = {}) {
  if (typeof window === 'undefined' || !root || reduced) {
    return { destroy() {} };
  }

  const q = gsap.utils.selector(root);
  const content = q('[data-content]');
  const reveals = q('[data-reveal]');

  const byGroup = new Map();
  for (const el of reveals) {
    const group = el.dataset.reveal;
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group).push(el);
  }

  const applyExit = (tl, mapSpan) => {
    for (const [group, span] of Object.entries(EXIT)) {
      const els = byGroup.get(group);
      if (!els?.length) continue;
      const [from, to] = mapSpan(span);
      tl.to(els, { '--t': 0, duration: to - from }, from);
    }
  };

  if (cinematic) {
    // `data-act` on the root: the acts' own `visibility` is what actually
    // gates which one is shown (hero.css §7), so this isn't load-bearing for
    // that, but the closing shot's scrim boost reads it (§5), and it's
    // useful for QA regardless: "which scene is live" as one attribute.
    root.dataset.act = '1';

    const acts = {
      1: q('.hero__act--1')[0],
      2: q('.hero__act--2')[0],
      3: q('.hero__act--3')[0],
      4: q('.hero__act--4')[0],
    };

    const [handoffStart, handoffEnd] = STAGE.handoff;
    const toHandoff = (v) => mapRange(v, 0, 1, handoffStart, handoffEnd);

    // The closing shot's own arrival, a split title sliding in from both
    // edges to meet at centre, then the CTAs on a short delay, plays as a
    // real, time-based animation rather than being tied to scroll position
    // directly. A scrub can't honour a literal "0.9s, power4.out": scrubbed
    // tweens are deliberately eased `none` (see `EASE.scrub`) so they never
    // fight the visitor's own scroll velocity, which is exactly wrong for a
    // considered, cinematic entrance. Firing a real timeline once when the
    // scrub crosses into the scene, and reversing it if the visitor scrolls
    // back out, gets the specified motion while the scrub still owns
    // visibility (the non-negotiable "only one scene" guarantee).
    const finaleLeft = q('.hero__finale-line--left')[0];
    const finaleRight = q('.hero__finale-line--right')[0];
    const finaleCtaGroup = q('.hero__finale-ctas')[0];
    const finaleCtaButtons = q('.hero__finale-ctas [data-cta]');

    const splitTl = gsap.timeline({ paused: true });
    if (finaleLeft) {
      splitTl.fromTo(
        finaleLeft,
        { xPercent: -100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
        0,
      );
    }
    if (finaleRight) {
      splitTl.fromTo(
        finaleRight,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.9, ease: 'power4.out' },
        0,
      );
    }
    if (finaleCtaGroup) {
      // No bounce, no overshoot, a plain decelerate, same family as the
      // titles' but without their more dramatic power4 curve.
      splitTl.fromTo(
        finaleCtaGroup,
        { autoAlpha: 0, y: 24, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' },
        0.9 + 0.15,
      );
    }
    if (finaleCtaButtons.length) {
      splitTl.fromTo(
        finaleCtaButtons,
        { '--charge': 0 },
        { '--charge': 1, duration: 0.5, ease: 'power2.out' },
        0.9 + 0.15,
      );
    }

    let finaleEntered = false;

    const tl = gsap.timeline({
      defaults: { ease: EASE.scrub },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          heroState.sceneProgress = self.progress;
          heroState.exit = mapRange(self.progress, handoffStart, 1, 0, 1);
          if (!heroState.scrolled && self.progress > 0.004) {
            heroState.scrolled = true;
            root.setAttribute('data-scrolled', '');
          }

          // The active act, as a stepwise function of the same progress 
          // written only through GSAP's own onUpdate (once per tick, not
          // per render), and only touches the DOM when it actually changes.
          const p = self.progress;
          const next =
            p < ACT.product.reveal[0] ? 1 :
            p < ACT.engineering.reveal[0] ? 2 :
            p < ACT.finale.reveal[0] ? 3 : 4;
          if (root.dataset.act !== String(next)) {
            root.dataset.act = String(next);
          }

          // Fires once on the way in, reverses once on the way back out 
          // `finaleEntered` is the debounce that keeps a `.play()`/`.reverse()`
          // pair from being re-issued on every tick while progress sits past
          // the threshold.
          if (p >= ACT.finale.reveal[0] && !finaleEntered) {
            finaleEntered = true;
            splitTl.play();
          } else if (p < ACT.finale.reveal[0] && finaleEntered) {
            finaleEntered = false;
            splitTl.reverse();
          }
        },
      },
    });

    /*
     * One scene, cut to the next: fade + blur + lift on the wrapper,
     * `visibility` flipped at the hard edges so there is never a frame where
     * two acts are simultaneously hit-testable, let alone simultaneously
     * legible. The text inside snaps straight to its finished state
     * (`--t: 1`, no travelling mask) the instant its scene becomes visible 
     * the wrapper's own motion is what "arriving" looks like for Acts 2 and
     * 3, so animating the mask underneath it at the same time would be two
     * effects fighting for the same read. Act 1 keeps its mask-driven
     * line-by-line ignition; only its *retirement* goes through this system.
     * Act 4's wrapper motion is switched off in CSS, `splitTl` above owns
     * its entrance instead, but it still uses `revealScene` for the
     * `visibility` gate, which is the part that actually matters.
     */
    const revealScene = (n, [from, to]) => {
      const el = acts[n];
      if (!el) return;
      tl.set(el, { visibility: 'visible' }, from);
      tl.fromTo(el, { '--scene-t': 0 }, { '--scene-t': 1, duration: to - from }, from);
    };
    const retireScene = (n, [from, to]) => {
      const el = acts[n];
      if (!el) return;
      tl.to(el, { '--scene-t': 0, duration: to - from }, from);
      tl.set(el, { visibility: 'hidden' }, to);
    };
    const snapOpen = (group, at) => {
      const els = byGroup.get(group);
      if (els?.length) tl.set(els, { '--t': 1 }, at);
    };

    /* ── Act 1 → 2: typography cedes the frame ───────────────────────── */
    retireScene(1, ACT.typography.retire);

    /* ── Act 2: the physical product ─────────────────────────────────── */
    snapOpen('paragraph', ACT.product.reveal[0]);
    revealScene(2, ACT.product.reveal);
    retireScene(2, ACT.product.retire);

    /* ── Act 3: the hidden engineering, as the floor opens ───────────── */
    snapOpen('climate', ACT.engineering.reveal[0]);
    revealScene(3, ACT.engineering.reveal);
    retireScene(3, ACT.engineering.retire);

    // Between here and Act 4 the frame is deliberately quiet, no text, so
    // the pipes igniting can hold the whole of the visitor's attention
    // rather than sharing it with a caption. (A former Act 4, the trust
    // line, alone, lived in this gap and was removed by explicit direction;
    // the quiet stretch simply absorbed the space it left behind.)

    /*
     * ── Act 4: the closing shot ──────────────────────────────────────────
     * Everything has settled (see `warmthAt`/`calmAt` in sceneTimeline.js 
     * the camera has nearly stopped and the thermal flow has slowed by the
     * time this reveals). `revealScene` here only sets up the *visibility*
     * gate, the wrapper's own fade/blur/lift is switched off for this act
     * in CSS (hero.css §7), because `splitTl` above owns 100% of this
     * scene's visible motion. Holds through the handoff below rather than
     * retiring on its own, it's the last thing on screen before the page
     * continues, not something that gets replaced by anything else.
     */
    snapOpen('finale', ACT.finale.reveal[0]);
    snapOpen('cta', ACT.finale.reveal[0]);
    revealScene(4, ACT.finale.reveal);

    /* ── the handoff: whatever Act 4 left on screen dissolves ─────────── */
    applyExit(tl, ([from, to]) => [toHandoff(from), toHandoff(to)]);

    const handoffSpan = handoffEnd - handoffStart;
    tl.fromTo(content, { scale: 1 }, { scale: 0.97, duration: handoffSpan * 0.75 }, handoffStart + handoffSpan * 0.05);
    tl.fromTo(
      heroState,
      { exitBloom: 0 },
      { exitBloom: 1, duration: handoffSpan * 0.55, ease: 'power2.in' },
      handoffStart + handoffSpan * 0.4,
    );

    return {
      destroy() {
        tl.scrollTrigger?.kill();
        tl.kill();
        splitTl.kill();
        heroState.exit = 0;
        heroState.exitBloom = 0;
        heroState.sceneProgress = 0;
        delete root.dataset.act;
      },
    };
  }

  const tl = gsap.timeline({
    defaults: { ease: EASE.scrub },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
      onUpdate: (self) => {
        heroState.exit = self.progress;
        if (!heroState.scrolled && self.progress > 0.004) {
          heroState.scrolled = true;
          root.setAttribute('data-scrolled', '');
        }
      },
    },
  });

  applyExit(tl, (span) => span);
  tl.fromTo(content, { scale: 1 }, { scale: 0.97, duration: 0.62 }, 0.1);
  tl.fromTo(heroState, { exitBloom: 0 }, { exitBloom: 1, duration: 0.37, ease: 'power2.in' }, 0.55);

  return {
    destroy() {
      tl.scrollTrigger?.kill();
      tl.kill();
      heroState.exit = 0;
      heroState.exitBloom = 0;
    },
  };
}
