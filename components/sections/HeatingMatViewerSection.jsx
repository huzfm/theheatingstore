'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Three.js is ~150kB gzipped before any scene code, and this section sits
 * directly under the hero. Loading it eagerly would put all of it in the home
 * page's initial bundle and hurt LCP for a product nobody has scrolled to yet.
 * ssr:false is not optional - WebGL has no server-side equivalent.
 */
const importScene = () => import('@/components/3d/HeatingMatViewerScene');

const HeatingMatViewerScene = dynamic(importScene, {
  ssr: false,
  loading: () => <ScenePoster />,
});

/** Facts, all from public/PDFs/prowarm.pdf rather than rounded off by hand. */
const SPECS = [
  { value: '500 mm', label: 'Roll width' },
  { value: '2 mm', label: 'Cable thickness' },
  { value: '65 mm', label: 'Loop pitch' },
  { value: '150 W', label: 'Per m²' },
];

/**
 * Stand-in while the Three.js chunk downloads. Echoes the studio rig - warm key
 * from upper left, cool fill opposite, a soft pool where the shadow lands - so
 * it reads as the same shot mid-load rather than as an empty panel. Tuned dark
 * on light, because the backdrop behind it is cream: on a pale ground the thing
 * that reads as "an object is about to be here" is a shadow, not a glow.
 */
function ScenePoster() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 45% at 30% 26%, rgba(120,102,84,0.07), transparent 70%),' +
            'radial-gradient(45% 40% at 74% 40%, rgba(90,105,140,0.05), transparent 72%)',
        }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-[22%] mx-auto h-24 w-[62%] max-w-lg rounded-[50%]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(74,64,54,0.13), transparent 70%)',
        }}
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
  );
}

function DragIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 12h16M7.5 8.5 4 12l3.5 3.5M16.5 8.5 20 12l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A 360° product viewer for the heating mat.
 *
 * ── Why a custom drag handler rather than constrained OrbitControls ──
 *
 * OrbitControls with enableZoom/enablePan off and minPolarAngle === maxPolarAngle
 * does produce azimuth-only rotation, and it was the obvious first choice. Three
 * things ruled it out, in order of how much they mattered:
 *
 *  1. It swallows single-finger vertical swipes. With panning disabled a touch
 *     drag is a rotation whatever direction it goes, so the canvas becomes a
 *     region of a scrollable marketing page that the visitor cannot scroll past.
 *     That is a trap, and OrbitControls has no axis-intent setting to avoid it.
 *     The handler below sets `touch-action: pan-y`, which hands vertical swipes
 *     back to the browser and keeps only horizontal ones - the gesture split a
 *     product viewer inside a page actually needs.
 *  2. Its autoRotate cannot be paused on interaction and eased back in after a
 *     delay without fighting its internal damping; the standard workaround is to
 *     toggle the property, which snaps.
 *  3. It orbits the *camera*. With a world-space environment map that slides the
 *     studio reflections across the mat in the opposite direction to the one a
 *     turning object would, which on a surface whose realism is carried by its
 *     specular response is the wrong read.
 *
 * What is lost is OrbitControls' free touch handling, so touch is wired
 * explicitly below through Pointer Events, which are one code path for mouse,
 * touch and pen.
 */
