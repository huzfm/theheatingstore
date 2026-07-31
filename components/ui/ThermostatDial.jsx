'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';

/**
 * An auto-looping smart-thermostat dial.
 *
 * Cycles OFF → HEATING → HOLDING → SCHEDULED → POWER CUT and back, on a timer.
 * Nothing here is interactive by design: it sits beside the About hero
 * headline, and a draggable control next to copy competes with the copy. The
 * component is self-contained, so a future product page can wrap it with real
 * controls without unpicking it from the hero.
 *
 * Deliberately SVG rather than react-three-fiber. A dial is a 2D instrument:
 * SVG arcs stay crisp at any DPI, the bevel and inner glow are more
 * convincing as layered gradients than as real geometry, and the whole thing
 * costs a handful of paths instead of a WebGL context.
 *
 * Performance posture: the ring, the tick mask, the glow and the temperature
 * digits are all written straight to the DOM from a single GSAP tween. React
 * renders once per *state*, not once per frame, five renders per 28-second
 * loop rather than seventeen hundred.
 */

/* Site easing, matching RevealText / Timeline / the About sections. */
const EASE = [0.16, 1, 0.3, 1];

/* ── Dial geometry ──────────────────────────────────────────────────
   A 270° arc with the gap at the bottom, which is what every physical
   thermostat does, a closed ring reads as a progress spinner instead. */
const SIZE = 240;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 100;
const CIRC = 2 * Math.PI * R;
const ARC = CIRC * 0.75;
const START_DEG = 135;
const SWEEP_DEG = 270;
const TICKS = 48;

/* The stored-warmth arc sits at its own radius, so it needs its own arc
   length, reusing the outer ring's would make it deplete at the wrong rate. */
const STORED_R = 62;
const STORED_CIRC = 2 * Math.PI * STORED_R;
const STORED_ARC = STORED_CIRC * 0.75;

/* Temperatures the loop moves between. */
const AMBIENT = 18;
const TARGET = 24;

/* Where the ring rests when the system is off, not zero. A dial pinned at
   empty reads as broken; a floor at room temperature is simply resting. */
const OFF_FILL = (AMBIENT - 10) / (TARGET + 4 - 10);

/**
 * The loop. Durations are tuned for someone reading the headline beside it:
 * long enough that each state is legible on its own, short enough that a
 * visitor sees the full cycle without waiting for it.
 */
const SEQUENCE = [
  { id: 'off', ms: 3800 },
  { id: 'heating', ms: 7600 },
  { id: 'holding', ms: 5600 },
  { id: 'scheduled', ms: 4600 },
  { id: 'outage', ms: 6800 },
];

export const DIAL_STATES = {
  off: {
    label: 'Off',
    detail: 'System resting',
    ring: '#6b655e',
    glow: 0.0,
    /* Breath period in seconds; 0 = perfectly still. */
    breath: 0,
  },
  heating: {
    label: 'Heating',
    detail: `Warming to ${TARGET}°`,
    ring: 'url(#dialHeat)',
    glow: 1,
    // Short period, this is the urgent one.
    breath: 1.7,
  },
  holding: {
    label: 'Holding',
    detail: 'At temperature',
    ring: 'url(#dialHeat)',
    glow: 0.72,
    // Slow and calm. The contrast with HEATING's 1.7s is the whole tell.
    breath: 5.2,
  },
  scheduled: {
    label: 'Scheduled',
    detail: 'Turns on at 18:00',
    ring: '#9a7f66',
    glow: 0.16,
    breath: 0,
  },
  outage: {
    label: 'Power cut',
    detail: 'Floor still warm',
    ring: '#6b655e',
    glow: 0.1,
    breath: 0,
  },
};

/** Ring fill each state settles at, as a fraction of the 270° arc. */
const FILL = {
  off: OFF_FILL,
  heating: 1,
  holding: 1,
  scheduled: 0,
  outage: OFF_FILL,
};

