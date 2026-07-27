/**
 * Hand-authored easing curves — the single source of truth for both the
 * pure scroll-math driver (timeline.js, which is deliberately framework-free
 * and must stay that way) and any real GSAP tweens elsewhere in this
 * component (quickTo-driven presence glow, magnetic CTA).
 *
 * Each curve is defined once as CSS-style cubic-bezier control points
 * [x1, y1, x2, y2] — the same 4 numbers you'd hand to CSS's cubic-bezier()
 * or GSAP's CustomEase. `cubicBezier()` turns that into a plain
 * (t: 0-1) => (eased: 0-1) function for timeline.js to call directly, same
 * signature as the polynomial eases it's replacing. `registerGsapEases()`
 * turns the SAME points into GSAP CustomEase instances so a tween can
 * reference them by name (`ease: 'weightedDrag'`) instead of a stock power
 * preset — it takes gsap/CustomEase as arguments rather than importing them
 * itself, so this module has zero framework dependencies and stays safe for
 * timeline.js to import.
 */

export const EASE_CURVES = {
  // Entrances: a held anticipation before a brisk, decisive arrival —
  // never a flat ease-out. Used wherever something is coming INTO place.
  emberRise: [0.6, 0.02, 0.05, 0.99],
  // Coming to rest: sharp arrival, then a long unhurried decay — the same
  // asymmetry as the CSS ambient-breathe keyframe (fast rise, slow fade),
  // authored here as a real easing curve instead of a keyframe hack.
  emberSettle: [0.11, 0.98, 0.24, 1],
  // Physical/magnetic interactions ONLY (cursor-following, magnetic CTA
  // pull) — overshoots a hair past its target before settling, so it reads
  // as mass responding to a force, never a snap-to-position UI easing.
  weightedDrag: [0.34, 1.56, 0.64, 1],
};

// --- Pure cubic-bezier solver (the standard UnitBezier technique browsers
// use for CSS cubic-bezier()/GSAP for CustomEase). No dependencies, no
// lookup tables — safe for timeline.js's "no DOM, no React, no GSAP" rule.
function bezierComponent(t, a1, a2) {
  const c = 3 * a1;
  const b = 3 * a2 - 6 * a1;
  const a = 1 - c - b;
  return ((a * t + b) * t + c) * t;
}

function bezierXSlope(t, x1, x2) {
  const c = 3 * x1;
  const b = 3 * x2 - 6 * x1;
  const a = 1 - c - b;
  return 3 * a * t * t + 2 * b * t + c;
}

function solveTForX(x, x1, x2) {
  let t = x;
  for (let i = 0; i < 8; i += 1) {
    const slope = bezierXSlope(t, x1, x2);
    if (Math.abs(slope) < 1e-6) break;
    t -= (bezierComponent(t, x1, x2) - x) / slope;
  }
  if (t >= 0 && t <= 1 && Math.abs(bezierComponent(t, x1, x2) - x) < 1e-4) return t;

  // Newton-Raphson didn't converge cleanly (can happen near shallow-slope
  // endpoints) — fall back to bisection, which always converges.
  let lo = 0;
  let hi = 1;
  let guess = x;
  for (let i = 0; i < 20; i += 1) {
    const current = bezierComponent(guess, x1, x2);
    if (Math.abs(current - x) < 1e-6) break;
    if (current < x) lo = guess;
    else hi = guess;
    guess = (lo + hi) / 2;
  }
  return guess;
}

/** Builds a (t: 0-1) => eased value function from cubic-bezier control points. */
export function cubicBezier(x1, y1, x2, y2) {
  return (t) => {
    const p = Math.min(1, Math.max(0, t));
    if (p === 0 || p === 1) return p;
    return bezierComponent(solveTForX(p, x1, x2), y1, y2);
  };
}

export const emberRise = cubicBezier(...EASE_CURVES.emberRise);
export const emberSettle = cubicBezier(...EASE_CURVES.emberSettle);
export const weightedDrag = cubicBezier(...EASE_CURVES.weightedDrag);

/**
 * Registers EASE_CURVES as named GSAP CustomEase instances so tweens can use
 * `ease: 'emberRise'` etc. Call once, client-side, before any tween
 * references the names — idempotent, safe to call from multiple modules.
 * Deliberately takes gsap/CustomEase as params instead of importing them so
 * this file stays importable from framework-free code (timeline.js).
 */
export function registerGsapEases(gsap, CustomEase) {
  gsap.registerPlugin(CustomEase);
  for (const [name, [x1, y1, x2, y2]] of Object.entries(EASE_CURVES)) {
    CustomEase.create(name, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
  }
}
