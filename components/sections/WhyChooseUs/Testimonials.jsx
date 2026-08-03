'use client';

import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { TESTIMONIALS } from './data';

/**
 * Three trade testimonials, all attributed to named people at named firms.
 *
 * The old version put a row of four Unsplash face photographs beside these as
 * "customer avatars". Those were stock photos of strangers, so they are gone,
 * see the note in data.js. Initials in a plate say the same thing without
 * implying a photograph of a customer that is not one.
 */
export default function Testimonials() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {TESTIMONIALS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {TESTIMONIALS.title}
          </RevealText>
        </div>

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
