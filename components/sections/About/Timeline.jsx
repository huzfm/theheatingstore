'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { MILESTONES } from './data';

const EASE = [0.16, 1, 0.3, 1];

function Milestone({ item, side }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const fromX = reduce ? 0 : side === 'left' ? -32 : 32;

  return (
    <div
      ref={ref}
      className={`relative flex items-center ${side === 'left' ? 'md:justify-start' : 'md:justify-end'}`}
    >
      {/* Node on the central line */}
      <span
        aria-hidden
        className="absolute left-4 top-2 z-10 md:left-1/2 md:-translate-x-1/2"
      >
        <motion.span
          className="block h-3.5 w-3.5 rounded-full bg-heat-500 shadow-[0_0_0_4px_rgba(255,138,61,0.15)]"
          initial={reduce ? false : { scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </span>

      <motion.div
        initial={reduce ? false : { opacity: 0, x: fromX, y: 12 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        className={`ml-12 w-full md:ml-0 md:w-[calc(50%-2.5rem)] ${side === 'left' ? 'md:text-right' : ''}`}
      >
        <span className="font-serif text-3xl text-heat-500">{item.year}</span>
        <h3 className="mt-1.5 font-serif text-xl text-bone-100">{item.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-bone-300">{item.desc}</p>
      </motion.div>
    </div>
  );
}

/**
 * Vertical milestone timeline. A heat line draws itself in as the section
 * scrolls through the viewport (scaleY tied to scroll progress); each
 * milestone pops in when it reaches centre. Under reduced motion the line is
 * simply present and the milestones are static.
 */
export default function Timeline() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 60%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative bg-ink-950 py-24 text-bone-100 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
              <span className="h-px w-8 bg-heat-500/60" />
              The Road So Far
            </span>
          </Reveal>
          <RevealText
            as="h2"
            className="mt-6 font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100"
          >
            A decade of warmer winters.
          </RevealText>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* Track + drawing line: left rail on mobile, centred on md+ */}
          <div className="pointer-events-none absolute bottom-0 left-[1.35rem] top-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-heat-400 to-heat-600"
              style={{ scaleY: reduce ? 1 : lineScale, height: '100%' }}
            />
          </div>

          <div className="space-y-14">
            {MILESTONES.map((item, i) => (
              <Milestone key={item.year} item={item} side={i % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
