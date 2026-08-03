'use client';

import Flag from 'react-world-flags';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { COUNTRIES } from './data';

/**
 * The countries these systems are proven in. Flags via react-world-flags,
 * already a dependency and already how the Why Choose Us global-presence
 * section renders them, so the two stay consistent.
 *
 * gap-px over a light background paints the hairline grid between tiles, the
 * same construction as the brand wall on /local-experience, so the two index
 * sections across the two sibling routes read as one pattern.
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
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {COUNTRIES.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 max-w-[14ch] font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              {COUNTRIES.title}
            </RevealText>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-bone-300 lg:mt-4">
              {COUNTRIES.intro}
            </p>
          </Reveal>
        </div>

        <RevealGroup
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-white/10 sm:grid-cols-4"
          stagger={0.06}
        >
          {COUNTRIES.list.map((c) => (
            <RevealItem key={c.code}>
              <div className="flex h-full flex-col items-center gap-4 bg-ink-950 px-4 py-8 text-center transition-colors duration-500 hover:bg-ink-900 sm:py-9">
                {/* Flags carry their own colours, so each sits on its own
                    plate rather than directly on near-black. */}
                <span className="block h-11 w-[62px] overflow-hidden rounded-md shadow-[0_6px_18px_-8px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
                  <Flag
                    code={c.code}
                    height="44"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </span>
                <span className="font-serif text-base leading-tight tracking-wide text-bone-100 sm:text-lg">
                  {c.name}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
