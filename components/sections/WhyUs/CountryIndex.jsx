'use client';

import Flag from 'react-world-flags';
import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import SectionHeading from './SectionHeading';
import { COUNTRIES } from './data';

/**
 * The nine countries these systems are proven in. Flags via react-world-flags,
 * already a dependency.
 *
 * India leads and is marked as the home market. The two pages this one merges
 * disagreed on the count — nine on one, eight on the other, because one list
 * included India and one did not — and putting them side by side made the
 * contradiction visible. Showing the home market rather than quietly folding it
 * into the total is what stops that happening again.
 *
 * gap-px over a light background paints the hairline grid between tiles, the
 * same construction as the brand wall above, so the two index sections read as
 * one pattern.
 */
export default function CountryIndex() {
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
        <SectionHeading
          eyebrow={COUNTRIES.eyebrow}
          title={COUNTRIES.title}
          titleWidth="max-w-[14ch]"
          intro={COUNTRIES.intro}
        />

        <RevealGroup
          // Three columns at every width, not two-then-four. Nine tiles divide
          // evenly by three and by nothing else here, and an odd tile out over
          // `gap-px` on a light background leaves a bare grey cell rather than
          // an empty one.
          className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-[24px] bg-white/10"
          stagger={0.06}
        >
          {COUNTRIES.list.map((c) => (
            <RevealItem key={c.code}>
              <div
                className={`flex h-full flex-col items-center gap-3 px-2 py-7 text-center transition-colors duration-500 hover:bg-ink-900 sm:gap-4 sm:px-4 sm:py-9 ${
                  c.home ? 'bg-heat-500/[0.07]' : 'bg-ink-950'
                }`}
              >
                {/* Flags carry their own colours, so each sits on its own
                    plate rather than directly on near-black. */}
                <span className="block h-9 w-[52px] overflow-hidden rounded-md shadow-[0_6px_18px_-8px_rgba(0,0,0,0.9)] ring-1 ring-white/15 sm:h-11 sm:w-[62px]">
                  <Flag
                    code={c.code}
                    height="44"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </span>
                <span
                  className={`font-serif text-[13px] leading-tight tracking-wide sm:text-lg ${
                    c.home ? 'text-heat-400' : 'text-bone-100'
                  }`}
                >
                  {c.name}
                </span>
                {c.home && (
                  <span className="-mt-1.5 text-[9px] uppercase tracking-[0.16em] text-bone-500 sm:-mt-2 sm:text-[9.5px]">
                    Home market
                  </span>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
