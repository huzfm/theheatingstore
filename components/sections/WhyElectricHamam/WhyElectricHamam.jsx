'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RevealText } from '@/components/ui/RevealText';
import { REASONS } from './reasons';

const EASE = [0.16, 1, 0.3, 1];
const TOTAL = REASONS.length;

/**
 * "7 Reasons to Install Electric Hamam This Winter".
 *
 * Rebuilt from scratch. The previous version put one reason on screen at a
 * time inside a pinned full-height stage, so six of the seven selling points
 * were hidden behind arrow clicks that most visitors never make; it also
 * shipped three divergent layouts (desktop stage / mobile carousel /
 * reduced-motion grid), a WebGL canvas for a decorative icon, three competing
 * navigation affordances and no call to action at the end.
 *
 * This is a scroll-native editorial index instead:
 *
 *  - Every reason is on the page, always. Nothing is gated behind interaction,
 *    so the whole argument is scannable in one pass and fully crawlable.
 *  - One layout for every viewport and for reduced motion. The rail stacks
 *    above the list below `lg`; nothing else changes.
 *  - A sticky left rail holds the heading and, critically, the CTA — so the
 *    next step stays on screen for the entire length of the argument rather
 *    than never appearing at all.
 *  - The reason nearest the viewport's middle becomes "active": its rule,
 *    numeral and figure take the row's accent and the rail's counter follows.
 *    That gives touch devices the same sense of progress hover gives a mouse,
 *    and it's driven by an IntersectionObserver over a thin centre band, not
 *    by a scroll handler, so it costs nothing per frame.
 *
 * Motion is opacity/transform only, each row reveals on its own
 * `whileInView` so the cascade follows the reader rather than firing all
 * seven at once, and the whole thing degrades to plain static markup under
 * `prefers-reduced-motion`.
 */

const CSS = `
  .weh { font-family: var(--font-body), system-ui, sans-serif; }

  /* The global stylesheet forces line-height 1.75 on every span/div/li and
     the heading face on h1-h6. Re-assert locally so display type sets tight. */
  .weh-display,
  .weh h2, .weh h2 span,
  .weh h3 {
    font-family: var(--font-heading), 'Arial Narrow', sans-serif;
    font-weight: 400;
    letter-spacing: 0.01em;
  }
  .weh h2, .weh h2 span { font-size: clamp(2.3rem, 5vw, 4.1rem); line-height: 0.94; }
  .weh h3 { font-size: clamp(1.45rem, 2.1vw, 2rem); line-height: 1.02; }
  .weh .weh-num { font-size: clamp(1.5rem, 1.9vw, 1.9rem); line-height: 1; }
  .weh .weh-stat-value { font-size: clamp(1.05rem, 1.4vw, 1.35rem); line-height: 1.1; }
  .weh p { line-height: 1.7; }

  /* ── Row ──────────────────────────────────────────────────────────────
     Each row owns its accent as --a (plus pre-mixed alpha variants, so no
     colour maths at paint time). .is-on is set by hover on pointer devices
     and by the scroll-position observer everywhere, they drive exactly the
     same declarations, so touch gets the same read as a mouse. */
  .weh-row { position: relative; }
  .weh-row-rule {
    position: absolute; inset: 0 0 auto 0; height: 1px;
    background: rgba(255,255,255,0.09);
  }
  .weh-row-rule::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, var(--a), var(--a-40) 55%, transparent);
    transform: scaleX(0); transform-origin: left center;
    transition: transform 0.6s cubic-bezier(.16,1,.3,1);
  }
  .weh-row-wash {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(96deg, var(--a-14), transparent 62%);
    opacity: 0; transition: opacity 0.45s ease;
  }
  .weh-row-inner { transition: transform 0.5s cubic-bezier(.16,1,.3,1); }

  .weh-num { color: rgba(140,133,125,0.75); transition: color 0.4s ease; }
  .weh-icon { color: rgba(140,133,125,0.55); transition: color 0.4s ease, opacity 0.4s ease; opacity: 0.7; }
  .weh-spine {
    width: 1px; flex: 1 1 auto; min-height: 0.75rem;
    background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02));
    position: relative;
  }
  .weh-spine::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(180deg, var(--a), transparent);
    transform: scaleY(0); transform-origin: top center;
    transition: transform 0.6s cubic-bezier(.16,1,.3,1);
  }
  .weh-stat-value { color: #f5f1ec; transition: color 0.4s ease; }

  .weh-row.is-on .weh-row-rule::after { transform: scaleX(1); }
  .weh-row.is-on .weh-row-wash { opacity: 1; }
  .weh-row.is-on .weh-num,
  .weh-row.is-on .weh-icon,
  .weh-row.is-on .weh-stat-value { color: var(--a); }
  .weh-row.is-on .weh-icon { opacity: 1; }
  .weh-row.is-on .weh-spine::after { transform: scaleY(1); }

  /* Nudge only where a pointer can actually hover, a translate that fires on
     scroll position alone would read as drift. */
  @media (hover: hover) and (pointer: fine) {
    .weh-row:hover .weh-row-inner { transform: translateX(6px); }
  }

  /* Cursor-following warmth. Written to --mx/--my as CSS vars from a pointer
     handler (never React state), and only mounted for fine pointers. */
  .weh-cursor {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255,138,61,0.09), transparent 66%);
    opacity: var(--on, 0); transition: opacity 0.5s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .weh-row-rule::after,
    .weh-row-wash,
    .weh-row-inner,
    .weh-spine::after,
    .weh-num, .weh-icon, .weh-stat-value { transition: none; }
  }
`;

