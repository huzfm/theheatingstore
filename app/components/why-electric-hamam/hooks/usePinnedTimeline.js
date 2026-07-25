'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import {
  BEAT_COUNT,
  beatLocalProgress,
  getBeatMotion,
  getFrameMotion,
  getImageDrift,
  getImageReveal,
  activeBeatIndex,
  clamp,
} from '../timeline';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Drives the whole presentation from a single ScrollTrigger on the pinned
 * wrapper. Per-frame writes go straight to the DOM via gsap.set on the refs
 * each chapter registers — deliberately kept out of React state (see
 * useScrollProgress's own rationale) so a scrub tick never triggers a
 * re-render. React state is only touched on the (much rarer) active-chapter
 * crossing, for mount gating and pointer-events.
 *
 * Deliberately NOT present here: any per-child stagger. Every element inside
 * a chapter — heading, body, stats, glass panel — is nested plain DOM under
 * `root` and inherits root's single opacity/blur/transform. Only the image
 * card gets its own motion (`image`/`frame`/`sweep`), and only because the
 * brief asks for it to read as its own physical object with weight, not
 * because it should arrive on a delay — its curve resolves within the same
 * ENTRY window as everything else.
 *
 * @param {import('react').RefObject<HTMLElement>} wrapperRef the pinned section
 * @param {import('react').RefObject<Array<{
 *   root: React.RefObject,
 *   image?: React.RefObject,
 *   frame?: React.RefObject,
 *   sweep?: React.RefObject,
 * }>>} beatsRef stable ref holding one entry per chapter, in BEAT_IDS order.
 * @param {import('react').RefObject<Array<{ref: React.RefObject, speed: number}>>} [ambientRef]
 *   optional background depth layers, parallaxed off the RAW global scroll
 *   progress (not per-chapter) so they drift continuously through the whole
 *   sequence rather than resetting every chapter.
 * @param {boolean} reduced prefers-reduced-motion — skips scrub math entirely
 */
export function usePinnedTimeline(wrapperRef, beatsRef, ambientRef, reduced = false) {
  const [activeIndex, setActiveIndex] = useState(0);
  const lastActive = useRef(0);
  const applyRef = useRef(null);

  applyRef.current = (progress) => {
    const beats = beatsRef.current;

    for (let i = 0; i < BEAT_COUNT; i += 1) {
      const entry = beats[i];
      if (!entry?.root?.current) continue;

      const localT = beatLocalProgress(progress, i);
      const motion = getBeatMotion(localT);

      gsap.set(entry.root.current, {
        opacity: motion.opacity,
        x: motion.x,
        y: motion.y,
        z: motion.z,
        rotationX: motion.rotateX,
        rotationY: motion.rotateY,
        filter: motion.blur > 0.05 ? `blur(${motion.blur.toFixed(2)}px)` : 'blur(0px)',
        scale: motion.scale,
        pointerEvents: motion.visible ? 'auto' : 'none',
      });

      if (entry.image?.current) {
        const drift = getImageDrift(localT);
        gsap.set(entry.image.current, {
          scale: drift.scale,
          x: `${drift.x}%`,
        });
      }

      if (entry.frame?.current) {
        const frameMotion = getFrameMotion(localT);
        gsap.set(entry.frame.current, {
          scale: frameMotion.scale,
          y: frameMotion.y,
          rotationY: frameMotion.rotateY,
        });
      }

      if (entry.frame?.current || entry.sweep?.current) {
        const reveal = getImageReveal(localT);
        if (entry.frame?.current) {
          entry.frame.current.style.clipPath = `inset(${reveal.inset}% round var(--weh-frame-radius, 26px))`;
          // Shadow expansion — the card's drop shadow deepens in lockstep
          // with the mask opening, so the lift into place reads as one
          // physical gesture instead of a shadow bolted on separately.
          entry.frame.current.style.setProperty('--weh-shadow-t', reveal.shadowT.toFixed(3));
        }
        if (entry.sweep?.current) {
          gsap.set(entry.sweep.current, { xPercent: reveal.sweepX, opacity: reveal.sweepOpacity });
        }
        if (entry.image?.current) {
          // Light bloom — the frame opens on a slightly blown-out highlight
          // that settles to true brightness as the reveal finishes.
          entry.image.current.style.filter = `brightness(${reveal.brightness.toFixed(3)})`;
        }
      }

      entry.root.current.style.pointerEvents = motion.visible ? 'auto' : 'none';
    }

    if (ambientRef?.current) {
      for (const layer of ambientRef.current) {
        if (!layer?.ref?.current) continue;
        gsap.set(layer.ref.current, { y: progress * layer.speed });
      }
    }

    const next = activeBeatIndex(progress);
    if (next !== lastActive.current) {
      lastActive.current = next;
      setActiveIndex(next);
    }
  };

  useScrollProgress(wrapperRef, {
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    enabled: !reduced,
    onUpdate: (progress) => applyRef.current(progress),
  });

  // Scrub ScrollTriggers only fire onUpdate on an actual scroll event, so a
  // page that loads already mid-section (scroll restoration, a deep link
  // further down the page) would otherwise sit at each chapter's default CSS
  // state until the visitor scrolls. Compute the real starting progress from
  // layout once and apply it synchronously, before paint.
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const initial = scrollableHeight > 0 ? clamp(-rect.top / scrollableHeight) : 0;
    applyRef.current(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Reduced motion: every chapter fully visible, un-transformed, stacked
  // normally (SceneManager renders them in flow instead of position:fixed).
  useEffect(() => {
    if (!reduced) return undefined;
    const beats = beatsRef.current;
    for (let i = 0; i < BEAT_COUNT; i += 1) {
      const entry = beats[i];
      if (entry?.root?.current) {
        gsap.set(entry.root.current, {
          opacity: 1, x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0,
          filter: 'blur(0px)', scale: 1, pointerEvents: 'auto',
        });
      }
      if (entry?.image?.current) {
        gsap.set(entry.image.current, { scale: 1, x: '0%' });
        entry.image.current.style.filter = 'brightness(1)';
      }
      if (entry?.frame?.current) {
        gsap.set(entry.frame.current, { scale: 1, y: 0, rotationY: 0 });
        entry.frame.current.style.clipPath = 'inset(0% round var(--weh-frame-radius, 26px))';
        entry.frame.current.style.setProperty('--weh-shadow-t', '1');
      }
      if (entry?.sweep?.current) gsap.set(entry.sweep.current, { opacity: 0 });
    }
    if (ambientRef?.current) {
      for (const layer of ambientRef.current) {
        if (layer?.ref?.current) gsap.set(layer.ref.current, { y: 0 });
      }
    }
  }, [reduced, beatsRef, ambientRef]);

  return { activeIndex };
}
