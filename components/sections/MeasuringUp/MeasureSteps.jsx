'use client';

import { RevealText, Reveal, RevealGroup, RevealItem } from '@/components/ui/RevealText';
import { STEPS } from './data';

/**
 * The three-step method, as image cards. The photography is the existing
 * /images/m1–m3 set, which is what the old page used and is genuinely
 * illustrative, a plan, a room with fixtures, a bare floor.
 *
 * Step 3 is the one that changed: it used to say the calculator applies a 20%
 * furniture deduction, which it does not. See the note at the top of data.js.
 */
export default function MeasureSteps() {
  return (
    <section className="relative bg-ink-950 px-4 py-20 text-bone-100 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.24em] text-heat-400 sm:text-[11px] sm:tracking-[0.28em]">
              <span className="h-px w-8 bg-heat-500/60" />
              {STEPS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-6 font-serif text-[clamp(1.75rem,6vw,3.25rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit] sm:mt-7 sm:leading-[1.02]"
          >
            {STEPS.title}
          </RevealText>
        </div>

        <RevealGroup className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-3 lg:mt-14" stagger={0.1}>
          {STEPS.list.map((s) => (
            <RevealItem key={s.n} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-ink-900/60">
                {/* These are floor-plan diagrams, not photography: object-cover
                    in a fixed-height band cropped the plans, and on step 02 it
                    cut off the dimension arrows the step is about. Contained on
                    a light plate, in the plans' own 4:3, so each one is whole. */}
                <div className="relative aspect-[4/3] overflow-hidden bg-bone-100 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-ink-950/85 px-3 py-1 font-serif text-[15px] leading-none text-heat-400 backdrop-blur-sm">
                    {s.n}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-serif text-lg leading-tight tracking-wide text-bone-100 sm:text-xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-bone-300 sm:mt-3.5">
                    {s.body}
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
