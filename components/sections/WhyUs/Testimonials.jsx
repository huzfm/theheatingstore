'use client';

import { RevealGroup, RevealItem } from '@/components/ui/RevealText';
import SectionHeading from './SectionHeading';
import { TESTIMONIALS } from './data';

/**
 * Three trade testimonials, all attributed to named people at named firms, and
 * placed directly after the guarantees they corroborate.
 *
 * The quotes are trimmed to two sentences each. The originals ran to four or
 * five and spent most of them on adjectives; on a page this long the shorter
 * quote is the one that gets read.
 *
 * No Review or AggregateRating markup in page.jsx for these: self-serving
 * reviews on your own organisation are not eligible for rich results and
 * marking them up is a manual-action risk, not an SEO win.
 */
export default function Testimonials() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={TESTIMONIALS.eyebrow} title={TESTIMONIALS.title} />

        <RevealGroup className="mt-14 grid gap-5 lg:grid-cols-3" stagger={0.1}>
          {TESTIMONIALS.list.map((t) => (
            <RevealItem key={t.name} className="h-full">
              <figure className="flex h-full flex-col rounded-[22px] border border-white/10 bg-ink-900/60 p-6 sm:p-8">
                <span className="inline-flex w-fit rounded-full border border-heat-500/25 bg-heat-500/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-heat-400">
                  {t.tag}
                </span>

                <blockquote className="mt-6 flex-1 text-[14.5px] leading-relaxed text-bone-300">
                  {t.text}
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] font-serif text-sm tracking-wide text-heat-400">
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-base leading-tight tracking-wide text-bone-100">
                      {t.name}
                    </span>
                    <span className="mt-1 block text-[12px] leading-snug text-bone-500">
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
