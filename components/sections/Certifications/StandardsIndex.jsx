'use client';

import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { GROUPS } from './data';

/**
 * The certification marks, grouped by what they actually govern.
 *
 * The grouping is the point. The previous version showed eleven cards across
 * four sections with no indication that four of them were electrical, three
 * were about the cable, and two applied only to water-based systems a given
 * customer probably is not buying. Each group here states what it applies to
 * in a line under its heading.
 *
 * gap-px over a light background paints the hairline grid between tiles, the
 * same construction as the brand wall on /local-experience and the country
 * index on /global-experience, so the three index sections read as one pattern.
 */
export default function StandardsIndex() {
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

      <div className="relative mx-auto max-w-6xl space-y-20 lg:space-y-24">
        {GROUPS.map((group) => (
          <div key={group.id}>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <Reveal>
                  <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                    <span className="h-px w-8 bg-heat-500/60" />
                    {group.eyebrow}
                  </span>
                </Reveal>
                <RevealText
                  as="h2"
                  className="mt-7 max-w-[16ch] font-serif text-[clamp(1.7rem,3.6vw,2.75rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit]"
                >
                  {group.title}
                </RevealText>
              </div>
              <Reveal delay={0.1}>
                <p className="text-[13px] uppercase tracking-[0.16em] text-bone-500 lg:mt-5">
                  {group.applies}
                </p>
              </Reveal>
            </div>

            <RevealGroup
              className="mt-10 grid gap-px overflow-hidden rounded-[24px] bg-white/10 sm:grid-cols-2 lg:mt-12"
              stagger={0.07}
            >
              {group.items.map((item) => (
                <RevealItem key={item.title} className="h-full">
                  <article className="flex h-full flex-col bg-ink-950 p-6 transition-colors duration-500 hover:bg-ink-900 sm:p-8">
                    {/* The mark, set large in the display face. Bebas is
                        all-caps by design, which suits an acronym set. */}
                    <span className="font-serif text-[clamp(1.6rem,3.4vw,2.4rem)] leading-none tracking-wide text-heat-500/90">
                      {item.mark}
                    </span>

                    <h3 className="mt-5 font-serif text-xl leading-tight tracking-wide text-bone-100">
                      {item.title}
                    </h3>

                    <p className="mt-3.5 flex-1 text-[14px] leading-relaxed text-bone-300">
                      {item.desc}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {item.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-bone-500"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        ))}
      </div>
    </section>
  );
}
