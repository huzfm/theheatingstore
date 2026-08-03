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
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {STEPS.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {STEPS.title}
          </RevealText>
        </div>

        <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {STEPS.list.map((s) => (
            <RevealItem key={s.n} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-ink-900/60">
                <div className="relative h-[200px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.75) 100%)',
                    }}
                  />
                  <span className="absolute bottom-4 left-5 font-serif text-[2.5rem] leading-none text-heat-400">
                    {s.n}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl leading-tight tracking-wide text-bone-100">
                    {s.title}
                  </h3>
                  <p className="mt-3.5 text-[14px] leading-relaxed text-bone-300">
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
