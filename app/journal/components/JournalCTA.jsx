'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { INDEX_ARTICLES } from '../data';

const EASE = [0.16, 1, 0.3, 1];
const BG_IMAGE = INDEX_ARTICLES.find((a) => a.slot === 'landscape')?.img;

function MagneticPrimary({ href, children, reduce }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

  function onMove(e) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { x: sx, y: sy }}
      className="inline-flex h-[54px] items-center rounded-full bg-bone-100 px-9 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-950 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.65)] transition-colors duration-300 hover:bg-heat-300"
    >
      {children}
    </motion.a>
  );
}

/**
 * Closing invitation. Dark, image-grounded, restrained — two calls to
 * action rather than a wall of copy.
 */
export default function JournalCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-ink-950 py-28 text-bone-100 sm:py-32">
      {BG_IMAGE && (
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          quality={70}
          className="object-cover object-center opacity-40"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(6,5,4,0.88) 0%, rgba(6,5,4,0.75) 50%, rgba(6,5,4,0.94) 100%)' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        animate={reduce ? undefined : { opacity: [0.25, 0.42, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(45% 50% at 50% 100%, rgba(255,138,61,0.18), transparent 70%)' }}
      />
      <div aria-hidden className="jr-grain pointer-events-none absolute inset-0 opacity-[0.05]" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 text-center sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="jr-eyebrow text-heat-300"
        >
          The Heating Store
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          className="jr-display mt-6 text-[clamp(2.25rem,5.5vw,4.25rem)] normal-case text-bone-100"
        >
          Planning a warmer space?
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
          className="mt-5 max-w-md text-[15px] leading-relaxed text-bone-100/70 sm:text-base"
        >
          Every home, hotel and villa in our journal started the same way — a
          few measurements and a conversation about how the space is used.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5"
        >
          <MagneticPrimary href="/SpaceVerification" reduce={reduce}>
            Verify My Space
          </MagneticPrimary>
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 text-[12.5px] uppercase tracking-[0.16em] text-bone-300 transition-colors duration-300 hover:text-bone-100"
          >
            Talk to an Expert
            <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
