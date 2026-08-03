'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
};
const line = {
  hidden: { y: '100%', opacity: 0, filter: 'blur(6px)' },
  show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease: EASE } },
};

/**
 * Short architectural-manifesto statement, breaking the page between the
 * article index and the closing CTA.
 *
 * A single whileInView trigger on the h2 drives both lines via variant
 * propagation (one IntersectionObserver, not one per line) — more robust
 * than nesting independent whileInView spans in a tiny masked element.
 */
export default function JournalManifesto() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-ink-950 py-24 text-bone-100 sm:py-32 lg:py-40">
      <div aria-hidden className="jr-grain pointer-events-none absolute inset-0 opacity-[0.04]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        animate={reduce ? undefined : { opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(45% 45% at 50% 0%, rgba(255,138,61,0.14), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="jr-eyebrow text-heat-300"
        >
          Editorial Note
        </motion.p>

        <motion.h2
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={reduce ? undefined : container}
          className="jr-display mt-6 text-[clamp(2.25rem,6vw,4.75rem)] normal-case"
        >
          <span className="block overflow-hidden">
            <motion.span variants={reduce ? undefined : line} className="block">
              Warmth is rarely seen.
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span variants={reduce ? undefined : line} className="block">
              It is <span className="text-heat-400">felt</span>.
            </motion.span>
          </span>
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
          className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.75] text-bone-100/65 sm:text-base"
        >
          We study the systems beneath the surface — because the best heating is
          the heating you never have to think about.
        </motion.p>

        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.6 }}
          className="mx-auto mt-12 h-px w-24 origin-center bg-heat-500/50"
        />
      </div>
    </section>
  );
}
