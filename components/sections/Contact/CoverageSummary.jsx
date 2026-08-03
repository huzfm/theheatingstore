'use client';

import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { COVERAGE } from './data';

/**
 * Where we work, as three columns of town names.
 *
 * The old cards led with an emoji and closed with an installation count,
 * "45k+", "200k+", "35k+". Those are not carried across, see the note in
 * data.js: they totalled 280,000 installations in the Valley alone, against a
 * "200+" figure sitting in the same file. The towns are the useful part and
 * they are checkable, so they carry the section on their own.
 */
export default function CoverageSummary() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {COVERAGE.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {COVERAGE.title}
          </RevealText>
        </div>

        <RevealGroup
          className="mt-14 grid gap-px overflow-hidden rounded-[24px] bg-white/10 md:grid-cols-3"
          stagger={0.09}
        >
          {COVERAGE.regions.map((r) => (
            <RevealItem key={r.title} className="h-full">
              <div className="h-full bg-ink-950 p-6 sm:p-8">
                <h3 className="font-serif text-xl leading-none tracking-wide text-heat-400">
                  {r.title}
                </h3>
                <ul className="mt-6 space-y-2.5">
                  {r.places.map((p) => (
                    <li
                      key={p}
                      className="border-b border-white/[0.06] pb-2.5 text-[14.5px] text-bone-300 last:border-0"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-bone-500/70">
            {COVERAGE.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
