'use client';

import { RevealText, Reveal } from '@/components/ui/RevealText';
import MagneticButton from '@/components/ui/MagneticButton';
import { CTA } from './data';

/**
 * Closing invitation. A raised heat-lit panel so the page lands on a warm,
 * confident note before the global footer. Buttons reuse MagneticButton.
 */
export default function AboutCTA() {
  return (
    <section className="relative bg-ink-950 px-5 pb-28 pt-4 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative isolate overflow-hidden rounded-[32px] border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* Warm panel backdrop */}
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
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-bone-300">
              {CTA.sub}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2">
              <MagneticButton as="a" href={CTA.primary.href} variant="solid" size="lg">
                {CTA.primary.label}
              </MagneticButton>
              <MagneticButton as="a" href={CTA.secondary.href} variant="outline" size="lg">
                {CTA.secondary.label}
                <span aria-hidden className="text-heat-400">→</span>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
