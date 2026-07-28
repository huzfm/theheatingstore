/**
 * Framerate-independent lerp. Plain `a + (b-a)*0.1` per frame moves faster on
 * a 144Hz display than a 60Hz one; this compensates using the real delta.
 *
 * @param {number} current
 * @param {number} target
 * @param {number} smoothing lower = snappier (0.05–0.25 typical)
 * @param {number} delta seconds since last frame
 */
export function damp(current, target, smoothing, delta) {
  return current + (target - current) * (1 - Math.exp(-smoothing * 60 * delta));
}

export const lerp = (a, b, t) => a + (b - a) * t;

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Remap a value from one range to another, clamped to the output range. */
export function mapRange(value, inMin, inMax, outMin, outMax, doClamp = true) {
  const t = (value - inMin) / (inMax - inMin || 1);
  const out = outMin + t * (outMax - outMin);
  return doClamp
    ? clamp(out, Math.min(outMin, outMax), Math.max(outMin, outMax))
    : out;
}

/**
 * Sub-progress within a stage of a longer scroll timeline.
 * mapRange(p, 0.3, 0.6, 0, 1) says "how far through stage B are we".
 */
export const stageProgress = (p, start, end) => clamp((p - start) / (end - start));

/** Smoothstep, eases the ends of a linear ramp so stages blend rather than kink. */
export function smoothstep(t) {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
}

/** Symmetric fade: 0 at the edges of [start,end], 1 across the middle. */
export function fadeBand(p, start, end, feather = 0.08) {
  if (p <= start || p >= end) return 0;
  const inFade = smoothstep((p - start) / feather);
  const outFade = smoothstep((end - p) / feather);
  return Math.min(inFade, outFade);
}

/** Shared palette, kept in sync with the --color-heat-* tokens in globals.css. */
export const PALETTE = {
  heat300: '#ffd0a1',
  heat400: '#ffb061',
  heat500: '#ff8a3d',
  heat600: '#f2681c',
  ink950: '#0a0a0a',
  ink900: '#0f0e0d',
  ink800: '#161512',
  bone100: '#f5f1ec',
  // ProWarm cable jacket, the physical product colour, distinct from the
  // heat300-600 ramp above which stands for warmth/glow, not material colour.
  matCable300: '#e8407f',
  matCable500: '#c22d70',
  matCable700: '#5c1638',
};

/**
 * Caps the renderer's pixel ratio. Retina laptops report 2–3, which means
 * 4–9x the fragments for a barely visible gain; 1.75 is the point where the
 * scene still looks crisp but mid-range GPUs hold 60fps.
 */
export const DPR = [1, 1.75];
