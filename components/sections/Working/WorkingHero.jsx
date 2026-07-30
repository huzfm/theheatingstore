'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { HERO } from './data';

/**
 * Opener for /working. Text-led rather than instrument-led on purpose: the
 * thermostat dial is the subject of its own section further down, and the
 * floor cutaway is the section directly below this one, so the hero's job is
 * only to state the premise and hand over.
 *
 * Same backdrop / gradient / grain recipe as AboutHero so the two routes read
 * as one site, but the layout is single-column, a second column here would
 * compete with the 3D panel that follows immediately.
 */
export default function WorkingHero() {
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
            'linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.80) 45%, rgba(10,10,10,0.97) 100%)',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(60vw 45vh at 50% 12%, rgba(255,138,61,0.16), transparent 62%), radial-gradient(50vw 40vh at 12% 95%, rgba(255,138,61,0.07), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/*
        Full screen at every width, and svh rather than vh specifically for
        mobile: `100vh` there is measured against the viewport with the URL bar
        hidden, so it overflows the screen by the height of the bar and pushes
        the buttons under the fold. `100svh` is the smallest stable viewport,
        i.e. the height that is actually visible with the browser chrome shown.
        Content is vertically centred within it, and min-h (not h) means a long
        translation grows the section instead of spilling out of it.
      */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-center px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-24 sm:pt-28">
        <Reveal>
          {/* flex-wrap + hairlines hidden below sm: at 320px the rules plus
              0.28em tracking on this label overflowed the padding. */}
          <span className="mx-auto flex max-w-full flex-wrap items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500 sm:text-[11px] sm:tracking-[0.28em]">
            <span className="hidden h-px w-8 bg-heat-500/60 sm:block" />
            {HERO.eyebrow}
            <span className="hidden h-px w-8 bg-heat-500/60 sm:block" />
          </span>
        </Reveal>

        <RevealText
          as="h1"
          // Lower floor on the clamp: 2.6rem was set by the desktop reading and
          // left the headline running three tight lines on a 320px screen.
          className="mx-auto mt-6 max-w-[16ch] font-serif text-[clamp(2rem,8.5vw,5.5rem)] leading-[1] tracking-[0.005em] text-bone-100 sm:mt-7 sm:leading-[0.96]"
        >
          {HERO.headline}
        </RevealText>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-300 sm:mt-7 sm:text-lg">
            {HERO.sub}
          </p>
        </Reveal>

        {/* Three claims the page then goes on to prove, in the order it proves
            them. Three across at every width, including mobile, where each
            column is ~90px on a 320px screen, hence the tighter type and the
            hyphens on the labels so a long word can break rather than force a
            horizontal scroll. Divider rules sit between columns only. */}
        <Reveal delay={0.28}>
          <dl className="mx-auto mt-10 grid w-full max-w-3xl grid-cols-3 border-t border-white/10 pt-8 sm:mt-14 sm:pt-10">
            {HERO.facts.map((f) => (
              <div
                key={f.label}
                className="border-l border-white/10 px-2 text-center first:border-l-0 sm:px-4"
              >
                <dt className="font-display text-[clamp(1rem,4.2vw,1.35rem)] leading-none text-heat-400 sm:text-[clamp(1.6rem,3vw,2.2rem)]">
                  {f.value}
                </dt>
                <dd
                  className="mx-auto mt-2.5 max-w-[22ch] text-[10.5px] leading-snug text-bone-500 sm:mt-3 sm:text-[13px] sm:leading-relaxed"
                  style={{ hyphens: 'auto' }}
                >
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.4}>
          <HeroCTAs center className="mt-10 sm:mt-12" />
        </Reveal>
      </div>
    </section>
  );
}
