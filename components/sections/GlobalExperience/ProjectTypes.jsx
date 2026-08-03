'use client';

import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { PROJECTS } from './data';

/**
 * The building types these systems go into, as photographic cards.
 *
 * The first entry is flagged `featured` and takes a double-width slot on
 * desktop: the mosque work is the most locally specific thing on this page and
 * carries the longest description, and an even six-up grid flattened it into
 * one tile among six.
 *
 * Images are remote (Unsplash), carried over from the previous version of this
 * page. They are plain <img> with loading="lazy" rather than next/image, since
 * next.config would need the remote host allow-listed for the optimiser.
 */
export default function ProjectTypes() {
  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {PROJECTS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {PROJECTS.title}
          </RevealText>
        </div>

        <RevealGroup
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {PROJECTS.list.map((p) => (
            <RevealItem
              key={p.label}
              className={p.featured ? 'sm:col-span-2' : undefined}
            >
              <article className="group relative h-full overflow-hidden rounded-[22px] border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] ${
                    p.featured ? 'h-[280px] sm:h-[340px]' : 'h-[260px]'
                  }`}
                />
                {/* Deep foot so the copy is legible over any photograph */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.10) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.95) 100%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="font-serif text-[clamp(1.15rem,2.4vw,1.6rem)] leading-tight tracking-wide text-bone-100">
                    {p.label}
                  </h3>
                  <p
                    className={`mt-2.5 text-[13px] leading-relaxed text-bone-300 ${
                      p.featured ? 'max-w-lg' : 'max-w-[38ch]'
                    }`}
                  >
                    {p.desc}
                  </p>
                  <span
                    aria-hidden
                    className="mt-4 block h-px w-10 bg-gradient-to-r from-heat-500 to-transparent transition-all duration-500 group-hover:w-16"
                  />
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
