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
 * Left column scrolls the three principles; the right column holds a sticky 3D
 * heating mat that changes state as each block lands. Every string comes from
 * data.js via lib/story-rail.
 *
 * Below lg there is no mat at all. A second WebGL canvas on a phone bought us
 * a decorative loop of a model nobody could read at that size, on the devices
 * least able to spend the battery, and it pushed the actual argument, the three
 * principles, a screen further down. The same three blocks become a snap
 * carousel instead. It is the same DOM either way, only the container changes
 * (see the max-width block in the injected stylesheet), so the copy exists once
 * for crawlers and assistive tech rather than once per breakpoint.
 *
 * The origin narrative used to lead this rail and now has its own section,
 * OriginGallery, immediately above. The thresholds and keyframes in
 * lib/story-rail were re-derived for the shorter three-block rail.
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
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  const [block, setBlock] = useState(0);
  const [slide, setSlide] = useState(0);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  /**
   * Mobile carousel focus.
   *
   * Snapping, momentum and the rubber band are the browser's, we only measure
   * the result: each card gets a --t of 1 at the centre of the viewport falling
   * to 0 a card-width away, and the stylesheet spends it on scale, opacity and
   * the heat wash. Written straight to the node, so a swipe costs zero renders;
   * only the index behind the tick rail is state, and only when it changes.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDesktop !== false) return undefined;

    let frame = 0;

    const paint = () => {
      frame = 0;
      const cards = track.querySelectorAll('[data-rail-card]');
      const mid = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let nearestDist = Infinity;

      cards.forEach((card, i) => {
        // offsetLeft is measured from the shared offset parent, so subtracting
        // the track's own puts both in the scroller's coordinate space.
        const centre = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(centre - mid);
        card.style.setProperty('--t', Math.max(0, 1 - dist / card.offsetWidth).toFixed(3));
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      });

      setSlide((prev) => (prev === nearest ? prev : nearest));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      track.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [isDesktop]);

  const goToSlide = (i) => {
    const card = trackRef.current?.querySelectorAll('[data-rail-card]')[i];
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  /* Render loop runs only while the section is on screen; the canvas mounts
     only once the visitor is approaching it. Desktop only, since the mat is
     the only consumer of either flag and it no longer renders below lg. */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || reduce || isDesktop !== true) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce, isDesktop]);

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

        /*
          Below lg the same three blocks are a carousel. --card is the slide
          width and the track's inline padding is derived from it, which is what
          lets the first and last card sit dead centre when snapped: centring
          card 0 asks for a scrollLeft of exactly 0, so the browser never has to
          settle for "as close as the scroll range allows".
        */
        @media (max-width: 1023.98px) {
          .rail-track {
            --card: 82vw;
            display: flex;
            gap: 3vw;
            /* Break out of the page gutter so the strip runs edge to edge. */
            margin-inline: -1.25rem;
            padding-inline: calc((100vw - var(--card)) / 2);
            overflow-x: auto;
            overscroll-behavior-x: contain;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            /* Cards dissolve into the bezel instead of being sliced by it. */
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          }
          .rail-track::-webkit-scrollbar { display: none; }

          .rail-block {
            --t: 0;
            flex: 0 0 var(--card);
            scroll-snap-align: center;
            scroll-snap-stop: always;
            justify-content: flex-start;
            border-radius: 26px;
            padding: 2.25rem 1.75rem 2.5rem;
            border: 1px solid rgba(255, 255, 255, calc(0.06 + 0.06 * var(--t)));
            background:
              radial-gradient(130% 85% at 50% 0%, rgba(255, 138, 61, calc(0.13 * var(--t))), transparent 62%),
              linear-gradient(180deg, #141312 0%, #0b0b0a 100%);
            box-shadow:
              0 1px 0 0 rgba(255, 255, 255, 0.04) inset,
              0 40px 90px -55px rgba(0, 0, 0, 0.95);
            opacity: calc(0.42 + 0.58 * var(--t));
            transform: scale(calc(0.935 + 0.065 * var(--t)));
            /* Follows the finger frame by frame; the transition only smooths
               the tail of a fling and the jump from a tick-rail tap. */
            transition: opacity 120ms linear, transform 120ms linear;
          }

          /* Hairline of heat along the top edge, brightest on the focused card. */
          .rail-block::before {
            content: '';
            position: absolute;
            inset-inline: 2.25rem;
            top: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 138, 61, calc(0.85 * var(--t))), transparent);
          }
        }

        @media (min-width: 640px) and (max-width: 1023.98px) {
          .rail-track { --card: 60vw; margin-inline: -2rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rail-block { transition: none; }
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
        <div className="grid lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* ── Left: the scrolling copy. A snap carousel below lg. ──── */}
          {/* data-lenis-prevent: on a tablet-width window Lenis still owns the
              wheel, and without this a trackpad's horizontal swipe over the
              track is swallowed and scrolls the page instead. */}
          <div ref={trackRef} data-lenis-prevent className="rail-track py-16 lg:py-0">
            {RAIL_BLOCKS.map((b, i) => {
              /* Desktop tracks the scrub; the carousel tracks the snap. */
              const isActive = isDesktop === true ? block === i : slide === i;
              return (
                <div
                  key={b.id}
                  data-rail-card
                  className="rail-block relative isolate flex flex-col justify-center lg:max-w-xl"
                  /* Seeds the focus falloff so the first card is already lit on
                     the first paint, before the scroll handler has measured
                     anything. Overwritten by that handler on every frame. */
                  style={{ '--t': i === 0 ? 1 : 0 }}
                >
                  {/*
                    Dimming the copy is the pinned rail's job: there, three
                    paragraphs share one screen and only one is being read. A
                    carousel card is already the only thing in view, and the
                    card itself carries the falloff, so stacking a second one
                    inside it would just make the peeking card unreadable.
                  */}
                  <div
                    className="transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      opacity: isDesktop === true && !isActive ? 0.28 : 1,
                      transform:
                        isDesktop === true && !isActive ? 'translateY(10px)' : 'translateY(0)',
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
                        /* First block carries the section's h2. It is set at
                           the principle scale, not the display scale it used
                           to be: the origin heading above now owns that size,
                           and two competing h2s in a row read as a mistake. */
                        <RevealText
                          as="h2"
                          className="mt-6 max-w-[18ch] font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.08] text-bone-100"
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

          {/*
            Carousel tick rail, the same instrument as the one on the pinned
            panel so the two breakpoints read as one design. Tappable as well as
            indicative: three cards is few enough that jumping straight to one
            beats swiping to it. display:none on desktop, so it never becomes a
            stray third cell in the two-column grid.
          */}
          <div className="-mt-8 flex items-center justify-between pb-16 lg:hidden">
            <div className="flex items-center gap-1">
              {RAIL_BLOCKS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => goToSlide(i)}
                  aria-label={`Show ${b.title}`}
                  aria-current={slide === i ? 'true' : undefined}
                  /* 2px of ink, 44px of target. */
                  className="flex h-11 items-center px-1.5"
                >
                  <span
                    className="block h-[2px] overflow-hidden rounded-full bg-white/15 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ width: slide === i ? '2.5rem' : '1.25rem' }}
                  >
                    <span
                      className="block h-full origin-left bg-heat-500 transition-transform duration-500 ease-out"
                      style={{
                        transform: `scaleX(${slide >= i ? 1 : 0})`,
                        boxShadow: slide === i ? '0 0 10px 1px rgba(255,138,61,0.6)' : 'none',
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>

            <span className="font-serif text-sm tracking-[0.18em] text-bone-500">
              <span className="text-bone-100">{String(slide + 1).padStart(2, '0')}</span>
              <span className="mx-1.5 text-bone-500/50">/</span>
              {String(RAIL_BLOCKS.length).padStart(2, '0')}
            </span>
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
