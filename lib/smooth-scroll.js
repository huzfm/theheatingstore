'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis as getGlobalLenis } from '@/hooks/useLenis';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Spec §1, Global smooth scroll (Lenis + GSAP ticker + ScrollTrigger).
 *
 * IMPORTANT context for maintainers: this app ALREADY boots a single global
 * Lenis via `app/components/SmoothScroll.jsx` → `hooks/useLenis.js`, mounted in
 * the root layout. Two Lenis instances on the same document fight over scroll
 * position and desync every ScrollTrigger, the precise failure `useLenis.js`
 * was written to avoid.
 *
 * So this module is deliberately SINGLETON-SAFE: `initSmoothScroll()` reuses an
 * already-running instance (the global one, or one it created) instead of
 * spawning a rival. It exists to satisfy the self-contained "create
 * lib/smooth-scroll.js" deliverable and to be a drop-in provider for any tree
 * that does NOT already have the global one, on this site it resolves to a
 * safe no-op that hands back the existing instance.
 *
 * Config follows the spec: lerp 0.1, smoothWheel on, syncTouch off (don't
 * hijack mobile momentum, this is a lead-gen site and a large share of Indian
 * mobile traffic is mid-range Android where native scroll simply feels better).
 */

let instance = null;
// Only teardown state for an instance THIS module created, we must never
// destroy the global instance owned by useLenis.js.
let owned = null;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Native momentum scroll beats JS smoothing on cheap touch devices, so we skip
 * Lenis entirely on small touch screens (< 768px + coarse pointer).
 */
function isSmallTouch() {
  if (typeof window === 'undefined') return false;
  const coarse =
    window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  return coarse && window.innerWidth < 768;
}

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  // Reuse whatever is already smoothing the document (global provider, or a
  // prior call to this init). Never stack a second instance.
  const existing = instance || getGlobalLenis?.();
  if (existing) {
    instance = existing;
    return existing;
  }

  // Fall back to native scrolling where JS smoothing hurts more than helps.
  if (prefersReducedMotion() || isSmallTouch()) return null;

  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.refresh();

  instance = lenis;
  owned = { onScroll, raf };
  return lenis;
}

export function destroySmoothScroll() {
  // Tear down only if WE created the instance; leave a borrowed global alone.
  if (instance && owned) {
    instance.off('scroll', owned.onScroll);
    gsap.ticker.remove(owned.raf);
    gsap.ticker.lagSmoothing(500, 33);
    instance.destroy();
  }
  instance = null;
  owned = null;
}

export function getLenis() {
  return instance || getGlobalLenis?.() || null;
}

/**
 * Smooth-scroll to a target (selector, element, or numeric offset), falling
 * back to native behaviour when no instance is mounted.
 */
export function scrollToTarget(target, options = {}) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.4, ...options });
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
 * Client provider that mounts/unmounts Lenis cleanly across App Router client
 * navigation. Safe to nest under the global provider (it reuses the running
 * instance and won't tear a borrowed one down on unmount).
 */
export function SmoothScrollProvider({ children = null }) {
  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  return children;
}
