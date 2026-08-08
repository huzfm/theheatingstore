'use client';

import { memo, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CableModel from './CableModel';
import { MAT_W, CABLE_RADIUS } from './constants';
import { buildMatCable, matBands } from './mat-layout';
// Only the cutaway scene shows callouts, and their beats are expressed
// against its rotation window. StoryMatScene renders this model with
// labels="none", so it never touches them.
import { FEATURES } from '@/lib/mat-features';
import { clamp } from '@/lib/three-utils';
import { meshAlpha } from '@/lib/textures';

/**
 * One callout, styled as an anchored instrument readout: a glowing node that
 * sits on the mat, a thin leader rising to a floating card, a large ghosted
 * index numeral behind the copy, and a spec footer carrying the one hard
 * number plus the reader's position in the sequence.
 *
 * `nodeOnly` drops everything but the glowing node. On a phone the mat is only
 * ~300px across and the card is ~150px of opaque fill centred on its own
 * anchor, so the readout covered roughly half of the thing it was pointing at,
 * for the entire turn. There is no offset that fixes that: the anchors ride the
 * mat's own edge, so any card large enough to be legible overlaps it. Narrow
 * screens therefore keep the node here, on the mat where it belongs, and hand
 * the copy to the overlay's caption slot (see FloorRevealSection), which is
 * already reserved for text and overlaps nothing.
 *
 * Style is written straight to the DOM each frame, routing it through state
 * would re-render every Html portal every frame. No backdrop-blur: a blurred
 * backdrop over a moving WebGL canvas forces the compositor to re-sample the
 * canvas behind every card each frame, which is expensive. The layered dark
 * gradient fill reads the same and costs nothing.
 *
 * Only opacity and transform are animated, so the whole reveal stays on the
 * compositor and never triggers layout.
 */
function FeatureLabel({ feature, rotationRef, activeIdRef, nodeOnly = false }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const shownRef = useRef(0);

  useFrame((_, delta) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // The camera looks down -Z, so this anchor faces us when
    // cos(rotY + azimuth) ≈ 1.
    const facing = Math.cos(rotationRef.current + feature.azimuth);
    // Only the single front-most unlocked callout is live (see the winner
    // pick in HeatingSheetModel), so exactly one shows at a time and the
    // previous one clears the moment a later anchor turns into view.
    const active = activeIdRef.current === feature.id;

    /**
     * Eased toward the target rather than snapped, and eased here rather than
     * by a CSS transition, because the transform below is rewritten every
     * frame and a transition on a property something else is also driving
     * fights itself. With callouts a sixth of a turn apart the handover
     * happens at facing ≈ cos(30°), so without this the incoming card would
     * arrive already at full opacity, i.e. pop.
     */
    const target = active ? clamp((facing - 0.5) / 0.35) : 0;
    shownRef.current += (target - shownRef.current) * Math.min(1, delta * 9);
    const v = shownRef.current;

    wrap.style.opacity = v.toFixed(3);
    // Fully faded cards still cost the compositor a layer to blend, and five
    // of the six are fully faded at any moment.
    wrap.style.visibility = v < 0.008 ? 'hidden' : 'visible';

    // Card lifts and settles as it resolves; the node and leader stay put.
    if (cardRef.current) {
      cardRef.current.style.transform =
        `translateY(${((1 - v) * 16).toFixed(1)}px) scale(${(0.972 + v * 0.028).toFixed(4)})`;
    }
  });

  /* Node on its own, sitting exactly on the anchor rather than hanging below a
     card. Same glow as the full readout, so the two variants read as the same
     component seen at two sizes. */
  if (nodeOnly) {
    return (
      <Html position={feature.anchor} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={wrapRef} style={{ opacity: 0, visibility: 'hidden' }} className="select-none">
          <span
            className="block h-[7px] w-[7px] rounded-full bg-heat-400"
            style={{
              boxShadow:
                '0 0 0 3px rgba(255,138,61,0.16), 0 0 0 7px rgba(255,138,61,0.06), 0 0 20px 5px rgba(255,138,61,0.75)',
            }}
          />
        </div>
      </Html>
    );
  }

  return (
    <Html position={feature.anchor} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      {/* Narrower than the copy strictly needs. A card the visitor can take in
          without moving their eyes across it is the point; wide cards invite
          long lines, and long lines are what made the previous ones read as
          blocks of text floating over the scene. */}
      <div
        ref={wrapRef}
        style={{ opacity: 0, visibility: 'hidden' }}
        className="relative w-[226px] select-none"
      >
        {/* ── Connector tail ───────────────────────────────────────────
            A leader dropping from the card's bottom edge to a glowing node.
            Integral to the card (not separately anchored), so it reads as
            "pinned to the mat" and tracks the card cleanly as it fades.
            drei's <Html center> centers the whole wrapper, so a separately
            positioned node can't reliably land on the 3D anchor, this keeps
            the whole readout self-contained. */}
        <div className="pointer-events-none absolute left-8 top-full flex flex-col items-center">
          <span
            className="h-9 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(255,176,97,0.9), rgba(255,176,97,0.12))' }}
          />
          {/* Node, with a static outer ring. A CSS keyframe pulse here would be
              animating an element that is already being faded by JS every
              frame, and the two read as jitter rather than as a heartbeat. */}
          <span
            className="h-[8px] w-[8px] rounded-full bg-heat-400"
            style={{
              boxShadow:
                '0 0 0 3px rgba(255,138,61,0.16), 0 0 0 7px rgba(255,138,61,0.06), 0 0 20px 5px rgba(255,138,61,0.75)',
            }}
          />
        </div>

        {/* ── Card ─────────────────────────────────────────────────────
            One size, not a responsive pair: this branch only renders at
            ≥640px now, where there is room beside the mat for it. */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl p-[1px]"
          style={{
            // Gradient border: bright warm at top-left, fading to hairline
            // one of the cheapest ways to make a card read as lit.
            background:
              'linear-gradient(150deg, rgba(255,176,97,0.6), rgba(255,255,255,0.09) 32%, rgba(255,255,255,0.04) 70%)',
            boxShadow: '0 30px 70px -24px rgba(0,0,0,0.95), 0 2px 10px -2px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="relative overflow-hidden rounded-[15px]"
            style={{
              background:
                'linear-gradient(158deg, #1c1813 0%, #131110 46%, #100e0c 100%)',
            }}
          >
            {/* Lit top edge. A single bright hairline across the head of the
                card is what makes it read as a machined face rather than a
                rectangle of dark fill. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(to right, transparent, rgba(255,176,97,0.85) 22%, rgba(255,255,255,0.18) 60%, transparent)',
              }}
            />

            {/* Warm wash bleeding in from the lit corner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.18), transparent 70%)' }}
            />

            <div className="relative px-4 pb-2.5 pt-3">
              {/* Ghosted index numeral behind the copy */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 right-1.5 font-display text-[52px] font-bold leading-none text-white/[0.05]"
              >
                {feature.index}
              </span>

              {/* Header row: counter chip + eyebrow. The chip carries the
                  total as well as the index, so the card answers "how much of
                  this is left" without the visitor having to count ticks. */}
              <div className="relative flex items-center gap-2">
                <span className="flex h-[16px] items-center rounded-full bg-heat-500/15 px-1.5 font-mono text-[8.5px] font-medium tracking-[0.1em] text-heat-300 ring-1 ring-inset ring-heat-400/25">
                  {feature.index}
                  <span className="text-heat-300/40">/{String(feature.total).padStart(2, '0')}</span>
                </span>
                <span className="text-[8px] font-medium uppercase tracking-[0.3em] text-white/35">
                  {feature.kicker}
                </span>
              </div>

              {/* No divider between title and body any more. At this size the
                  two are already a single glance, and a rule through the
                  middle of four words reads as a seam in the card. */}
              <p className="relative mt-2 font-display text-[14px] font-semibold leading-[1.15] tracking-[-0.01em] text-white">
                {feature.title}
              </p>

              <p className="relative mt-1.5 text-[10.5px] leading-snug text-white/50">
                {feature.body}
              </p>
            </div>

            {/* ── Spec band ────────────────────────────────────────────
                The one hard number, given its own inset band rather than
                floating at the bottom of the body copy. Separating it is what
                makes the whole card read as an instrument readout rather than
                as marketing: the band is the value, everything above it is the
                explanation. On the right, one tick per callout, so the turn
                has a visible position and end. */}
            <div
              className="relative flex items-center justify-between gap-2 border-t border-white/[0.07] px-4 py-2"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.028), rgba(0,0,0,0.22))' }}
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[15px] font-bold leading-none text-heat-400">
                  {feature.spec}
                </span>
                <span className="text-[8.5px] uppercase tracking-[0.2em] text-white/40">
                  {feature.specLabel}
                </span>
              </div>

              <div aria-hidden="true" className="flex shrink-0 items-center gap-[2.5px]">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Html>
  );
}

/**
 * The heating mat: fibreglass scrim laid as strips, with the cable at real
 * spacing running across each strip.
 *
 * No cold tail. A real mat has one, and an earlier pass modelled it on that
 * reasoning, but it is a black unheated lead trailing off the corner of a
 * shot whose entire subject is a glowing orange run. It read as a stray wire
 * rather than as a connection, and it was the only thing pulling the eye off
 * the mat.
 *
 * `labels` picks how the callouts are drawn:
 *   'card'  full anchored readout, for screens wide enough to hold one;
 *   'node'  the anchor node only, with the copy shown elsewhere by the caller;
 *   'none'  no callouts at all (StoryMatScene).
 * `onActiveChange` reports which callout is current, so a caller drawing the
 * copy outside the canvas knows what to draw.
 */
function HeatingSheetModel({
  rotationRef,
  progressRef,
  labels = 'card',
  onActiveChange = null,
  levelRef = null,
}) {
  const mesh = useMemo(() => meshAlpha(), []);
  const bands = useMemo(() => matBands(), []);
  const curve = useMemo(() => buildMatCable(), []);

  // Weave density held constant per unit rather than per strip, so the scrim
  // reads as one fabric cut into strips instead of three differently woven
  // sheets. 8 repeats across MAT_W is the pitch the single sheet used.
  const weaveV = (8 / MAT_W) * bands[0].width;

  /**
   * Which callout owns the screen right now. Each frame we pick the single
   * unlocked callout whose anchor most directly faces the camera; every other
   * one reads this and stays hidden. This is what makes the reveal strictly
   * sequential: as the mat turns and a new anchor comes forward it takes over,
   * and the previous callout drops away rather than lingering two-at-a-time.
   *
   * The anchors are spread evenly around the turn, so once everything is
   * unlocked the front-most is always at least cos(180°/n) toward the camera
   * and there is always exactly one winner, never a gap with nothing on screen.
   */
  const activeIdRef = useRef(null);
  const notifyRef = useRef(onActiveChange);
  notifyRef.current = onActiveChange;

  useFrame(() => {
    let bestId = null;
    let best = 0.12; // ignore anchors barely edge-on to the camera
    for (let i = 0; i < FEATURES.length; i += 1) {
      const f = FEATURES[i];
      if (progressRef.current < f.unlock) continue;
      const facing = Math.cos(rotationRef.current + f.azimuth);
      if (facing > best) {
        best = facing;
        bestId = f.id;
      }
    }

    // Only on a genuine handover, not every frame: the callback lifts React
    // state a few components up, and the winner changes six times across the
    // whole turn.
    if (activeIdRef.current !== bestId) {
      activeIdRef.current = bestId;
      notifyRef.current?.(bestId);
    }
  });

  return (
    <group>
      {/* Fibreglass scrim. Real mats are an open weave you can see through,
          so this is an alpha cut-out rather than a solid backing slab
          light passes between the strands and the layer below shows through,
          which is what makes it read as mesh and not as card.

          One plane per strip, not one for the whole mat: a mat is a 500 mm
          roll laid in runs with the mesh cut and turned at each end, so the
          seams between strips are there on every real floor and they're what
          gives the surface any structure at all. A single sheet left the
          cable with nothing to be organised by. */}
      {bands.map((band) => (
        <mesh key={band.index} position={[0, 0, band.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[MAT_W, band.width]} />
          {/* Lower opacity and no alphaTest: the hard cutout rendered as a
              drawn wireframe grid. A soft translucent scrim reads as fabric,
              which is what it is. */}
          <meshStandardMaterial
            color="#a49d90"
            alphaMap={mesh}
            alphaMap-repeat={[8, weaveV]}
            transparent
            opacity={0.28}
            roughness={0.85}
            metalness={0}
            envMapIntensity={0.5}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Sits one cable radius above the scrim, which is where a bonded cable
          actually is. The previous 0.018 was ~10 mm of daylight under it. */}
      <group position={[0, CABLE_RADIUS + 0.002, 0]}>
        <CableModel curve={curve} radius={CABLE_RADIUS} levelRef={levelRef} />
      </group>

      {labels !== 'none' &&
        FEATURES.map((f) => (
          <FeatureLabel
            key={f.id}
            feature={f}
            rotationRef={rotationRef}
            activeIdRef={activeIdRef}
            nodeOnly={labels === 'node'}
          />
        ))}
    </group>
  );
}

export default memo(HeatingSheetModel);
