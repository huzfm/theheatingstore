/**
 * Pure scroll-progress → motion math for the presentation. No DOM, no React,
 * no GSAP — just numbers, so the choreography can be reasoned about (and
 * unit-tested) independently of how it gets painted.
 *
 * The whole experience is one continuous 0→1 scroll range (`globalProgress`,
 * from a single ScrollTrigger on the pinned wrapper) cut into equal chapters:
 * title card, 6 benefit scenes, the doctor quote, the CTA ending. Each
 * chapter is a complete, self-contained premium presentation card — never
 * two visible at once, because chapters occupy disjoint slices of the global
 * range by construction, and every element inside a chapter (image,
 * typography, stats, glass) is driven off that ONE shared local-progress
 * curve. Nothing inside a card staggers relative to anything else — it
 * arrives, reads, and leaves as a single composition, the way a slide does.
 *
 * Every chapter plays exactly three phases, sized ENTRY 25% / HOLD 50% /
 * EXIT 25% of its own window:
 *  - ENTRY  the whole composition arrives together as one push from depth —
 *           blur resolving to sharp, a soft camera push-in, a faint tilt
 *           correcting to level, the image mask opening. By the end of this
 *           phase every element is fully in place — nothing left mid-reveal.
 *  - HOLD   fully settled. No drift, no floating, no continuous transform —
 *           the card just sits still, for as long as the visitor wants,
 *           long enough to read every word without anything moving.
 *  - EXIT   the whole card leaves as one gesture (fade, blur, a further
 *           push past the camera) — never reversed-entry, so it reads as
 *           the camera arcing past rather than rewinding.
 *
 * `getBeatMotion` is the camera for the whole chapter; `getFrameMotion` is a
 * second, slightly out-of-phase curve for the image card so it reads as its
 * own physical object with weight, not a layer glued to the background —
 * the lag is a handful of percent, not a separate act.
 */

/**
 * Scroll distance (in viewport heights) each chapter owns. Deliberately
 * generous: ENTRY/EXIT should each resolve within a wheel-tick or two (never
 * feel like a scrub-through-mud reveal), while HOLD's share of that distance
 * is the "slack" that lets a visitor scroll a little without breaking the
 * card, or simply stop and read with nothing in motion.
 */
export const BEAT_VH = 100;

export const BEAT_IDS = [
  'title',
  'smoke-free',
  'even-warmth',
  'everyday-comfort',
  'precise-control',
  'power-cut-ready',
  'modern-interiors',
  'quote',
  'cta',
];

export const BEAT_COUNT = BEAT_IDS.length;

// Exactly three phases per beat: ENTRY 25% / HOLD 50% / EXIT 25%. Because
// each beat already owns its own disjoint slice of global progress, there's
// no need for a separate "gap" fraction — both neighbours are at opacity 0
// right at the boundary, so nothing ever overlaps.
const ENTER_END = 0.25;
const EXIT_START = 0.75;
const EXIT_END = 1;

// The image mask/reveal plays out over most of the entry window (a slow,
// deliberate "door opening") but still finishes a beat before the text has
// fully settled — images resolve first, per the brief. The close-up mirror
// of that reveal (the frame closing like an iris) runs across the whole
// exit window, staying in lockstep with the fade/blur/scale-down.
const REVEAL_END = 0.2;
const CLOSE_START = EXIT_START;

export function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutCubic(t) {
  const p = clamp(t);
  return 1 - Math.pow(1 - p, 3);
}

function easeOutQuart(t) {
  const p = clamp(t);
  return 1 - Math.pow(1 - p, 4);
}

function easeInCubic(t) {
  const p = clamp(t);
  return p * p * p;
}

function easeInQuart(t) {
  const p = clamp(t);
  return p * p * p * p;
}

/**
 * A restrained back-out — the "hand-directed" overshoot the brief asks for:
 * motion settles a hair past its resting value before easing back, instead
 * of arriving dead-on like a UI transition. `s` is kept low on purpose
 * (default 1.2 vs. the usual ~1.7) so it reads as weight, not bounce.
 */
function easeOutBackSubtle(t, s = 1.2) {
  const p = clamp(t) - 1;
  return p * p * ((s + 1) * p + s) + 1;
}

/** [start, end) window a beat occupies in the 0→1 global progress range. */
export function getBeatWindow(index, total = BEAT_COUNT) {
  const size = 1 / total;
  return { start: index * size, end: (index + 1) * size };
}

/** Global progress → this beat's own local progress, clamped to [0, 1]. */
export function beatLocalProgress(globalProgress, index, total = BEAT_COUNT) {
  const { start, end } = getBeatWindow(index, total);
  const size = end - start;
  if (size <= 0) return 0;
  return clamp((globalProgress - start) / size);
}

/**
 * The "camera" for a whole beat. ENTRY reads as a slow push-in from depth —
 * scale, negative z and a faint tilt resolving out of blur, with a touch of
 * overshoot as it settles (anticipation, not bounce). HOLD is deliberately
 * inert: the composition is fully resolved and does not move again until it
 * leaves — that stillness is what gives the visitor room to read. EXIT is
 * NOT the enter reversed — the camera keeps drifting the same direction it
 * was already moving and adds an opposite-direction tilt, like it's arcing
 * past the scene rather than rewinding through it.
 */
