'use client';

import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import GlowCard from '@/components/ui/GlowCard';
import CounterNumber from '@/components/ui/CounterNumber';
import { STATS } from './data';

/**
 * Impact band — count-up figures that tick from zero when they scroll into
 * view. Reuses CounterNumber (the same count-up used by the configurator) and
 * GlowCard, so it reads as the same system as the rest of the site.
 */
export default function AboutStats() {
  return (
    <section className="relative bg-ink-950 py-20 text-bone-100 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60vw 30vh at 50% 50%, rgba(255,138,61,0.05), transparent 65%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <RevealGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" stagger={0.1}>
          {STATS.map((s) => (
            <RevealItem key={s.label}>
              <GlowCard className="px-5 py-9 text-center" lift={-4}>
                <div className="font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-none text-heat-500">
                  <CounterNumber
                    value={s.value}
                    suffix={s.suffix}
                    separator={!!s.separator}
                    duration={1.8}
                  />
                </div>
                <div className="mt-3 text-[13px] uppercase tracking-[0.14em] text-bone-300">
                  {s.label}
                </div>
              </GlowCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
