'use client';

import { memo, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CableModel from './CableModel';
import { MAT_W, MAT_L, CABLE_RADIUS } from './constants';
import { buildMatCable, matBands } from './mat-layout';
// Only the cutaway scene shows callouts, and their beats are expressed
// against its rotation window. StoryMatScene renders this model with
// showLabels={false}, so it never touches this.
import { TIMELINE } from '@/lib/floor-timeline';
import { clamp } from '@/lib/three-utils';
import { meshAlpha } from '@/lib/textures';

/**
 * Feature callouts.
 *
 * Each owns an `azimuth`: the direction, in the mat's local space, that its
 * anchor points. Visibility uses that rather than per-face normals and camera
 * dot products, because the mat is flat, every face normal points straight up,
 * and a dot-product test returns the same answer for all of them. A local
 * point (a·sinφ, 0, a·cosφ) rotated by θ about Y has world z = a·cos(θ + φ),
 * so an anchor swings toward the camera exactly when cos(θ + φ) → 1, which is
 * the entire visibility test.
 *
 * Everything positional is derived from that one number rather than written
 * out per feature. The hand-authored version had azimuths and anchor corners
 * that disagreed about which way was which, so half the callouts drew a leader
 * line to the far edge of the mat; worse, two of the four sat on corners that
 * faced away for the whole of their unlock window and so never appeared at all.
 */

/** Anchor ring, held inside the mat's edge so leader lines land on scrim. */
const ANCHOR_X = MAT_W / 2 - 0.36;
const ANCHOR_Z = MAT_L / 2 - 0.3;

/**
 * Where in the 360° turn the first and last callout face the camera, as a
 * fraction of the rotation window. The first is held back a little so the turn
 * is visibly under way before anything is asked to be read, and the last stops
 * short of a full revolution so that it, rather than the first coming back
 * around, is what holds the frame at the end of the section.
 */
const FIRST_BEAT = 0.1;
const LAST_BEAT = 0.94;

/**
 * Copy is deliberately terse: a title of three or four words and a body of
 * one short line. These are read off a card that is on screen for a couple of
 * seconds while the mat is turning underneath it, so anything longer is a
 * paragraph the visitor has to choose between reading and watching. The spec
 * band carries the number, the title carries the claim, the body carries the
 * single reason it is true, and nothing carries more than that.
 */
const COPY = [
  {
    id: 'profile',
    kicker: 'Profile',
    title: 'Barely there',
    body: 'No door trimming, no step between rooms.',
    spec: '5 mm',
    specLabel: 'build height',
  },
  {
    id: 'roll',
    kicker: 'The roll',
    title: 'Cut, turned, repeated',
    body: 'The mesh is cut at the wall. The cable never is.',
    spec: '500 mm',
    specLabel: 'roll width',
  },
  {
    id: 'spacing',
    kicker: 'Coverage',
    title: 'Even, edge to edge',
    body: 'Fixed pitch, so no hot stripes and no cold patches.',
    spec: '75 mm',
    specLabel: 'cable pitch',
  },
  {
    id: 'output',
    kicker: 'Output',
    title: 'Sized to the room',
    body: 'Matched to the heat the space actually loses.',
    spec: '150 W',
    specLabel: 'per m²',
  },
  {
    id: 'cable',
    kicker: 'The cable',
    title: 'Self-regulating',
    body: 'Cold spots draw more, warm spots less.',
    spec: 'Auto',
    specLabel: 'per zone',
  },
  {
    id: 'warranty',
    kicker: 'Assurance',
    title: 'Ten-year cover',
    body: 'Cable and mat, behind certified installation.',
    spec: '10 yr',
    specLabel: 'warranty',
  },
];

const [ROTATE_START, ROTATE_END] = TIMELINE.rotate;
const ROTATE_SPAN = ROTATE_END - ROTATE_START;

const FEATURES = COPY.map((feature, i) => {
  const beat =
    COPY.length === 1
      ? FIRST_BEAT
      : FIRST_BEAT + (i * (LAST_BEAT - FIRST_BEAT)) / (COPY.length - 1);

  // The mat's rotation is spin·2π, so an anchor that faces the camera on
  // `beat` is one whose azimuth cancels that angle out.
  const azimuth = -beat * Math.PI * 2;

  return {
    ...feature,
    index: String(i + 1).padStart(2, '0'),
    ordinal: i,
    total: COPY.length,
    azimuth,
    anchor: [ANCHOR_X * Math.sin(azimuth), 0.06, ANCHOR_Z * Math.cos(azimuth)],
    // Eligible slightly before it swings into view, so it is already the
    // front-most candidate by the time it gets there. Never before the turn
    // starts: nothing should be legible while the mat is still lifting.
    unlock: ROTATE_START + Math.max(0, beat - 0.08) * ROTATE_SPAN,
  };
});

/**
 * One callout, styled as an anchored instrument readout: a glowing node that
 * sits on the mat, a thin leader rising to a floating card, a large ghosted
 * index numeral behind the copy, and a spec footer carrying the one hard
 * number plus the reader's position in the sequence.
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
function FeatureLabel({ feature, rotationRef, activeIdRef }) {
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

  return (
    <Html position={feature.anchor} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      {/* Narrower than the copy strictly needs. A card the visitor can take in
          without moving their eyes across it is the point; wide cards invite
          long lines, and long lines are what made the previous ones read as
          blocks of text floating over the scene. */}
      <div
        ref={wrapRef}
        style={{ opacity: 0, visibility: 'hidden' }}
        className="relative w-[148px] select-none sm:w-[226px]"
      >
        {/* ── Connector tail ───────────────────────────────────────────
            A leader dropping from the card's bottom edge to a glowing node.
            Integral to the card (not separately anchored), so it reads as
            "pinned to the mat" and tracks the card cleanly as it fades.
            drei's <Html center> centers the whole wrapper, so a separately
            positioned node can't reliably land on the 3D anchor, this keeps
            the whole readout self-contained. */}
        <div className="pointer-events-none absolute left-5 top-full flex flex-col items-center sm:left-8">
          <span
            className="h-6 w-px sm:h-9"
            style={{ background: 'linear-gradient(to bottom, rgba(255,176,97,0.9), rgba(255,176,97,0.12))' }}
          />
          {/* Node, with a static outer ring. A CSS keyframe pulse here would be
              animating an element that is already being faded by JS every
              frame, and the two read as jitter rather than as a heartbeat. */}
          <span
            className="h-[7px] w-[7px] rounded-full bg-heat-400 sm:h-[8px] sm:w-[8px]"
            style={{
              boxShadow:
                '0 0 0 3px rgba(255,138,61,0.16), 0 0 0 7px rgba(255,138,61,0.06), 0 0 20px 5px rgba(255,138,61,0.75)',
            }}
          />
        </div>

        {/* ── Card ─────────────────────────────────────────────────────
            Every size below is responsive: the base values fit a phone,
            the sm: values (≥640px) restore the full desktop card. */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-xl p-[1px] sm:rounded-2xl"
          style={{
            // Gradient border: bright warm at top-left, fading to hairline
            // one of the cheapest ways to make a card read as lit.
            background:
              'linear-gradient(150deg, rgba(255,176,97,0.6), rgba(255,255,255,0.09) 32%, rgba(255,255,255,0.04) 70%)',
            boxShadow: '0 30px 70px -24px rgba(0,0,0,0.95), 0 2px 10px -2px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="relative overflow-hidden rounded-[11px] sm:rounded-[15px]"
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
              className="pointer-events-none absolute -left-5 -top-5 h-14 w-14 rounded-full sm:-left-6 sm:-top-6 sm:h-20 sm:w-20"
              style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.18), transparent 70%)' }}
            />

            <div className="relative px-2.5 pb-2 pt-2 sm:px-4 sm:pb-2.5 sm:pt-3">
              {/* Ghosted index numeral behind the copy */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-1.5 right-1 font-display text-[34px] font-bold leading-none text-white/[0.05] sm:-top-2 sm:right-1.5 sm:text-[52px]"
              >
                {feature.index}
              </span>

              {/* Header row: counter chip + eyebrow. The chip carries the
                  total as well as the index, so the card answers "how much of
                  this is left" without the visitor having to count ticks. */}
              <div className="relative flex items-center gap-1.5 sm:gap-2">
                <span className="flex h-[14px] items-center rounded-full bg-heat-500/15 px-1.5 font-mono text-[7.5px] font-medium tracking-[0.1em] text-heat-300 ring-1 ring-inset ring-heat-400/25 sm:h-[16px] sm:px-1.5 sm:text-[8.5px]">
                  {feature.index}
                  <span className="text-heat-300/40">/{String(feature.total).padStart(2, '0')}</span>
                </span>
                <span className="text-[6.5px] font-medium uppercase tracking-[0.24em] text-white/35 sm:text-[8px] sm:tracking-[0.3em]">
                  {feature.kicker}
                </span>
              </div>

              {/* No divider between title and body any more. At this size the
                  two are already a single glance, and a rule through the
                  middle of four words reads as a seam in the card. */}
              <p className="relative mt-1.5 font-display text-[11px] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:mt-2 sm:text-[14px]">
                {feature.title}
              </p>

              <p className="relative mt-1 text-[9px] leading-snug text-white/50 sm:mt-1.5 sm:text-[10.5px]">
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
              className="relative flex items-center justify-between gap-2 border-t border-white/[0.07] px-2.5 py-1.5 sm:px-4 sm:py-2"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.028), rgba(0,0,0,0.22))' }}
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[12px] font-bold leading-none text-heat-400 sm:text-[15px]">
                  {feature.spec}
                </span>
                <span className="text-[7px] uppercase tracking-[0.16em] text-white/40 sm:text-[8.5px] sm:tracking-[0.2em]">
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
 */
function HeatingSheetModel({ rotationRef, progressRef, showLabels = true, levelRef = null }) {
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
    activeIdRef.current = bestId;
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

      {showLabels &&
        FEATURES.map((f) => (
          <FeatureLabel
            key={f.id}
            feature={f}
            rotationRef={rotationRef}
            activeIdRef={activeIdRef}
          />
        ))}
    </group>
  );
}

export { FEATURES };
export default memo(HeatingSheetModel);
