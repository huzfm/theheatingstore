'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { STAGES, stageAt, SECTION_VH } from '@/lib/floor-timeline';
// Data only, no three.js behind it, so importing the callout copy here does
// not undo the lazy-loading of the scene below.
import { FEATURES_BY_ID } from '@/lib/mat-features';

/**
 * Three.js is ~150kB gzipped before any of our own scene code. Loading it
 * eagerly would push it into the home page's initial bundle and hurt LCP on
 * a page whose hero is above this section. ssr:false is required as well 
 * WebGL has no server-side equivalent.
 */
const importScene = () => import('@/components/3d/FloorCutawayScene');

const FloorCutawayScene = dynamic(importScene, {
  ssr: false,
  loading: () => <ScenePoster />,
});

/**
 * Static stand-in shown while the Three.js chunk downloads and the canvas
 * warms up. It echoes the studio rig, a warm key-light glow from upper-left,
 * a cooler fill, and a soft floor pool, so the placeholder reads as the same
 * scene mid-load rather than an empty black hole. The faint pulse signals
 * that something is arriving.
 */
function ScenePoster() {
  return (
    <div className="absolute inset-0 bg-ink-950" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 50% at 28% 22%, rgba(255,244,230,0.12), transparent 70%),' +
            'radial-gradient(50% 45% at 75% 78%, rgba(234,88,12,0.09), transparent 72%)',
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-[36%] mx-auto h-40 w-[72%] max-w-xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.06), transparent 70%)',
        }}
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  );
}

/**
 * Whether the viewport is too narrow to carry an anchored callout card over
 * the mat. Matches the `sm` breakpoint the card's own styles are written to.
 *
 * Read in an effect rather than during render, so the server and the first
 * client render agree; until it resolves, `null` means "not yet known" and the
 * callouts stay off, which is a frame of nothing rather than a frame of the
 * wrong layout.
 */
function useIsNarrow() {
  const [narrow, setNarrow] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return narrow;
}

/**
 * The active callout, docked into the overlay instead of floating over the
 * mat. Phone-only: the anchored card is ~150px of opaque fill on a mat that is
 * barely 300px across, so on a narrow screen it hid most of the thing it was
 * annotating. The scene keeps the glowing anchor node (labels="node"), and the
 * copy lands here, in the strip the stage caption already owns, where it
 * covers nothing.
 *
 * Same information as the card and in the same order, laid out for a wide
 * short slot rather than a narrow tall one: chip and kicker on one line, the
 * claim, the reason, then the spec and the position ticks on a footer row.
 */
