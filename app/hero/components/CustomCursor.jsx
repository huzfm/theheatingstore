'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { damp } from '../lib/ease';

/**
 * A restrained custom cursor: a small ring trailing the real pointer with a
 * dot at its centre, that closes around interactive targets rather than
 * following them.
 *
 * This site previously argued against a custom cursor at all (see
 * `useMagnetic`) on the grounds that it's the most worn Awwwards cliché and
 * costs conversions on a lead-gen page. That argument holds against the
 * *common* version — a large shape hard-glued to the pointer, obscuring it.
 * What's built here is the opposite of that: it never replaces the system
 * pointer, stays small, and only reacts near the handful of targets tagged
 * `data-cursor-target` (the CTAs) rather than editorialising the whole page.
 *
 * Damped on the GSAP ticker rather than CSS-transitioned, matching every
 * other continuous value in this hero — a transition on top of a per-frame
 * target produces two lags fighting each other.
 */
export default function CustomCursor({ active = true }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let scale = 0;
    let targetScale = 0;
    let hovering = false;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      targetScale = 1;
    };

    const onLeaveWindow = () => {
      targetScale = 0;
    };

    const onOver = (event) => {
      hovering = Boolean(event.target.closest('[data-cursor-target]'));
    };

    const tick = (_time, deltaMs) => {
      const dt = Math.min(deltaMs, 60) / 1000;

      x = damp(x, targetX, 16, dt);
      y = damp(y, targetY, 16, dt);
      scale = damp(scale, targetScale, 10, dt);

      dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale * (hovering ? 1.9 : 1)})`;
      ring.style.opacity = hovering ? '0.9' : '0.45';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeaveWindow);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseleave', onLeaveWindow);
      gsap.ticker.remove(tick);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="hero-cursor" aria-hidden="true">
      <span ref={ringRef} className="hero-cursor__ring" />
      <span ref={dotRef} className="hero-cursor__dot" />
    </div>
  );
}
