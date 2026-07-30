'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { RevealText } from '@/components/ui/RevealText';
import { RAIL_BLOCKS, blockAt, BLOCK_VH, TAIL_VH } from '@/lib/story-rail';
import { ORIGIN } from './data';

/**
 * three.js is ~150kB gzipped before any scene code of ours. Loading it eagerly
 * would put it in the About route's initial bundle, above a section the
 * visitor has to scroll past the hero to reach. ssr:false is mandatory as
 * well, WebGL has no server-side equivalent.
 */
const StoryMatScene = dynamic(() => import('@/components/3d/StoryMatScene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Resolves to true/false only after mount, so it is never consulted during
 * render on the server. Every layout decision that must match between server
 * and client is done in CSS below; this gates one thing only, which of the
 * two panels actually gets a WebGL canvas, so we never mount two.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isDesktop;
}

/** Shared panel chrome, so both the pinned and the mobile visual match. */
function Panel({ className = '', children }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] ${className}`}
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, rgba(255,138,61,0.10), transparent 55%), linear-gradient(180deg, #131211 0%, #0b0b0a 100%)',
      }}
    >
      {children}
    </div>
  );
}

/**
 * The About story rail.
 *
 * Left column scrolls the origin narrative and the three principles; the right
 * column holds a sticky 3D heating mat that changes state as each block lands.
 * The copy is unchanged, every string comes from data.js via lib/story-rail.
 *
 * Pinning is CSS `position: sticky`, not ScrollTrigger's `pin`. ScrollTrigger
 * still drives everything reactive (it owns the 0→1 scrub the scene reads),
 * but pinning through it inserts a pin-spacer whose height is measured once
 * and has to be recomputed on every resize, which is precisely where pinned
 * sections break. Sticky has nothing to recompute. This follows the same call
 * already made in components/sections/FloorRevealSection.
 */
export default function StoryRail() {
  const wrapperRef = useRef(null);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  const [block, setBlock] = useState(0);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  /**
   * The mobile panel never scrubs, it holds the resting pose from the end of
   * the timeline (mat lit, calm hero framing) and relies on the scene's idle
   * drift for life.
   */
  const staticProgressRef = useRef(0.94);

  /**
   * Scroll → ref, with no React state in the hot path. Only the block index
   * touches state, and only on its four threshold crossings, so a full pass
   * costs 5 renders rather than several hundred.
   */
  const { progress: progressRef } = useScrollProgress(wrapperRef, {
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    enabled: isDesktop === true && !reduce,
    onUpdate: (p) => {
      const next = blockAt(p);
      setBlock((prev) => (prev === next ? prev : next));
    },
  });

  /**
   * ScrollTrigger seeds its progress on create and on every refresh, but only
   * reports it through onUpdate. Without this, reloading part-way down the
   * page leaves the copy dimmed to block 0 and the tick rail empty until the
   * visitor scrolls. One frame's wait is enough for the trigger to exist.
   */
  useEffect(() => {
    if (reduce || isDesktop !== true) return undefined;
    const id = requestAnimationFrame(() => setBlock(blockAt(progressRef.current)));
    return () => cancelAnimationFrame(id);
  }, [reduce, isDesktop, progressRef]);

  /* Render loop runs only while the section is on screen; the canvas mounts
     only once the visitor is approaching it. */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || reduce) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  /* ── Reduced motion ───────────────────────────────────────────────
     No canvas, no sticky, no 485vh of scroll. The origin photograph as a
     still, and the same five blocks as ordinary stacked prose.          */
  if (reduce) {
    return (
      <section className="relative bg-ink-950 py-24 text-bone-100 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="space-y-12">
            {RAIL_BLOCKS.map((b) => (
              <div key={b.id}>
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
                  {b.kicker}
                </span>
                {b.title ? (
                  <h2 className="mt-4 font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.05] text-bone-100">
                    {b.title}
                  </h2>
                ) : null}
                <p className="mt-4 max-w-xl text-base leading-relaxed text-bone-300">{b.body}</p>
              </div>
            ))}
          </div>

          <Panel className="lg:sticky lg:top-24">
            <img
              src={ORIGIN.image}
              alt="Underfloor heating installation in progress"
              className="h-[320px] w-full object-cover lg:h-[560px]"
            />
          </Panel>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapperRef} data-section="story-rail" className="relative bg-ink-950 text-bone-100">
      {/*
        Block height and tail live in lib/story-rail.js, because the block
        thresholds there are derived arithmetically from these two numbers.
        Injecting them rather than hard-coding a Tailwind class is what keeps
        the two from drifting apart.

        The vh sizing applies at lg only. Below that the rail is not pinned,
        so 85vh per paragraph would just be five screens of mostly empty space.
      */}
      <style>{`
        @media (min-width: 1024px) {
          .rail-block { min-height: ${BLOCK_VH}vh; }
          .rail-tail  { height: ${TAIL_VH}vh; }
        }
      `}</style>

      {/* Ambient wash, matching the other About sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50vw 40vh at 50% 0%, rgba(255,138,61,0.06), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* ── Mobile visual: above the copy, not pinned, no scroll states ── */}
        <div className="pt-16 lg:hidden">
          <Panel className="h-[55vh] min-h-[320px]">
            {mounted && isDesktop === false ? (
              <StoryMatScene
                progressRef={staticProgressRef}
                active={active}
                idle
                /* Anchored <Html> cards are unreadable at this scale, and each
                   one is a DOM portal composited over a live canvas, the most
                   expensive thing here on the devices least able to afford it. */
                showCallouts={false}
              />
            ) : null}
            <span className="pointer-events-none absolute bottom-4 left-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-heat-400">
              <span className="h-1.5 w-1.5 rounded-full bg-heat-400 shadow-[0_0_10px_2px_rgba(255,138,61,0.8)]" />
              The heating mat
            </span>
          </Panel>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* ── Left: the scrolling copy ─────────────────────────────── */}
          <div className="space-y-14 py-16 lg:space-y-0 lg:py-0">
            {RAIL_BLOCKS.map((b, i) => {
              const isActive = isDesktop !== true || block === i;
              return (
                <div
                  key={b.id}
                  className="rail-block flex flex-col justify-center lg:max-w-xl"
                >
                  <div
                    className="transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: isActive ? 1 : 0.28,
                      transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                    }}
                  >
                    <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
                      <span
                        className="h-px bg-heat-500/60 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: isActive ? '2rem' : '0.75rem' }}
                      />
                      {b.kicker}
                    </span>

                    {b.title ? (
                      i === 0 ? (
                        <RevealText
                          as="h2"
                          className="mt-6 max-w-[18ch] font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100"
                        >
                          {b.title}
                        </RevealText>
                      ) : (
                        <h3 className="mt-6 font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.08] text-bone-100">
                          {b.title}
                        </h3>
                      )
                    ) : null}

                    <p className="mt-6 text-base leading-relaxed text-bone-300">{b.body}</p>

                    <span
                      aria-hidden
                      className="mt-8 block h-px bg-gradient-to-r from-heat-500 to-transparent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ width: isActive ? '3.5rem' : '1rem' }}
                    />
                  </div>
                  
                </div>
              );
            })}

            {/* Tail, gives the final block room to sit at rest before the
                section releases, instead of the pin ending on top of it. */}
            <div className="rail-tail hidden lg:block" aria-hidden />
          </div>

          {/* ── Right: the pinned visual ─────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center py-12">
              <Panel className="h-full max-h-[76vh] w-full">
                {mounted && isDesktop === true ? (
                  <StoryMatScene progressRef={progressRef} active={active} idle showCallouts />
                ) : null}

                {/* Instrument caption, same treatment as the About hero panel */}
                <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-heat-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-heat-400 shadow-[0_0_10px_2px_rgba(255,138,61,0.8)]" />
                    Live · Heating mat
                  </span>

                  {/* Which block you're on. Fills as the rail advances. */}
                  <span className="flex gap-1.5">
                    {RAIL_BLOCKS.map((b, i) => (
                      <span
                        key={b.id}
                        className="block h-[2px] w-6 overflow-hidden rounded-full bg-white/15"
                      >
                        <span
                          className="block h-full origin-left bg-heat-500 transition-transform duration-500 ease-out"
                          style={{ transform: `scaleX(${block >= i ? 1 : 0})` }}
                        />
                      </span>
                    ))}
                  </span>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
