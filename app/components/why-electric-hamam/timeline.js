/**
 * Pure scroll-progress → motion math for the presentation. No DOM, no React,
 * no GSAP, just numbers, so the choreography can be reasoned about (and
 * unit-tested) independently of how it gets painted.
 *
 * The whole experience is one continuous 0→1 scroll range (`globalProgress`,
 * from a single ScrollTrigger on the pinned wrapper) cut into equal chapters:
 * title card, 6 benefit scenes, the doctor quote, the CTA ending. Each
 * chapter is a complete, self-contained premium presentation card, never
 * two visible at once, because chapters occupy disjoint slices of the global
 * range by construction, and every element inside a chapter (image,
 * typography, stats, glass) is driven off that ONE shared local-progress
 * curve. Nothing inside a card staggers relative to anything else, it
 * arrives, reads, and leaves as a single composition, the way a slide does.
 *
 * Every chapter plays exactly three phases, sized ENTRY 25% / HOLD 50% /
 * EXIT 25% of its own window:
 *  - ENTRY  the whole composition arrives together as one push from depth 
 *           blur resolving to sharp, a soft camera push-in, a faint tilt
 *           correcting to level, the image mask opening. By the end of this
 *           phase every element is fully in place, nothing left mid-reveal.
 *  - HOLD   fully settled. No drift, no floating, no continuous transform 
 *           the card just sits still, for as long as the visitor wants,
 *           long enough to read every word without anything moving.
 *  - EXIT   the whole card leaves as one gesture (fade, blur, a further
 *           push past the camera), never reversed-entry, so it reads as
 *           the camera arcing past rather than rewinding.
 *
 * `getBeatMotion` is the camera for the whole chapter; `getFrameMotion` is a
 * second, slightly out-of-phase curve for the image card so it reads as its
 * own physical object with weight, not a layer glued to the background 
 * the lag is a handful of percent, not a separate act.
 *
 * Every curve in this file is one of the three named eases from easings.js
 * (emberRise for entering, emberSettle for coming to rest, weightedDrag for
 * anything that should read as an object with physical mass settling into
 * place — the image frame's own "drop into its housing," not just pointer-
 * driven interactions) — never a stock preset, never an unrouted one-off.
 * All three are plain, dependency-free functions, so importing them here
 * doesn't break this file's "no DOM, no React, no GSAP" rule.
 */

import { emberRise, emberSettle, weightedDrag } from './easings';

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
// no need for a separate "gap" fraction, both neighbours are at opacity 0
// right at the boundary, so nothing ever overlaps.
const ENTER_END = 0.25;
const EXIT_START = 0.75;
const EXIT_END = 1;

// The image mask/reveal plays out over most of the entry window (a slow,
// deliberate "door opening") but still finishes a beat before the text has
// fully settled, images resolve first, per the brief. The close-up mirror
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

<<<<<<< HEAD
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
 * A restrained back-out, the "hand-directed" overshoot the brief asks for:
 * motion settles a hair past its resting value before easing back, instead
 * of arriving dead-on like a UI transition. `s` is kept low on purpose
 * (default 1.2 vs. the usual ~1.7) so it reads as weight, not bounce.
 */
function easeOutBackSubtle(t, s = 1.2) {
  const p = clamp(t) - 1;
  return p * p * ((s + 1) * p + s) + 1;
}

=======
>>>>>>> 8199ed9 (latest changes)
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
 * The "camera" for a whole beat. ENTRY reads as a slow push-in from depth 
 * scale, negative z and a faint tilt resolving out of blur, with a touch of
<<<<<<< HEAD
 * overshoot as it settles (anticipation, not bounce). HOLD is deliberately
 * inert: the composition is fully resolved and does not move again until it
 * leaves, that stillness is what gives the visitor room to read. EXIT is
 * NOT the enter reversed, the camera keeps drifting the same direction it
 * was already moving and adds an opposite-direction tilt, like it's arcing
 * past the scene rather than rewinding through it.
