'use client';

import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/* The card slides in HORIZONTALLY from the side you're scrolling toward. The
   `custom` value is the scroll direction (+1 down, -1 up), passed down from the
   showcase; both the container and its items read it so the whole lockup and
   its lines travel the same way. On the way down the card enters from the right
   and the outgoing card leaves to the left; scrolling back up mirrors it. */
const container = {
  hidden: (dir) => ({ opacity: 0, x: dir >= 0 ? 68 : -68 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.62,
      ease: EASE,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir >= 0 ? -52 : 52,
    transition: { duration: 0.42, ease: EASE },
  }),
};

const item = {
  hidden: (dir) => ({ opacity: 0, x: dir >= 0 ? 22 : -22 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: EASE },
  },
};

/**
 * The text side of a single reason: a giant faint numeral behind bold copy,
 * an accent icon badge, title, rule and body. Reused for all seven, and in a
 * static (`plain`) form for the reduced-motion fallback list.
 */
export default function ReasonCard({
  reason,
  plain = false,
  className = '',
  direction = 1,
}) {
  const { num, title, desc, stat, statLabel, accent, Icon } = reason;

  if (plain) {
    return (
      <div className="relative border-t border-white/10 pt-6">
        <span className="text-xs font-semibold tracking-[0.2em] text-heat-500">
          {num}
        </span>
        <div className="mt-4 flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${accent}1e`, border: `1px solid ${accent}40` }}
          >
            <Icon size={20} color={accent} />
          </span>
          <h3 className="weh-display text-xl text-white">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-bone-500">{desc}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      variants={container}
      custom={direction}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Meta row, small icon chip + position counter. Kept compact so it
          reads as a label, never competing with the title below. */}
      <motion.div variants={item} className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: `${accent}1c`,
            border: `1px solid ${accent}40`,
            boxShadow: `0 0 22px ${accent}2b`,
          }}
        >
          <Icon size={20} color={accent} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-bone-500">
          Reason {num}
          <span className="text-bone-500/45"> / 07</span>
        </span>
      </motion.div>

      {/* Index + title lockup, the number is the single dominant numeral for
          the reason, set beside the title as an editorial anchor (no floating
          watermark, so it can never overlap the copy). */}
      <motion.div variants={item} className="weh-step-1 mt-7 flex items-center gap-5 sm:gap-6">
        <span
          aria-hidden="true"
          className="weh-display weh-index shrink-0 select-none font-semibold leading-none"
          style={{ color: accent, opacity: 0.95 }}
        >
          {num}
        </span>
        <div className="relative self-stretch pl-5 sm:pl-6">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[15%] bottom-[15%] w-px bg-white/12"
          />
          <div className="flex h-full flex-col justify-center">
            <h3 className="weh-display weh-title max-w-[13ch] font-bold leading-[1.03] tracking-tight text-white">
              {title}
            </h3>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="weh-step-2 mt-7 h-px w-16 rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <motion.p
        variants={item}
        className="weh-step-3 mt-6 max-w-[42ch] text-[15px] leading-relaxed text-bone-300/85 sm:text-base"
      >
        {desc}
      </motion.p>

      <motion.div
        variants={item}
        className="weh-step-4 mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5"
      >
        <span
          className="weh-display text-lg font-bold leading-none"
          style={{ color: accent }}
        >
          {stat}
        </span>
        <span className="h-3.5 w-px bg-white/15" />
        <span className="text-[11px] uppercase tracking-[0.16em] text-bone-500">
          {statLabel}
        </span>
      </motion.div>
    </motion.div>
  );
}
