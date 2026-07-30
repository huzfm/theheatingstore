'use client';

import { Reveal } from '@/components/ui/RevealText';
import { SPECS } from './data';

/**
 * Numbers strip between the control section and the FAQ. Four figures, all
 * carried from the site's existing FAQ copy, deliberately placed after the
 * explanation, since a cost figure only means something once the visitor
 * understands what they'd be buying.
 */
export default function SpecStrip() {
  return (
    <section className="relative bg-ink-950 px-5 py-20 text-bone-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative isolate overflow-hidden rounded-[28px] border border-white/10 px-6 py-12 sm:px-10 sm:py-14"
          style={{
            background:
              'radial-gradient(90% 130% at 50% 0%, rgba(255,138,61,0.13), transparent 62%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
          }}
        >
          <Reveal>
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.3em] text-heat-400">
              At a glance
            </p>
          </Reveal>

          <dl className="mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-4 lg:gap-y-0">
            {SPECS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div className="px-2 text-center lg:border-l lg:border-white/10 lg:first:border-0">
                  <dt className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none text-bone-100">
                    {s.value}
                  </dt>
                  <dd className="mx-auto mt-3 max-w-[20ch] text-[13px] leading-relaxed text-bone-500">
                    {s.label}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.3}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-bone-500/70">
              Figures are typical for Kashmir installations and vary with room
              size, insulation and floor build-up. A site survey replaces every
              range above with a number for your own house.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
