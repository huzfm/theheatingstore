'use client';

import { RevealText, Reveal } from '@/components/ui/RevealText';
import { PHYSICS } from './data';

/**
 * The explanation section, placed immediately after the floor cutaway so the
 * visitor has just *seen* the stack before being told why it is arranged that
 * way. Three numbered principles, then a four-row comparison against the
 * heating people already own.
 *
 * The comparison is a real <table> rather than a grid of divs: it is tabular
 * data, and a screen reader announcing "Heat distribution, electric hamam,
 * even across the whole floor" is the whole point of the markup.
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

        {/* Comparison. Scrolls inside its own container on narrow screens so
            the page body itself never scrolls sideways. */}
        <Reveal delay={0.1}>
          <div className="mt-16 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <caption className="sr-only">
                Electric hamam compared with radiators and blowers
              </caption>
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th scope="col" className="w-[26%] px-5 py-5 text-[11px] font-medium uppercase tracking-[0.22em] text-bone-500 sm:px-7">
                    <span className="sr-only">Metric</span>
                  </th>
                  <th scope="col" className="px-5 py-5 font-display text-sm text-heat-400 sm:px-7">
                    {compare.a}
                  </th>
                  <th scope="col" className="px-5 py-5 font-display text-sm text-bone-500 sm:px-7">
                    {compare.b}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compare.rows.map((r) => (
                  <tr key={r.metric} className="border-b border-white/[0.07] last:border-0">
                    <th
                      scope="row"
                      className="px-5 py-6 align-top text-[11px] font-medium uppercase tracking-[0.2em] text-bone-500 sm:px-7"
                    >
                      {r.metric}
                    </th>
                    <td className="px-5 py-6 align-top text-sm leading-relaxed text-bone-100 sm:px-7">
                      {r.a}
                    </td>
                    <td className="px-5 py-6 align-top text-sm leading-relaxed text-bone-500 sm:px-7">
                      {r.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
