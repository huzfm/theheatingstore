'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { RevealText } from '@/components/ui/RevealText';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Compact header for the pinned showcase. Kept deliberately small so it never
 * competes with (or overlaps) the large per-reason title below it. The words
 * still rise out of a mask on first view (RevealText); the eyebrow fades in
 * ahead of them. Renders static under reduced motion.
 */
export default function SectionHeading({ className = '' }) {
  const reduce = useReducedMotion();

  // return (
  //   <div className={className}>
  //     <motion.div
  //       className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2"
  //       initial={reduce ? false : { opacity: 0, y: 10 }}
  //       whileInView={{ opacity: 1, y: 0 }}
  //       viewport={{ once: true, amount: 0.6 }}
  //       transition={{ duration: 0.7, ease: EASE }}
  //     >
  //       <span className="relative flex h-1.5 w-1.5">
  //         <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-heat-500 opacity-70" />
  //         <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-heat-500" />
  //       </span>
  //       <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-heat-400">
  //         Why Electric Hamam
  //       </span>
  //     </motion.div>

  //     <RevealText
  //       as="h2"
  //       className="weh-display weh-heading mt-4 font-bold leading-tight tracking-tight text-white"
  //     >
  //       7 Reasons to Install
  //     </RevealText>
  //     <RevealText
  //       as="span"
  //       delay={0.12}
  //       className="weh-display weh-heading block font-bold leading-tight tracking-tight text-heat-500"
  //     >
  //       Electric Hamam This Winter
  //     </RevealText>
  //   </div>
  // );
  return (
  <div className={`flex flex-col items-center text-center ${className}`}>
    <motion.div
      className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 "
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-heat-500 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-heat-500" />
      </span>

      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-heat-400 ">
        Why Electric Hamam
      </span>
    </motion.div>

   <RevealText
  as="h2"
  className="mt-4 text-2xl md:text-3xl xl:text-7xl font-extrabold leading-[0.9] tracking-[-0.04em] text-white text-center"
>
  7 Reasons to Install
</RevealText>

<RevealText
  as="span"
  delay={0.12}
  className="block text-2xl md:text-3xl xl:text-2xl font-extrabold leading-[0.9] tracking-[-0.04em] text-heat-500 text-center mb-10"
>
  Electric Hamam This Winter
</RevealText>
  </div>
);
}
