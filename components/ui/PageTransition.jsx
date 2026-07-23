'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Route-change wrapper for the experience pages (/experience, /experience/*).
 *
 * Honest limitation: the App Router unmounts the outgoing route before
 * AnimatePresence can play an exit animation on it — there's no router-level
 * "hold the old tree" hook the way there was in the pages router. Chasing a
 * true cross-fade requires intercepting every navigation and deferring it,
 * which is fragile and breaks the back button.
 *
 * So this is an enter-only transition: the incoming page rises and fades in
 * over a veil that wipes away. Visually it reads as a deliberate transition,
 * and it can't desync from the router.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          // Slow start, fast finish — feels like the page settling into place.
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}

        {/* Veil that lifts off the new page */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200] bg-ink-950"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
