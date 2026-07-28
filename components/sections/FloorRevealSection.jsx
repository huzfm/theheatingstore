'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { STAGES, stageAt } from '@/lib/floor-timeline';
import './FloorRevealSection.css';

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

export default function FloorRevealSection() {
  const wrapperRef = useRef(null);
  const progressRef = useRef(0);
  const reduceMotion = useReducedMotion();

  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  /* ── Reduced motion: no sticky, no rotation, no 340vh of scroll. ──
     A short static section naming the same five layers.             */
  if (reduceMotion) {
    return (
      <section className="freveal px-6 py-24 text-bone-100 md:px-16">
        <h2 className="font-display text-4xl font-bold tracking-tight">
          Look beneath the floor
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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
    // 340vh of scroll: enough that the 360° turn never feels rushed, short
    // enough that it doesn't feel stuck. The inner panel is sticky rather
    // than GSAP-pinned, no pin-spacer means nothing to recalculate on
    // resize, which is where pinned sections normally break.
    <section
      ref={wrapperRef}
      data-section="floor-reveal"
      className="freveal relative h-[340vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Atmosphere, behind the canvas ────────────────────────── */}
        <div className="freveal__scrim" />
        <div className="freveal__glow" />
        <div className="freveal__seam" />
        <div className="freveal__grain" />

        <div className="absolute inset-0 z-0">
          {mounted ? (
            <FloorCutawayScene progressRef={progressRef} active={active} />
          ) : null}
        </div>

        {/* ── Overlay copy ─────────────────────────────────────────────
            z-[3] matches .hhero__inner: without an explicit z-index here
            this div sits at z-index:auto, which paints *below* the scrim/
            glow (z-index 1) and grain (z-index 2) regardless of DOM order,
            crushing the text into the scrim's near-black colour. ───────── */}
        <div className="pointer-events-none relative z-[3] flex h-full flex-col justify-between px-6 py-14 md:px-16 md:py-20">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--copper-bright)]">
              The system, layer by layer
            </p>
            <h2 className="mt-5 max-w-[13ch] font-display text-4xl font-bold leading-[0.95] tracking-tight text-[var(--ivory)] md:text-6xl lg:text-7xl">
              Look beneath the floor.
            </h2>
          </div>

          {/* Stage caption, crossfades as the sequence advances */}
          <div className="relative h-32 max-w-md">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.id}
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: stage === i ? 1 : 0,
                  y: stage === i ? 0 : 12,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--copper-bright)]">
                  {s.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-xl text-[var(--ivory)] md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll cue, a mouse-style indicator inviting the visitor to keep
            scrolling. Bottom-centre on mobile; pinned to the right edge and
            vertically centred on wider screens. Persistent, it stays put for
            the whole sequence rather than fading on scroll. */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2.5 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2">
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
        <div className="pointer-events-none absolute bottom-6 left-6 z-[3] flex gap-2 md:bottom-14 md:left-auto md:right-16">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className="h-[2px] w-10 overflow-hidden rounded-full bg-white/15"
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