export function getBeatMotion(localT) {
  const t = clamp(localT);

  if (t <= 0 || t >= 1) {
    return {
      phase: t <= 0 ? 'before' : 'after',
      visible: false,
      opacity: 0,
      blur: 22,
      scale: 0.88,
      x: 0,
      y: 36,
      z: -160,
      rotateX: 0,
      rotateY: 0,
    };
  }

  if (t < ENTER_END) {
    const e = t / ENTER_END;
    const opacityT = easeOutQuart(e);
    const motionT = easeOutBackSubtle(e);
    const tiltT = easeOutCubic(e);
    return {
      phase: 'enter',
      visible: true,
      opacity: opacityT,
      blur: lerp(22, 0, opacityT),
      scale: lerp(0.88, 1, motionT),
      x: lerp(-16, 0, motionT),
      y: lerp(36, 0, motionT),
      z: lerp(-160, 0, motionT),
      rotateX: lerp(6, 0, tiltT),
      rotateY: lerp(-5, 0, tiltT),
    };
  }

  if (t < EXIT_START) {
    return {
      phase: 'hold',
      visible: true,
      opacity: 1,
      blur: 0,
      scale: 1,
      x: 0,
      y: 0,
      z: 0,
      rotateX: 0,
      rotateY: 0,
    };
  }

  if (t < EXIT_END) {
    const x = (t - EXIT_START) / (EXIT_END - EXIT_START);
    const drop = easeInQuart(x);
    const opacityDrop = easeInCubic(x);
    return {
      phase: 'exit',
      visible: true,
      opacity: lerp(1, 0, opacityDrop),
      blur: lerp(0, 20, opacityDrop),
      scale: lerp(1, 0.955, drop),
      x: lerp(0, 22, drop),
      y: lerp(0, -30, drop),
      z: lerp(0, -90, drop),
      rotateX: 0,
      rotateY: lerp(0, 7, drop),
    };
  }

  return {
    phase: 'gap',
    visible: false,
    opacity: 0,
    blur: 20,
    scale: 0.955,
    x: 22,
    y: -30,
    z: -90,
    rotateX: 0,
    rotateY: 7,
  };
}

/**
 * A second, independent motion curve for the image card within a scene —
 * deliberately out of phase with getBeatMotion so the card reads as an
 * object with its own weight, not a layer glued to the camera. Settles a
 * hair after the scene itself starts resolving, then holds dead still —
 * no oscillation while the visitor is meant to be reading — before a last
 * push as the beat exits.
 */
export function getFrameMotion(localT) {
  const t = clamp(localT);

  if (t < ENTER_END) {
    const lag = 0.05;
    const e = clamp((t - lag) / (ENTER_END - lag));
    const motionT = easeOutBackSubtle(e);
    return {
      scale: lerp(0.9, 1, motionT),
      y: lerp(26, 0, motionT),
      rotateY: lerp(6, 0, easeOutCubic(e)),
    };
  }

  if (t < EXIT_START) {
    return { scale: 1, y: 0, rotateY: 0 };
  }

  const x = clamp((t - EXIT_START) / (EXIT_END - EXIT_START));
  const drop = easeInCubic(x);
  return {
    scale: lerp(1, 0.965, drop),
    y: lerp(0, -14, drop),
    rotateY: lerp(0, -5, drop),
  };
}

/**
 * A scene's background image never moves during HOLD — the brief is explicit
 * that nothing should keep animating while the visitor reads. Instead the
 * image gets one soft push-in as the camera arrives (a Ken Burns-style
 * settle, not a loop) and one further push as it leaves, arcing past like
 * the beat's own camera does.
 */
export function getImageDrift(localT) {
  const t = clamp(localT);

  if (t < ENTER_END) {
    const e = easeOutCubic(t / ENTER_END);
    return { scale: lerp(1, 1.06, e), x: lerp(-0.6, 0, e) };
  }

  if (t < EXIT_START) {
    return { scale: 1.06, x: 0 };
  }

  const x = easeInCubic((t - EXIT_START) / (EXIT_END - EXIT_START));
  return { scale: lerp(1.06, 1.12, x), x: lerp(0, 0.8, x) };
}

/**
 * The image frame's own "door opening" reveal: a clip-path inset that closes
 * the frame down at rest and opens it in the first slice of ENTRY, plus a
 * diagonal light-sweep and a soft brightness bloom that both settle before
 * the text has finished arriving. `shadowT` (0→1) drives the frame's drop
 * shadow so it deepens as the card lifts into place — a "shadow expansion"
 * synced to the same open/close curve.
 *
 * On the way out the frame closes again — the mirror of the opening reveal,
 * playing across the whole EXIT window so it never looks like a separate
 * effect bolted onto the fade.
 */
export function getImageReveal(localT) {
  const t = clamp(localT);

  if (t <= CLOSE_START) {
    const r = easeOutCubic(clamp(t / REVEAL_END));
    return {
      inset: lerp(9, 0, r),
      shadowT: r,
      brightness: lerp(1.32, 1, r),
      sweepX: lerp(-30, 130, r),
      sweepOpacity: t <= 0 ? 0 : lerp(0.6, 0, easeInCubic(clamp((t - REVEAL_END * 0.4) / (REVEAL_END * 0.9)))),
    };
  }

  const c = easeInCubic(clamp((t - CLOSE_START) / (EXIT_END - CLOSE_START)));
  return {
    inset: lerp(0, 9, c),
    shadowT: lerp(1, 0, c),
    brightness: lerp(1, 0.9, c),
    sweepX: lerp(-30, 130, c),
    sweepOpacity: lerp(0, 0.55, Math.sin(clamp(c) * Math.PI)),
  };
}

/** Which beat index "owns" a given global progress — for lightweight UI state. */
export function activeBeatIndex(globalProgress, total = BEAT_COUNT) {
  return clamp(Math.floor(globalProgress * total), 0, total - 1);
}
