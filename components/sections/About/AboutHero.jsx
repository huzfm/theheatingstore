'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HERO } from './data';

const EASE = [0.16, 1, 0.3, 1];

/* The global stylesheet forces line-height 1.75 on every span/div
   (globals.css: `p, li, span, div, td, th`), which flattens the tight
   editorial leading a display headline like this needs. Re-assert it
   directly on every node inside the h1, the mask wrappers included. */
const CSS = `
  .ah-hero h1, .ah-hero h1 * { line-height: 0.88; }
  .ah-grid {
    background-image: linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: calc(100% / 7) 100%;
  }
  /* A crop of this frame at 62% 40% keeps the dark lake/mountain glass on
     the left (where the headline sits) and the fireplace panel on the
     right (where the instrument annotation sits). Mobile recentres on the
     fireplace, the one element worth keeping full-bleed at that width. */
  .ah-bg { background-position: 62% 40%; }
  @media (max-width: 767px) {
    .ah-bg { background-position: 78% 55%; }
  }
`;

/**
 * Mount-triggered fade (not scroll-triggered — the hero is already in view
 * at load, nothing ever scrolls it across an intersection boundary).
 */
function FadeIn({ children, delay = 0, y = 16, className = '' }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * One headline line, masked and revealed as a whole rather than word by
 * word — an editorial headline reads as typeset lines, not a typewriter.
 */
function MaskLine({ children, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <span className="block">{children}</span>;
  }
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Amber "live" indicator — a bare pulse, not a badge. */
function PulseDot({ reduce }) {
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-heat-400"
          animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span className="relative h-1.5 w-1.5 rounded-full bg-heat-400" />
    </span>
  );
}

/**
 * About hero, art-directed as a single cinematic photograph rather than a
 * UI screen with a picture behind it. The frame does the selling: dark
 * lake-and-mountain glass on the left carries the headline, the fireplace
 * on the right carries one bare technical annotation, and a hairline
 * title-block (top) / footer (bottom) reads the whole viewport as a
 * surveyed architectural print rather than a landing-page section.
 */
export default function AboutHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.09]);

  return (
    <section
      ref={sectionRef}
      className="ah-hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-bone-100"
    >
      <style>{CSS}</style>

      {/* ── Photograph ──────────────────────────────────────────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
        initial={reduce ? false : { scale: 1.04, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <div
          className="ah-bg absolute inset-0 bg-cover"
          style={{ backgroundImage: "url('/images/aboutt.png')" }}
        />
      </motion.div>

      {/* Left-side grade: dark over the lake/mountain glass where the
          headline sits, clearing toward the fireplace on the right. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(92deg, rgba(6,5,4,0.9) 0%, rgba(6,5,4,0.58) 30%, rgba(6,5,4,0.12) 54%, transparent 68%)',
        }}
      />
      {/* Top / bottom vignette so the title-block and footer sit on stone,
          not glare. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,5,4,0.62) 0%, transparent 20%, transparent 58%, rgba(6,5,4,0.72) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 50%, transparent 60%, rgba(4,3,2,0.42) 100%)' }}
      />

      {/* Warmth read off the fireplace itself, a slow breathing wash. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(30vw 30vh at 80% 58%, rgba(255,138,61,0.16), transparent 68%)' }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* Architectural framing: a faint column grid + corner marks, desktop
          only. Mobile gets one thin edge rule instead — there isn't margin
          for chrome that isn't content at that width. */}
      <div aria-hidden className="ah-grid pointer-events-none absolute inset-0 hidden opacity-30 lg:block" />
      <span
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-20 bottom-20 z-10 w-px bg-white/12 lg:hidden"
      />
      {[
        { pos: 'left-7 top-7 border-l border-t', origin: 'top left' },
        { pos: 'right-7 top-7 border-r border-t', origin: 'top right' },
        { pos: 'left-7 bottom-7 border-l border-b', origin: 'bottom left' },
        { pos: 'right-7 bottom-7 border-r border-b', origin: 'bottom right' },
      ].map(({ pos, origin }, i) => (
        <motion.span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute z-10 hidden h-4 w-4 border-white/25 lg:block ${pos}`}
          style={{ transformOrigin: origin }}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.08 }}
        />
      ))}

      {/* ── Instrument annotation ───────────────────────────────────────
          Bare text set directly on the fireplace panel, not a card. Full
          stack on tablet/desktop; a single repositioned line on mobile so
          it never crowds the headline. */}
      <motion.div
        initial={reduce ? false : { opacity: 0, filter: 'blur(6px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: EASE, delay: 2.05 }}
        className="absolute right-[7%] top-[30%] z-20 hidden w-max flex-col items-end gap-1.5 text-right md:flex"
      >
        <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-heat-300/90">
          <PulseDot reduce={reduce} />
          Grid · Live
        </span>
        <span className="mt-1.5 h-px w-8 bg-white/20" />
        <span className="text-[9px] uppercase tracking-[0.22em] text-bone-500">Instrument 01</span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-bone-500">{HERO.instrument.metric}</span>
        <span className="font-serif text-[30px] leading-none text-bone-100 lg:text-[34px]">
          {HERO.instrument.value}
        </span>
        <span className="text-[9px] uppercase tracking-[0.22em] text-heat-300/80">{HERO.instrument.status}</span>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.4 }}
        className="absolute right-5 top-[16%] z-20 flex items-center gap-2 text-[8.5px] uppercase tracking-[0.2em] text-bone-300/85 md:hidden"
      >
        <PulseDot reduce={reduce} />
        {HERO.instrument.value} · {HERO.instrument.status}
      </motion.div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-20 flex min-h-[100svh] flex-1 flex-col px-5 pb-6 pt-24 sm:px-8 sm:pt-24 lg:px-16 lg:pb-8 lg:pt-28">
        {/* Title-block header: brand + coordinates, ruled off like a
            drawing's letterhead. */}
        <div>
          <div className="h-px w-full bg-white/12" />
          <div className="flex items-start justify-between gap-6 pt-3.5">
            <FadeIn delay={0.8}>
              <span className="inline-flex items-center gap-3">
                <span className="mt-[3px] h-px w-6 shrink-0 bg-heat-500/70" />
                <span className="flex flex-col gap-1">
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-bone-100/90">
                    {HERO.brand}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-bone-500">{HERO.location}</span>
                </span>
              </span>
            </FadeIn>
            <FadeIn delay={0.9}>
              <span className="hidden flex-col items-end gap-0.5 text-right sm:flex">
                <span className="text-[9px] uppercase tracking-[0.25em] text-bone-500">{HERO.coords[0]}</span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-bone-500">{HERO.coords[1]}</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-bone-300/80">{HERO.coords[2]}</span>
              </span>
            </FadeIn>
          </div>
        </div>

        {/* Statement, pushed to the lower third, full width against the
            dark lake/mountain glass. */}
        <div className="mt-auto max-w-[900px] pt-6">
          <h1 className="font-serif uppercase text-[clamp(3rem,8vw,7.5rem)] tracking-[-0.01em] text-bone-100">
            {HERO.headline.map((line, i) => (
              <MaskLine key={i} delay={1.0 + i * 0.13}>
                {line.text}
                {line.accent && <span className="text-heat-400">{line.accent}</span>}
              </MaskLine>
            ))}
          </h1>

          <FadeIn delay={1.75}>
            <p className="mt-6 max-w-[500px] text-[15px] leading-[1.7] text-bone-100/70 sm:text-[16px] lg:text-[17px]">
              {HERO.sub}
            </p>
          </FadeIn>

          <FadeIn delay={1.95}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <motion.a
                href={HERO.primary.href}
                whileHover={reduce ? undefined : { y: -2 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="inline-flex items-center rounded-full bg-bone-100 px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-950 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.65)] transition-colors duration-300 hover:bg-heat-300"
              >
                {HERO.primary.label}
              </motion.a>

              <a
                href={HERO.secondary.href}
                className="group inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.16em] text-bone-300 transition-colors duration-300 hover:text-bone-100"
              >
                {HERO.secondary.label}
                <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Title-block footer: brand line / chapter tags, ruled off to
            mirror the header. Hidden below sm — on short mobile viewports
            it's the first thing to go, the headline and CTA hold the
            fold instead. */}
        <FadeIn delay={2.15} className="mt-8 hidden sm:block">
          <div className="h-px w-full bg-white/12" />
          <div className="flex flex-col items-start gap-2 pt-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <span className="text-[10px] uppercase tracking-[0.22em] text-bone-500">{HERO.footerLeft}</span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-bone-600 sm:inline">
              {HERO.footerRight}
            </span>
          </div>
        </FadeIn>
      </div>

      {/* Scroll cue: bottom-center, independent of the footer row. */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4, ease: EASE }}
        className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2.5 sm:flex"
      >
        <span className="text-[8.5px] uppercase tracking-[0.32em] text-bone-500">Scroll to Explore</span>
        <span className="relative h-9 w-px overflow-hidden bg-white/15">
          {!reduce && (
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1/2 bg-heat-400/70"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </span>
      </motion.div>
    </section>
  );
}
