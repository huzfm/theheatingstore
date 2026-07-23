'use client';

import { Fragment, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * "Warmth that rises through the floor" — the beat right after the 3D floor
 * reveal.
 *
 * Left  : a statement that reads muted grey and fills to orange, word by
 *         word, as it scrolls up through the viewport — scrubbed 1:1 to
 *         scroll. This is the Olivier-Larose / premium-agency technique:
 *         each word is a muted ghost with an orange copy stacked on top whose
 *         OPACITY (GPU-composited) fades 0→1. No tall pinned section — the
 *         reveal is tied to the paragraph's natural travel, which is what
 *         makes it read as "flowing" instead of stuck.
 * Right : the heating sheet — serpentine cable with heat pulses, a breathing
 *         glow and warmth rising off the mat — on a pointer-tilt panel.
 *
 * Speed is controlled entirely by the useScroll `offset`: the wider the
 * window, the more scroll distance the reveal takes — i.e. the slower it
 * feels. It's set deliberately wide here.
 */

const EASE = [0.16, 1, 0.3, 1];

const COPY =
  'Warmth, engineered beneath your feet. So every step, from the first out of bed to the last of the night, lands on heat.';
const WORDS = COPY.split(' ');

const CHIPS = ['5 mm thin', 'Self-regulating', 'Even, edge to edge', 'Silent'];

/* Each word owns a slice of the 0→1 scroll range; the slice is ~1.8 words
   wide so two words are always mid-fade and the wave stays continuous. */
function Word({ children, progress, index, total, reduce }) {
  const start = index / total;
  const end = Math.min((index + 1.8) / total, 1);
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <span className="whm-word">
      <span className="whm-word-base" aria-hidden="true">
        {children}
      </span>
      <motion.span
        className="whm-word-fill"
        style={{ opacity: reduce ? 1 : opacity }}
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
        <pattern id="whm-mesh" width="15" height="15" patternUnits="userSpaceOnUse">
          <path d="M15 0H0V15" fill="none" stroke="rgba(85,217,154,0.10)" strokeWidth="1" />
        </pattern>
        <filter id="whm-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
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
          <animate attributeName="stroke-opacity" values="0.22; 0.5; 0.22" dur="3.2s" repeatCount="indefinite" />
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
              from="0"
              to="-100"
              dur="3.2s"
              begin={`${offset}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}

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

  const revealRef = useRef(null);
  // Wide window = slow reveal: it starts when the paragraph's top is 85% down
  // the viewport and only completes once its bottom nears the top. Widen the
  // gap to slow it further; narrow it to speed up.
  const { scrollYProgress } = useScroll({
    target: revealRef,
    offset: ['start 0.85', 'end 0.25'],
  });

  // Pointer tilt for the sheet panel.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.3 });
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.3 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-10, 10]);
  const glareX = useTransform(sx, [-0.5, 0.5], ['20%', '80%']);
  const glareY = useTransform(sy, [-0.5, 0.5], ['10%', '90%']);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(240px circle at ${x} ${y}, rgba(255,255,255,0.07), transparent 60%)`,
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
      data-section="warmth-reveal"
      className="whm relative overflow-hidden bg-ink-950 px-6 py-32 md:px-16 md:py-44 lg:px-24"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        .whm .whm-reveal {
          font-family: 'Sora', var(--font-display-sora), system-ui, sans-serif;
          font-weight: 800;
          font-size: clamp(1.85rem, 3.7vw, 3.35rem);
          line-height: 1.32;
          letter-spacing: -0.02em;
          max-width: 20ch;
        }
        /* Stacked layers: a muted ghost with an orange copy fading in over it.
           Opacity is the only animated property, so it composites on the GPU. */
        .whm .whm-word { position: relative; display: inline-block; }
        .whm .whm-word-base,
        .whm .whm-word-fill {
          font-weight: inherit;
          line-height: inherit;
          letter-spacing: inherit;
          /* Push past Sora's 800 ceiling by stroking the glyphs in their own
             colour, so both layers thicken by the same amount. */
          -webkit-text-stroke: 0.6px currentColor;
        }
        .whm .whm-word-base { color: #5b544c; }
        .whm .whm-word-fill {
          position: absolute;
          left: 0;
          top: 0;
          color: #f5f1ec;
          will-change: opacity;
        }
        .whm-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 16px; border-radius: 999px;
          font-size: 13px; font-weight: 500; line-height: 1; color: #cfc7bd;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.10);
          transition: border-color .25s ease, color .25s ease, background .25s ease, box-shadow .25s ease;
        }
        .whm-chip::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: #ff8a3d; box-shadow: 0 0 8px rgba(255,138,61,0.7);
        }
        .whm-chip:hover {
          color: #f5f1ec; border-color: rgba(255,138,61,0.5);
          background: rgba(255,138,61,0.06); box-shadow: 0 8px 26px rgba(255,138,61,0.14);
        }
        .whm-panel {
          background:
            radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.08), transparent 60%),
            linear-gradient(180deg, #0f0e0d 0%, #0a0a0a 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 40px 90px rgba(0,0,0,0.55);
        }
      `}</style>

      {/* Ambient wash: heat under both columns */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(45vw 45vh at 16% 40%, rgba(255,138,61,0.06), transparent 62%), radial-gradient(45vw 50vh at 90% 62%, rgba(255,138,61,0.07), transparent 62%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* ── LEFT: scroll-scrubbed reveal + micro-interactions ── */}
        <div>
          <motion.p
            className="mb-8 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.32em] text-heat-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="h-px w-10 bg-heat-500/50" />
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

        {/* ── RIGHT: heat sheet with under-flow animation, on a tilt panel ── */}
        <motion.div
          className="[perspective:1100px]"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          <motion.div
            className="whm-panel relative overflow-hidden rounded-3xl p-5 sm:p-7"
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          >
            {!reduce && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: glare }}
              />
            )}
            <HeatingSheet animate={!reduce} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
