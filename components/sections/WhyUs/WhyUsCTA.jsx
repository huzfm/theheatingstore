'use client';

import { Check } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { CTA } from './data';

/**
 * The page's single closing panel, same raised heat-lit treatment as every
 * other route's closer, with the six included items listed under the buttons.
 *
 * The merge retired two more of these — /local-experience and
 * /global-experience each ended on their own near-identical ask. One page, one
 * ask, at the one point where the reader has actually been given the argument.
 *
 * The global footer is hidden on /why-choose-us (SiteChrome hidePrefixes in
 * app/layout.js), so this is the last thing on the page and carries the extra
 * bottom padding for it.
 */
export default function WhyUsCTA() {
  return (
    <section className="relative bg-ink-950 px-5 pb-32 pt-24 text-bone-100 sm:px-8">
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
            className="mx-auto mt-5 max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
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

          <Reveal delay={0.3}>
            <ul className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-8">
              {CTA.included.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-[13px] text-bone-300"
                >
                  <Check
                    size={14}
                    strokeWidth={2}
                    aria-hidden
                    className="shrink-0 text-heat-500/80"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
