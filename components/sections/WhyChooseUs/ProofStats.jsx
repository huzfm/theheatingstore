'use client';

import { Check } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { STATS } from './data';

/**
 * The four headline figures, each with the three specifics that back it.
 *
 * The old version rendered these as cards with a per-stat accent colour
 * (#F5B97A, #7FC0E8, #FF9E7A, #8FD4A6), a hand-rolled SVG icon and an animated
 * percentage bar whose value, `pct`, was not derived from anything, 92, 100,
 * 78 and 56 were decorative. A progress bar that measures nothing is worse
 * than no bar, so the numbers carry themselves here.
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
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {STATS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {STATS.title}
          </RevealText>
        </div>

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