/** Temperature each state settles at. */
const TEMP = {
  off: AMBIENT,
  heating: TARGET,
  holding: TARGET,
  scheduled: AMBIENT,
  outage: 22.4,
};

function polar(radius, deg) {
  // SVG's y axis points down, so a positive angle sweeps clockwise, which is
  // the same direction stroke-dasharray runs. Keeping both in one convention
  // is what lets the tick mask line up with the ring without a fudge factor.
  const rad = (deg * Math.PI) / 180;

  // Rounded, and not for tidiness: Math.sin/cos are implementation-defined to
  // within an ulp, so Node and the browser disagree in the last digit or two.
  // React serialises the full float into the line's x1/y1, which made every
  // tick a hydration mismatch. Two decimals on a 240-unit viewBox is far below
  // a device pixel and is identical on both sides.
  const round = (v) => Math.round(v * 100) / 100;
  return [round(CX + radius * Math.cos(rad)), round(CY + radius * Math.sin(rad))];
}

export default function ThermostatDial({ className = '', onStateChange }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const state = SEQUENCE[index].id;
  const config = DIAL_STATES[state];
  const bump = useAnimationControls();

  /* Elements written to imperatively, never through React state. */
  const ringRef = useRef(null);
  const glowRingRef = useRef(null);
  const maskRef = useRef(null);
  const innerGlowRef = useRef(null);
  const tempRef = useRef(null);
  const storedRef = useRef(null);

  /* Current animated values, so a transition starts from wherever the last
     one actually got to rather than snapping to a nominal start. */
  const valuesRef = useRef({ fill: OFF_FILL, temp: AMBIENT, stored: 1 });

  const ticks = useMemo(
    () =>
      Array.from({ length: TICKS }, (_, i) => {
        const deg = START_DEG + (i / (TICKS - 1)) * SWEEP_DEG;
        const [x1, y1] = polar(78, deg);
        const [x2, y2] = polar(88, deg);
        return { x1, y1, x2, y2 };
      }),
    []
  );

  /** Push the current values into the DOM. Called from the tween's onUpdate. */
  const paint = () => {
    const { fill, temp, stored } = valuesRef.current;
    const offset = ARC * (1 - fill);

    if (ringRef.current) ringRef.current.style.strokeDashoffset = `${offset}`;
    if (glowRingRef.current) glowRingRef.current.style.strokeDashoffset = `${offset}`;
    if (maskRef.current) maskRef.current.style.strokeDashoffset = `${offset}`;
    if (storedRef.current) {
      storedRef.current.style.strokeDashoffset = `${STORED_ARC * (1 - stored)}`;
    }
    // Inner glow tracks the fill, so more heat really is more glow rather
    // than the two being animated separately and drifting apart.
    if (innerGlowRef.current) {
      innerGlowRef.current.style.opacity = `${(0.06 + fill * 0.5).toFixed(3)}`;
    }
    if (tempRef.current) tempRef.current.textContent = temp.toFixed(1);
  };

  /* Paint once on mount so the dial is correct before the first tween. */
  useEffect(paint, []);

  /* ── The loop ─────────────────────────────────────────────────────
     A chain of timeouts rather than an interval, so each state can hold for
     a different length of time. */
  useEffect(() => {
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % SEQUENCE.length),
      SEQUENCE[index].ms
    );
    return () => clearTimeout(id);
  }, [index]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  /* The transition bump. Skipped entirely under reduced motion. */
  useEffect(() => {
    if (reduce) return;
    bump.start({ scale: [0.975, 1], transition: { duration: 0.75, ease: EASE } });
  }, [state, reduce, bump]);

  /* ── State transition choreography ────────────────────────────────
     GSAP rather than Framer Motion here specifically because these are
     *sequenced*: entering HEATING the glow comes up first, then the ring
     starts filling, and only then do the digits start climbing. A timeline
     expresses that directly; three independently-delayed motion values would
     drift apart the moment a duration changed. */
  useEffect(() => {
    const values = valuesRef.current;
    const targetFill = FILL[state];
    const targetTemp = TEMP[state];

    // Reduced motion: land on the new state's values with a short crossfade.
    // The states still change, what goes away is the travel between them and
    // the continuous pulsing, which is what the preference is actually about.
    if (reduce) {
      values.fill = targetFill;
      values.temp = targetTemp;
      values.stored = state === 'outage' ? 0.55 : 1;
      paint();
      return undefined;
    }

    const tl = gsap.timeline();

    if (state === 'heating') {
      /* The wake-up. Ring and digits are driven by the same tween so the
         number cannot arrive at target while the arc is still filling. */
      tl.to(values, {
        fill: targetFill,
        temp: targetTemp,
        duration: 5.4,
        ease: 'power2.inOut',
        onUpdate: paint,
        delay: 0.45,
      });
    } else if (state === 'outage') {
      /* Stored warmth: the ring drops to resting, but a second inner arc
         depletes slowly from full. The floor is offline, not cold, which is
         the product claim this state exists to make. */
      values.stored = 1;
      tl.to(values, {
        fill: targetFill,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: paint,
      })
        .to(
          values,
          { stored: 0.55, temp: targetTemp, duration: 5.6, ease: 'none', onUpdate: paint },
          0.2
        );
    } else {
      tl.to(values, {
        fill: targetFill,
        temp: targetTemp,
        stored: 1,
        duration: 1.1,
        ease: 'power3.out',
        onUpdate: paint,
      });
    }

    return () => tl.kill();
  }, [state, reduce]);

  const breathing = !reduce && config.breath > 0;

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
      <motion.div
        /**
         * Scale bump marking the transition moment.
         *
         * Driven by controls rather than a `key` that changes per state: a
         * changing key remounts this subtree, which would tear down the SVG
         * and every ref the GSAP tween writes into, leaving the tween
         * updating detached nodes and the dial frozen after its first change.
         */
        animate={bump}
        className="relative aspect-square w-[min(78%,340px)]"
      >
        {/* Ambient bloom behind the dial, intensity per state. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,138,61,0.30), rgba(255,138,61,0.06) 55%, transparent 72%)',
          }}
          animate={
            breathing
              ? { opacity: [config.glow * 0.55, config.glow, config.glow * 0.55] }
              : { opacity: config.glow * 0.8 }
          }
          transition={
            breathing
              ? { duration: config.breath, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.9, ease: EASE }
          }
        />

        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative h-full w-full">
          <defs>
            <linearGradient id="dialHeat" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#c74e0f" />
              <stop offset="45%" stopColor="#ff8a3d" />
              <stop offset="100%" stopColor="#ffd0a1" />
            </linearGradient>

            <radialGradient id="dialInner">
              <stop offset="0%" stopColor="#ff8a3d" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#f2681c" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#f2681c" stopOpacity="0" />
            </radialGradient>

            {/* Bevel: a light top edge and a dark bottom one. Two stops and a
                1px stroke do what a 3D lathe would, at no cost. */}
            <linearGradient id="dialBezel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>

            <radialGradient id="dialFace" cx="0.5" cy="0.32">
              <stop offset="0%" stopColor="#1b1917" />
              <stop offset="100%" stopColor="#0c0b0a" />
            </radialGradient>

            {/* Lights the tick marks progressively, in lockstep with the ring
                because it shares the ring's dash geometry exactly. */}
            <mask id="dialTickMask">
              <circle
                ref={maskRef}
                cx={CX}
                cy={CY}
                r={83}
                fill="none"
                stroke="#ffffff"
                strokeWidth={14}
                strokeDasharray={`${ARC} ${CIRC - ARC}`}
                strokeDashoffset={ARC * (1 - OFF_FILL)}
                transform={`rotate(${START_DEG} ${CX} ${CY})`}
              />
            </mask>
          </defs>

          {/* Face + bezel */}
          <circle cx={CX} cy={CY} r={112} fill="url(#dialFace)" />
          <circle cx={CX} cy={CY} r={112} fill="url(#dialBezel)" />
          <circle cx={CX} cy={CY} r={112} fill="none" stroke="#ffffff" strokeOpacity="0.08" />

          {/* Inner glow, opacity written every frame from the fill value */}
          <circle ref={innerGlowRef} cx={CX} cy={CY} r={76} fill="url(#dialInner)" opacity="0.1" />

          {/* Tick marks: a dim layer always present, a warm layer revealed by
              the mask as the ring fills. */}
          <g stroke="#ffffff" strokeOpacity="0.13" strokeWidth="1.5" strokeLinecap="round">
            {ticks.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
            ))}
          </g>
          <g
            mask="url(#dialTickMask)"
            stroke="#ffb061"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              opacity: state === 'off' || state === 'outage' || state === 'scheduled' ? 0.25 : 1,
              transition: 'opacity 700ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {ticks.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} />
            ))}
          </g>

          {/* Track */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.07"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${ARC} ${CIRC - ARC}`}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
          />

          {/* Scheduled state draws the track as a dotted outline instead 
              present, waiting, clearly not running. */}
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="#9a7f66"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="1 9"
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
            style={{
              opacity: state === 'scheduled' ? 0.9 : 0,
              transition: 'opacity 700ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />

          {/* Soft wide pass under the ring, standing in for a blur filter 
              an feGaussianBlur would re-run on every animated frame. */}
          <circle
            ref={glowRingRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={config.ring}
            strokeOpacity="0.22"
            strokeWidth={20}
            strokeLinecap="round"
            strokeDasharray={`${ARC} ${CIRC - ARC}`}
            strokeDashoffset={ARC * (1 - OFF_FILL)}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
            style={{ transition: 'stroke 900ms cubic-bezier(0.16,1,0.3,1)' }}
          />

          {/* The ring itself */}
          <circle
            ref={ringRef}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={config.ring}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={`${ARC} ${CIRC - ARC}`}
            strokeDashoffset={ARC * (1 - OFF_FILL)}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
            style={{ transition: 'stroke 900ms cubic-bezier(0.16,1,0.3,1)' }}
          />

          {/* Stored-warmth arc, only meaningful during an outage. */}
          <circle
            ref={storedRef}
            cx={CX}
            cy={CY}
            r={STORED_R}
            fill="none"
            stroke="#ffb061"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${STORED_ARC} ${STORED_CIRC - STORED_ARC}`}
            strokeDashoffset={0}
            transform={`rotate(${START_DEG} ${CX} ${CY})`}
            style={{
              opacity: state === 'outage' ? 0.85 : 0,
              transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </svg>

        {/* ── Readout ─────────────────────────────────────────────────
            Outside the SVG so it inherits the site's type stack rather than
            SVG text metrics, which never quite match. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-start gap-1">
            <span
              ref={tempRef}
              className="font-display text-[clamp(2.6rem,7vw,3.9rem)] font-semibold leading-none tracking-tight text-bone-100 tabular-nums"
            >
              {AMBIENT.toFixed(1)}
            </span>
            <span className="mt-1 text-lg font-light text-bone-500">°C</span>
          </div>

          {/* Status line. Keyed on state so each label crossfades in rather
              than the text swapping under you. */}
          <motion.div
            key={state}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.25 }}
            className="mt-3 flex flex-col items-center"
          >
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-heat-400">
              {/* HOLDING earns a tick; it is the only state that represents
                  something completed. */}
              {state === 'holding' ? (
                <motion.svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
                >
                  <motion.path d="M20 6 9 17l-5-5" />
                </motion.svg>
              ) : (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: state === 'off' ? '#6b655e' : '#ffb061',
                    boxShadow:
                      state === 'heating' ? '0 0 10px 2px rgba(255,138,61,0.8)' : 'none',
                  }}
                />
              )}
              {config.label}
            </span>
            <span className="mt-1.5 text-[11px] tracking-wide text-bone-500">
              {config.detail}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
