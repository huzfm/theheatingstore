'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { STAGES, stageAt } from '@/lib/floor-timeline';

/**
 * Three.js is ~150kB gzipped before any of our own scene code. Loading it
 * eagerly would push it into the home page's initial bundle and hurt LCP on
 * a page whose hero is above this section. ssr:false is required as well —
 * WebGL has no server-side equivalent.
 */
const FloorCutawayScene = dynamic(() => import('@/components/3d/FloorCutawayScene'), {
  ssr: false,
  loading: () => null,
});

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
   * Only run the render loop while the section is on screen, and only mount
   * the canvas once the visitor is actually approaching it.
   */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Reduced motion: no sticky, no rotation, no 340vh of scroll. ──
     A short static section naming the same five layers.             */
  if (reduceMotion) {
    return (
      <section className="bg-ink-950 px-6 py-24 text-bone-100 md:px-16">
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
    // than GSAP-pinned — no pin-spacer means nothing to recalculate on
    // resize, which is where pinned sections normally break.
    <section
      ref={wrapperRef}
      data-section="floor-reveal"
      className="relative h-[340vh] bg-ink-950"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Warm bloom behind the model */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60vw 50vh at 50% 55%, rgba(255,138,61,0.10), transparent 70%)',
          }}
        />

        {/* Screen-blended warm haze over the canvas. This stands in for the
            GPU bloom pass that was removed for performance: the compositor
            draws one gradient per frame regardless of scene complexity,
            where a real bloom pass scales with resolution. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
          style={{
            background:
              'radial-gradient(38vw 32vh at 50% 52%, rgba(255,138,61,0.16), transparent 68%)',
          }}
        />

        <div className="absolute inset-0">
          {mounted ? (
            <FloorCutawayScene progressRef={progressRef} active={active} />
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

          {/* Stage caption — crossfades as the sequence advances */}
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
          </div>
        </div>

        {/* Progress rail — ticks that fill as each stage completes.
            Left-aligned on mobile so it clears the floating chat bubble that
            sits bottom-right on the home page; moves to the right on wider
            screens where there's room. */}
        <div className="pointer-events-none absolute bottom-6 left-6 flex gap-2 md:bottom-14 md:left-auto md:right-16">
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
