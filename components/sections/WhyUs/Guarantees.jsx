'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import SectionHeading from './SectionHeading';
import { GUARANTEES, INCLUDED } from './data';

/**
 * The four guarantees, then what comes with the job.
 *
 * These are one section because they are one argument: what we owe you when it
 * goes wrong, and what we do without charging for it when it goes right. The
 * old page split them into a guarantees grid and a five-card photo carousel two
 * sections further down, with the country flag row in between.
 *
 * The included list is set as hairline rows rather than cards on purpose. It is
 * the least visually demanding thing on the page and it sits between two heavy
 * grids; giving it borders and backgrounds too would flatten the whole run.
 */
export default function Guarantees() {
  return (
    <section
      id="promise"
      className="relative scroll-mt-24 bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={GUARANTEES.eyebrow}
          title={GUARANTEES.title}
          titleWidth="max-w-[14ch]"
          intro={GUARANTEES.intro}
        />

        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2" stagger={0.08}>
          {GUARANTEES.list.map((g, i) => (
            <RevealItem key={g.title} className="h-full">
              <article className="h-full rounded-[22px] border border-white/10 bg-ink-900/60 p-6 transition-colors duration-500 hover:border-heat-500/25 sm:p-8">
                <span className="font-serif text-[11px] tracking-[0.3em] text-heat-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-serif text-xl leading-tight tracking-wide text-bone-100">
                  {g.title}
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-bone-300">
                  {g.desc}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Included as standard */}
        <div className="mt-16 border-t border-white/10 pt-10">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-bone-500">
                {INCLUDED.label}
              </p>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center gap-2 text-[13px] font-medium text-heat-400 transition-colors duration-300 hover:text-heat-300"
              >
                The five stages, in order
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </Reveal>

          <dl className="mt-4">
            {INCLUDED.list.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="grid gap-2 border-b border-white/10 py-6 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
                  <dt className="font-serif text-[clamp(1.2rem,2.4vw,1.55rem)] leading-none tracking-wide text-bone-100">
                    {item.title}
                  </dt>
                  <dd className="max-w-2xl text-[14px] leading-relaxed text-bone-300">
                    {item.desc}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
