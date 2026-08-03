'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { TIMELINE } from './data';

/**
 * "How long is my house a building site." The rail above answers what happens;
 * this answers when, which is the question that actually decides whether
 * somebody books.
 *
 * One scroll-filled line with five markers. Horizontal on desktop, vertical on
 * mobile, the same line and the same fill in both, driven by one scrollYProgress
 * mapped to scaleX or scaleY. The honest bit is the disclaimer under it: these
 * are ranges for a typical single-floor house, and the page says so rather than
 * implying a schedule it cannot promise.
 */
export default function OnSiteTimeline() {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 65%'],
  });
  const fill = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  return (
    <section className="relative bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {TIMELINE.eyebrow}
            </span>
          </Reveal>
          <RevealText
            as="h2"
            // See HowItWorksHero for why [&_span]:leading-[inherit] is here.
            className="mt-7 font-serif text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {TIMELINE.title}
          </RevealText>
        </div>

        <div ref={ref} className="mt-14 lg:mt-20">
          {/* Desktop: horizontal rule with the markers hanging off it */}
          <div className="relative hidden lg:block">
            <span aria-hidden className="absolute left-0 right-0 top-[7px] h-px bg-white/10" />
            <motion.span
              aria-hidden
              className="absolute left-0 right-0 top-[7px] h-px origin-left bg-gradient-to-r from-heat-500 to-heat-400"
              style={{ scaleX: reduce ? 1 : fill }}
            />
            <ol className="grid grid-cols-5 gap-6">
              {TIMELINE.phases.map((p, i) => (
                <Reveal key={p.when} delay={i * 0.08}>
                  <li className="relative pr-4">
                    <span
                      aria-hidden
                      className="block h-[15px] w-[15px] rounded-full border border-heat-500/40 bg-ink-950"
                    >
                      <span className="mx-auto mt-[3px] block h-[7px] w-[7px] rounded-full bg-heat-500 shadow-[0_0_10px_2px_rgba(255,138,61,0.5)]" />
                    </span>
                    <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                      {p.when}
                    </p>
                    <h3 className="mt-3 font-serif text-xl leading-tight tracking-wide text-bone-100">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-bone-500">
                      {p.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Mobile / tablet: the same line, turned on its side */}
          <div className="relative lg:hidden">
            <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
            <motion.span
              aria-hidden
              className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-heat-500 to-heat-400"
              style={{ scaleY: reduce ? 1 : fill }}
            />
            <ol className="space-y-9">
              {TIMELINE.phases.map((p, i) => (
                <Reveal key={p.when} delay={i * 0.06}>
                  <li className="relative pl-9">
                    <span
                      aria-hidden
                      className="absolute left-0 top-1 block h-[15px] w-[15px] rounded-full border border-heat-500/40 bg-ink-950"
                    >
                      <span className="mx-auto mt-[3px] block h-[7px] w-[7px] rounded-full bg-heat-500 shadow-[0_0_10px_2px_rgba(255,138,61,0.5)]" />
                    </span>
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                      {p.when}
                    </p>
                    <h3 className="mt-2 font-serif text-xl leading-tight tracking-wide text-bone-100">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-bone-500">
                      {p.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-14 max-w-2xl border-t border-white/10 pt-7 text-xs leading-relaxed text-bone-500/70">
            {TIMELINE.intro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
