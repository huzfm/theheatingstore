'use client';

import { RevealText, Reveal } from '@/components/ui/RevealText';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { CTA } from './data';

/**
 * Closing panel, same raised heat-lit treatment as AboutCTA so the site lands
 * on a consistent note. Kept as its own component rather than importing
 * AboutCTA, that one is bound to the About page's copy.
 */
export default function WorkingCTA() {
  return (
    <section className="relative bg-ink-950 px-5 pb-28 pt-4 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(80% 120% at 50% 0%, rgba(255,138,61,0.22), transparent 60%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
            }}
          />
          <Reveal>
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-heat-400">
              {CTA.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mx-auto mt-5 max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] text-bone-100"
          >
            {CTA.title}
          </RevealText>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-bone-300">
              {CTA.sub}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <HeroCTAs center className="mt-9" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
