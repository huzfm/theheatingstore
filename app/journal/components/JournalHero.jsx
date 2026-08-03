'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { INDEX_ARTICLES } from '../data';

const EASE = [0.16, 1, 0.3, 1];

const HERO_IMAGE = INDEX_ARTICLES.find((a) => a.slot === 'panorama')?.img;

const HEADLINE = ['THE', 'JOURNAL'];

function FadeIn({ children, delay = 0, y = 14, className = '' }) {
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

function MaskLine({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={`block ${className}`}>{children}</span>;
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
        animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Full-bleed cinematic cover for /journal. Same title-block / corner-mark
 * language as AboutHero, art-directed as its own composition: an asymmetric
 * masthead rather than a centred marketing headline.
 */
export default function JournalHero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.1]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-bone-100"
    >
      {/* Photograph */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={reduce ? undefined : { y: bgY, scale: bgScale }}
        initial={reduce ? false : { scale: 1.04, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        {HERO_IMAGE && (
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={78}
            className="object-cover"
            style={{ objectPosition: '62% 45%' }}
          />
        )}
      </motion.div>

      {/* Scrims */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,5,4,0.72) 0%, rgba(6,5,4,0.32) 34%, rgba(6,5,4,0.5) 64%, rgba(6,5,4,0.92) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(4,3,2,0.5) 100%)' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(35vw 30vh at 78% 62%, rgba(255,138,61,0.14), transparent 68%)' }}
      />
      <div aria-hidden className="jr-grain pointer-events-none absolute inset-0 opacity-[0.05]" />

      {/* Architectural framing */}
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

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-20 flex min-h-[100svh] flex-1 flex-col px-5 pb-24 pt-24 sm:px-8 sm:pb-28 md:pt-28 lg:px-16 lg:pb-10">
        {/* Title-block header */}
        <div>
          <div className="h-px w-full bg-white/12" />
          <div className="flex items-start justify-between gap-4 pt-3 sm:pt-3.5">
            <FadeIn delay={0.6}>
              <span className="flex items-start gap-2.5 sm:gap-3">
                <span className="mt-[3px] h-px w-5 shrink-0 bg-heat-500/70 sm:w-6" />
                <span className="flex flex-col gap-1">
                  <span className="text-[9.5px] font-medium uppercase tracking-[0.28em] text-bone-100/90 sm:text-[10.5px] sm:tracking-[0.3em]">
                    The Heating Store
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.24em] text-bone-500 sm:text-[9px] sm:tracking-[0.25em]">
                    Journal
                  </span>
                </span>
              </span>
            </FadeIn>
            <FadeIn delay={0.7}>
              <span className="flex flex-col items-end gap-0.5 text-right">
                <span className="text-[8.5px] uppercase tracking-[0.24em] text-bone-500 sm:text-[9px] sm:tracking-[0.25em]">
                  Issue 01
                </span>
                <span className="text-[8.5px] uppercase tracking-[0.24em] text-bone-300/80 sm:text-[9px] sm:tracking-[0.25em]">
                  Kashmir / India
                </span>
              </span>
            </FadeIn>
          </div>
        </div>

        {/* Masthead + intro, asymmetric split. A dedicated compact stack
            below 1024px — not the desktop grid shrunk down — so the intro,
            footer meta and scroll cue all still land inside one screen. */}
        <div className="mt-auto grid grid-cols-1 gap-6 pt-6 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pt-10">
          <div className="lg:col-span-7">
            <h1 className="jr-hero-headline jr-display text-bone-100 text-[clamp(3rem,14vw,10rem)] lg:text-[clamp(5rem,11vw,10rem)]">
              {HEADLINE.map((line, i) => (
                <MaskLine key={line} delay={0.75 + i * 0.12}>
                  {i === 1 ? <span className="text-heat-400">{line}</span> : line}
                </MaskLine>
              ))}
            </h1>
          </div>

          <FadeIn delay={1.35} className="lg:col-span-5 lg:pb-2">
            <div className="flex items-start gap-3 lg:gap-3.5">
              <span aria-hidden className="mt-1 h-8 w-px shrink-0 bg-heat-400/50 lg:h-10" />
              <p className="max-w-[30rem] text-[13px] leading-[1.6] text-bone-100/75 sm:text-[14.5px] lg:text-[15.5px] lg:leading-[1.7]">
                Studies and field notes on the invisible systems that shape how a
                space feels — from Kashmir&rsquo;s coldest winters to the quietest
                luxury interiors.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Footer rule + metadata */}
        <FadeIn delay={1.6} className="mt-5 lg:mt-10">
          <div className="h-px w-full bg-white/12" />
          <div className="flex flex-col items-start gap-1.5 pt-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:pt-3.5">
            <span className="text-[9px] uppercase tracking-[0.18em] text-bone-500 lg:text-[10px] lg:tracking-[0.22em]">
              Writing on Warmth &amp; the Architecture of Comfort
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-bone-600 lg:text-[10px] lg:tracking-[0.22em]">2026</span>
          </div>
        </FadeIn>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1, ease: EASE }}
        className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-5"
      >
        <span className="text-[7.5px] uppercase tracking-[0.3em] text-bone-500 md:text-[8.5px] md:tracking-[0.32em]">
          Scroll to Read
        </span>
        <span className="jr-scroll-track relative h-7 w-px bg-white/15 md:h-9">
          {!reduce && <span aria-hidden className="jr-scroll-run absolute inset-x-0 top-0 h-1/2 bg-heat-400/70" />}
        </span>
      </motion.div>
    </section>
  );
}
