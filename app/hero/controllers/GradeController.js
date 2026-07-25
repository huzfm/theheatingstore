'use client';

import gsap from 'gsap';
import { heroState } from '../lib/signals';

/**
 * The room's idle life — everything that keeps happening once the system has
 * come on and the visitor is just sitting there reading.
 *
 * There are three signals, and the reason this is one controller rather than
 * three is that they have to stay phase-related. A still photograph reads as a
 * live plate when the firelight and the reflection it throws across the stone
 * move together, and reads as a broken loop the moment they drift apart.
 *
 * All of it is scaled by `warmth`, so nothing flickers during the cold open —
 * an unlit fire has nothing to flicker with — and all of it stops dead when the
 * hero leaves the viewport.
 */

const TAU = Math.PI * 2;

/**
 * Firelight. Three incommensurate sines rather than one: a single sine reads as
 * a pulse, and any pulse the eye can predict stops looking like combustion.
 * Weighted toward the low frequency so it breathes rather than strobes.
 */
function firelightAt(t) {
  return (
    0.62 * Math.sin(t * 6.1) +
    0.26 * Math.sin(t * 11.3 + 1.7) +
    0.12 * Math.sin(t * 19.7 + 4.1)
  );
}

/**
 * Coil shimmer. Deliberately slower than the fire and phase-offset from it: the
 * two heat sources in this room are different objects and should never appear
 * to be driven by the same signal.
 */
function coilAt(t) {
  return 0.6 * Math.sin(t * 1.3 + 0.4) + 0.4 * Math.sin(t * 2.7 + 2.1);
}

const FIRE_AMPLITUDE = 0.12;
const BLOOM_BASE = 0.07;
const BLOOM_AMPLITUDE = 0.045;

/** Drift periods, in seconds. Coprime so the pair never visibly repeats. */
const DRIFT_X_PERIOD = 28;
const DRIFT_Y_PERIOD = 37;
const DRIFT_X_AMPLITUDE = 8;
const DRIFT_Y_AMPLITUDE = 5;

export function createGradeController({ enabled = true } = {}) {
  if (typeof window === 'undefined' || !enabled) {
    return { destroy() {}, setActive() {} };
  }

  let elapsed = 0;
  let active = true;

  const tick = (_time, deltaMs) => {
    if (!active) return;

    const dt = Math.min(deltaMs, 60) / 1000;
    elapsed += dt;

    const { warmth, exit } = heroState;

    // Idle life fades out as the hero exits — during the push into the floor
    // the coil bloom is being driven by the scroll instead, and leaving the
    // shimmer running underneath it would fight that ramp.
    const life = warmth * (1 - exit);

    heroState.fire = 1 + firelightAt(elapsed) * FIRE_AMPLITUDE * life;

    // Idle shimmer only. The exit blow-out is ScrollController's `exitBloom`,
    // and CSS sums the two.
    heroState.bloom = (BLOOM_BASE + coilAt(elapsed) * BLOOM_AMPLITUDE) * life;

    heroState.driftX =
      Math.sin((elapsed * TAU) / DRIFT_X_PERIOD) * DRIFT_X_AMPLITUDE * life;
    heroState.driftY =
      Math.sin((elapsed * TAU) / DRIFT_Y_PERIOD + 1.1) * DRIFT_Y_AMPLITUDE * life;
  };

  gsap.ticker.add(tick);

  return {
    /**
     * Driven by an IntersectionObserver on the hero. Once the visitor has
     * scrolled past, these sines are running for nobody — and on a laptop that
     * is real battery.
     */
    setActive(next) {
      active = next;
    },
    destroy() {
      gsap.ticker.remove(tick);
    },
  };
}
