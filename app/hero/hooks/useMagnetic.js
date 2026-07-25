'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { clamp, damp, smoothstep } from '../lib/ease';

/**
 * Magnetic attraction for the hero's CTAs.
 *
 * The site deliberately has no custom cursor — it is the most worn Awwwards
 * cliché and on a lead-generation page it costs conversions. Magnetism gets the
 * same "the interface is paying attention" read while leaving the visitor's
 * actual pointer alone, and it puts the response on the thing they are about to
 * click rather than on a floating dot.
 *
 * Three details do the work:
 *
 *   · The pull is damped on the ticker, not transitioned in CSS. A CSS
 *     transition on top of a per-frame target produces two lags fighting.
 *   · The label moves at roughly half the button's offset (handled in CSS), so
 *     there is parallax *inside* the button. Without it, magnetism feels like
 *     the button is stuck to the cursor; with it, it feels like mass.
 *   · Proximity is continuous rather than a hover boundary, so the thermal
 *     field warms as a hand approaches instead of snapping on at the edge.
 */

/** Attraction radius in px, measured from the button's centre. */
const RADIUS = 90;
/** Hard ceiling on displacement. Past ~6px this stops reading as attraction. */
const MAX_PULL = 6;
const STRENGTH = 0.25;
const LAMBDA = 9;

export function useMagnetic(ref, { enabled = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    let targetX = 0;
    let targetY = 0;
    let targetProx = 0;
    let x = 0;
    let y = 0;
    let prox = 0;

    let rect = null;
    let rectDirty = true;
    let pointer = null;

    const invalidate = () => {
      rectDirty = true;
    };

    const onPointerMove = (event) => {
      pointer = event;
    };

    const tick = (_time, deltaMs) => {
      const dt = Math.min(deltaMs, 60) / 1000;

      if (pointer) {
        // One layout read per frame at most, and only while the pointer is
        // actually moving. Measuring inside the pointermove handler instead
        // would force a synchronous reflow on every event.
        if (rectDirty || !rect) {
          rect = el.getBoundingClientRect();
          rectDirty = false;
        }

        const dx = pointer.clientX - (rect.left + rect.width / 2);
        const dy = pointer.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy);

        // Full strength inside half the radius, easing to nothing at its edge,
        // so there is no discontinuity as the pointer crosses the boundary.
        const falloff = 1 - smoothstep(RADIUS * 0.5, RADIUS, dist);
        const pull = Math.min(dist * STRENGTH * falloff, MAX_PULL);
        const scale = dist > 0 ? pull / dist : 0;

        targetX = dx * scale;
        targetY = dy * scale;
        targetProx = clamp(1 - smoothstep(0, RADIUS, dist));

        pointer = null;
      }

      x = damp(x, targetX, LAMBDA, dt);
      y = damp(y, targetY, LAMBDA, dt);
      prox = damp(prox, targetProx, LAMBDA * 0.7, dt);

      el.style.setProperty('--mx', `${x.toFixed(2)}px`);
      el.style.setProperty('--my', `${y.toFixed(2)}px`);
      el.style.setProperty('--prox', prox.toFixed(3));
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      targetProx = 0;
      pointer = null;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    // The hero moves under the pointer while scrolling, so a cached rect goes
    // stale on scroll just as surely as on resize.
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
      gsap.ticker.remove(tick);
    };
  }, [ref, enabled]);
}
