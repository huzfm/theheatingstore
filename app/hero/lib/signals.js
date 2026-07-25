'use client';

import gsap from 'gsap';

/**
 * The hero's shared animation state, and the single place it reaches the DOM.
 *
 * Why this exists rather than React state: the pointer, the scroll position and
 * the flicker all change every frame. Routing per-frame values through
 * `useState` would re-render the hero subtree 60+ times a second and make 60fps
 * unreachable no matter how the components are written. So every continuous
 * value lives in this plain mutable object, controllers write to it, and it is
 * flushed to the DOM exactly once per frame as CSS custom properties.
 *
 * The payoff is that CSS then does the actual work on the compositor, and the
 * WebGL layer reads these same numbers in its render loop, so the DOM and the
 * GPU can never disagree about how warm the room currently is.
 *
 * The hero re-renders roughly three times over its whole lifetime.
 */
export const heroState = {
  /** 0 = cold open, 1 = fully energised. Drives the whole grade. */
  warmth: 0,
  /** 0..1 position of the current sweeping along the coil bed during ignition. */
  ignite: 0,
  /** Damped pointer, -1..1, origin at viewport centre. */
  px: 0,
  py: 0,
  /** 0..1 progress of the scroll exit. */
  exit: 0,
  /**
   * Coil bloom, split by owner. GradeController writes the idle shimmer and
   * ScrollController writes the exit blow-out; CSS sums them. Two controllers
   * sharing one field would mean whichever ticked last won the frame.
   */
  bloom: 0,
  exitBloom: 0,
  /** Firelight flicker multiplier, ~0.85..1.15. */
  fire: 1,
  /** Slow idle camera drift, in px. */
  driftX: 0,
  driftY: 0,
  /** Set once the visitor has scrolled; retires the scroll cue for good. */
  scrolled: false,
  /**
   * 0..1 progress through the whole pinned scroll narrative, the floor
   * separating, the pipes igniting, the floor closing again. The single
   * source every 3D scene component reads instead of each owning its own
   * scroll listener. See `lib/sceneTimeline.js` for the stage windows this
   * drives and `warmthAt()` for the derived thermal state.
   */
  sceneProgress: 0,
  /** 0..1 load-time settle for the 3D camera, mirroring the DOM hero's own overscan resolve. */
  boot: 0,
};

/** Reset to the cold-open state. Called when the hero mounts. */
export function resetHeroState() {
  heroState.warmth = 0;
  heroState.ignite = 0;
  heroState.px = 0;
  heroState.py = 0;
  heroState.exit = 0;
  heroState.bloom = 0;
  heroState.exitBloom = 0;
  heroState.fire = 1;
  heroState.driftX = 0;
  heroState.driftY = 0;
  heroState.scrolled = false;
  heroState.sceneProgress = 0;
  heroState.boot = 0;
}

/**
 * The state keys that become CSS custom properties, and how much they must
 * move before we bother writing them.
 *
 * The epsilon matters: a value jittering in the 5th decimal would invalidate
 * style every frame for a change no one can see. Skipping those writes keeps
 * idle frames genuinely free.
 */
const PUBLISHED = [
  ['warmth', '--h-warmth', 0.001],
  ['ignite', '--h-ignite', 0.001],
  ['px', '--h-px', 0.0005],
  ['py', '--h-py', 0.0005],
  ['exit', '--h-exit', 0.0005],
  ['bloom', '--h-bloom', 0.002],
  ['exitBloom', '--h-exit-bloom', 0.002],
  ['fire', '--h-fire', 0.003],
];

/** Values carrying a px unit rather than being unitless scalars. */
const PIXEL = [
  ['driftX', '--h-drift-x', 0.05],
  ['driftY', '--h-drift-y', 0.05],
];

/**
 * Starts the per-frame flush onto `el`.
 *
 * Runs on GSAP's ticker rather than its own `requestAnimationFrame` loop. The
 * app already drives Lenis from that same ticker (see `hooks/useLenis.js`), and
 * adding a second rAF loop would mean scroll position and hero state were being
 * sampled on two different clocks, the exact drift that makes pinned sections
 * lag their content by a frame.
 *
 * @param {HTMLElement} el element the custom properties are written to
 * @returns {() => void} teardown
 */
export function mountHeroSignals(el) {
  if (!el) return () => {};

  // Seeded with NaN so the first tick always writes every property.
  const last = Object.create(null);

  const flush = () => {
    for (let i = 0; i < PUBLISHED.length; i += 1) {
      const [key, prop, eps] = PUBLISHED[i];
      const value = heroState[key];
      if (!(Math.abs(value - last[key]) < eps)) {
        last[key] = value;
        el.style.setProperty(prop, value.toFixed(4));
      }
    }

    for (let i = 0; i < PIXEL.length; i += 1) {
      const [key, prop, eps] = PIXEL[i];
      const value = heroState[key];
      if (!(Math.abs(value - last[key]) < eps)) {
        last[key] = value;
        el.style.setProperty(prop, `${value.toFixed(2)}px`);
      }
    }
  };

  // Flush last in the frame, so controllers added earlier have all written
  // their values before the DOM sees any of them.
  gsap.ticker.add(flush);
  flush();

  return () => {
    gsap.ticker.remove(flush);
  };
}
