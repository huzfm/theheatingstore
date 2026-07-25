/**
 * The hero's ease vocabulary.
 *
 * Every move in the hero draws from this list and nothing defines an ease
 * inline. That constraint is the whole point: a motion system reads as
 * authored when unrelated elements decelerate the same way, and reads as a
 * template when each one picks its own curve. If a new move needs a curve that
 * is not here, the right fix is usually to reach for an existing one.
 *
 * The house style is long and decelerating. Fast, snappy, or overshooting
 * motion reads consumer-grade; luxury brands move slowly because slowness
 * implies nothing is being rushed or concealed.
 */

/** GSAP ease strings — all built-ins, no plugin dependency. */
export const EASE = {
  /** Camera coming to rest. Long tail, no perceptible arrival. */
  settle: 'expo.out',
  /** Heat arriving in a surface — type reveals, grade ramps. */
  thermal: 'power3.out',
  /** Current filling a bar. Slight front-load, then confident. */
  charge: 'power2.out',
  /** Magnetic release. The only curve in the system permitted to overshoot. */
  release: 'back.out(1.7)',
  /** Scroll-scrubbed segments. Must be linear or scrubbing feels rubbery. */
  scrub: 'none',
};

/**
 * CSS equivalents for the handful of things that stay as CSS transitions
 * (hover states, tier cross-fades) rather than being driven by GSAP.
 */
export const CSS_EASE = {
  settle: 'cubic-bezier(0.16, 1, 0.30, 1)',
  thermal: 'cubic-bezier(0.22, 1, 0.36, 1)',
  draw: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

/**
 * The hero's timing constants, in seconds. Grouped here so the ignition
 * sequence can be re-timed as a whole without hunting through components.
 */
export const TIME = {
  /** How long the room is held cold before the system energises. */
  coldHold: 0.2,
  /** Current running the coil bed. */
  ignition: 1.2,
  /** Camera settling from its 1.04 overscan. Deliberately outlasts ignition. */
  camera: 2.4,
  /** A single line of type warming into existence. */
  line: 1.1,
  /** Offset between consecutive headline lines. */
  lineStagger: 0.09,
};

/* ── numeric helpers ───────────────────────────────────────────────────── */

export const clamp = (x, min = 0, max = 1) => (x < min ? min : x > max ? max : x);

export const lerp = (a, b, t) => a + (b - a) * t;

/** Remaps x from [inMin,inMax] to [outMin,outMax], clamped at both ends. */
export function mapRange(x, inMin, inMax, outMin, outMax) {
  return lerp(outMin, outMax, clamp((x - inMin) / (inMax - inMin)));
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Frame-rate-independent damping.
 *
 * The usual `value += (target - value) * 0.06` is a trap: it is a fixed
 * fraction *per frame*, so the same code settles roughly twice as fast on a
 * 120 Hz display as on a 60 Hz one, and visibly stutters whenever a frame is
 * long. Converting the coefficient through `1 - e^(-lambda·dt)` makes the
 * settle time a property of wall-clock time instead of refresh rate.
 *
 * `lambda` is roughly "how many e-foldings per second" — higher is snappier.
 */
export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
