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
  getCopyPanelMotion,
  getSceneIndexMotion,
  getSceneHeadingMotion,
  getSceneBodyMotion,
  getSceneRowstatMotion,
  getTitleMotion,
  getTitleEyebrowMotion,
  getTitleHeadingMotion,
  getQuoteMotion,
  getQuoteMarkMotion,
  getQuoteTextMotion,
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
 * Per-child stagger is deliberately rare here: for most chapters, every
 * element inside is nested plain DOM under `root` and inherits root's
 * single opacity/blur/transform. Four chapter types get more than that,
 * each for a specific reason: the title card's `eyebrow`/`heading` stagger
 * on their own emberRise curves because the cold open is the one place a
 * held-breath pause between two lines of copy is the entire point of the
 * beat; benefit scenes get the full treatment — `image`/`frame`/`sweep`
 * for the photograph's own physical weight, `copy` for a faint independent
 * depth-offset so the copy panel doesn't move as one rigid unit with the
 * image, and `copyIndex`/`copyCounter`/`copyHeading`/`copyBody`/
 * `copyRowstat` for their own decelerating stagger (see the getScene*Motion
 * family in timeline.js); the quote chapter gets `mark`/`text` for a
 * two-layer reveal where the mark arrives first and quiet, like a stage
 * direction, before the quote itself lands. CTA still just inherits root's
 * single curve.
 *
 * @param {import('react').RefObject<HTMLElement>} wrapperRef the pinned section
 * @param {import('react').RefObject<Array<{
 *   root: React.RefObject,
 *   image?: React.RefObject,
 *   frame?: React.RefObject,
 *   sweep?: React.RefObject,
 *   copy?: React.RefObject,
 *   copyIndex?: React.RefObject,
 *   copyCounter?: React.RefObject,
 *   copyHeading?: React.RefObject,
 *   copyBody?: React.RefObject,
 *   copyRowstat?: React.RefObject,
 *   eyebrow?: React.RefObject,
 *   heading?: React.RefObject,
 *   mark?: React.RefObject,
 *   text?: React.RefObject,
 *   mirrored?: boolean,
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

      if (entry.eyebrow || entry.heading) {
        // Title chapter — its own iris/unveil signature (getTitleMotion),
        // not the shared push-in-from-depth camera every other beat uses.
        const titleMotion = getTitleMotion(localT);
        gsap.set(entry.root.current, {
          opacity: titleMotion.opacity,
          scale: titleMotion.scale,
          filter: titleMotion.blur > 0.05 ? `blur(${titleMotion.blur.toFixed(2)}px)` : 'blur(0px)',
          pointerEvents: titleMotion.visible ? 'auto' : 'none',
        });
        entry.root.current.style.clipPath = `inset(${titleMotion.clipInset.toFixed(2)}% 0%)`;

        if (entry.eyebrow?.current) {
          const eyebrowMotion = getTitleEyebrowMotion(localT);
          gsap.set(entry.eyebrow.current, { opacity: eyebrowMotion.opacity, y: eyebrowMotion.y });
        }
        if (entry.heading?.current) {
          const headingMotion = getTitleHeadingMotion(localT);
          gsap.set(entry.heading.current, { opacity: headingMotion.opacity, y: headingMotion.y });
        }

        entry.root.current.style.pointerEvents = titleMotion.visible ? 'auto' : 'none';
        continue;
      }

      if (entry.mark) {
        // Quote chapter — its own slower, more spacious pacing
        // (getQuoteMotion) plus a two-layer mark→text reveal, not the
        // shared push-in-from-depth camera every other beat uses.
        const quoteMotion = getQuoteMotion(localT);
        gsap.set(entry.root.current, {
          opacity: quoteMotion.opacity,
          scale: quoteMotion.scale,
          filter: quoteMotion.blur > 0.05 ? `blur(${quoteMotion.blur.toFixed(2)}px)` : 'blur(0px)',
          pointerEvents: quoteMotion.visible ? 'auto' : 'none',
        });

        if (entry.mark?.current) {
          const markMotion = getQuoteMarkMotion(localT);
          gsap.set(entry.mark.current, { opacity: markMotion.opacity, y: markMotion.y });
        }
        if (entry.text?.current) {
          const textMotion = getQuoteTextMotion(localT);
          gsap.set(entry.text.current, { opacity: textMotion.opacity, y: textMotion.y });
        }

        entry.root.current.style.pointerEvents = quoteMotion.visible ? 'auto' : 'none';
        continue;
      }

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

      const mirrored = !!entry.mirrored;

      if (entry.image?.current) {
        const drift = getImageDrift(localT, mirrored);
        gsap.set(entry.image.current, {
          scale: drift.scale,
          x: `${drift.x}%`,
        });
      }

      if (entry.frame?.current) {
        const frameMotion = getFrameMotion(localT, mirrored);
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

      if (entry.copy?.current) {
        // Faint independent depth-offset — see getCopyPanelMotion — so the
        // copy panel doesn't move as one rigid unit with the image.
        const copyMotion = getCopyPanelMotion(localT, mirrored);
        gsap.set(entry.copy.current, { x: copyMotion.x, y: copyMotion.y });
      }
      if (entry.copyIndex?.current) {
        const m = getSceneIndexMotion(localT);
        gsap.set(entry.copyIndex.current, { opacity: m.opacity, y: m.y });
      }
      if (entry.copyCounter?.current) {
        // Shares the index's exact timing — both are top-of-card framing.
        const m = getSceneIndexMotion(localT);
        gsap.set(entry.copyCounter.current, { opacity: m.opacity, y: m.y });
      }
      if (entry.copyHeading?.current) {
        const m = getSceneHeadingMotion(localT);
        gsap.set(entry.copyHeading.current, { opacity: m.opacity, y: m.y });
      }
      if (entry.copyBody?.current) {
        const m = getSceneBodyMotion(localT);
        gsap.set(entry.copyBody.current, { opacity: m.opacity, y: m.y });
      }
      if (entry.copyRowstat?.current) {
        const m = getSceneRowstatMotion(localT);
        gsap.set(entry.copyRowstat.current, { opacity: m.opacity, y: m.y });
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
        if (entry.eyebrow || entry.heading) {
          entry.root.current.style.clipPath = 'inset(0% 0%)';
        }
      }
      if (entry?.eyebrow?.current) gsap.set(entry.eyebrow.current, { opacity: 1, y: 0 });
      if (entry?.heading?.current) gsap.set(entry.heading.current, { opacity: 1, y: 0 });
      if (entry?.mark?.current) gsap.set(entry.mark.current, { opacity: 1, y: 0 });
      if (entry?.text?.current) gsap.set(entry.text.current, { opacity: 1, y: 0 });
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
      if (entry?.copy?.current) gsap.set(entry.copy.current, { x: 0, y: 0 });
      if (entry?.copyIndex?.current) gsap.set(entry.copyIndex.current, { opacity: 1, y: 0 });
      if (entry?.copyCounter?.current) gsap.set(entry.copyCounter.current, { opacity: 1, y: 0 });
      if (entry?.copyHeading?.current) gsap.set(entry.copyHeading.current, { opacity: 1, y: 0 });
      if (entry?.copyBody?.current) gsap.set(entry.copyBody.current, { opacity: 1, y: 0 });
      if (entry?.copyRowstat?.current) gsap.set(entry.copyRowstat.current, { opacity: 1, y: 0 });
    }
    if (ambientRef?.current) {
      for (const layer of ambientRef.current) {
        if (layer?.ref?.current) gsap.set(layer.ref.current, { y: 0 });
      }
    }
  }, [reduced, beatsRef, ambientRef]);

  return { activeIndex };
}
