'use client';

import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import GlowCard from '@/components/ui/GlowCard';
import { PRINCIPLES } from './data';

/**
 * The three things we stand for — distinct cursor-glow cards rather than a
 * generic icon grid. Reuses GlowCard (dark, pointer-tracked border light) and
 * the shared reveal stagger.
 */
export default function Principles() {
  return (
    <section className="relative bg-ink-950 py-24 text-bone-100 sm:py-28">
      {/* Ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50vw 40vh at 50% 0%, rgba(255,138,61,0.06), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
              <span className="h-px w-8 bg-heat-500/60" />
              What We Stand For
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-6 font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100"
          >
            Three things we never compromise.
          </RevealText>
        </div>

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {PRINCIPLES.map((p) => (
            <RevealItem key={p.num}>
              <GlowCard className="h-full p-8">
                <span className="font-serif text-4xl text-heat-500/90">{p.num}</span>
                <h3 className="mt-5 font-serif text-2xl leading-tight text-bone-100">
                  {p.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-bone-300">{p.desc}</p>
                <span
                  aria-hidden
                  className="mt-6 block h-px w-10 bg-gradient-to-r from-heat-500 to-transparent"
                />
              </GlowCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
