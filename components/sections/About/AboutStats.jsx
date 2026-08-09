'use client';

import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import GlowCard from '@/components/ui/GlowCard';
import CounterNumber from '@/components/ui/CounterNumber';
import { STATS } from './data';

/**
 * Impact band, count-up figures that tick from zero when they scroll into
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
        <RevealGroup
          className="grid grid-cols-2 items-stretch gap-4 sm:gap-6 lg:grid-cols-4"
          stagger={0.1}
        >
          {STATS.map((s) => (
            /* h-full down the whole chain: the RevealItem is the grid child, so
               without it the card only ever grows to its own content and the
               four cards end up different heights the moment one label wraps. */
            <RevealItem key={s.label} className="h-full">
              <GlowCard
                className="flex h-full flex-col items-center px-4 py-8 text-center sm:px-5 sm:py-9"
                lift={-4}
              >
                {/* Fixed-height band, contents bottom-aligned, height tied to
                    the same clamp as the type (line-height is 1, so the box is
                    exactly the font size). The figures are not the same width
                    or even the same kind of thing, so this is what sits all
                    four on one line across the row rather than letting each
                    card set its own.

                    The cap is 2.75rem and not the old 3.75rem because the
                    widest figure, "2,000,000+", overran a quarter-width card at
                    that size and wrapped, which is what knocked the row out of
                    line in the first place. */}
                <div className="flex h-[clamp(1.75rem,4.5vw,2.75rem)] w-full items-end justify-center">
                  <span
                    className="whitespace-nowrap font-serif text-[clamp(1.75rem,4.5vw,2.75rem)] text-heat-500"
                    // lineHeight inline, not `leading-none`: globals.css sets
                    // `span { line-height: 1.75 }` outside any cascade layer,
                    // and unlayered CSS beats every Tailwind utility whatever
                    // its specificity. Same trap RevealText documents.
                    style={{ lineHeight: 1 }}
                  >
                    {/* Not every stat is a number. The warranty is the word
                        "Lifetime", which has nothing to count up to, so it is
                        set in the same type and skips the counter entirely. */}
                    {s.text ? (
                      s.text
                    ) : (
                      <CounterNumber
                        value={s.value}
                        suffix={s.suffix}
                        separator={!!s.separator}
                        duration={1.8}
                      />
                    )}
                  </span>
                </div>
                {/* Two lines' worth of room reserved whether the label needs it
                    or not, so "Years installing" and "Installations worldwide"
                    start on the same line as each other. */}
                <div
                  className="mt-3 flex min-h-[2.75rem] w-full items-start justify-center text-[11px] uppercase tracking-[0.12em] text-bone-300 sm:text-[13px] sm:tracking-[0.14em]"
                  style={{ lineHeight: 1.5 }}
                >
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
