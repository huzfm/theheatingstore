'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLenisScroll, useScrollTriggerRefresh } from '@/hooks/useLenis';
import CustomCursor from '@/components/ui/CustomCursor';
import PageTransition from '@/components/ui/PageTransition';

/**
 * Client shell for the /experience route.
 *
 * Responsibilities, all of them scoped to this route:
 *  1. boot Lenis + GSAP ScrollTrigger sync
 *  2. keep ScrollTriggers correct across resizes
 *  3. flag <html> so the dark ground + cursor:none CSS applies here and
 *     nowhere else in the site
 *  4. mount the custom cursor and the route-transition wrapper
 *
 * The <html> class is added on mount and removed on unmount, so navigating
 * back to /about or /blog restores the legacy white theme and the native
 * cursor with no residue.
 */
export default function ExperienceShell({ children }) {
  const reduceMotion = useReducedMotion();

  // Smooth scroll is a motion effect: users who asked for less motion get
  // the browser's native scrolling instead.
  useLenisScroll({ enabled: !reduceMotion });
  useScrollTriggerRefresh();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('experience-active');
    return () => root.classList.remove('experience-active');
  }, []);

  return (
    <div className="exp relative min-h-screen bg-ink-950 text-bone-100 antialiased">
      <CustomCursor />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