function DockedCallout({ feature }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 bottom-0"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-[16px] items-center rounded-full bg-heat-500/15 px-1.5 font-mono text-[8.5px] font-medium tracking-[0.1em] text-heat-300 ring-1 ring-inset ring-heat-400/25">
          {feature.index}
          <span className="text-heat-300/40">/{String(feature.total).padStart(2, '0')}</span>
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-heat-500">
          {feature.kicker}
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-xl leading-tight text-white">
        {feature.title}
      </h3>
      <p className="mt-1.5 text-sm leading-snug text-white/55">{feature.body}</p>

      <div className="mt-3 flex items-center gap-3 border-t border-white/[0.08] pt-2.5">
        <span className="font-display text-[15px] font-bold leading-none text-heat-400">
          {feature.spec}
        </span>
        <span className="text-[8.5px] uppercase tracking-[0.2em] text-white/40">
          {feature.specLabel}
        </span>

        {/* One tick per callout, so the turn has a visible position and end.
            The section's own progress rail counts layers, not callouts, and
            during the turn it has been full for a while. */}
        <span aria-hidden="true" className="ml-auto flex shrink-0 items-center gap-[3px]">
          {Array.from({ length: feature.total }).map((_, i) => (
            <span
              key={i}
              className={
                i === feature.ordinal
                  ? 'h-[2px] w-2.5 rounded-full bg-heat-400'
                  : 'h-[2px] w-1.5 rounded-full bg-white/15'
              }
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}

export default function FloorRevealSection() {
  const wrapperRef = useRef(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const narrow = useIsNarrow();

  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Which callout the turn is currently on. Only meaningful on narrow screens,
  // where this component rather than the scene draws the copy; the scene
  // reports it six times across the whole section, so the re-renders are
  // negligible.
  const [featureId, setFeatureId] = useState(null);

  // Stable identity: the scene is a lazily-imported component, and a fresh
  // callback on every render of this one would re-render the whole canvas
  // subtree each time the stage changes.
  const handleActiveFeature = useCallback((id) => setFeatureId(id), []);

  // Non-null only while a narrow screen is between callouts' unlock points.
  const dockedFeature = narrow && featureId ? FEATURES_BY_ID[featureId] : null;

  /**
   * Scroll → progressRef, with no React state in the hot path. The stage
   * index is the one thing that does update state, and only on the two
   * threshold crossings, so this component renders 3 times per pass rather
   * than several hundred.
   */
  useScrollProgress(wrapperRef, {
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    enabled: !reduceMotion,
    onUpdate: (p) => {
      // The value the 3D scene actually animates from. Written to a ref, so
      // the canvas reads it in useFrame without React re-rendering.
      progressRef.current = p;

      const next = stageAt(p);
      setStage((prev) => (prev === next ? prev : next));
    },
  });

  /**
   * Warm the Three.js chunk during idle time, so the ~150kB download and its
   * parse are already paid for by the time the visitor scrolls down here
   * this is what removes the 2-3s wait that used to start only on arrival.
   * Deferred to requestIdleCallback so it never competes with the hero's LCP;
   * the setTimeout is the fallback for Safari, which lacks the API.
   */
  useEffect(() => {
    if (reduceMotion) return undefined;

    const ric = typeof window !== 'undefined' ? window.requestIdleCallback : null;
    if (ric) {
      const id = ric(() => importScene(), { timeout: 3000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => importScene(), 1800);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  /**
   * Two thresholds, deliberately different:
   *  - mount the canvas well before it enters the viewport (1200px), so WebGL
   *    context creation, the environment cubemap bake and shader compilation
   *    all happen off-screen while the loop is parked, not in the frame the
   *    visitor first sees;
   *  - run the render loop only when it's genuinely near/on screen (300px).
   * Once mounted we stop observing for mount; `active` keeps tracking so the
   * loop still parks when the section scrolls away.
   */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          mountObserver.disconnect();
        }
      },
      { rootMargin: '1200px 0px' }
    );

    const activeObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '300px 0px' }
    );

    mountObserver.observe(el);
    activeObserver.observe(el);
    return () => {
      mountObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  /* ── Reduced motion: no sticky, no rotation, no 390vh of scroll. ──
     A short static section naming the same layers.                  */
  if (reduceMotion) {
    return (
      <section className="bg-ink-950 px-6 py-24 text-bone-100 md:px-16">
        <h2 className="font-display text-4xl font-bold tracking-tight">
          Look beneath the floor
        </h2>
        {/* 3 columns: STAGES is 5 entries, which fills two rows without
            stranding a lone card the way a 4-wide grid would. */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((s) => (
            <div key={s.id} className="border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-heat-500">
                {s.eyebrow}
              </p>
              <h3 className="mt-4 font-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone-500">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    // Scroll length: enough that the 360° turn never feels rushed, short
    // enough that it doesn't feel stuck. The inner panel is sticky rather
    // than GSAP-pinned, no pin-spacer means nothing to recalculate on
    // resize, which is where pinned sections normally break.
    //
    // Height comes from SECTION_VH rather than a Tailwind arbitrary value:
    // it is derived from the carpet's share of the timeline, so the layers
    // beneath it keep their original pace in pixels scrolled, and Tailwind's
    // JIT can't see a value computed at runtime.
    <section
      ref={wrapperRef}
      data-section="floor-reveal"
      className="relative bg-ink-950"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          {mounted ? (
            <FloorCutawayScene
              progressRef={progressRef}
              active={active}
              // Narrow screens get the anchor node only and the copy is drawn
              // in the caption slot below; wider ones keep the full anchored
              // card. `null` is the pre-measurement state, so nothing is drawn
              // until we know which it is.
              labels={narrow === null ? 'none' : narrow ? 'node' : 'card'}
              onActiveFeature={narrow ? handleActiveFeature : null}
            />
          ) : null}
        </div>

        {/* ── Overlay copy ─────────────────────────────────────────── */}
        <div className="pointer-events-none relative flex h-full flex-col justify-between px-6 py-14 md:px-16 md:py-20">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-heat-500">
              The system, layer by layer
            </p>
            <h2 className="mt-5 max-w-[13ch] font-display text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
              Look beneath the floor.
            </h2>
          </div>

          {/* Stage caption, crossfades as the sequence advances. Once the turn
              starts on a narrow screen the callout takes the slot over: it is
              the more specific copy, and the stage caption it replaces was
              generic narration of the same turn. Taller in that state, and the
              children are bottom-anchored, so the swap doesn't shift anything
              on screen. */}
          <div className={`relative max-w-md ${dockedFeature ? 'h-44' : 'h-32'}`}>
            {STAGES.map((s, i) => (
              <motion.div
                key={s.id}
                className="absolute inset-x-0 bottom-0"
                initial={false}
                animate={{
                  opacity: !dockedFeature && stage === i ? 1 : 0,
                  y: !dockedFeature && stage === i ? 0 : 12,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-heat-500">
                  {s.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-xl text-white md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {s.body}
                </p>
              </motion.div>
            ))}

            <AnimatePresence>
              {/* Keyed by feature, so a handover is an exit plus an enter,
                  i.e. a crossfade between two callouts rather than one card
                  whose text is swapped underneath the reader. */}
              {dockedFeature ? (
                <DockedCallout key={dockedFeature.id} feature={dockedFeature} />
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll cue, a mouse-style indicator inviting the visitor to keep
            scrolling. Pinned to the right edge and vertically centred, and
            desktop-only: on a phone it sat bottom-centre, directly on top of
            the caption, and there is no free margin to move it into. Persistent
            where it does show, it stays put for the whole sequence rather than
            fading on scroll. */}
        <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2.5 md:flex">
          <span className="flex h-9 w-[19px] items-start justify-center rounded-full border border-white/30">
            <motion.span
              className="mt-1.5 h-1.5 w-1.5 rounded-full bg-heat-500"
              animate={{ y: [0, 9, 0], opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
            />
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/55">
            Scroll
          </span>
        </div>

        {/* Progress rail, ticks that fill as each stage completes.
            Left-aligned on mobile so it clears the floating chat bubble that
            sits bottom-right on the home page; moves to the right on wider
            screens where there's room. */}
        <div className="pointer-events-none absolute bottom-6 left-6 flex gap-2 md:bottom-14 md:left-auto md:right-16">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              // Narrower on mobile: at the old fixed w-10 the rail ran past
              // the right edge of a 320px viewport once it grew past five
              // ticks. Kept, so adding a stage back can't reintroduce that.
              className="h-[2px] w-8 overflow-hidden rounded-full bg-white/15 md:w-10"
            >
              <motion.div
                className="h-full bg-heat-500"
                initial={false}
                animate={{ scaleX: stage >= i ? 1 : 0 }}
                style={{ originX: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
