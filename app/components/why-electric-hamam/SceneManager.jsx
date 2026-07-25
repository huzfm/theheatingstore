'use client';

import { useEffect, useRef } from 'react';
import { SCENES } from './content';
import { usePinnedTimeline } from './hooks/usePinnedTimeline';
import TitleScene from './TitleScene';
import Scene from './Scene';
import QuoteScene from './QuoteScene';
import CTAEnding from './CTAEnding';

/**
 * Stacks every chapter (title card, 6 benefit scenes, quote, CTA) into one
 * viewport-covering stage and lets usePinnedTimeline drive which one is
 * visible. In reduced-motion mode the CSS on the ancestor `.weh-static`
 * wrapper (see WhyElectricHamam.jsx) overrides the stacking to normal
 * document flow — this component's markup doesn't change between modes.
 *
 * Each chapter registers only the refs its own motion actually needs: every
 * chapter gets a `root` (the one composition-wide camera move); benefit
 * scenes additionally get `image`/`frame`/`sweep` for the photograph's own
 * physical motion. Nothing else is individually animated — headings, body
 * copy, stats and quote text are plain nested DOM that simply inherits
 * root's opacity/blur/transform, so they always arrive, hold and leave as
 * one composition.
 *
 * Three blurred ambient glow layers sit behind the stage content and
 * parallax at different rates off the raw scroll progress — the
 * foreground/midground/background depth the visual brief asks for. Their
 * tint follows whichever scene is currently active.
 */
export default function SceneManager({ wrapperRef, ctaHref, reduced }) {
  const titleRoot = useRef(null);

  // Plain {current: null} ref-shaped objects, one set per scene — a stable
  // array built once so identity never changes across renders. React treats
  // any object with a settable `.current` exactly like a real ref.
  const sceneRefsRef = useRef(null);
  if (!sceneRefsRef.current) {
    sceneRefsRef.current = SCENES.map(() => ({
      root: { current: null },
      image: { current: null },
      frame: { current: null },
      sweep: { current: null },
    }));
  }
  const sceneRefs = sceneRefsRef.current;

  const quoteRoot = useRef(null);
  const ctaRoot = useRef(null);

  const ambientBg = useRef(null);
  const ambientMid = useRef(null);
  const ambientFg = useRef(null);
  const ambientRef = useRef([
    { ref: ambientBg, speed: -36 },
    { ref: ambientMid, speed: 54 },
    { ref: ambientFg, speed: -84 },
  ]);

  const stageRef = useRef(null);

  const beatsRef = useRef(null);
  if (!beatsRef.current) {
    beatsRef.current = [
      { root: titleRoot },
      ...sceneRefs.map((r) => ({ root: r.root, image: r.image, frame: r.frame, sweep: r.sweep })),
      { root: quoteRoot },
      { root: ctaRoot },
    ];
  }

  const { activeIndex } = usePinnedTimeline(wrapperRef, beatsRef, ambientRef, reduced);

  // Tint the ambient glow to whichever benefit scene is active (indices
  // 1..6 in the chapter sequence map to SCENES[0..5]); title/quote/CTA fall
  // back to the brand copper.
  useEffect(() => {
    const scene = SCENES[activeIndex - 1];
    const accent = scene?.accent ?? '#B86B45';
    stageRef.current?.style.setProperty('--weh-ambient-accent', accent);
  }, [activeIndex]);

  return (
    <div ref={stageRef} className="weh-stage">
      <div className="weh-ambient-layer weh-ambient-layer--bg" ref={ambientBg} aria-hidden="true" />
      <div className="weh-ambient-layer weh-ambient-layer--mid" ref={ambientMid} aria-hidden="true" />
      <div className="weh-ambient-layer weh-ambient-layer--fg" ref={ambientFg} aria-hidden="true" />

      <TitleScene rootRef={titleRoot} />

      {SCENES.map((scene, i) => (
        <Scene
          key={scene.id}
          scene={scene}
          rootRef={sceneRefs[i].root}
          imageRef={sceneRefs[i].image}
          frameRef={sceneRefs[i].frame}
          sweepRef={sceneRefs[i].sweep}
        />
      ))}

      <QuoteScene rootRef={quoteRoot} />

      <CTAEnding rootRef={ctaRoot} ctaHref={ctaHref} />
    </div>
  );
}
