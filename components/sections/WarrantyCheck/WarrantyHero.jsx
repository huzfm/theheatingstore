'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Search, Phone } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { HERO, PHONE, PHONE_DISPLAY } from './data';

/**
 * Opener for /warranty-check. Same recipe as the other routes' heroes, and
 * short for the same reason /contact's is short: the thing the visitor came
 * for is the search box directly underneath, so a full-viewport hero would put
 * it behind a scroll.
 *
 * The primary CTA scrolls to the lookup rather than navigating, the secondary
 * is the phone number, which is what someone whose record does not come back
 * needs next.
 */
export default function WarrantyHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-bone-100">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${HERO.bgImage}')` }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.90) 0%, rgba(10,10,10,0.78) 42%, rgba(10,10,10,0.97) 100%)',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(55vw 45vh at 50% 12%, rgba(255,138,61,0.15), transparent 62%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      <div className="relative z-10 mx-auto flex min-h-[74svh] max-w-5xl flex-col justify-center px-5 pb-16 pt-32 text-center sm:px-8 sm:pb-20 sm:pt-36">
        <Reveal>
          <span className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500 sm:text-[11px] sm:tracking-[0.28em]">
            <span className="hidden h-px w-8 bg-heat-500/60 sm:block" />
            {HERO.eyebrow}
            <span className="hidden h-px w-8 bg-heat-500/60 sm:block" />
          </span>
        </Reveal>

        <RevealText
          as="h1"
          // [&_span]:leading-[inherit]: RevealText wraps each word in a bare
          // <span>, which globals.css gives line-height 1.75, and an element
          // selector beats an inherited value.
          className="mx-auto mt-6 max-w-[17ch] font-serif text-[clamp(2rem,7.5vw,4.75rem)] leading-[1] tracking-[0.005em] text-bone-100 [&_span]:leading-[inherit] sm:mt-7 sm:leading-[0.98]"
        >
          {HERO.headline}
        </RevealText>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-300 sm:mt-7 sm:text-lg">
            {HERO.sub}
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#lookup"
              className="inline-flex items-center gap-2.5 rounded-full bg-heat-500 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)] transition-colors duration-200 hover:bg-heat-400"
            >
              <Search size={16} strokeWidth={1.9} aria-hidden />
              Check my warranty
            </a>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2.5 rounded-full border border-bone-500/30 px-7 py-3.5 text-sm font-semibold text-bone-100 transition-colors duration-200 hover:border-heat-500/60 hover:text-white"
            >
              <Phone size={16} strokeWidth={1.9} aria-hidden />
              {PHONE_DISPLAY}
            </a>
          </div>
        </Reveal>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,1))' }}
      />
    </section>
  );
}
