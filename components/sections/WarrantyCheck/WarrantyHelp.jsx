'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { HELP } from './data';

/**
 * What to do when the lookup comes back empty.
 *
 * The old page ended at the search box, so a visitor whose record did not
 * resolve was left with "No Warranty Found. Please verify or contact support."
 * and nothing else. An empty result on this page is nearly always a phone
 * number filed under someone else, and saying so is the difference between the
 * page answering the question and the page refusing it.
 */
export default function WarrantyHelp() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div
          className="relative isolate overflow-hidden rounded-[32px] border border-white/10 px-6 py-14 sm:px-10 sm:py-16 lg:px-14"
          style={{
            background:
              'radial-gradient(80% 120% at 50% 0%, rgba(255,138,61,0.18), transparent 60%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
          }}
        >
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {HELP.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 font-serif text-[clamp(1.8rem,4vw,3rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit]"
            >
              {HELP.title}
            </RevealText>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-bone-300">{HELP.intro}</p>
            </Reveal>
          </div>

          <RevealGroup
            className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3"
            stagger={0.08}
          >
            {HELP.reasons.map((r) => (
              <RevealItem key={r.title} className="h-full">
                <div className="h-full bg-ink-950/70 p-6 backdrop-blur-sm sm:p-7">
                  <h3 className="font-serif text-lg leading-tight tracking-wide text-bone-100">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-bone-300">{r.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15}>
            <div className="mt-12 border-t border-white/10 pt-8">
              <Link
                href="/certifications"
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-heat-400 transition-colors duration-300 hover:text-heat-300"
              >
                What the warranty covers, and the standards behind it
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
