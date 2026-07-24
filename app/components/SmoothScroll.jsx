'use client';

import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { useLenisScroll, useScrollTriggerRefresh } from '@/hooks/useLenis';

/**
 * Site-wide smooth scroll. Marries Lenis to GSAP's ticker + ScrollTrigger via
 * the existing useLenisScroll hook (the same integration the /experience route
 * uses), so scroll-driven sections read as buttery instead of hitching on
 * heavy frames.
 *
 * Excluded on /experience, which mounts its own Lenis inside ExperienceShell —
 * running two instances would have them fighting over the scroll position.
 * Disabled under prefers-reduced-motion so it falls back to native scrolling.
 */
const OWN_LENIS_PREFIXES = ['/experience'];

export default function SmoothScroll() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const routeOwnsLenis = OWN_LENIS_PREFIXES.some((p) => pathname?.startsWith(p));

  useLenisScroll({ enabled: !routeOwnsLenis && !reduce });
  useScrollTriggerRefresh([pathname]);

  return null;
}
