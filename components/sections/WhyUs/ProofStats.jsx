'use client';

import { Check } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import SectionHeading from './SectionHeading';
import { STATS } from './data';

/**
 * The four headline figures, each with the two specifics that back it.
 *
 * Trimmed from four figures × three bullets. The old set also opened with two
 * figures making the same point (300,000+ customers, then 2,000,000+ systems),
 * so the first card now carries the scale argument alone and the other three
 * carry reliability, cover and reach — one argument each.
 */
export default function ProofStats() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55vw 40vh at 50% 0%, rgba(255,138,61,0.06), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading eyebrow={STATS.eyebrow} title={STATS.title} />

        <RevealGroup
          className="mt-14 grid gap-px overflow-hidden rounded-[24px] bg-white/10 sm:grid-cols-2"
          stagger={0.08}
        >
          {STATS.list.map((s) => (
            <RevealItem key={s.label} className="h-full">
              <article className="h-full bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900 sm:p-8">
                <p className="font-serif text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-heat-400">
                  {s.display}
                </p>
                <h3 className="mt-4 font-serif text-xl leading-tight tracking-wide text-bone-100">
                  {s.label}
                </h3>
                <p className="mt-1.5 text-[13px] text-bone-500">{s.sub}</p>

                <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        strokeWidth={2}
                        aria-hidden
                        className="mt-1 shrink-0 text-heat-500/80"
                      />
                      <span className="text-[13.5px] leading-relaxed text-bone-300">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