=======
 * overshoot as it settles (anticipation, not bounce) via `weightedDrag` —
 * the push-in is a physical camera move with weight, the same character as
 * the image frame's own settle, just on the whole composition. HOLD is
 * deliberately inert: the composition is fully resolved and does not move
 * again until it leaves — that stillness is what gives the visitor room to
 * read. EXIT is NOT the enter reversed — the camera keeps drifting the same
 * direction it was already moving and adds an opposite-direction tilt on
 * `emberSettle`, like it's arcing past the scene rather than rewinding
 * through it.
>>>>>>> 8199ed9 (latest changes)
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
    const rise = emberRise(t / ENTER_END);
    const motionT = weightedDrag(t / ENTER_END);
    return {
      phase: 'enter',
      visible: true,
      opacity: rise,
      blur: lerp(22, 0, rise),
      scale: lerp(0.88, 1, motionT),
      x: lerp(-16, 0, motionT),
      y: lerp(36, 0, motionT),
      z: lerp(-160, 0, motionT),
      rotateX: lerp(6, 0, rise),
      rotateY: lerp(-5, 0, rise),
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
    const drop = emberSettle((t - EXIT_START) / (EXIT_END - EXIT_START));
    return {
      phase: 'exit',
      visible: true,
      opacity: lerp(1, 0, drop),
      blur: lerp(0, 20, drop),
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
 * A second, independent motion curve for the image card within a scene 
 * deliberately out of phase with getBeatMotion so the card reads as an
 * object with its own weight, not a layer glued to the camera. Settles a
<<<<<<< HEAD
 * hair after the scene itself starts resolving, then holds dead still 
 * no oscillation while the visitor is meant to be reading, before a last
 * push as the beat exits.
=======
 * hair after the scene itself starts resolving, then holds dead still —
 * no oscillation while the visitor is meant to be reading — before a last
 * push as the beat exits. `mirrored` (true for image-on-left scenes) flips
 * the hinge direction so alternating layouts read as genuinely mirrored,
 * not the same rotation transplanted onto the other side of the page.
 *
 * Its overshoot-and-settle now rides `weightedDrag` — resolved in the Phase
 * 6 polish pass: this reads as an object with physical mass dropping into
 * its housing, the exact character weightedDrag was authored for, even
 * though the trigger is scroll rather than a pointer.
>>>>>>> 8199ed9 (latest changes)
 */
export function getFrameMotion(localT, mirrored = false) {
  const t = clamp(localT);
  const dir = mirrored ? -1 : 1;

  if (t < ENTER_END) {
    const lag = 0.05;
    const e = clamp((t - lag) / (ENTER_END - lag));
    const motionT = weightedDrag(e);
    return {
      scale: lerp(0.9, 1, motionT),
      y: lerp(26, 0, motionT),
      rotateY: lerp(dir * 6, 0, emberRise(e)),
    };
  }

  if (t < EXIT_START) {
    return { scale: 1, y: 0, rotateY: 0 };
  }

  const drop = emberSettle(clamp((t - EXIT_START) / (EXIT_END - EXIT_START)));
  return {
    scale: lerp(1, 0.965, drop),
    y: lerp(0, -14, drop),
    rotateY: lerp(0, dir * -5, drop),
  };
}

/**
<<<<<<< HEAD
 * A scene's background image never moves during HOLD, the brief is explicit
 * that nothing should keep animating while the visitor reads. Instead the
 * image gets one soft push-in as the camera arrives (a Ken Burns-style
 * settle, not a loop) and one further push as it leaves, arcing past like
 * the beat's own camera does.
=======
 * True parallax, not just a fade: unlike the frame (which sits perfectly
 * still through HOLD), the image keeps drifting a small amount the whole
 * time the visitor is reading — capped, transform-only (scale + x),
 * shaped on emberSettle so most of the drift happens early and nearly
 * stops well before HOLD ends. It's scroll-tied, not autonomous: a visitor
 * who stops scrolling gets a still frame, exactly like everything else in
 * this presentation — only scrolling through HOLD's own window reveals it.
 * All three phases are one continuous curve — each segment's start value
 * is the previous segment's end value, so there's never a visible seam.
 * `mirrored` flips the drift direction for image-on-left scenes.
>>>>>>> 8199ed9 (latest changes)
 */
export function getImageDrift(localT, mirrored = false) {
  const t = clamp(localT);
  const dir = mirrored ? 1 : -1;

  if (t < ENTER_END) {
    const e = emberRise(t / ENTER_END);
    return { scale: lerp(1, 1.06, e), x: lerp(dir * 0.6, 0, e) };
  }

  if (t < EXIT_START) {
    const h = emberSettle((t - ENTER_END) / (EXIT_START - ENTER_END));
    return { scale: lerp(1.06, 1.085, h), x: lerp(0, dir * 0.9, h) };
  }

  const x2 = emberSettle((t - EXIT_START) / (EXIT_END - EXIT_START));
  return { scale: lerp(1.085, 1.12, x2), x: lerp(dir * 0.9, dir * 1.4, x2) };
}

/**
<<<<<<< HEAD
 * The image frame's own "door opening" reveal: a clip-path inset that closes
 * the frame down at rest and opens it in the first slice of ENTRY, plus a
 * diagonal light-sweep and a soft brightness bloom that both settle before
 * the text has finished arriving. `shadowT` (0→1) drives the frame's drop
 * shadow so it deepens as the card lifts into place, a "shadow expansion"
 * synced to the same open/close curve.
 *
 * On the way out the frame closes again, the mirror of the opening reveal,
 * playing across the whole EXIT window so it never looks like a separate
 * effect bolted onto the fade.
=======
 * A faint, independent depth-offset for the copy panel — its own lag and
 * its own emberRise/emberSettle timing, mirrored opposite the image's own
 * drift, so the two panels read as separate objects at slightly different
 * depths rather than one rigid card moving as a unit. Deliberately small:
 * this should never be the thing a visitor consciously notices.
 */
export function getCopyPanelMotion(localT, mirrored = false) {
  const t = clamp(localT);
  const dir = mirrored ? -1 : 1;

  if (t < ENTER_END) {
    const lag = 0.1;
    const e = emberRise(clamp((t - lag) / (ENTER_END - lag)));
    return { x: lerp(dir * 10, 0, e), y: lerp(8, 0, e) };
  }

  if (t < EXIT_START) {
    const h = emberSettle((t - ENTER_END) / (EXIT_START - ENTER_END));
    return { x: lerp(0, dir * -4, h), y: 0 };
  }

  const x2 = emberSettle((t - EXIT_START) / (EXIT_END - EXIT_START));
  return { x: lerp(dir * -4, dir * -8, x2), y: lerp(0, -6, x2) };
}

// index → heading → body → rowstat, each its own emberRise-windowed slice
// of ENTRY. Start points are spaced with a widening gap (0.24 → 0.26 →
// 0.30) so the pacing measurably decelerates, like a held breath, rather
// than a fixed per-item delay — the same technique as the title card's
// eyebrow→heading stagger, just carried across four stops instead of two.
// The counter-stat badge (where present) isn't its own stop: it arrives
// bundled with `index`, both being top-of-card framing rather than the
// two-beat narrative arc (heading, then the supporting body/stat).
const SCENE_COPY_WINDOWS = {
  index: [0, 0.4],
  heading: [0.24, 0.62],
  body: [0.5, 0.84],
  rowstat: [0.8, 1],
};

function sceneCopyChildMotion(localT, windowKey, liftPx) {
  const t = clamp(localT);
  if (t >= EXIT_START) return { opacity: 1, y: 0 }; // parent's own fade carries it out
  const e = t < ENTER_END ? windowedEmberRise(t / ENTER_END, SCENE_COPY_WINDOWS[windowKey]) : 1;
  return { opacity: e, y: lerp(liftPx, 0, e) };
}

export function getSceneIndexMotion(localT) {
  return sceneCopyChildMotion(localT, 'index', 10);
}

export function getSceneHeadingMotion(localT) {
  return sceneCopyChildMotion(localT, 'heading', 20);
}

export function getSceneBodyMotion(localT) {
  return sceneCopyChildMotion(localT, 'body', 14);
}

export function getSceneRowstatMotion(localT) {
  return sceneCopyChildMotion(localT, 'rowstat', 12);
}

/**
 * The image frame's own "door opening" reveal — one authored sequence, not
 * three independent effects: the clip-path inset, the shadow depth
 * (`shadowT`), and the diagonal light-sweep/brightness bloom all ride the
 * SAME `r` value (emberRise) as the frame opens, so the mask parting, the
 * card lifting into shadow, and the light crossing it read as one physical
 * gesture — a shutter or material sliding into place — rather than three
 * things that merely finish around the same time.
 *
 * On the way out the frame closes again on `c` (emberSettle) — a brisk
 * re-close followed by an unhurried settle, playing across the whole EXIT
 * window so it never looks like a separate effect bolted onto the fade.
>>>>>>> 8199ed9 (latest changes)
 */
export function getImageReveal(localT) {
  const t = clamp(localT);

  if (t <= CLOSE_START) {
    const r = emberRise(clamp(t / REVEAL_END));
    return {
      inset: lerp(9, 0, r),
      shadowT: r,
      brightness: lerp(1.32, 1, r),
      sweepX: lerp(-30, 130, r),
      sweepOpacity: t <= 0 ? 0 : lerp(0.6, 0, emberSettle(clamp((t - REVEAL_END * 0.4) / (REVEAL_END * 0.9)))),
    };
  }

  const c = emberSettle(clamp((t - CLOSE_START) / (EXIT_END - CLOSE_START)));
  return {
    inset: lerp(0, 9, c),
    shadowT: lerp(1, 0, c),
    brightness: lerp(1, 0.9, c),
    sweepX: lerp(-30, 130, c),
    // The exit sweep is a brief flash (rise then fall), not an entrance or
    // a settle — none of the three named eases describe that shape, so this
    // stays local, hand-tuned math rather than a forced, worse-fitting fit.
    sweepOpacity: lerp(0, 0.55, Math.sin(clamp(c) * Math.PI)),
  };
}

/** Which beat index "owns" a given global progress, for lightweight UI state. */
export function activeBeatIndex(globalProgress, total = BEAT_COUNT) {
  return clamp(Math.floor(globalProgress * total), 0, total - 1);
}

/**
 * ── Title scene ────────────────────────────────────────────────────────
 * The cold open gets its own signature transition rather than the shared
 * push-in-from-depth camera every other beat uses: a vertical iris/unveil,
 * where a clip-path band parts outward from the center like a shutter
 * opening, in lockstep with opacity/blur/scale resolving on `emberRise`.
 * EXIT settles on `emberSettle` — a brisk close followed by an unhurried
 * fade, rather than entry played backwards.
 */
const TITLE_CLIP_CLOSED = 40; // inset %, top+bottom — curtain fully drawn
const TITLE_CLIP_OPEN = 0; // fully unveiled
const TITLE_CLIP_EXIT = TITLE_CLIP_CLOSED * 0.6; // partial re-close on the way out, not a full curtain-drop

export function getTitleMotion(localT) {
  const t = clamp(localT);

  if (t <= 0 || t >= 1) {
    return {
      visible: false,
      opacity: 0,
      blur: 18,
      scale: 0.97,
      clipInset: TITLE_CLIP_CLOSED,
    };
  }

  if (t < ENTER_END) {
    const e = emberRise(t / ENTER_END);
    return {
      visible: true,
      opacity: e,
      blur: lerp(18, 0, e),
      scale: lerp(0.985, 1, e),
      clipInset: lerp(TITLE_CLIP_CLOSED, TITLE_CLIP_OPEN, e),
    };
  }

  if (t < EXIT_START) {
    return { visible: true, opacity: 1, blur: 0, scale: 1, clipInset: TITLE_CLIP_OPEN };
  }

  if (t < EXIT_END) {
    const x = emberSettle((t - EXIT_START) / (EXIT_END - EXIT_START));
    return {
      visible: true,
      opacity: lerp(1, 0, x),
      blur: lerp(0, 16, x),
      scale: lerp(1, 1.02, x),
      clipInset: lerp(TITLE_CLIP_OPEN, TITLE_CLIP_EXIT, x),
    };
  }

  return { visible: false, opacity: 0, blur: 16, scale: 1.02, clipInset: TITLE_CLIP_EXIT };
}

// Eyebrow resolves first and quickly; heading waits through a deliberately
// widening pause before its own, heavier arrival — "increasing pause
// between them" read as a growing gap before each element even starts,
// not a fixed per-item delay. Both windows are fractions of the shared
// ENTRY span (t / ENTER_END), each independently re-eased with emberRise.
const TITLE_EYEBROW_WINDOW = [0, 0.46];
const TITLE_HEADING_WINDOW = [0.32, 1];

function windowedEmberRise(e, [start, end]) {
  if (end <= start) return 1;
  return emberRise(clamp((e - start) / (end - start)));
}

export function getTitleEyebrowMotion(localT) {
  const t = clamp(localT);
  if (t >= EXIT_START) return { opacity: 1, y: 0 }; // parent's own fade carries it out
  const e = t < ENTER_END ? windowedEmberRise(t / ENTER_END, TITLE_EYEBROW_WINDOW) : 1;
  return { opacity: e, y: lerp(14, 0, e) };
}

export function getTitleHeadingMotion(localT) {
  const t = clamp(localT);
  if (t >= EXIT_START) return { opacity: 1, y: 0 };
  const e = t < ENTER_END ? windowedEmberRise(t / ENTER_END, TITLE_HEADING_WINDOW) : 1;
  return { opacity: e, y: lerp(22, 0, e) };
}

/**
 * ── Quote scene ────────────────────────────────────────────────────────
 * The emotional peak gets its own pacing, distinct from both the title's
 * quick iris and the benefit scenes' brisk-arrival cards: entry itself
 * rides `emberSettle` rather than `emberRise` — a brisk arrival immediately
 * followed by a long, unhurried decay into full clarity — so the card
 * reads as settling into place rather than arriving. HOLD is stretched
 * well past the standard 50% share (68% here) so there's real room to
 * read slowly, with nothing else competing for attention once it lands.
 * A deliberately plain camera move (opacity/blur/scale only, no push or
 * tilt) keeps it spacious rather than punchy.
 */
const QUOTE_ENTER_END = 0.18;
const QUOTE_EXIT_START = 0.86;
const QUOTE_EXIT_END = 1;

export function getQuoteMotion(localT) {
  const t = clamp(localT);

  if (t <= 0 || t >= 1) {
    return { visible: false, opacity: 0, blur: 20, scale: 0.96 };
  }

  if (t < QUOTE_ENTER_END) {
    const e = emberSettle(t / QUOTE_ENTER_END);
    return { visible: true, opacity: e, blur: lerp(20, 0, e), scale: lerp(0.96, 1, e) };
  }

  if (t < QUOTE_EXIT_START) {
    return { visible: true, opacity: 1, blur: 0, scale: 1 };
  }

  if (t < QUOTE_EXIT_END) {
    const x = emberSettle((t - QUOTE_EXIT_START) / (QUOTE_EXIT_END - QUOTE_EXIT_START));
    return { visible: true, opacity: lerp(1, 0, x), blur: lerp(0, 18, x), scale: lerp(1, 1.02, x) };
  }

  return { visible: false, opacity: 0, blur: 18, scale: 1.02 };
}

// The mark arrives first and quiet — a small, quick lift within the first
// half of the (already short) entry window, fully resolved well before the
// text even starts. The quote text waits for a real pause, then arrives
// with more presence (a taller lift). The two reveals are deliberately
// unequal in both timing and weight, so the mark reads as a stage
// direction — a quiet cue before the line — rather than a second headline.
const QUOTE_MARK_WINDOW = [0, 0.5];
const QUOTE_TEXT_WINDOW = [0.35, 1];

function quoteChildMotion(localT, staggerWindow, liftPx) {
  const t = clamp(localT);
  if (t >= QUOTE_EXIT_START) return { opacity: 1, y: 0 }; // parent's own fade carries it out
  const e = t < QUOTE_ENTER_END ? windowedEmberRise(t / QUOTE_ENTER_END, staggerWindow) : 1;
  return { opacity: e, y: lerp(liftPx, 0, e) };
}

export function getQuoteMarkMotion(localT) {
  return quoteChildMotion(localT, QUOTE_MARK_WINDOW, 5);
}

export function getQuoteTextMotion(localT) {
  return quoteChildMotion(localT, QUOTE_TEXT_WINDOW, 16);
}
