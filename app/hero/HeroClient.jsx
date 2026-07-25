'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import './hero.css';
import HeroPoster from './components/HeroPoster';
import HeroAtmosphere from './components/HeroAtmosphere';
import HeroContent from './components/HeroContent';
import ScrollCue from './components/ScrollCue';
import CustomCursor from './components/CustomCursor';
import LeadPopup from '../components/LeadPopup.jsx';

import { mountHeroSignals, resetHeroState } from './lib/signals';
import { useCapabilityTier } from './hooks/useCapabilityTier';
import { createIgnitionTimeline } from './controllers/IgnitionTimeline';
import { createPointerController } from './controllers/PointerController';
import { createGradeController } from './controllers/GradeController';
import { createScrollController } from './controllers/ScrollController';

/**
 * FIRST HEAT — composition root.
 *
 * This file wires controllers to a DOM subtree and does nothing else. No
 * animation values, no easing, no timing, no scene geometry. Everything that
 * decides how the hero *feels* lives in `controllers/`, `webgl/scene/` and
 * `hero.css`, which is what makes the motion system editable as a system
 * rather than as forty scattered transition declarations.
 *
 * The 3D architectural cutaway (`webgl/HeroScene.jsx`) is the hero's primary
 * visual on capable desktop hardware; `HeroPoster` is not a loading state for
 * it but a complete, independently art-directed hero for everyone else —
 * reduced motion, mobile, low-power devices. Which one a visitor gets is a
 * single `data-tier` attribute that `hero.css` reads to decide even the
 * *document height* (a tall sticky-pinned scroll runway for the cinematic
 * narrative on tier 2, an ordinary single-viewport section otherwise) — see
 * `ScrollController`'s `cinematic` mode for the other half of that split.
 *
 * The hero renders about three times over its entire lifetime. Pointer,
 * scroll, firelight and scene progress are all continuous per-frame values,
 * and every one of them is routed through `lib/signals.js` into CSS custom
 * properties / a shared mutable object rather than through React state.
 */

const HeroCanvas = dynamic(() => import('./webgl/HeroCanvas'), {
  ssr: false,
  loading: () => null,
});

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Arms the cold open while the document is still parsing.
 *
 * Hydration is far too late to begin a load sequence. The browser paints the
 * server-rendered HTML long before React runs, so a hero that only went cold in
 * a layout effect would paint finished, snap back to cold, and re-ignite — the
 * exact flash the sequence exists to avoid.
 *
 * Running this inline instead means the very first paint is already the cold
 * room. Three properties make it safe rather than clever:
 *
 *   · it never arms for reduced-motion visitors, so they never see a frame of
 *     an animation they asked not to have;
 *   · it disarms itself after four seconds, so a bundle that fails to load
 *     cannot leave the hero's copy permanently masked;
 *   · a visitor with JS off never gets the attribute at all and is served the
 *     complete, finished hero.
 */
const ARM_SCRIPT = `(function(){try{
if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var e=document.querySelector('[data-hero]');if(!e)return;
e.setAttribute('data-armed','');
window.__heroDisarm=setTimeout(function(){e.removeAttribute('data-armed')},4000);
}catch(_){}})()`;

export default function HeroClient() {
  const rootRef = useRef(null);
  const caps = useCapabilityTier();
  const cinematic = caps.tier === 2;

  // Flipped only once the 3D scene has actually produced a frame, so the
  // cross-fade never reveals an empty canvas over the poster.
  const [sceneLive, setSceneLive] = useState(false);
  // Gates CustomCursor so it never lingers active over unrelated sections
  // once the visitor has scrolled well past the hero.
  const [heroInView, setHeroInView] = useState(true);

  /* ── ignition ──────────────────────────────────────────────────────── */

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    // `useCapabilityTier` resolves in its own layout effect and re-renders
    // synchronously, so this runs on the following pass — still before paint.
    // Waiting avoids building the timeline against a default tier and then
    // rebuilding it a frame later.
    if (!root || !caps.resolved) return undefined;

    // Hydration succeeded, so the inline script's failsafe is no longer needed.
    clearTimeout(window.__heroDisarm);

    resetHeroState();
    const stopSignals = mountHeroSignals(root);

    // The timeline sets the cold-open state synchronously on construction.
    // Because that happens inside a layout effect, the browser's first paint is
    // already the cold room — there is no frame where the finished hero flashes.
    const timeline = createIgnitionTimeline(root, { reduced: caps.reduced, cinematic });
    timeline.play();

    return () => {
      timeline.kill();
      stopSignals();
    };
  }, [caps.resolved, caps.reduced, cinematic]);

  /* ── continuous controllers ────────────────────────────────────────── */

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !caps.resolved || caps.reduced) return undefined;

    const pointer = createPointerController();
    const grade = createGradeController();
    const scroll = createScrollController(root, { cinematic });

    // The idle sines (and, on tier 2, the 3D render loop) are running for
    // nobody once the hero is off screen, and on a laptop that is real
    // battery for zero visible benefit.
    const observer = new IntersectionObserver(
      ([entry]) => {
        grade.setActive(entry.isIntersecting);
        setHeroInView(entry.isIntersecting);
      },
      { rootMargin: '10% 0px' },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      pointer.destroy();
      grade.destroy();
      scroll.destroy();
    };
  }, [caps.resolved, caps.reduced, cinematic]);

  /* ── tier reporting ────────────────────────────────────────────────── */

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.setAttribute('data-tier', String(caps.tier));
  }, [caps.tier]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.setAttribute('data-webgl', sceneLive ? 'on' : 'off');
  }, [sceneLive]);

  const showScene = cinematic && caps.resolved && caps.webgl;

  return (
    <>
      <section
        ref={rootRef}
        className="hero"
        data-hero
        aria-label="The Heating Store — underfloor heating and electric hamam systems"
      >
        {/* Must stay the first child: it runs during parse, before the plate
            and the copy below it have even been created. */}
        <script dangerouslySetInnerHTML={{ __html: ARM_SCRIPT }} />

        <div className="hero__stage">
          <HeroPoster />

          {showScene && (
            <HeroCanvas
              onReady={() => setSceneLive(true)}
              onLost={() => setSceneLive(false)}
              active={heroInView}
              reduced={caps.reduced}
              quality={caps.tier === 2 ? 'high' : 'low'}
            />
          )}

          <HeroAtmosphere />
          <HeroContent />
          <ScrollCue />
        </div>
      </section>

      <CustomCursor active={heroInView && !caps.reduced} />

      {/*
        Hoisted out of the section on purpose. `LeadPopup` positions itself
        `fixed`, and an ancestor carrying a `transform` or `filter` becomes the
        containing block for fixed descendants — which would silently reposition
        the modal relative to the sticky stage instead of the viewport.
      */}
      <LeadPopup />
    </>
  );
}
