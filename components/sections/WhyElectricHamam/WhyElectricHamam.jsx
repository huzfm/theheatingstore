'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import SectionHeading from './SectionHeading';
import ReasonCard from './ReasonCard';
import ReasonSVG from './ReasonSVG';
import { REASONS, IS_3D } from './reasons';

const EASE = [0.16, 1, 0.3, 1];

/* Scoped fonts. The home route loads Bebas Neue (--font-heading) and
   Hanken Grotesk (--font-body) globally; the Sora display face is only loaded on the
   /experience route, so `font-display` would fall back to system-ui here. We
   bind explicitly to the fonts that are actually present. */
const FONT_CSS = `
  .weh-showcase { font-family: var(--font-body), system-ui, sans-serif; }
  .weh-showcase .weh-display {
    font-family: var(--font-heading), 'Arial Narrow', sans-serif;
  }

  /* Fluid sizes live here (not inline) so a height media query can override
     them — the pinned stage must fit the viewport at any height without the
     copy crowding the bottom edge. */
  .weh-showcase .weh-index { font-size: clamp(3rem, 6vw, 5.25rem); }
  .weh-showcase .weh-title { font-size: clamp(1.85rem, 3vw, 3rem); }
  .weh-showcase .weh-heading { font-size: clamp(1.5rem, 2.4vw, 1.875rem); }

  /* Short viewports (most laptops): tighten type + rhythm so the tallest
     reason — the three-line "Energy Efficient Heating" — clears the bottom. */
  @media (max-height: 840px) {
    .weh-showcase .weh-index { font-size: clamp(2.5rem, 4.6vw, 3.75rem); }
    .weh-showcase .weh-title { font-size: clamp(1.5rem, 2.4vw, 2.35rem); }
    .weh-showcase .weh-heading { font-size: clamp(1.35rem, 2vw, 1.6rem); }
    .weh-showcase .weh-head-gap { margin-bottom: 1.25rem; }
    .weh-showcase .weh-step-1 { margin-top: 1.25rem; }
    .weh-showcase .weh-step-2 { margin-top: 1.1rem; }
    .weh-showcase .weh-step-3 { margin-top: 1.1rem; }
    .weh-showcase .weh-step-4 { margin-top: 1.25rem; }
  }
`;

/**
 * Three.js is lazy: the canvas only enters the bundle once a visitor nears the
 * section, so it costs the hero nothing. ssr:false because WebGL has no
 * server render.
 */
const ReasonIcon3D = dynamic(() => import('./ReasonIcon3D'), {
  ssr: false,
  loading: () => null,
});

const TOTAL = REASONS.length;

