'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Tracks a section's scroll progress (0 → 1) in a ref, deliberately WITHOUT
 * calling setState.
 *
 * Scroll fires on every frame. Routing that through React state would
 * re-render the subscriber — and in an R3F tree, its whole subtree — 60+
 * times a second. Instead the value lands in a plain ref that render-loop
 * consumers (useFrame) read imperatively, so the scene animates without React
 * re-rendering at all.
 *
 * @param {import('react').RefObject<HTMLElement>} targetRef section to track
 * @param {object} options
 * @param {string} [options.start='top top']
 * @param {string} [options.end='bottom bottom']
 * @param {boolean} [options.pin=false]
 * @param {number|boolean} [options.scrub=true]
 * @param {(progress: number, self: object) => void} [options.onUpdate]
 * @param {boolean} [options.enabled=true]
 * @returns {{ progress: { current: number }, trigger: { current: object } }}
 */
export function useScrollProgress(targetRef, options = {}) {
  const {
    start = 'top top',
    end = 'bottom bottom',
    pin = false,
    pinSpacing = true,
    scrub = true,
    anticipatePin = 1,
    onUpdate,
    enabled = true,
  } = options;

  const progress = useRef(0);
  const trigger = useRef(null);
  // Held in a ref so a caller passing an inline arrow doesn't tear down and
  // rebuild the ScrollTrigger on every render.
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return undefined;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      pin,
      pinSpacing,
      scrub,
      anticipatePin,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        onUpdateRef.current?.(self.progress, self);
      },
      onRefresh: (self) => {
        progress.current = self.progress;
      },
    });

    trigger.current = st;

    return () => {
      st.kill();
      trigger.current = null;
    };
  }, [targetRef, start, end, pin, pinSpacing, scrub, anticipatePin, enabled]);

  return { progress, trigger };
}

/**
 * Same tracking, but surfaced as React state for UI that genuinely needs to
 * re-render (a progress bar, a stage counter).
 *
 * Updates are quantised to `steps` buckets so a full scroll costs ~`steps`
 * renders instead of several hundred. Use the ref version for anything
 * inside a canvas.
 */
export function useScrollProgressState(targetRef, options = {}) {
  const { steps = 100, ...rest } = options;
  const [value, setValue] = useState(0);
  const last = useRef(-1);

  useScrollProgress(targetRef, {
    ...rest,
    onUpdate: (p) => {
      const bucket = Math.round(p * steps);
      if (bucket !== last.current) {
        last.current = bucket;
        setValue(bucket / steps);
      }
    },
  });

  return value;
}

/**
 * Whole-page scroll progress (0 → 1), quantised the same way.
 * Drives global chrome such as a reading-progress rail.
 */
export function usePageScrollProgress(steps = 200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const last = { current: -1 };

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const bucket = Math.round(self.progress * steps);
        if (bucket !== last.current) {
          last.current = bucket;
          setValue(bucket / steps);
        }
      },
    });

    return () => st.kill();
  }, [steps]);

  return value;
}

/**
 * Lightweight parallax: drifts an element on Y as it crosses the viewport.
 * Used on non-3D sections so depth stays consistent site-wide.
 *
 * @param {number} distance px of travel across the full crossing (+ = down)
 */
export function useParallax(ref, distance = 80, options = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;

    const tween = gsap.fromTo(
      el,
      { y: -distance / 2 },
      {
        y: distance / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [ref, distance, enabled]);
}
