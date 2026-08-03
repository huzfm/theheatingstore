'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { OFFERS } from './data';

/**
 * What is included. Formerly a five-step "process" carousel, which it was not:
 * only two of the five were steps, the rest were offers. /how-it-works owns
 * the actual sequence, so this states what comes with the job and links there
 * for the order things happen in.
 *
 * The first card takes a double-width slot on desktop so the row does not read
 * as five identical tiles.
 */
export default function WhatYouGet() {
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
                {OFFERS.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
            >
              {OFFERS.title}
            </RevealText>
          </div>
          <Reveal delay={0.12}>
            <div className="lg:mt-4">
              <p className="max-w-xl text-base leading-relaxed text-bone-300">
                {OFFERS.intro}
              </p>
              <Link
                href="/how-it-works"
                className="group mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-heat-400 transition-colors duration-300 hover:text-heat-300"
              >
                The five stages, in order
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </Reveal>
        </div>

        <RevealGroup
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {OFFERS.list.map((o, i) => (
            <RevealItem
              key={o.num}
              className={i === 0 ? 'h-full sm:col-span-2' : 'h-full'}
            >
              <article className="group relative h-full overflow-hidden rounded-[22px] border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={o.img}
                  alt=""
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${
                    i === 0 ? 'h-[280px] sm:h-[320px]' : 'h-[280px]'
                  }`}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.96) 100%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="font-serif text-[11px] tracking-[0.3em] text-heat-500">
                    {o.num}
                  </span>
                  <h3 className="mt-2.5 font-serif text-[clamp(1.15rem,2.4vw,1.55rem)] leading-tight tracking-wide text-bone-100">
                    {o.title}
                  </h3>
                  <p
                    className={`mt-2.5 text-[13px] leading-relaxed text-bone-300 ${
                      i === 0 ? 'max-w-xl' : 'max-w-[42ch]'
                    }`}
                  >
                    {o.desc}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
