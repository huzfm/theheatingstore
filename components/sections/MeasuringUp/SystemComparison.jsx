'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { SYSTEMS } from './data';

/**
 * Electric versus water, side by side. Both cards keep their original copy,
 * including the electric card's "reduce by 10%" paragraph, which is the
 * explanation for the allowance the calculator above applies.
 *
 * The electric card's button used to point at /electric-underfloor-heating,
 * which is not a route in this app. It goes to /product now.
 */
export default function SystemComparison() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {SYSTEMS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 max-w-[18ch] font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {SYSTEMS.title}
          </RevealText>
        </div>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2" stagger={0.1}>
          {SYSTEMS.list.map((s) => (
            <RevealItem key={s.tag} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-ink-900/60">
                <div className="relative h-[220px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 45%, rgba(10,10,10,0.85) 100%)',
                    }}
                  />
                  <span className="absolute bottom-4 left-5 rounded-full border border-heat-500/30 bg-ink-950/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-heat-400 backdrop-blur-sm">
                    {s.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-serif text-[clamp(1.3rem,2.6vw,1.7rem)] leading-tight tracking-wide text-bone-100">
                    {s.title}
                  </h3>

                  <div className="mt-4 space-y-3.5">
                    {s.paras.map((p, i) => (
                      <p key={i} className="text-[14px] leading-relaxed text-bone-300">
                        {p}
                      </p>
                    ))}
                  </div>

                  <Link
                    href={s.href}
                    className="group/link mt-auto inline-flex items-center gap-2 border-t border-white/10 pt-6 text-[13px] font-medium text-heat-400 transition-colors duration-300 hover:text-heat-300"
                  >
                    {s.cta}
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden
                      className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
