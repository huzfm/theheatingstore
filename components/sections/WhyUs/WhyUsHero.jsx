'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { HERO } from './data';

/**
 * The page's single opener, on the same recipe as every other route's hero.
 *
 * The merge retired two more heroes — /local-experience opened on a Srinagar
 * team and /global-experience on eight foreign winters. The headline here has
 * to carry both halves of that argument, which is why it is two sentences:
 * imported standard, local accountability.
 */
export default function WhyUsHero() {
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
            'linear-gradient(180deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.74) 42%, rgba(10,10,10,0.96) 100%)',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(55vw 45vh at 50% 12%, rgba(255,138,61,0.16), transparent 62%), radial-gradient(45vw 40vh at 8% 94%, rgba(255,138,61,0.06), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* svh not vh: on mobile `100vh` is measured with the URL bar hidden, so
          it overflows by the height of the bar and pushes the CTAs under the
          fold. min-h so long copy grows the section rather than spilling. */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col justify-center px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-24 sm:pt-28">
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
          className="mx-auto mt-6 max-w-[18ch] font-serif text-[clamp(2rem,7.4vw,4.9rem)] leading-[1] tracking-[0.005em] text-bone-100 [&_span]:leading-[inherit] sm:mt-7 sm:leading-[0.96]"
        >
          {HERO.headline}
        </RevealText>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-bone-300 sm:mt-7 sm:text-lg">
            {HERO.sub}
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <HeroCTAs center className="mt-10 sm:mt-12" />
        </Reveal>

        <Reveal delay={0.4}>
          <dl className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-3 border-t border-white/10 pt-8 sm:mt-14 sm:pt-10">
            {HERO.facts.map((f) => (
              <div
                key={f.label}
                className="border-l border-white/10 px-2 text-center first:border-l-0 sm:px-4"
              >
                <dt className="font-serif text-[clamp(1.3rem,5vw,1.7rem)] leading-none text-heat-400 sm:text-[clamp(1.7rem,3vw,2.3rem)]">
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
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,1))' }}
      />
    </section>
  );
}
