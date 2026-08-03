'use client';

import { RevealText, Reveal } from '@/components/ui/RevealText';
import { NETWORK } from './data';

/**
 * Coverage as a typographic index rather than rows of pill chips.
 *
 * The town names are the content here, so they are set large in the display
 * face and given the space to act as the section's visual weight. The previous
 * two passes buried them: first beside a stock photo of a map with pulsing
 * nodes at coordinates that corresponded to nothing, then as small grey pills
 * that read as tags rather than places.
 *
 * Each region is a row: label and note on the left, names on the right,
 * separated by hairlines. J&K leads and is marked as the base of operations,
 * it has the most towns and is where the team physically is.
 */
export default function CoverageIndex() {
  const total = NETWORK.regions.reduce((n, r) => n + r.places.length, 0);

  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {NETWORK.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 max-w-[13ch] font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              {NETWORK.title}
            </RevealText>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300 lg:mt-4">
              {NETWORK.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-white/10 lg:mt-16">
          {NETWORK.regions.map((r, i) => {
            const home = i === 0;
            return (
              <Reveal key={r.region} delay={i * 0.07}>
                <div
                  className="relative grid gap-6 border-b border-white/10 py-9 lg:grid-cols-[minmax(0,260px)_1fr] lg:gap-14 lg:py-11"
                  style={
                    home
                      ? {
                          background:
                            'linear-gradient(90deg, rgba(255,138,61,0.07), transparent 55%)',
                        }
                      : undefined
                  }
                >
                  {/* Region */}
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tracking-[0.24em] text-heat-500/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {home && (
                        <span className="rounded-full border border-heat-500/30 bg-heat-500/10 px-2.5 py-1 text-[9.5px] uppercase tracking-[0.18em] text-heat-400">
                          Base of operations
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-3 font-serif text-[clamp(1.5rem,3vw,2.1rem)] leading-none tracking-wide ${
                        home ? 'text-heat-400' : 'text-bone-100'
                      }`}
                    >
                      {r.region}
                    </h3>
                    <p className="mt-3.5 max-w-[34ch] text-[13px] leading-relaxed text-bone-500">
                      {r.note}
                    </p>
                  </div>

                  {/* Towns, set as the display type they deserve */}
                  <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-3 sm:gap-x-10 lg:justify-end">
                    {r.places.map((place) => (
                      <li
                        key={place}
                        className={`font-serif text-[clamp(1.35rem,3.6vw,2.1rem)] leading-none tracking-wide transition-colors duration-300 ${
                          home
                            ? 'text-bone-100 hover:text-heat-300'
                            : 'text-bone-300 hover:text-bone-100'
                        }`}
                      >
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-xs leading-relaxed text-bone-500/70">
            {total} towns across {NETWORK.regions.length} regions. Not on the
            list? Ask anyway, most of these started as a single enquiry from
            somewhere we had not worked before.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