/** Primary + secondary actions. Rendered twice: pinned in the rail on
 *  desktop, and at the foot of the list on small screens where the rail
 *  scrolls away above the argument it introduces. */
function Actions({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href="/contact"
        className="group inline-flex items-center gap-2.5 rounded-full bg-heat-500 px-6 py-3.5 text-[14px] font-semibold text-ink-950 transition-colors duration-300 hover:bg-heat-400"
      >
        Book a free site visit
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
      <Link
        href="/how-it-works"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-[14px] font-semibold text-bone-100 transition-colors duration-300 hover:border-heat-500/60 hover:text-white"
      >
        How installation works
      </Link>
    </div>
  );
}

function Reason({ reason, index, active, reduce, onEnter, onLeave, registerRef }) {
  const { num, title, desc, stat, statLabel, accent, Icon } = reason;
  const [hovered, setHovered] = useState(false);
  const on = hovered || active;

  return (
    <motion.li
      ref={registerRef}
      data-index={index}
      className={`weh-row ${on ? 'is-on' : ''}`}
      style={{
        '--a': accent,
        '--a-40': `${accent}66`,
        '--a-14': `${accent}1f`,
      }}
      onPointerEnter={() => {
        setHovered(true);
        onEnter?.();
      }}
      onPointerLeave={() => {
        setHovered(false);
        onLeave?.();
      }}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className="weh-row-rule" aria-hidden="true" />
      <span className="weh-row-wash" aria-hidden="true" />

      <div className="weh-row-inner relative flex gap-5 py-7 pr-1 sm:gap-8 sm:py-9">
        {/* Index spine: number, hairline, glyph. Reads as a catalogue entry
            and gives the eye a fixed left edge to run down. */}
        <div className="flex w-9 shrink-0 flex-col items-center sm:w-11">
          <span aria-hidden="true" className="weh-display weh-num">
            {num}
          </span>
          <span className="weh-spine my-3" aria-hidden="true" />
          <span className="weh-icon">
            <Icon size={18} color="currentColor" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2.5">
            <h3 className="text-bone-100">{title}</h3>

            <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-1">
              <span className="weh-display weh-stat-value">{stat}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-bone-500 sm:text-[10.5px]">
                {statLabel}
              </span>
            </div>
          </div>

          <p className="mt-4 max-w-[52ch] text-[15px] text-bone-300/75 sm:text-[15.5px]">
            {desc}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export default function WhyElectricHamam() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const cursorRef = useRef(null);
  const rowRefs = useRef([]);

  const [active, setActive] = useState(0);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Whichever row crosses a thin band through the middle of the viewport is
     the active one. A band (rather than a threshold on the whole row) means
     exactly one row qualifies at a time regardless of how tall the rows get
     on narrow screens. */
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (!rows.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        });
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 }
    );
    rows.forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, []);

  const handleMove = useCallback((e) => {
    const el = cursorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--on', '1');
  }, []);

  const handleLeave = useCallback(() => {
    cursorRef.current?.style.setProperty('--on', '0');
  }, []);

  const activeAccent = REASONS[active]?.accent ?? '#ff8a3d';

  return (
    <section
      ref={sectionRef}
      id="why-electric-hamam"
      data-section="why-electric-hamam"
      className="weh relative overflow-hidden bg-ink-950 py-24 md:py-32"
      onPointerMove={canHover ? handleMove : undefined}
      onPointerLeave={canHover ? handleLeave : undefined}
    >
      <style>{CSS}</style>

      {/* Hairline that separates this section from the one above it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,138,61,0.28), transparent)',
        }}
      />

      {/* Static ambient wash, painted once. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58vw 46vh at 8% 4%, rgba(255,138,61,0.055), transparent 62%), radial-gradient(48vw 42vh at 96% 88%, rgba(255,138,61,0.045), transparent 62%)',
        }}
      />

      {/* Accent wash that crossfades to whichever reason is currently in the
          middle of the viewport, opacity only, so it never triggers a repaint
          of the gradient itself. */}
      {!reduce && (
        <AnimatePresence>
          <motion.div
            key={activeAccent}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{
              background: `radial-gradient(44vw 44vh at 72% 46%, ${activeAccent}1c, transparent 64%)`,
              willChange: 'opacity',
            }}
          />
        </AnimatePresence>
      )}

      {canHover && <div ref={cursorRef} className="weh-cursor" aria-hidden="true" />}

      <div className="relative mx-auto max-w-[1240px] px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ── Rail ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <motion.div
                className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-heat-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-heat-500" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-heat-400">
                  Why Electric Hamam
                </span>
              </motion.div>

              <h2 className="mt-6 text-balance">
                <RevealText as="span" className="block text-bone-100">
                  7 Reasons to Install
                </RevealText>
                <RevealText as="span" delay={0.1} className="block text-heat-500">
                  Electric Hamam This Winter
                </RevealText>
              </h2>

              <motion.p
                className="mt-6 max-w-[46ch] text-[15px] text-bone-300/70 sm:text-base"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              >
                What actually changes when a wood-fired hamam becomes a heated
                floor, measured in minutes, inches and years rather than
                adjectives.
              </motion.p>

              {/* Progress. Mirrors where the reader is in the list, so the
                  seven-ness of the argument stays legible without a stepper
                  the visitor has to operate. */}
              <div className="mt-10 hidden lg:block">
                <div className="flex items-baseline gap-2 tabular-nums">
                  <span className="relative inline-block h-[1.9rem] w-[2.4ch] overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={active}
                        className="weh-display absolute inset-0 text-[1.75rem] leading-none"
                        style={{ color: activeAccent }}
                        initial={reduce ? false : { y: '55%', opacity: 0 }}
                        animate={{ y: '0%', opacity: 1 }}
                        exit={reduce ? undefined : { y: '-55%', opacity: 0 }}
                        transition={{ duration: 0.34, ease: EASE }}
                      >
                        {REASONS[active].num}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-bone-500">
                    / {String(TOTAL).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-3.5 flex max-w-[260px] gap-1.5">
                  {REASONS.map((r, i) => (
                    <span
                      key={r.num}
                      className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10"
                    >
                      <motion.span
                        className="block h-full origin-left rounded-full"
                        style={{ background: r.accent }}
                        initial={false}
                        animate={{ scaleX: i <= active ? 1 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <Actions className="mt-10 hidden lg:flex" />
            </div>
          </div>

          {/* ── The seven reasons ────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ol className="list-none">
              {REASONS.map((reason, i) => (
                <Reason
                  key={reason.num}
                  reason={reason}
                  index={i}
                  active={active === i}
                  reduce={reduce}
                  registerRef={(el) => {
                    rowRefs.current[i] = el;
                  }}
                />
              ))}
            </ol>

            {/* Closing rule, the list reads as a finished set rather than
                trailing off into the next section. */}
            <div
              aria-hidden="true"
              className="h-px"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.09), transparent)',
              }}
            />

            <Actions className="mt-12 lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
