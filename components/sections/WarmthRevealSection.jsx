'use client';

import { Fragment, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * "Warmth that rises through the floor" — the beat right after the 3D floor
 * reveal.
 *
 * Left  : a statement that reads as a faint warm ghost and comes into focus
 *         — opacity, blur, brightness, contrast, lift and letter-spacing all
 *         resolve together — word by word, scrubbed 1:1 to scroll.
 * Right : the heating sheet — serpentine cable with heat pulses, a breathing
 *         glow and warmth rising off the mat — behind a layered glass panel
 *         (reflection, grain, glow, shadow, moving specular highlight) that
 *         tilts and catches light with the pointer.
 *
 * The canvas around both columns is a warm editorial wash — ivory, sandstone,
 * beige, ash, stone — built from stacked radial gradients, a breathing
 * ambient glow, fine grain and a soft vignette, all drifting at
 * sub-perceptual speed. Scroll drives three independent parallax speeds
 * (canvas slowest, light layer a little more, panel fastest) so the section
 * reads as a space with depth rather than a flat backdrop.
 */

const EASE = [0.16, 1, 0.3, 1];

const COPY =
  'Warmth, engineered beneath your feet. So every step, from the first out of bed to the last of the night, lands on heat.';
const WORDS = COPY.split(' ');

const CHIPS = ['5 mm thin', 'Self-regulating', 'Even, edge to edge', 'Silent'];

/* Fine procedural grain, shared by the canvas wash and the glass panel via
   a CSS custom property set once on the section root. */
const NOISE_SVG =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.045 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/* Each word owns a slice of the 0→1 scroll range; the slice is ~1.8 words
   wide so two words are always mid-fade and the wave stays continuous. It
   resolves on several axes at once — opacity, blur, brightness, contrast,
   a tiny lift and a hair of letter-spacing — so the reveal reads as coming
   into focus rather than a simple fade. */
function Word({ children, progress, index, total, reduce }) {
  const start = index / total;
  const end = Math.min((index + 1.8) / total, 1);

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const blur = useTransform(progress, [start, end], [6, 0]);
  const brightness = useTransform(progress, [start, end], [0.7, 1]);
  const contrast = useTransform(progress, [start, end], [0.86, 1]);
  const y = useTransform(progress, [start, end], [9, 0]);
  const scale = useTransform(progress, [start, end], [0.986, 1]);
  const tracking = useTransform(progress, [start, end], [0.05, 0]);

  const filter = useMotionTemplate`blur(${blur}px) brightness(${brightness}) contrast(${contrast})`;
  const letterSpacing = useMotionTemplate`${tracking}em`;

  return (
    <span className="whm-word">
      <span className="whm-word-base" aria-hidden="true">
        {children}
      </span>
      <motion.span
        className="whm-word-fill"
        style={
          reduce
            ? { opacity: 1 }
            : { opacity, filter, y, scale, letterSpacing }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ── Serpentine heating cable, generated so the spacing stays exact ─────── */
function serpentinePath() {
  const x0 = 66;
  const x1 = 334;
  const y0 = 118;
  const gap = 40;
  const rows = 5;
  let d = `M ${x0} ${y0}`;
  let y = y0;
  for (let i = 0; i < rows; i += 1) {
    const leftToRight = i % 2 === 0;
    const endX = leftToRight ? x1 : x0;
    d += ` L ${endX} ${y}`;
    if (i < rows - 1) {
      const ny = y + gap;
      const sweep = leftToRight ? 1 : 0;
      d += ` A ${gap / 2} ${gap / 2} 0 0 ${sweep} ${endX} ${ny}`;
      y = ny;
    }
  }
  return d;
}
const CABLE = serpentinePath();

const WISPS = [90, 132, 174, 216, 258, 300].map((x, i) => ({
  x,
  delay: (i * 0.55).toFixed(2),
}));

function HeatingSheet({ animate }) {
  return (
    <svg
      viewBox="0 0 400 360"
      className="h-auto w-full"
      role="img"
      aria-label="Underfloor heating mat with heat flowing along the cable"
    >
      <defs>
        <linearGradient id="whm-cable" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb061" />
          <stop offset="1" stopColor="#f2681c" />
        </linearGradient>
        <linearGradient id="whm-wisp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffb061" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd0a1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="whm-haze" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity="0" />
          <stop offset="0.55" stopColor="#ffb061" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffd0a1" stopOpacity="0" />
        </linearGradient>
        <pattern id="whm-mesh" width="15" height="15" patternUnits="userSpaceOnUse">
          <path d="M15 0H0V15" fill="none" stroke="rgba(85,217,154,0.10)" strokeWidth="1" />
        </pattern>
        <filter id="whm-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {/* Atmospheric shimmer above the cable — a soft gradient pushed
            through fractal noise so it wobbles like real heat haze. */}
        <filter id="whm-heat-distort" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" numOctaves="2" seed="7" result="whm-noise">
            {animate && (
              <animate
                attributeName="baseFrequency"
                values="0.012 0.05; 0.021 0.07; 0.012 0.05"
                dur="9s"
                calcMode="spline"
                keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
                keyTimes="0; 0.5; 1"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="whm-noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {animate && (
        <g>
          {WISPS.map((w) => (
            <path
              key={w.x}
              d={`M ${w.x} 96 q 7 -12 0 -24 q -7 -12 0 -24`}
              fill="none"
              stroke="url(#whm-wisp)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 8; 0 -26"
                dur="3.4s"
                begin={`${w.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0; 0.7; 0"
                dur="3.4s"
                begin={`${w.delay}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
        </g>
      )}

      <rect x="42" y="96" width="316" height="224" rx="18" fill="#111311" stroke="rgba(255,255,255,0.06)" />
      <rect x="42" y="96" width="316" height="224" rx="18" fill="url(#whm-mesh)" />

      <path
        d={CABLE}
        fill="none"
        stroke="url(#whm-cable)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.32"
        filter="url(#whm-glow)"
      >
        {animate && (
          <animate
            attributeName="stroke-opacity"
            values="0.22; 0.5; 0.22"
            dur="4.8s"
            calcMode="spline"
            keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
            keyTimes="0; 0.5; 1"
            repeatCount="indefinite"
          />
        )}
      </path>
      <path
        d={CABLE}
        fill="none"
        stroke="url(#whm-cable)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.5"
      />
      {animate &&
        [0, -1.6].map((offset, i) => (
          <path
            key={i}
            d={CABLE}
            fill="none"
            stroke="#ffe0b8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            strokeDasharray="15 85"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0; -100"
              keyTimes="0; 1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1"
              dur="4.2s"
              begin={`${offset}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}

      {/* Heat haze rising off the cable rows */}
      {animate && (
        <rect
          x="52"
          y="70"
          width="296"
          height="70"
          fill="url(#whm-haze)"
          filter="url(#whm-heat-distort)"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      <g>
        <rect x="42" y="332" width="92" height="20" rx="10" fill="rgba(255,138,61,0.12)" />
        <circle cx="56" cy="342" r="3.5" fill="#ff8a3d" />
        <text x="66" y="346" fontSize="11" fill="#ffb061" letterSpacing="0.5">
          24°C · even
        </text>
      </g>
    </svg>
  );
}

export default function WarmthRevealSection() {
  const reduce = useReducedMotion();

  const sectionRef = useRef(null);
  const revealRef = useRef(null);

  // Wide window = slow reveal: it starts when the paragraph's top is 85% down
  // the viewport and only completes once its bottom nears the top. Widen the
  // gap to slow it further; narrow it to speed up.
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  // Section-wide scroll pass, used purely for the depth parallax below —
  // canvas moves least, the light layer a little more, the panel the most,
  // so the whole thing reads as layers rather than a flat sheet.
  const { scrollYProgress: depthProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const canvasY = useTransform(depthProgress, [0, 1], reduce ? [0, 0] : [-12, 12]);
  const lightY = useTransform(depthProgress, [0, 1], reduce ? [0, 0] : [-24, 24]);
  const panelY = useTransform(depthProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);

  // Pointer tilt + moving specular highlight + dynamic light position.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.4 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-8, 8]);
  const glareX = useTransform(sx, [-0.5, 0.5], ['15%', '85%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['8%', '92%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(280px circle at ${x} ${y}, rgba(255,255,255,0.18), rgba(255,224,184,0.05) 42%, transparent 68%)`,
  );
  const lightShift = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(60% 75% at ${x} ${y}, rgba(255,138,61,0.12), transparent 72%)`,
  );

  const handleMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={sectionRef}
      data-section="warmth-reveal"
      className="whm relative overflow-hidden px-6 py-32 md:px-16 md:py-44 lg:px-24"
      style={{ '--whm-noise': `url("${NOISE_SVG}")` }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

        .whm {
          --whm-ivory: #f7f2ea;
          --whm-sandstone: #eee2d1;
          --whm-beige: #e6d7c3;
          --whm-ash: #cabfb2;
          --whm-stone: #b6a998;
          --whm-ink: #241b14;
          background: linear-gradient(175deg, var(--whm-ivory) 0%, var(--whm-sandstone) 46%, var(--whm-beige) 100%);
        }

        /* ── Luxury editorial canvas ─────────────────────────────────── */
        .whm-canvas { position: absolute; inset: -6% -4%; pointer-events: none; }
        .whm-canvas-base {
          position: absolute; inset: 0;
          background:
            radial-gradient(46vw 42vh at 12% 8%, rgba(255,255,255,0.55), transparent 60%),
            radial-gradient(52vw 48vh at 88% 18%, rgba(230,215,195,0.55), transparent 62%),
            radial-gradient(60vw 55vh at 20% 92%, rgba(182,169,152,0.35), transparent 65%),
            radial-gradient(50vw 46vh at 82% 88%, rgba(202,191,178,0.4), transparent 60%);
        }
        .whm-blob {
          position: absolute; border-radius: 999px; filter: blur(64px);
          will-change: transform;
        }
        .whm-blob-a {
          width: 46vw; height: 46vw; left: -10%; top: -8%;
          background: radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%);
          animation: whmDriftA 42s cubic-bezier(0.45,0,0.55,1) infinite;
        }
        .whm-blob-b {
          width: 40vw; height: 40vw; right: -8%; top: 12%;
          background: radial-gradient(circle, rgba(230,215,195,0.5), transparent 70%);
          animation: whmDriftB 54s cubic-bezier(0.45,0,0.55,1) infinite;
        }
        .whm-blob-c {
          width: 44vw; height: 44vw; left: 12%; bottom: -14%;
          background: radial-gradient(circle, rgba(182,169,152,0.4), transparent 70%);
          animation: whmDriftC 48s cubic-bezier(0.45,0,0.55,1) infinite;
        }
        .whm-light {
          position: absolute; inset: 0;
          background:
            radial-gradient(38vw 34vh at 18% 42%, rgba(255,138,61,0.07), transparent 62%),
            radial-gradient(40vw 40vh at 88% 60%, rgba(255,138,61,0.08), transparent 62%);
          animation: whmBreathe 13s cubic-bezier(0.45,0,0.55,1) infinite;
          will-change: opacity;
        }
        .whm-grain {
          position: absolute; inset: 0;
          background-image: var(--whm-noise);
          opacity: 0.035;
          mix-blend-mode: overlay;
        }
        .whm-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(120% 100% at 50% 38%, transparent 52%, rgba(36,27,20,0.08) 78%, rgba(36,27,20,0.18) 100%);
        }

        @keyframes whmDriftA {
          0%, 100% { transform: translate3d(-3%, -2%, 0) scale(1); }
          50% { transform: translate3d(3%, 3%, 0) scale(1.06); }
        }
        @keyframes whmDriftB {
          0%, 100% { transform: translate3d(2%, -3%, 0) scale(1.04); }
          50% { transform: translate3d(-3%, 2%, 0) scale(1); }
        }
        @keyframes whmDriftC {
          0%, 100% { transform: translate3d(-2%, 3%, 0) scale(1); }
          50% { transform: translate3d(3%, -2%, 0) scale(1.05); }
        }
        @keyframes whmBreathe {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.95; }
        }
        @media (prefers-reduced-motion: reduce) {
          .whm-blob, .whm-light { animation: none !important; }
        }

        /* ── Editorial reveal ─────────────────────────────────────────── */
        .whm .whm-reveal {
          font-family: 'Sora', var(--font-display-sora), system-ui, sans-serif;
          font-weight: 800;
          font-size: clamp(1.85rem, 3.7vw, 3.35rem);
          line-height: 1.32;
          letter-spacing: -0.02em;
          max-width: 20ch;
        }
        .whm .whm-word { position: relative; display: inline-block; }
        .whm .whm-word-base,
        .whm .whm-word-fill {
          font-weight: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          -webkit-text-stroke: 0.6px currentColor;
        }
        .whm .whm-word-base { color: rgba(36,27,20,0.22); }
        .whm .whm-word-fill {
          position: absolute;
          left: 0;
          top: 0;
          color: var(--whm-ink);
          will-change: opacity, filter, transform;
        }

        .whm-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 999px;
          font-size: 13px; font-weight: 500; line-height: 1; color: rgba(36,27,20,0.68);
          background: rgba(255,255,255,0.42); border: 1px solid rgba(36,27,20,0.10);
          backdrop-filter: blur(8px);
          box-shadow: 0 1px 2px rgba(36,27,20,0.04);
          transition: border-color .3s ease, color .3s ease, background .3s ease, box-shadow .3s ease, transform .3s ease;
        }
        .whm-chip::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #ff8a3d; box-shadow: 0 0 8px rgba(255,138,61,0.6);
        }
        .whm-chip:hover {
          color: var(--whm-ink); border-color: rgba(255,138,61,0.45);
          background: rgba(255,255,255,0.64); box-shadow: 0 10px 26px rgba(242,104,28,0.14);
        }

        /* ── Glass panel ──────────────────────────────────────────────── */
        .whm-panel {
          position: relative; z-index: 1;
          background:
            radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.10), transparent 60%),
            linear-gradient(180deg, #14120f 0%, #0a0a0a 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -1px 0 rgba(0,0,0,0.5),
            inset 0 0 60px rgba(0,0,0,0.35),
            0 50px 100px -20px rgba(36,27,20,0.5),
            0 18px 40px -14px rgba(36,27,20,0.32);
        }
        .whm-panel::before {
          content: ''; position: absolute; inset: -40% -20%;
          background: linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.05) 100%);
          transform: rotate(-6deg);
          pointer-events: none;
        }
        .whm-panel::after {
          content: ''; position: absolute; inset: 0;
          background-image: var(--whm-noise);
          opacity: 0.05; mix-blend-mode: overlay;
          pointer-events: none;
        }
        .whm-panel-glow {
          position: absolute; inset: -18% -14%; z-index: 0;
          background: radial-gradient(60% 60% at 50% 35%, rgba(255,138,61,0.22), transparent 70%);
          filter: blur(50px);
          animation: whmBreathe 11s cubic-bezier(0.45,0,0.55,1) infinite;
          pointer-events: none;
        }
        .whm-panel-shadow {
          position: absolute; left: 8%; right: 8%; bottom: -9%; height: 26%; z-index: 0;
          background: radial-gradient(60% 100% at 50% 50%, rgba(36,27,20,0.4), transparent 75%);
          filter: blur(28px);
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .whm-panel-glow { animation: none !important; }
        }
      `}</style>

      {/* Luxury warm canvas: ivory / sandstone / beige / ash / stone, drifting
          ambient light, fine grain, soft vignette — three parallax speeds. */}
      <div className="whm-canvas" aria-hidden="true">
        <div className="whm-canvas-base" />
        <motion.div style={{ y: canvasY }}>
          <span className="whm-blob whm-blob-a" />
          <span className="whm-blob whm-blob-b" />
          <span className="whm-blob whm-blob-c" />
        </motion.div>
        <motion.div className="whm-light" style={{ y: lightY }} />
        <div className="whm-grain" />
        <div className="whm-vignette" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* ── LEFT: scroll-scrubbed reveal + micro-interactions ── */}
        <div>
          <motion.p
            className="mb-8 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.32em] text-heat-600"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="h-px w-10 bg-heat-600/50" />
            Even heat, edge to edge
          </motion.p>

          <p ref={revealRef} className="whm-reveal">
            {WORDS.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <Word
                  progress={scrollYProgress}
                  index={i}
                  total={WORDS.length}
                  reduce={reduce}
                >
                  {word}
                </Word>{' '}
              </Fragment>
            ))}
          </p>

          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
            }}
          >
            {CHIPS.map((chip) => (
              <motion.span
                key={chip}
                className="whm-chip cursor-default"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                whileHover={reduce ? undefined : { y: -3 }}
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: heat sheet on a layered glass panel, with depth parallax ── */}
        <motion.div style={{ y: panelY }}>
          <motion.div
            className="relative [perspective:1200px]"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}
          >
            <div className="whm-panel-glow" aria-hidden="true" />
            <div className="whm-panel-shadow" aria-hidden="true" />

            <motion.div
              className="whm-panel overflow-hidden rounded-3xl p-5 sm:p-7"
              onPointerMove={handleMove}
              onPointerLeave={handleLeave}
              style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
            >
              {!reduce && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: lightShift, transform: 'translateZ(6px)' }}
                />
              )}

              <div style={reduce ? undefined : { transform: 'translateZ(14px)' }}>
                <HeatingSheet animate={!reduce} />
              </div>

              {!reduce && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{ background: glare, transform: 'translateZ(30px)' }}
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
