'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
     them, the pinned stage must fit the viewport at any height without the
     copy crowding the bottom edge. */
  .weh-showcase .weh-index { font-size: clamp(3rem, 6vw, 5.25rem); }
  .weh-showcase .weh-title { font-size: clamp(1.85rem, 3vw, 3rem); }
  .weh-showcase .weh-heading { font-size: clamp(1.5rem, 2.4vw, 1.875rem); }

  /* Mobile carousel: hide the horizontal scrollbar; scroll-snap padding lets
     the first and last cards settle centred. */
  .weh-track { scrollbar-width: none; -ms-overflow-style: none; scroll-padding: 0 24px; }
  .weh-track::-webkit-scrollbar { display: none; }

  /* Short viewports (most laptops): tighten type + rhythm so the tallest
     reason, the three-line "Energy Efficient Heating", clears the bottom. */
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
  // unmounted when far away, reclaims the GPU without toggling frameloop.
  const [nearby, setNearby] = useState(false);
  // The 3D panel only ever shows at lg+ (it's `hidden lg:flex`). On phones and
  // tablets we must not even mount the WebGL canvas: a display:none canvas still
  // runs its rAF render loop every frame, stealing the GPU from the scroll
  // compositor and making the pinned section stutter. `canHover` gates the
  // cursor-follow glow so touch devices skip its per-move repaint entirely.
  const [isDesktop, setIsDesktop] = useState(false);
  const [canHover, setCanHover] = useState(false);

  // Mobile carousel state (native snap-scroll). Declared up here with every
  // other hook so hook order never changes when `isDesktop` flips at runtime.
  const [mActive, setMActive] = useState(0);
  const trackRef = useRef(null);
  // Remember the last 3D visual so the desktop canvas keeps stable props while
  // SVG reasons are on screen. Lives at the top (not after an early return) to
  // keep the hook order stable across the reduced-motion / mobile branches.
  const threeD = useRef({ variant: 'floor', color: '#f2681c' });

  useEffect(() => {
    const desktopMq = window.matchMedia('(min-width: 1024px)');
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      setIsDesktop(desktopMq.matches);
      setCanHover(hoverMq.matches);
    };
    sync();
    desktopMq.addEventListener('change', sync);
    hoverMq.addEventListener('change', sync);
    return () => {
      desktopMq.removeEventListener('change', sync);
      hoverMq.removeEventListener('change', sync);
    };
  }, []);

  /* Mount the canvas while the section is near the viewport; unmount it once
     it's well out of view so the WebGL context stops costing anything on the
     rest of the page. `isDesktop` is a dependency because the desktop section
     (which owns `wrapperRef`) only renders once it turns true, the first mount
     shows the mobile carousel, where wrapperRef is unattached. Without this the
     observer would never be created on desktop and the two WebGL visuals
     (reasons 2 & 3) would never load. */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || reduce || !isDesktop) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setNearby(entry.isIntersecting),
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, isDesktop]);

  /* Cursor-following glow, written straight to CSS vars, no re-render. */
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

  /* Desktop navigation is click-driven (not scroll-jacked): the stepper rungs
     and the prev/next arrows just set the active reason. `direction` (derived
     below) then decides which way the card slides. */
  const goTo = useCallback((i) => {
    setActive((prev) => (prev === i ? prev : Math.min(TOTAL - 1, Math.max(0, i))));
  }, []);
  const next = useCallback(() => {
    setActive((prev) => Math.min(TOTAL - 1, prev + 1));
  }, []);
  const prevReason = useCallback(() => {
    setActive((prev) => Math.max(0, prev - 1));
  }, []);

  /* Left/right arrow keys step through the reasons, but only while the section
     is on screen (`nearby`) and only on desktop, so they never hijack the page
     elsewhere. We don't touch Up/Down, those must stay free for page scroll. */
  useEffect(() => {
    if (!isDesktop) return undefined;
    const onKey = (e) => {
      if (!nearby) return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prevReason();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDesktop, nearby, next, prevReason]);

  /* Mobile carousel: track which card is centred so the dots stay in sync.
     An IntersectionObserver rooted on the scroller is cheaper and jitter-free
     compared with reading scrollLeft on every scroll event. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDesktop || reduce) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setMActive(Number(entry.target.dataset.index));
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    track.querySelectorAll('[data-reason-card]').forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [isDesktop, reduce]);

  /* Dot / arrow jump on the mobile carousel, smooth-scrolls the chosen card to
     centre using native scroll. */
  const goToMobile = useCallback((i) => {
    const track = trackRef.current;
    const card = track?.querySelector(`[data-index="${i}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, []);

  /* Scroll direction (+1 down / -1 up), derived during render by comparing the
     active index to the one we last committed. It's what makes the card slide
     the RIGHT way: entering from the right on the way down, from the left on the
     way back up, a real carousel feel rather than a one-way animation. */
  const prevActiveRef = useRef(active);
  const direction = active >= prevActiveRef.current ? 1 : -1;
  useEffect(() => {
    prevActiveRef.current = active;
  }, [active]);

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

  /* ── Mobile / tablet: native swipe carousel, NOT pinned. Buttery native
        momentum scroll, cards snap into place, dots track position. No
        scroll-jacking, so the page never feels stuck. ── */
  if (!isDesktop) {
    return (
      <section
        id="why-electric-hamam"
        data-section="why-electric-hamam"
        className="weh-showcase relative overflow-hidden bg-ink-950 py-16"
      >
        <style>{FONT_CSS}</style>

        {/* Ambient warm wash so the dark stage isn't flat */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(70vw 40vh at 80% 8%, rgba(255,138,61,0.06), transparent 60%), radial-gradient(60vw 40vh at 0% 100%, rgba(255,138,61,0.05), transparent 60%)',
          }}
        />

        <div className="relative px-6">
          <SectionHeading />
        </div>

        {/* Snap-scroll track */}
        <div
          ref={trackRef}
          className="weh-track relative mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {REASONS.map((r, i) => {
            const Icon = r.Icon;
            return (
              <article
                key={r.num}
                data-reason-card
                data-index={i}
                className="relative flex w-[80vw] max-w-[340px] shrink-0 snap-center flex-col rounded-3xl border border-white/[0.08] p-6"
                style={{
                  background:
                    'radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.06), transparent 55%), linear-gradient(180deg, #131211 0%, #0b0b0a 100%)',
                  boxShadow: '0 30px 70px -40px rgba(0,0,0,0.85)',
                }}
              >
                {/* meta row */}
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: `${r.accent}1c`,
                      border: `1px solid ${r.accent}40`,
                      boxShadow: `0 0 22px ${r.accent}2b`,
                    }}
                  >
                    <Icon size={20} color={r.accent} />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-bone-500">
                    Reason {r.num}
                    <span className="text-bone-500/45"> / 07</span>
                  </span>
                </div>

                {/* number + title */}
                <div className="mt-6 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="weh-display shrink-0 select-none font-semibold leading-none"
                    style={{ color: r.accent, fontSize: '3rem' }}
                  >
                    {r.num}
                  </span>
                  <h3
                    className="weh-display font-bold leading-[1.05] tracking-tight text-white"
                    style={{ fontSize: '1.55rem' }}
                  >
                    {r.title}
                  </h3>
                </div>

                <div
                  className="mt-5 h-px w-14 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${r.accent}, transparent)` }}
                />

                <p className="mt-4 text-[14px] leading-relaxed text-bone-300/85">
                  {r.desc}
                </p>

                <div className="mt-6 inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5">
                  <span
                    className="weh-display text-base font-bold leading-none"
                    style={{ color: r.accent }}
                  >
                    {r.stat}
                  </span>
                  <span className="h-3.5 w-px bg-white/15" />
                  <span className="text-[11px] uppercase tracking-[0.16em] text-bone-500">
                    {r.statLabel}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          {REASONS.map((r, i) => (
            <button
              key={r.num}
              onClick={() => goToMobile(i)}
              aria-label={`Reason ${r.num}: ${r.title}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === mActive ? 24 : 8,
                background: i === mActive ? '#ff8a3d' : 'rgba(255,255,255,0.22)',
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  const current = REASONS[active];
  const is3D = !!IS_3D[current.visual];
  if (is3D) threeD.current = { variant: current.visual, color: current.accent };

  return (
    <section
      ref={wrapperRef}
      id="why-electric-hamam"
      data-section="why-electric-hamam"
      className="weh-showcase relative bg-ink-950"
    >
      <style>{FONT_CSS}</style>
      <div
        className="relative h-screen max-h-[900px] min-h-[640px] w-full overflow-hidden"
        onPointerMove={canHover ? handleMove : undefined}
        onPointerLeave={canHover ? handleLeave : undefined}
        // `contain: paint` isolates the stage as its own paint root.
        style={{ contain: 'paint' }}
      >
        {/* Ambient base wash, its own compositor layer so the large radial
            gradients are painted once and only composited. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60vw 45vh at 78% 30%, rgba(255,138,61,0.05), transparent 65%), radial-gradient(50vw 40vh at 10% 85%, rgba(255,138,61,0.04), transparent 65%)',
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* Per-reason accent glow, crossfades as the active reason changes */}
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
              transform: 'translateZ(0)',
              willChange: 'opacity',
              backfaceVisibility: 'hidden',
            }}
          />
        </AnimatePresence>

        {/* Cursor-following light, only rendered on hover-capable (desktop)
            pointers; on touch it would never move yet still cost a full-screen
            gradient layer. */}
        {canHover && (
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[var(--on,0)] transition-opacity duration-500"
            style={{
              '--on': 0,
              background:
                'radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,138,61,0.10), transparent 65%)',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          />
        )}

        {/* ── Content ──
            grid-rows-[auto_1fr] hard-separates the compact header (row 1) from
            the reason stage (row 2), so the two can never overlap regardless of
            viewport height. Right padding keeps text clear of the stepper. */}
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-6 py-12 pr-20 md:px-12 md:py-16 md:pr-24 lg:pr-16">
          <SectionHeading className="weh-head-gap mb-8" />

          <div className="grid min-h-0 items-stretch gap-8 lg:grid-cols-[1.05fr_0.9fr] lg:gap-12">
            {/* Text stage, the active reason, vertically centred in its column.
                min-h keeps the absolutely-positioned card from collapsing below
                lg (where the 3D panel that would otherwise set the row height is
                hidden). */}
            <div className="relative min-h-[360px] lg:min-h-[380px]">
              <AnimatePresence custom={direction} mode="sync">
                <ReasonCard
                  key={current.num}
                  reason={current}
                  direction={direction}
                  className="absolute inset-0 flex flex-col justify-center"
                />
              </AnimatePresence>
            </div>

            {/* Persistent 3D panel, plain surface (no backdrop-blur) so it
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
                {/* Shared WebGL layer, the two 3D reasons (cable / floor).
                    Mounted while the section is near the viewport; faded out
                    under the SVG reasons via opacity. */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: is3D ? 1 : 0 }}
                >
                  {nearby && isDesktop ? (
                    <ReasonIcon3D
                      variant={threeD.current.variant}
                      color={threeD.current.color}
                    />
                  ) : null}
                </div>

                {/* SVG layer, the five non-3D reasons, crossfaded */}
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

                {/* Product-plate footer, a subtle catalogue tag, not a second
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

        {/* Prev / next, desktop is click-driven, so these arrows are the
            primary control. They disable at the ends so the bounds are obvious,
            and a counter sits alongside. */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 md:bottom-10">
          <button
            type="button"
            onClick={prevReason}
            disabled={active === 0}
            aria-label="Previous reason"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-bone-200 transition-all duration-200 hover:border-heat-500/60 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={active === TOTAL - 1}
            aria-label="Next reason"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-bone-200 transition-all duration-200 hover:border-heat-500/60 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <span className="ml-2 flex items-baseline gap-1 tabular-nums">
            <span className="weh-display text-lg font-bold text-heat-400">
              {current.num}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-bone-500/60">
              / 07
            </span>
          </span>
        </div>

        {/* Vertical stepper, reads as a clear progress index. The overall
            "NN / 07" counter caps it so the visitor always knows where they
            are; each rung is a click target that jumps to that reason. */}
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
