'use client';

import Flag from 'react-world-flags';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { RELIABILITY } from './data';

/**
 * The four guarantees, then the nine countries these systems run in.
 *
 * Kept as one section because they are one argument: the guarantees are only
 * worth anything if the company behind them operates at a scale that can honour
 * them, and the country list is the evidence for that scale.
 */
export default function Reliability() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {RELIABILITY.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 max-w-[14ch] font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              {RELIABILITY.title}
            </RevealText>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300 lg:mt-4">
              {RELIABILITY.intro}
            </p>
          </Reveal>
        </div>

        {/* Guarantees */}
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2" stagger={0.08}>
          {RELIABILITY.list.map((r, i) => (
            <RevealItem key={r.title} className="h-full">
              <article className="h-full rounded-[22px] border border-white/10 bg-ink-900/60 p-6 transition-colors duration-500 hover:border-heat-500/25 sm:p-8">
                <span className="font-serif text-[11px] tracking-[0.3em] text-heat-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-serif text-xl leading-tight tracking-wide text-bone-100">
                  {r.title}
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-bone-300">
                  {r.desc}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Countries */}
        <Reveal delay={0.1}>
          <div className="mt-14 border-t border-white/10 pt-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
              Installed and supported in
            </p>
            <ul className="mt-7 flex flex-wrap gap-3">
              {RELIABILITY.countries.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-2 pr-5"
                >
                  {/* Flags carry their own colours, so each gets a plate
                      rather than sitting directly on near-black. */}
                  <span className="block h-7 w-10 overflow-hidden rounded-[5px] ring-1 ring-white/15">
                    <Flag
                      code={c.code}
                      height="28"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </span>
                  <span className="text-[13.5px] text-bone-300">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