export default function HeatingMatViewerSection() {
  const wrapperRef = useRef(null);
  const reduced = useReducedMotion();

  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hinted, setHinted] = useState(false);

  /**
   * Interaction state as one mutable object, shared with the scene's useFrame.
   * Nothing here belongs in React state: it changes every frame during a drag,
   * and routing it through a setter would re-render the section on each pointer
   * move for no visible benefit.
   */
  const controls = useRef({
    angle: 0,
    velocity: 0,
    pending: 0,
    dragging: false,
    lastInput: 0,
    pointerId: null,
    radPerPx: 0.006,
    demand: false,
    invalidate: null,
  });

  useEffect(() => {
    controls.current.demand = Boolean(reduced);
  }, [reduced]);

  /* ── Warm the chunk during idle time ──────────────────────────────
     So the download and parse are already paid for by the time the visitor
     reaches this section. Deferred to requestIdleCallback so it never competes
     with the hero's LCP; the timeout is Safari's fallback. */
  useEffect(() => {
    const ric = typeof window !== 'undefined' ? window.requestIdleCallback : null;
    if (ric) {
      const id = ric(() => importScene(), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => importScene(), 1500);
    return () => clearTimeout(t);
  }, []);

  /* ── Mount early, run only when visible ───────────────────────────
     Two thresholds, matching FloorRevealSection: create the WebGL context, bake
     the environment cubemap and compile shaders well before the section is on
     screen, but leave the render loop parked until it nearly is. This is what
     answers the auto-rotate cost - the idle spin is a continuous loop, so the
     only meaningful saving is not running it when nobody is looking. */
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
      { rootMargin: '900px 0px' }
    );

    const activeObserver = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '150px 0px' }
    );

    mountObserver.observe(el);
    activeObserver.observe(el);
    return () => {
      mountObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  const endDrag = useCallback((event) => {
    const c = controls.current;
    if (c.pointerId === null) return;
    wrapperRef.current?.releasePointerCapture?.(c.pointerId);
    c.pointerId = null;
    c.dragging = false;
    c.lastInput = performance.now() / 1000;
    setDragging(false);
    c.invalidate?.();
    void event;
  }, []);

  const onPointerDown = useCallback((event) => {
    const el = wrapperRef.current;
    if (!el || event.button > 0) return;

    const c = controls.current;
    c.dragging = true;
    c.pointerId = event.pointerId;
    c.lastX = event.clientX;
    c.lastInput = performance.now() / 1000;
    /**
     * Sensitivity in radians per pixel, derived from the element's width so a
     * drag across the viewer is one full turn on any screen. A fixed constant
     * tuned on a desktop canvas makes the same gesture on a phone barely move
     * the product. Floored so a very narrow viewport does not become twitchy.
     */
    c.radPerPx = (Math.PI * 2) / Math.max(420, el.clientWidth * 0.95);

    el.setPointerCapture(event.pointerId);
    setDragging(true);
    setHinted(true);
    c.invalidate?.();
  }, []);

  const onPointerMove = useCallback((event) => {
    const c = controls.current;
    if (!c.dragging || event.pointerId !== c.pointerId) return;

    c.pending += (event.clientX - c.lastX) * c.radPerPx;
    c.lastX = event.clientX;
    c.lastInput = performance.now() / 1000;
    c.invalidate?.();
  }, []);

  /**
   * Keyboard rotation, so the product is not reachable by pointer only. Nudges
   * velocity rather than the angle, which reuses the same inertia the drag ends
   * in - a held arrow key spins up and coasts to a stop instead of stepping.
   */
  const onKeyDown = useCallback((event) => {
    const dir = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!dir) return;
    event.preventDefault();

    const c = controls.current;
    c.velocity = Math.max(-4, Math.min(4, c.velocity + dir * 0.9));
    c.lastInput = performance.now() / 1000;
    setHinted(true);
    c.invalidate?.();
  }, []);

  return (
    <section
      data-section="mat-viewer"
      // Cream with the yellow left in. bone-100 (#f5f1ec) is a neutral warm
      // grey; this holds the same lightness but pushes the hue toward the
      // butter end, which is the colour of the paper backdrop the product is
      // meant to be sitting on and picks up the heat palette without becoming
      // orange.
      className="relative overflow-hidden bg-[#faf4e3] px-6 py-20 md:px-10 md:py-28"
    >
      {/* Studio backdrop. The canvas is transparent, so the sweep behind the
          product is CSS: it costs nothing, and it means the panel still reads as
          a lit studio while the Three.js chunk is in flight. On cream the useful
          gradient is the inverse of the dark version - a bright centre falling
          off to a warmer, slightly darker surround, which is what a seamless
          paper backdrop under a soft key actually does. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(56% 50% at 50% 30%, rgba(255,252,240,0.9), transparent 74%),' +
            'radial-gradient(46% 40% at 22% 14%, rgba(255,205,80,0.22), transparent 72%),' +
            'radial-gradient(52% 44% at 86% 22%, rgba(255,176,97,0.16), transparent 74%),' +
            'radial-gradient(74% 58% at 50% 106%, rgba(186,158,110,0.24), transparent 72%)',
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center">
        {/* ── Copy ─────────────────────────────────────────────────────
            Cut to a single line. The product is the argument here; every
            paragraph that explained it was competing with the thing it was
            explaining, and the section below this one takes the mat apart in
            context anyway. */}
        <h2 className="max-w-[18ch] text-center font-display text-4xl font-bold leading-[0.98] tracking-tight text-ink-950 md:text-5xl">
          A heating mat, turned in your hands.
        </h2>

        {/* ── Viewer ───────────────────────────────────────────────────
            Full width and centred, sized by height rather than an aspect ratio.
            The scene solves its own camera distance from the live aspect (see
            fitDistance), and with the product standing upright that solve is
            height-bound at anything wider than about 5:4 - so height is the
            dimension that actually decides how large the mat renders, and
            clamping it directly is more honest than picking an aspect and
            hoping the container width lands somewhere useful. */}
        <div
          ref={wrapperRef}
          role="img"
          tabIndex={0}
          aria-label="Interactive 3D view of an electric underfloor heating mat, stood upright and part unrolled: the roll is on the right, wound on a cardboard core, and the black glass-fibre mesh runs out to the left carrying an orange-red heating cable in serpentine loops, held down by three cream reinforcement strips. Drag horizontally, or use the left and right arrow keys, to turn it."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className="relative mt-8 h-[clamp(300px,52vw,560px)] w-full max-w-5xl select-none rounded-2xl outline-none ring-offset-4 ring-offset-[#faf4e3] focus-visible:ring-2 focus-visible:ring-heat-600/60 md:mt-10"
          style={{
            // pan-y is what keeps this from trapping the page: the browser
            // still owns vertical swipes and hands us only horizontal ones.
            touchAction: 'pan-y',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
        >
          {mounted ? (
            <HeatingMatViewerScene
              controls={controls}
              active={active}
              reduced={Boolean(reduced)}
            />
          ) : (
            <ScenePoster />
          )}

          {/* Drag affordance. Fades out for good on the first interaction of
              any kind, including the keyboard - once someone has moved it they
              do not need telling that they can. */}
          <AnimatePresence>
            {!hinted && (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-ink-950/10 bg-white/75 px-3.5 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-950/60 backdrop-blur-sm"
              >
                <motion.span
                  className="text-heat-600"
                  animate={reduced ? undefined : { x: [-2.5, 2.5, -2.5] }}
                  transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                >
                  <DragIcon className="h-3.5 w-3.5" />
                </motion.span>
                Drag to rotate
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* One row of figures under the product, in place of the copy that used
            to sit beside it. Four numbers say what four paragraphs did. */}
        <dl className="mt-10 flex w-full max-w-3xl flex-wrap justify-center gap-x-10 gap-y-6 border-t border-ink-950/10 pt-6 sm:gap-x-16">
          {SPECS.map((spec) => (
            <div key={spec.label} className="text-center">
              <dd className="font-display text-2xl font-semibold text-heat-700 md:text-[1.75rem]">
                {spec.value}
              </dd>
              <dt className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-950/40">
                {spec.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
