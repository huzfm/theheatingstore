'use client';

import gsap from 'gsap';
import { heroState } from '../lib/signals';
import { clamp, damp } from '../lib/ease';

/**
 * Turns the pointer into one damped, normalised signal.
 *
 * Everything that responds to the mouse, the depth parallax on the plate, the
 * warm light shifting toward the cursor, the counter-float on the headline 
 * reads from this single pair of numbers. That is what keeps those responses
 * feeling like one room reacting rather than three independent effects that
 * happen to share an input.
 *
 * The raw pointer is never used directly. An undamped pointer makes parallax
 * feel glued to the cursor, which reads as cheap; the damping is what turns it
 * into something with mass.
 */

/** e-foldings per second. Low enough to have weight, high enough to not lag. */
const LAMBDA = 3.2;

/** Recentre this fast once the pointer leaves the window. */
const LAMBDA_RECENTRE = 1.4;

export function createPointerController({ enabled = true } = {}) {
  if (typeof window === 'undefined' || !enabled) {
    return { destroy() {} };
  }

  // A coarse pointer means a finger. There is no hover position to track, and
  // running a device-orientation variant instead costs battery for an effect
  // nobody looking at a phone in one hand would notice.
  if (window.matchMedia('(pointer: coarse)').matches) {
    return { destroy() {} };
  }

  let targetX = 0;
  let targetY = 0;
  let inside = false;

  const onPointerMove = (event) => {
    // Normalised to -1..1 with the origin at viewport centre, so the response
    // is symmetric regardless of window size.
    targetX = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
    targetY = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
    inside = true;
  };

  const onPointerLeave = () => {
    // Drift back to neutral rather than snapping, a snap would announce that
    // the effect was a script all along.
    targetX = 0;
    targetY = 0;
    inside = false;
  };

  const tick = (_time, deltaMs) => {
    // GSAP hands us milliseconds; the damping maths is in seconds. Clamp the
    // step so a long frame (tab refocus, a slow paint) can't teleport the
    // pointer across the screen.
    const dt = Math.min(deltaMs, 60) / 1000;
    const lambda = inside ? LAMBDA : LAMBDA_RECENTRE;

    heroState.px = damp(heroState.px, targetX, lambda, dt);
    heroState.py = damp(heroState.py, targetY, lambda, dt);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);
  gsap.ticker.add(tick);

  return {
    destroy() {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      gsap.ticker.remove(tick);
      heroState.px = 0;
      heroState.py = 0;
    },
  };
}
