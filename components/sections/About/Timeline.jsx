'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { MILESTONES } from './data';
import {
  BALUSTER_H,
  BALUSTER_W,
  CAP_D,
  CENTER_Y,
  COLLAR_H,
  COLLAR_W,
  FINIAL_D,
  FLANGE_D,
  FLANGE_DROP,
  NEWEL_BOTTOM,
  NEWEL_H,
  NEWEL_R,
  NEWEL_TOP,
  NEWEL_W,
  OUTER_R,
  PLINTH_H,
  PLINTH_W,
  POST_PLANES,
  PERSPECTIVE,
  RAIL_LENGTH,
  RAIL_R,
  RAIL_T,
  RAIL_TRANSFORM,
  RAIL_TRANSFORM_CROSS,
  RISE,
  SECTION_VH,
  STEP_ANGLE,
  STEP_COUNT,
  TILT,
  TREAD_CLIP,
  TREAD_D,
  TREAD_W,
  labelFadeAt,
  litAt,
  rotationAt,
  stepAt,
} from '@/lib/about-stair';

const EASE = [0.16, 1, 0.3, 1];

/* useLayoutEffect warns when it runs during SSR; nothing here reads the DOM on
   the server, so fall back to useEffect there. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * True only at lg and up, and only after mount.
 *
 * The server can't know the viewport, so the first render is always the flat
 * list, which is also what a phone keeps. On desktop the swap to the staircase
 * happens in a layout effect, i.e. after hydration matches but before the
 * browser paints, so there is no visible flash of the flat list.
 */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useIsoLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isDesktop;
}

/**
 * One cylindrical part of the newel: four planes through the vertical axis.
 *
 * The cylinder trick shades with the object rather than with the light, which
 * is why every gradient below puts its specular in the middle of the plane,
 * whichever plane is most square to the camera then shows its highlight
 * centred and the part reads round from any angle.
 */
function Post({ variant, width, height, y, round = false }) {
  return POST_PLANES.map((a) => (
    <span
      key={a}
      className={`stair-post stair-post--${variant}`}
      style={{
        width,
        height,
        marginLeft: -width / 2,
        borderRadius: round ? '50%' : undefined,
        transform: `translateY(${y}px) rotateY(${a}deg)`,
      }}
    />
  ));
}

/** A horizontal disc: a cap, a plinth top or a tread flange. */
function Disc({ variant, size, y }) {
  return (
    <span
      className={`stair-disc stair-disc--${variant}`}
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        transform: `translateY(${y}px) rotateX(90deg)`,
      }}
    />
  );
}

/**
 * The newel the treads spring from: plinth, shaft, collar, cap and finial,
 * bottom to top. Rendered once, as a child of the spinning container.
 */
function Newel() {
  return (
    <>
      <Post
        variant="plinth"
        width={PLINTH_W}
        height={PLINTH_H}
        y={NEWEL_BOTTOM - PLINTH_H}
      />
      <Disc variant="plinth" size={PLINTH_W} y={NEWEL_BOTTOM - PLINTH_H} />

      <Post variant="shaft" width={NEWEL_W} height={NEWEL_H} y={NEWEL_TOP} />

      <Post variant="collar" width={COLLAR_W} height={COLLAR_H} y={NEWEL_TOP} />
      <Disc variant="cap" size={CAP_D} y={NEWEL_TOP} />

      <Post
        variant="finial"
        width={FINIAL_D}
        height={FINIAL_D}
        y={NEWEL_TOP - FINIAL_D}
        round
      />
    </>
  );
}

/** The milestones as ordinary stacked prose. Reduced motion, and below lg. */
function FlatTimeline() {
  return (
    <ol className="relative mt-14 space-y-10 border-l border-white/10 pl-7">
      {MILESTONES.map((item) => (
        <li key={item.year} className="relative">
          <span
            aria-hidden
            className="absolute -left-[calc(1.75rem+1px)] top-2 block h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-heat-500 shadow-[0_0_0_4px_rgba(255,138,61,0.15)]"
          />
          <span className="font-serif text-3xl text-heat-500">{item.year}</span>
          <h3 className="mt-1.5 font-serif text-xl text-bone-100">{item.title}</h3>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-bone-300">
            {item.desc}
          </p>
        </li>
      ))}
    </ol>
  );
}

