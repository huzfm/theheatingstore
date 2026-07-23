'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Module-level handle so non-React callers (anchor links, buttons anywhere in
 * the tree) can drive the scroll without prop-drilling the instance.
 */
let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

/**
 * Smooth-scroll to a target: a CSS selector, an element, or a numeric offset.
 * Falls back to native scrolling if Lenis isn't mounted (e.g. reduced motion).
 */
export function scrollToTarget(target, options = {}) {
  const opts = { offset: 0, duration: 1.4, ...options };

  if (lenisInstance) {
    lenisInstance.scrollTo(target, opts);
    return;
  }

  const el =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (el instanceof Element) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}

/**
 * Boots Lenis and marries it to GSAP's ticker + ScrollTrigger.
 *
 * The desync gotcha: Lenis animates scroll on its own RAF loop while
 * ScrollTrigger reads scroll position on GSAP's ticker. Two loops, two
 * clocks — pinned sections drift behind the content by a frame or more.
 * The fix is to make GSAP the single clock (drive `lenis.raf` from
 * `gsap.ticker`) and make Lenis the single source of scroll truth
 * (`ScrollTrigger.update` fires on Lenis's own scroll event).
 *
 * `lagSmoothing(0)` is required: GSAP otherwise silently swallows large
 * frame gaps, which makes Lenis jump on tab refocus or a slow frame.
 *
 * @param {{ enabled?: boolean }} options
 */
export function useLenisScroll({ enabled = true } = {}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out — long tail, no rubbery overshoot at rest.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native inertial scrolling on touch already feels right; smoothing it
      // twice fights the OS and feels laggy on mid-range phones.
      syncTouch: false,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger measures against the window here (Lenis scrolls the real
    // document rather than a proxy element), so no scrollerProxy is needed —
    // but it must re-measure once Lenis has settled the initial layout.
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance = null;
    };
  }, [enabled]);

  return lenisRef;
}

/**
 * Recalculates every ScrollTrigger on resize / orientation change.
 *
 * Pinned sections cache their start/end pixel values at creation time, so a
 * viewport change leaves them pinning over the wrong range until refreshed.
 * Debounced because resize fires continuously during a drag, and a refresh
 * mid-drag is expensive.
 */
export function useScrollTriggerRefresh(deps = []) {
  useEffect(() => {
    let timeout;

    const refresh = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => ScrollTrigger.refresh(), 180);
    };

    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);

    // Catches layout shifts that never fire a window resize: late-loading
    // fonts, images settling, a 3D canvas swapping in after hydration.
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', refresh);
      window.removeEventListener('orientationchange', refresh);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
