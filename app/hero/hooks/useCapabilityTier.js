'use client';

import { useEffect, useLayoutEffect, useState } from 'react';

/**
 * Decides how much hero the visitor's device should be asked to render.
 *
 *   Tier 0, still. The room sits at its final warm state, fully legible, with
 *            no ignition, no idle life and no parallax. This is what
 *            `prefers-reduced-motion` gets: a photograph, not a degraded
 *            animation.
 *   Tier 1, the full CSS + GSAP experience. Grade, ignition, thermal type,
 *            depth parallax, magnetic CTAs, the scroll match-cut. This is the
 *            baseline everyone else receives and it is complete on its own.
 *   Tier 2, Tier 1 plus the WebGL layer: heat-haze refraction, coil bloom,
 *            embers and film grain. Desktop, capable GPU, unmetered only.
 *
 * The tiering lives here as one decision rather than as scattered `if`s so
 * there is a single answer to "what is this visitor actually getting", and so
 * the thresholds can be tuned in one place against real analytics.
 */

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * WebGL2 support has to be probed rather than assumed, it is absent on older
 * iOS, on some locked-down enterprise browsers, and whenever hardware
 * acceleration has been switched off, in which case a canvas would fall back to
 * software rasterising a fullscreen shader. That is far worse than no shader.
 */
function hasWebGL2() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    // Release the context immediately; we only wanted the answer.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function detectTier() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { tier: 0, reduced: true };
  }

  // Data Saver is an explicit request to stop spending the visitor's money.
  // A large share of this site's traffic is metered mobile, so it is honoured
  // even on hardware that could handle the shader.
  const conn =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn?.saveData) return { tier: 1, reduced: false };
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) {
    return { tier: 1, reduced: false };
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 1024;
  // Both of these are absent on Safari, so an optimistic default keeps Macs
  // from being demoted by a missing API rather than by a real limitation.
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = navigator.deviceMemory ?? 8;

  if (coarsePointer || narrow || cores < 4 || memory < 4) {
    return { tier: 1, reduced: false };
  }

  return { tier: hasWebGL2() ? 2 : 1, reduced: false };
}

/**
 * Unlike the previous photographic hero, the 3D scene is the hero's primary
 * content on tier 2 rather than a decorative enhancement layered over an
 * already-complete experience, so this waits only long enough to let the
 * ignition sequence's first frames paint uncontested, not for full idle. The
 * timeout is the safety net for pages that never go idle.
 */
const WEBGL_DELAY_MS = 400;

export function useCapabilityTier() {
  /**
   * Deliberately identical on the server and on the first client render.
   * Nothing in the hero's markup branches on `tier` or `reduced`, they are
   * applied imperatively as a data attribute, and `webgl` starts false
   * everywhere, so there is no hydration mismatch to reconcile.
   */
  const [state, setState] = useState({
    tier: 1,
    reduced: false,
    resolved: false,
    webgl: false,
  });

  useIsomorphicLayoutEffect(() => {
    const detected = detectTier();
    setState((prev) => ({ ...prev, ...detected, resolved: true }));

    // A visitor can turn reduced-motion on mid-session; respect it live rather
    // than stranding them in an animation they just asked to stop.
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => {
      setState((prev) =>
        event.matches
          ? { ...prev, tier: 0, reduced: true, webgl: false }
          : { ...prev, ...detectTier() },
      );
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (state.tier < 2 || state.webgl) return undefined;

    let idleHandle;
    const promote = () => setState((prev) => ({ ...prev, webgl: true }));

    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(promote, { timeout: 1200 });
      } else {
        promote();
      }
    }, WEBGL_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (idleHandle && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      }
    };
  }, [state.tier, state.webgl]);

  return state;
}