/**
 * The staircase itself.
 *
 * One node per milestone, each carrying its own tread, riser, year plate,
 * baluster and the rail segment reaching to the next step. Every transform is
 * static and set once at render; the only thing scroll touches is `rotateY` on
 * the single `.stair-spin` wrapper, plus two custom properties per step that
 * the faces read for shading. That keeps a scroll frame at one transform write
 * and 2n property writes, with no React render at all.
 *
 * `--lit` and `--fade` are custom properties rather than `filter` on the step
 * wrapper on purpose: `filter` is a grouping property, and setting it on an
 * element forces its `transform-style: preserve-3d` back to `flat`, which
 * would collapse each step's faces into a single plane.
 */
function Staircase({ spinRef, stepRefs }) {
  return (
    <div
      className="stair-stage pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      <div className="stair-tilt">
        {/* Contact shadow, so the structure sits on something. */}
        <span className="stair-ground" />

        <div ref={spinRef} className="stair-spin">
          <Newel />

          {MILESTONES.map((item, i) => (
            <div
              key={item.year}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="stair-step"
              style={{
                transform: `rotateY(${i * STEP_ANGLE}deg) translateY(${-i * RISE}px)`,
              }}
            >
              {/* Bracket bolting this tread to the newel. Lives inside the
                  step, so it picks up the step's own shading for free. */}
              <span
                className="stair-disc stair-disc--flange stair-face"
                style={{
                  width: FLANGE_D,
                  height: FLANGE_D,
                  marginLeft: -FLANGE_D / 2,
                  marginTop: -FLANGE_D / 2,
                  transform: `translateY(${FLANGE_DROP}px) rotateX(90deg)`,
                }}
              />

              <span className="stair-tread stair-face" />
              <span className="stair-riser stair-face" />

              {/* Year, sitting 2px proud of the riser so the riser's own
                  shading scrim doesn't dim it. */}
              <span className="stair-year">{item.year}</span>

              <span className="stair-baluster stair-face" />
              <span className="stair-baluster stair-baluster--cross stair-face" />

              {/* No rail off the top step: it would end in mid-air. */}
              {i < STEP_COUNT - 1 ? (
                <>
                  <span className="stair-rail stair-face" />
                  <span className="stair-rail stair-rail--cross stair-face" />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The About timeline.
 *
 * The milestones are the steps of a spiral staircase that turns on scroll,
 * bringing each one square to the camera in turn. Geometry, the step angle and
 * the total rotation all come from lib/about-stair.js and are derived from
 * MILESTONES.length, so the section takes a sixth milestone without any
 * animation maths being touched.
 *
 * Pinning is CSS `position: sticky`, not ScrollTrigger's `pin`, the same call
 * already made in StoryRail and FloorRevealSection: a pin-spacer's height is
 * measured once and has to be recomputed on every resize, and sticky has
 * nothing to recompute. ScrollTrigger still owns the 0→1 scrub.
 *
 * It runs at lg and up only. The geometry is fixed px and the finished render
 * is scaled to fit (see .stair-stage), which held its projection on a phone but
 * left the structure small and hard to read for the cost of a pinned 320vh
 * scrub; below lg, and under reduced motion, the milestones render as a plain
 * list instead.
 */
export default function Timeline() {
  const wrapperRef = useRef(null);
  const spinRef = useRef(null);
  const stepRefs = useRef([]);
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  const [active, setActive] = useState(0);

  // Below lg the staircase is not rendered at all, so nothing must scrub.
  const enabled = !reduce && isDesktop;

  /**
   * Scroll → DOM, with no React state in the hot path. ScrollTrigger's scrub
   * already runs on GSAP's ticker (which Lenis drives, see hooks/useLenis), so
   * these writes are frame-batched without a rAF of our own. Only the active
   * index touches state, and only on its four threshold crossings, so a full
   * pass costs 5 renders rather than several hundred.
   */
  const { progress: progressRef } = useScrollProgress(wrapperRef, {
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    enabled,
    onUpdate: (p) => {
      const spin = spinRef.current;
      if (spin) spin.style.transform = `rotateY(${rotationAt(p)}deg)`;

      for (let i = 0; i < stepRefs.current.length; i += 1) {
        const el = stepRefs.current[i];
        if (!el) continue;
        el.style.setProperty('--lit', litAt(p, i).toFixed(3));
        el.style.setProperty('--fade', labelFadeAt(p, i).toFixed(3));
      }

      const next = stepAt(p);
      setActive((prev) => (prev === next ? prev : next));
    },
  });

  /**
   * ScrollTrigger seeds its progress on create and on refresh but only reports
   * it through onUpdate. Without this, reloading part-way down the page leaves
   * the staircase unrotated and unshaded behind copy that says otherwise.
   * One frame is enough for the trigger to exist.
   */
  useEffect(() => {
    if (!enabled) return undefined;

    const id = requestAnimationFrame(() => {
      const p = progressRef.current;
      const spin = spinRef.current;
      if (spin) spin.style.transform = `rotateY(${rotationAt(p)}deg)`;
      for (let i = 0; i < stepRefs.current.length; i += 1) {
        const el = stepRefs.current[i];
        if (!el) continue;
        el.style.setProperty('--lit', litAt(p, i).toFixed(3));
        el.style.setProperty('--fade', labelFadeAt(p, i).toFixed(3));
      }
      setActive(stepAt(p));
    });

    return () => cancelAnimationFrame(id);
  }, [enabled, progressRef]);

  const heading = (
    <>
      <Reveal>
        <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-bone-500">
          <span className="h-px w-8 bg-heat-500/60" />
          The Road So Far
        </span>
      </Reveal>
      <RevealText
        as="h2"
        className="mt-6 max-w-[14ch] font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] text-bone-100"
      >
        A decade of warmer winters.
      </RevealText>
    </>
  );

  /* ── Flat: reduced motion, and every viewport below lg ────────────
     No sticky, no 320vh of scroll, no 3D. The same five milestones as
     an ordinary ordered list. The staircase is a fixed-px structure
     scaled down to fit a phone, where it ends up small, expensive and
     hard to read, so mobile gets the list instead. Desktop is
     untouched.                                                      */
  if (reduce || !isDesktop) {
    return (
      <section className="relative bg-ink-950 py-24 text-bone-100 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          {heading}
          <FlatTimeline />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      data-section="about-stair"
      className="relative bg-ink-950 text-bone-100"
      // Height drives the scrub distance and is derived in lib/about-stair.js
      // from the step count, so Tailwind's JIT can't see it as a class.
      style={{ height: `${SECTION_VH}vh` }}
    >
      <style>{`
        /*
          The structure is ~600px across and ~430px tall in its own
          coordinates, and those numbers drive every transform in this
          file. Rather than make the geometry responsive, the finished
          3D render is scaled as a whole: perspective is expressed in
          the same local units, so a uniform scale here shrinks the
          camera distance along with the object and the projection is
          identical, just smaller. Making the constants themselves
          viewport-relative would instead change the perspective ratio
          and flatten the effect on a phone.

          The shift lifts it clear of the caption block, which needs
          more height on a narrow screen where the copy wraps.
        */
        .stair-stage {
          perspective: ${PERSPECTIVE}px;
          perspective-origin: 50% 45%;
          transform: translateY(var(--stair-shift, 0)) scale(var(--stair-scale, 1));
          --stair-scale: 0.46;
          --stair-shift: -6%;
        }
        @media (min-width: 480px) { .stair-stage { --stair-scale: 0.6; } }
        @media (min-width: 640px) { .stair-stage { --stair-scale: 0.72; --stair-shift: -3%; } }
        @media (min-width: 768px) { .stair-stage { --stair-scale: 0.86; --stair-shift: 0%; } }
        @media (min-width: 1024px) { .stair-stage { --stair-scale: 1; } }
        .stair-tilt {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          transform: translateY(${CENTER_Y}px) rotateX(${TILT}deg);
        }
        .stair-spin {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          transform: rotateY(0deg);
          will-change: transform;
        }
        .stair-step {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          transform-style: preserve-3d;
          --lit: 1;
          --fade: 1;
        }

        /* Shading scrim. One rule lights every face from the step's own angle,
           so the structure darkens as it turns away without a per-face write. */
        .stair-face { position: absolute; }
        .stair-face::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: #000;
          opacity: calc((1 - var(--lit)) * 0.74);
        }

        .stair-tread {
          top: 0;
          left: 0;
          width: ${TREAD_W}px;
          height: ${TREAD_D}px;
          margin-left: ${-TREAD_W / 2}px;
          transform-origin: 50% 0;
          transform: translateZ(${NEWEL_R}px) rotateX(90deg);
          clip-path: ${TREAD_CLIP};
          background:
            linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 55%, rgba(255,138,61,0.10) 100%),
            linear-gradient(180deg, #24211d 0%, #17150f 100%);
          border-bottom: 1px solid rgba(255,176,97,0.28);
        }

        .stair-riser {
          top: 0;
          left: 0;
          width: ${TREAD_W}px;
          height: ${RISE}px;
          margin-left: ${-TREAD_W / 2}px;
          transform: translateZ(${OUTER_R}px);
          background: linear-gradient(180deg, #131210 0%, #0a0908 100%);
          border-top: 1px solid rgba(255,176,97,0.20);
          box-shadow: inset 0 12px 26px -14px rgba(0,0,0,0.9);
        }

        .stair-year {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${TREAD_W}px;
          height: ${RISE}px;
          margin-left: ${-TREAD_W / 2}px;
          transform: translateZ(${OUTER_R + 2}px);
          font-family: var(--font-heading);
          font-size: 46px;
          line-height: 1;
          letter-spacing: 0.06em;
          color: #ffb061;
          text-shadow: 0 0 26px rgba(255,138,61,0.45);
          opacity: var(--fade);
        }

        .stair-baluster {
          top: 0;
          left: 0;
          width: ${BALUSTER_W}px;
          height: ${BALUSTER_H}px;
          margin-left: ${-BALUSTER_W / 2}px;
          transform: translate3d(0, ${-BALUSTER_H}px, ${RAIL_R}px);
          background: linear-gradient(90deg, #0d0c0a, #35302a 45%, #0d0c0a);
        }
        .stair-baluster--cross {
          transform: translate3d(0, ${-BALUSTER_H}px, ${RAIL_R}px) rotateY(90deg);
        }

        .stair-rail {
          top: 0;
          left: 0;
          width: ${RAIL_LENGTH}px;
          height: ${RAIL_T}px;
          margin-left: ${-RAIL_LENGTH / 2}px;
          margin-top: ${-RAIL_T / 2}px;
          border-radius: ${RAIL_T / 2}px;
          transform: ${RAIL_TRANSFORM};
          background: linear-gradient(180deg, #4a4239, #221f1a 60%, #14120f);
        }
        .stair-rail--cross { transform: ${RAIL_TRANSFORM_CROSS}; }

        /* ── The newel ────────────────────────────────────────────────
           Every horizontal gradient runs dark → mid → specular → mid →
           dark across the plane. Because the planes turn with the post,
           putting the highlight at the centre is what makes whichever
           plane is facing the camera read as the lit belly of a
           cylinder. The vertical layer on top of it is the ambient: the
           section's warm wash comes from above, so each part catches
           heat near its top and sinks to black at its foot. */
        .stair-post {
          position: absolute;
          top: 0;
          left: 0;
        }

        .stair-post--shaft {
          background:
            linear-gradient(180deg,
              rgba(255,176,97,0.16) 0%,
              rgba(255,176,97,0.03) 26%,
              rgba(0,0,0,0.30) 74%,
              rgba(0,0,0,0.55) 100%),
            linear-gradient(90deg,
              #060605 0%, #131009 12%, #2b2419 30%,
              #665a49 45%, #342c1f 60%, #131009 86%, #060605 100%);
        }

        /* Machined band: narrower highlight, harder falloff, so it reads
           as metal against the shaft's softer timber. */
        .stair-post--collar {
          background:
            linear-gradient(90deg,
              #0a0908 0%, #221c14 15%, #574a38 36%,
              #9a8562 45%, #4d422f 58%, #1a1610 86%, #0a0908 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,196,138,0.30),
            inset 0 -1px 0 rgba(0,0,0,0.75);
        }

        .stair-post--plinth {
          background:
            linear-gradient(180deg,
              rgba(255,176,97,0.10) 0%,
              rgba(0,0,0,0.20) 45%,
              rgba(0,0,0,0.72) 100%),
            linear-gradient(90deg,
              #070605 0%, #1b1610 16%, #4b4030 40%,
              #6f6048 47%, #362d21 62%, #14100c 86%, #070605 100%);
          box-shadow: inset 0 1px 0 rgba(255,196,138,0.22);
        }

        .stair-post--finial {
          background: radial-gradient(circle at 36% 28%,
            #c0a67f 0%, #8a7457 26%, #4a3e2e 56%, #1d1813 82%, #0d0b09 100%);
        }

        .stair-disc {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
        }

        /* Discs are seen from above at the camera's pitch, so their
           highlight sits up-and-left of centre rather than centred. */
        .stair-disc--cap {
          background: radial-gradient(circle at 40% 32%,
            #7d6c55 0%, #4a3f2f 40%, #1c1811 76%, #0b0a08 100%);
          box-shadow: 0 0 0 1px rgba(255,196,138,0.16);
        }

        .stair-disc--plinth {
          background: radial-gradient(circle at 42% 34%,
            #5c4f3c 0%, #362e23 44%, #16130e 78%, #0a0907 100%);
          box-shadow: 0 0 0 1px rgba(255,196,138,0.12);
        }

        .stair-disc--flange {
          background: radial-gradient(circle at 42% 34%,
            #4b4133 0%, #2a2419 48%, #12100c 82%, #0a0907 100%);
          box-shadow: 0 0 0 1px rgba(255,176,97,0.20);
        }

        .stair-ground {
          position: absolute;
          top: 0;
          left: 0;
          width: 820px;
          height: 820px;
          margin-left: -410px;
          margin-top: -410px;
          transform: translateY(46px) rotateX(90deg);
          background: radial-gradient(
            closest-side,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.42) 42%,
            rgba(255,138,61,0.05) 62%,
            transparent 74%
          );
        }
      `}</style>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Ambient wash, matching the other About sections */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(52vw 44vh at 50% 8%, rgba(255,138,61,0.06), transparent 62%)',
          }}
        />

        <Staircase spinRef={spinRef} stepRefs={stepRefs} />

        {/* ── Overlay copy ─────────────────────────────────────────── */}
        <div className="pointer-events-none relative flex h-full flex-col justify-between px-6 py-14 md:px-16 md:py-20">
          <div>{heading}</div>

          {/* Milestone caption, crossfading as each step comes square to the
              camera. Same treatment as the home page's layer-stack section.
              Taller on narrow screens, where the body copy wraps further and
              would otherwise run under the progress rail. */}
          <div className="relative h-44 max-w-md pb-8 sm:h-36 sm:pb-0">
            {MILESTONES.map((item, i) => (
              <motion.div
                key={item.year}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 12 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-heat-500">
                  {item.year}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-bone-100 md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-300">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Which milestone you're on. Fills as the staircase turns.
            Right-aligned and narrower on mobile: the floating widget on this
            route sits bottom-left, and at 390px a left-aligned rail runs
            straight underneath it. */}
        <div className="pointer-events-none absolute bottom-6 right-6 flex gap-2 md:bottom-14 md:right-16">
          {MILESTONES.map((item, i) => (
            <div
              key={item.year}
              className="h-[2px] w-8 overflow-hidden rounded-full bg-white/15 md:w-10"
            >
              <motion.div
                className="h-full bg-heat-500"
                initial={false}
                animate={{ scaleX: active >= i ? 1 : 0 }}
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
