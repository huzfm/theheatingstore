'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { CHAPTERS } from './data';

/**
 * A chapter opener: image one side, prose the other, the image over-scaled and
 * parallax-drifting against the copy as the pair scrolls through. Mirrors
 * components/sections/About/OriginStory.
 *
 * One component for both of the page's narrative beats — the Kashmir brief and
 * the imported standard. They were separate files on separate routes with
 * byte-identical markup except for which side the image sat on, which is what
 * `flip` is for; the two alternate so a reader scrolling the whole page does
 * not see the same arrangement twice.
 *
 * These carry the #local and #global anchors, so they are also where the two
 * retired URLs land. The chapter number is looked up from CHAPTERS rather than
 * written into each story, so the jump bar and the openers cannot disagree.
 */
export default function StoryBeat({ story }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  const num = CHAPTERS.find((c) => c.id === story.id)?.num;

  const image = (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/10 ${
        story.flip ? 'lg:order-2' : ''
      }`}
    >
      <motion.img
        src={story.image}
        alt={story.imageAlt}
        style={reduce ? undefined : { y: imgY, scale: 1.12 }}
        className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: story.flip
            ? 'linear-gradient(220deg, rgba(10,10,10,0.15), transparent 40%), radial-gradient(60% 50% at 80% 100%, rgba(255,138,61,0.16), transparent 70%)'
            : 'linear-gradient(140deg, rgba(10,10,10,0.15), transparent 40%), radial-gradient(60% 50% at 20% 100%, rgba(255,138,61,0.16), transparent 70%)',
        }}
      />
    </div>
  );

  return (
    <section
      id={story.id}
      ref={ref}
      className="relative scroll-mt-24 bg-ink-950 py-24 text-bone-100 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {image}

        <div className={story.flip ? 'lg:order-1' : ''}>
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
              <span className="h-px w-8 bg-heat-500/60" />
              {num && <span className="text-heat-500/70">{num}</span>}
              {story.eyebrow}
            </span>
          </Reveal>

          <RevealText
            as="h2"
            className="mt-6 max-w-[16ch] font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100 [&_span]:leading-[inherit]"
          >
            {story.title}
          </RevealText>

          <div className="mt-7 space-y-5">
            {story.paragraphs.map((p, i) => (
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