export default function WhyElectricHamam() {
  const wrapperRef = useRef(null);
  const glowRef = useRef(null);
  const reduce = useReducedMotion();

  const [active, setActive] = useState(0);
  // The canvas is mounted only while the section is near the viewport and
  // unmounted when far away — reclaims the GPU without toggling frameloop.
  const [nearby, setNearby] = useState(false);

  /* Scroll → active reason index. useScrollProgress is GSAP ScrollTrigger with
     invalidateOnRefresh, so scrub positions recompute on resize; the sticky
     panel below means there is no pin-spacer to break. State flips only on the
     seven threshold crossings, not every frame. */
  useScrollProgress(wrapperRef, {
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6, // temporal smoothing so the index hand-off never hitches
    enabled: !reduce,
    onUpdate: (p) => {
      const idx = Math.min(TOTAL - 1, Math.max(0, Math.floor(p * TOTAL)));
      setActive((prev) => (prev === idx ? prev : idx));
    },
  });

  /* Mount the canvas while the section is near the viewport; unmount it once
     it's well out of view so the WebGL context stops costing anything on the
     rest of the page. */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || reduce) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setNearby(entry.isIntersecting),
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  /* Cursor-following glow, written straight to CSS vars — no re-render. */
  const handleMove = useCallback((e) => {
    const el = glowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--on', '1');
  }, []);
  const handleLeave = useCallback(() => {
    glowRef.current?.style.setProperty('--on', '0');
  }, []);

  /* Stepper jump: scroll so the section's progress lands mid-reason `i`. */
  const goTo = useCallback((i) => {
    const el = wrapperRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const p = (i + 0.5) / TOTAL;
    window.scrollTo({ top: top + travel * p, behavior: 'smooth' });
  }, []);

  /* ── Reduced motion: no pin, no scroll-jack, no WebGL. A calm static list. ── */
  if (reduce) {
    return (
      <section
        id="why-electric-hamam"
        className="weh-showcase bg-ink-950 px-6 py-24 text-bone-100 md:px-16"
      >
        <style>{FONT_CSS}</style>
        <SectionHeading />
        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <ReasonCard key={r.num} reason={r} plain />
          ))}
        </div>
      </section>
    );
  }

  const current = REASONS[active];
  const is3D = !!IS_3D[current.visual];
  // Remember the last 3D visual so the canvas keeps stable props (and doesn't
  // re-render) while SVG reasons are on screen.
  const threeD = useRef({ variant: 'cable', color: '#ffb061' });
  if (is3D) threeD.current = { variant: current.visual, color: current.accent };

  return (
    <section
      ref={wrapperRef}
      id="why-electric-hamam"
      data-section="why-electric-hamam"
      className="weh-showcase relative bg-ink-950"
      style={{ height: `${TOTAL * 100}vh` }}
    >
      <style>{FONT_CSS}</style>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {/* Ambient base wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60vw 45vh at 78% 30%, rgba(255,138,61,0.05), transparent 65%), radial-gradient(50vw 40vh at 10% 85%, rgba(255,138,61,0.04), transparent 65%)',
          }}
        />

        {/* Per-reason accent glow — crossfades as the active reason changes */}
        <AnimatePresence>
          <motion.div
            key={current.num}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              background: `radial-gradient(46vw 46vh at 74% 42%, ${current.accent}22, transparent 62%)`,
            }}
          />
        </AnimatePresence>

        {/* Cursor-following light */}
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--on,0)] transition-opacity duration-500"
          style={{
            '--on': 0,
            background:
              'radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,138,61,0.10), transparent 65%)',
          }}
        />

        {/* ── Content ──
            grid-rows-[auto_1fr] hard-separates the compact header (row 1) from
            the reason stage (row 2), so the two can never overlap regardless of
            viewport height. Right padding keeps text clear of the stepper. */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-12 pr-20 md:px-12 md:py-16 md:pr-24 lg:pr-16">
          <SectionHeading className="weh-head-gap mb-8" />

          <div className="grid min-h-0 items-stretch gap-8 lg:grid-cols-[1.05fr_0.9fr] lg:gap-12">
            {/* Text stage — the active reason, vertically centred in its column.
                min-h keeps the absolutely-positioned card from collapsing below
                lg (where the 3D panel that would otherwise set the row height is
                hidden). */}
            <div className="relative min-h-[360px] lg:min-h-[380px]">
              <AnimatePresence>
                <ReasonCard
                  key={current.num}
                  reason={current}
                  className="absolute inset-0 flex flex-col justify-center"
                />
              </AnimatePresence>
            </div>

            {/* Persistent 3D panel — plain surface (no backdrop-blur) so it
                doesn't repaint on every scroll frame */}
            <div className="hidden items-center justify-center lg:flex">
              <div
                className="relative aspect-square w-full max-w-[380px] overflow-hidden rounded-3xl border border-white/[0.07]"
                style={{
                  background:
                    'radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.07), transparent 55%), linear-gradient(180deg, #131211 0%, #0b0b0a 100%)',
                  boxShadow: '0 40px 90px -40px rgba(0,0,0,0.8)',
                }}
              >
                {/* Shared WebGL layer — the two 3D reasons (cable / floor).
                    Mounted while the section is near the viewport; faded out
                    under the SVG reasons via opacity. */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: is3D ? 1 : 0 }}
                >
                  {nearby ? (
                    <ReasonIcon3D
                      variant={threeD.current.variant}
                      color={threeD.current.color}
                    />
                  ) : null}
                </div>

                {/* SVG layer — the five non-3D reasons, crossfaded */}
                <AnimatePresence mode="wait">
                  {!is3D && (
                    <motion.div
                      key={current.visual}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <ReasonSVG kind={current.visual} color={current.accent} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Caliper label on the floor cross-section */}
                {current.visual === 'floor' && (
                  <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-bone-300">
                    ↕ 2.5–3 in profile
                  </div>
                )}

                {/* Product-plate footer — a subtle catalogue tag, not a second
                    giant numeral (the dominant one lives beside the title). */}
                <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: current.accent }}
                  >
                    N°&nbsp;{current.num}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-bone-500/70">
                    Electric Hamam
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical stepper — reads as a clear progress index. The overall
            "NN / 07" counter caps it so the visitor always knows where they
            are; each rung is a click target that scrolls to that reason. */}
        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 md:right-9 md:block">
          <div className="flex flex-col items-end gap-4">
            <span className="mb-1 flex items-baseline gap-1 tabular-nums">
              <span className="weh-display text-base font-bold text-heat-400">
                {REASONS[active].num}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-bone-500/60">
                / 07
              </span>
            </span>
            {REASONS.map((r, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <button
                  key={r.num}
                  onClick={() => goTo(i)}
                  aria-label={`Reason ${r.num}: ${r.title}`}
                  className="pointer-events-auto group flex items-center gap-3"
                >
                  <span
                    className={`weh-display tabular-nums transition-all duration-300 ${
                      on
                        ? 'text-heat-400'
                        : 'text-bone-500 group-hover:text-bone-300'
                    }`}
                    style={{
                      fontSize: on ? '0.95rem' : '0.72rem',
                      opacity: on ? 1 : done ? 0.6 : 0.35,
                    }}
                  >
                    {r.num}
                  </span>
                  <span
                    className="relative block h-[2px] overflow-hidden rounded-full bg-white/12"
                    style={{ width: on ? 46 : done ? 26 : 16, transition: 'width 0.35s ease' }}
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-heat-500"
                      initial={false}
                      animate={{ width: on || done ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
