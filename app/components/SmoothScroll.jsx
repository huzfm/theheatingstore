'use client';

import { useEffect, useState } from 'react';
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
 *
 * Also disabled on small touch screens (< 768px + coarse pointer): native
 * inertial scrolling already feels right there, and smoothing it twice fights
 * the OS and reads as laggy on mid-range phones — a large share of the traffic
 * on this lead-gen site.
 */
const OWN_LENIS_PREFIXES = ['/experience'];

function useIsSmallTouch() {
  // Starts false so SSR and the first client render agree; flips after mount if
  // the device is actually a small touch screen (Lenis then tears down cleanly
  // via the hook's `enabled` change).
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px) and (pointer: coarse)');
    const update = () => setSmall(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return small;
}

export default function SmoothScroll() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const smallTouch = useIsSmallTouch();
  const routeOwnsLenis = OWN_LENIS_PREFIXES.some((p) => pathname?.startsWith(p));

  useLenisScroll({ enabled: !routeOwnsLenis && !reduce && !smallTouch });
  useScrollTriggerRefresh([pathname]);

  return null;
}
