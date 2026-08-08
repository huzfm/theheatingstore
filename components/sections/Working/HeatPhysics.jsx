'use client';

import { RevealText, Reveal } from '@/components/ui/RevealText';
import { PHYSICS } from './data';

/**
 * The explanation section, placed immediately after the floor cutaway so the
 * visitor has just *seen* the stack before being told why it is arranged that
 * way. Three numbered principles, then a four-metric comparison against the
 * heating people already own.
 *
 * The comparison is a real <table> rather than a grid of divs: it is tabular
 * data, and a screen reader announcing "Warmest point, the floor where you
 * stand" is the whole point of the markup. See the note above it for why it is
 * two columns rather than three.
 */
export default function HeatPhysics() {
  const { compare } = PHYSICS;

  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
            <span className="h-px w-8 bg-heat-500/60" />
            {PHYSICS.eyebrow}
          </span>
        </Reveal>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <RevealText
            as="h2"
            className="max-w-[14ch] font-serif text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.02] text-bone-100"
          >
            {PHYSICS.title}
          </RevealText>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300 lg:mt-3">
              {PHYSICS.intro}
            </p>
          </Reveal>
        </div>

        {/* Three principles */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {PHYSICS.points.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.08}>
              <article className="h-full bg-ink-950 p-7 sm:p-9">
                <span className="font-display text-[11px] tracking-[0.3em] text-heat-500">
                  {p.k}
                </span>
                <h3 className="mt-5 font-serif text-2xl leading-snug text-bone-100">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-500">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Comparison. Two columns, and the whole thing is visible at every
            width — no sideways scroll, inside this container or anywhere else.

            It used to be three columns (metric, then the two systems) held open
            by a `min-w-[560px]`, which meant a phone got a table it had to drag
            sideways to finish reading, and the two things being compared were
            never on screen together. That is the one thing a comparison has to
            do. The metric is now a full-width label above each pair, so the
            only two columns left are the two answers and they split the width
            evenly at any size.

            Still a real <table>: this is tabular data, and one <tbody> per
            metric with a `scope="rowgroup"` header is what lets a screen reader
            announce "Warmest point — the floor, where you stand". */}
        <Reveal delay={0.1}>
          <div className="mt-16 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Electric hamam compared with radiators and blowers
              </caption>
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th
                    scope="col"
                    className="w-1/2 border-r border-white/10 px-4 py-4 font-display text-[13px] text-heat-400 sm:px-7 sm:py-5 sm:text-sm"
                  >
                    {compare.a}
                  </th>
                  <th
                    scope="col"
                    className="w-1/2 px-4 py-4 font-display text-[13px] text-bone-500 sm:px-7 sm:py-5 sm:text-sm"
                  >
                    {compare.b}
                  </th>
                </tr>
              </thead>

              {compare.rows.map((r) => (
                <tbody key={r.metric} className="border-t border-white/[0.07]">
                  <tr>
                    <th
                      colSpan={2}
                      scope="rowgroup"
                      className="bg-white/[0.02] px-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-bone-500 sm:px-7"
                    >
                      {r.metric}
                    </th>
                  </tr>
                  <tr>
                    {/* Left column carries a faint heat wash: at a glance, the
                        tinted side is ours. */}
                    <td className="border-r border-white/10 bg-heat-500/[0.04] px-4 py-5 align-top text-[12.5px] leading-relaxed text-bone-100 sm:px-7 sm:py-6 sm:text-sm">
                      {r.a}
                    </td>
                    <td className="px-4 py-5 align-top text-[12.5px] leading-relaxed text-bone-500 sm:px-7 sm:py-6 sm:text-sm">
                      {r.b}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
