'use client';

import { useEffect, useRef, useState } from 'react';
import { useExperienceStore } from '@/lib/store';

/**
 * Two-part cursor: a solid dot that tracks the pointer 1:1, and a larger
 * ring that lags behind it. On hover over anything interactive the ring
 * expands into a warm glow and the dot shrinks.
 *
 * Position is written straight to the DOM inside a RAF loop rather than
 * through state — a cursor that re-renders React on mousemove is the single
 * easiest way to make a site feel heavy.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  const cursorVariant = useExperienceStore((s) => s.cursorVariant);
  const cursorLabel = useExperienceStore((s) => s.cursorLabel);
  const setCursor = useExperienceStore((s) => s.setCursor);
  const resetCursor = useExperienceStore((s) => s.resetCursor);

  const [enabled, setEnabled] = useState(false);

  // Only mount on devices with a real pointer. Touch devices have no cursor
  // to replace, and a fixed dot would just sit in the corner forever.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    let frame;
    let visible = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const tick = () => {
      // Critically-damped-ish follow: the ring eases toward the dot, giving
      // the cursor a little weight without ever feeling disconnected.
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled]);

  /**
   * Hover detection by event delegation rather than per-element handlers.
   * One listener covers every button, link and [data-cursor] element on the
   * page — including anything mounted later — so no component has to
   * remember to wire the cursor up.
   */
  useEffect(() => {
    if (!enabled) return undefined;

    const SELECTOR =
      'a, button, [role="button"], input, select, textarea, [data-cursor]';

    const onOver = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
      if (!el) return;
      setCursor(el.dataset.cursor || 'hover', el.dataset.cursorLabel || '');
    };

    const onOut = (e) => {
      const el = e.target instanceof Element ? e.target.closest(SELECTOR) : null;
      if (!el) return;
      // Ignore moves between a parent and its own children.
      if (el.contains(e.relatedTarget)) return;
      resetCursor();
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [enabled, setCursor, resetCursor]);

  if (!enabled) return null;

  const isHover = cursorVariant === 'hover' || cursorVariant === 'drag';

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-heat-400 opacity-0 mix-blend-screen transition-[width,height,opacity] duration-300 ease-out"
        style={{
          width: isHover ? 5 : 7,
          height: isHover ? 5 : 7,
          willChange: 'transform',
        }}
      />

      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border opacity-0 transition-[width,height,background-color,border-color,opacity] duration-300 ease-out"
        style={{
          width: isHover ? 54 : 30,
          height: isHover ? 54 : 30,
          borderColor: isHover
            ? 'rgba(255, 138, 61, 0.55)'
            : 'rgba(207, 199, 189, 0.35)',
          backgroundColor: isHover
            ? 'rgba(255, 138, 61, 0.12)'
            : 'transparent',
          boxShadow: isHover
            ? '0 0 34px 6px rgba(255, 138, 61, 0.22)'
            : '0 0 0 0 rgba(255, 138, 61, 0)',
          willChange: 'transform',
        }}
      />

      {cursorLabel ? (
        <div
          ref={labelRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[9999] whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-bone-100"
          style={{ willChange: 'transform' }}
        >
          {cursorLabel}
        </div>
      ) : null}
    </>
  );
}
