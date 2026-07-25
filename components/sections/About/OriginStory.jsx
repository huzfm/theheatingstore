'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { ORIGIN } from './data';

/**
 * Origin narrative, side-by-side scroll reveal (pinning would be overkill for
 * two paragraphs). The image parallax-drifts against the copy to give the pair
 * a little depth as it enters.
 */
export default function OriginStory() {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section ref={ref} className="relative bg-ink-950 py-24 text-bone-100 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Image */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/10">
          <motion.img
            src={ORIGIN.image}
            alt="Underfloor heating installation in progress"
            style={reduce ? undefined : { y: imgY, scale: 1.12 }}
            className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(140deg, rgba(10,10,10,0.15), transparent 40%), radial-gradient(60% 50% at 20% 100%, rgba(255,138,61,0.16), transparent 70%)',
            }}
          />
        </div>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
              <span className="h-px w-8 bg-heat-500/60" />
              {ORIGIN.eyebrow}
            </span>
          </Reveal>

          <RevealText
            as="h2"
            className="mt-6 max-w-[18ch] font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100"
          >
            {ORIGIN.title}
          </RevealText>

          <div className="mt-7 space-y-5">
            {ORIGIN.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className="max-w-xl text-base leading-relaxed text-bone-300">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
