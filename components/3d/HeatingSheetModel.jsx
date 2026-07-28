'use client';

import { memo, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CableModel from './CableModel';
import { MAT_W, MAT_L, CABLE_RADIUS } from './constants';
import { buildMatCable, matBands } from './mat-layout';
import { meshAlpha } from '@/lib/textures';

/**
 * Feature callouts, each anchored to a corner of the mat with an `azimuth`:
 * the direction that corner faces in the mat's local space.
 *
 * Visibility uses that azimuth rather than per-face normals and camera dot
 * products. The mat is flat, so every face normal points straight up, a
 * dot-product test returns the same answer for all four labels and cannot
 * distinguish them. Azimuth has no failure mode and gives the intended
 * effect: a callout is legible only while its edge faces the viewer.
 */
const FEATURES = [
  {
    id: 'profile',
    index: '01',
    kicker: 'Profile',
    title: 'Ultra-thin build height',
    body: 'Sits under the finish with no door trimming and no step between rooms.',
    spec: '5 mm',
    specLabel: 'total profile',
    anchor: [-MAT_W / 2 + 0.3, 0.07, -MAT_L / 2 + 0.34],
    azimuth: Math.PI * 0.75,
    unlock: 0.66,
  },
  {
    id: 'cable',
    index: '02',
    kicker: 'The cable',
    title: 'Self-regulating output',
    body: 'Adapts section by section, cold spots draw more, warm spots less.',
    spec: 'Auto',
    specLabel: 'per-zone',
    anchor: [MAT_W / 2 - 0.3, 0.07, -MAT_L / 2 + 0.34],
    azimuth: Math.PI * 0.25,
    unlock: 0.74,
  },
  {
    id: 'distribution',
    index: '03',
    kicker: 'Coverage',
    title: 'Even heat distribution',
    body: 'Fixed cable spacing across the mat, no hot stripes, no cold patches.',
    spec: '75 mm',
    specLabel: 'spacing',
    anchor: [MAT_W / 2 - 0.3, 0.07, MAT_L / 2 - 0.34],
    azimuth: -Math.PI * 0.25,
    unlock: 0.82,
  },
  {
    id: 'warranty',
    index: '04',
    kicker: 'Assurance',
    title: 'Backed for the long run',
    body: 'Cable and mat covered for a decade, behind certified installation.',
    spec: '10 yr',
    specLabel: 'warranty',
    anchor: [-MAT_W / 2 + 0.3, 0.07, MAT_L / 2 - 0.34],
    azimuth: -Math.PI * 0.75,
    unlock: 0.9,
  },
];

/**
 * One callout, styled as an anchored instrument readout: a glowing node that
 * sits on the mat, a thin leader rising to a floating card, a large ghosted
 * index numeral behind the copy, and a spec footer.
 *
 * Opacity is written straight to the DOM each frame, routing it through
 * state would re-render four Html portals every frame. No backdrop-blur: a
 * blurred backdrop over a moving WebGL canvas forces the compositor to
 * re-sample the canvas behind every card each frame, which is expensive. The
 * layered dark gradient fill reads the same and costs nothing.
 */
function FeatureLabel({ feature, rotationRef, progressRef, activeIdRef }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  useFrame(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // The camera looks down -Z, so this corner faces us when
    // cos(rotY + azimuth) ≈ 1.
    const facing = Math.cos(rotationRef.current + feature.azimuth);
    // Only the single front-most unlocked label is live (see the winner pick
    // in HeatingSheetModel), so exactly one callout shows at a time and the
    // earlier ones clear the moment a later corner turns into view.
    const active = activeIdRef.current === feature.id ? 1 : 0;
    const opacity = Math.min(1, Math.max(0, (facing - 0.1) / 0.5)) * active;

    wrap.style.opacity = opacity.toFixed(3);
    // Card lifts and settles as it resolves; the node/leader stay put.
    if (cardRef.current) {
      cardRef.current.style.transform = `translateY(${((1 - opacity) * 14).toFixed(1)}px)`;
    }
  });

  return (
    <Html position={feature.anchor} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      <div
        ref={wrapRef}
        style={{ opacity: 0, transition: 'opacity 120ms linear' }}
        className="relative w-[150px] select-none sm:w-[248px]"
      >
        {/* ── Connector tail ───────────────────────────────────────────
            A leader dropping from the card's bottom edge to a glowing node.
            Integral to the card (not separately anchored), so it reads as
            "pinned to the mat" and tracks the card cleanly as it fades.
            drei's <Html center> centers the whole wrapper, so a separately
            positioned node can't reliably land on the 3D corner, this keeps
            the whole readout self-contained. */}
        <div className="pointer-events-none absolute left-5 top-full flex flex-col items-center sm:left-8">
          <span
            className="h-6 w-px sm:h-9"
            style={{ background: 'linear-gradient(to bottom, rgba(255,176,97,0.9), rgba(255,176,97,0.15))' }}
          />
          <span
            className="h-[6px] w-[6px] rounded-full bg-heat-400 sm:h-[7px] sm:w-[7px]"
            style={{ boxShadow: '0 0 0 4px rgba(255,138,61,0.12), 0 0 18px 4px rgba(255,138,61,0.8)' }}
          />
        </div>

        {/* ── Card ─────────────────────────────────────────────────────
            Every size below is responsive: the base values fit a phone,
            the sm: values (≥640px) restore the full desktop card unchanged. */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-xl p-[1px] sm:rounded-2xl"
          style={{
            // Gradient border: bright warm at top-left, fading to hairline 
            // one of the cheapest ways to make a card read as lit.
            background:
              'linear-gradient(150deg, rgba(255,176,97,0.55), rgba(255,255,255,0.08) 32%, rgba(255,255,255,0.04) 70%)',
            boxShadow: '0 30px 70px -24px rgba(0,0,0,0.95), 0 2px 10px -2px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="relative overflow-hidden rounded-[11px] px-3 pb-2.5 pt-2.5 sm:rounded-[15px] sm:px-5 sm:pb-4 sm:pt-4"
            style={{
              background:
                'linear-gradient(158deg, #1c1813 0%, #131110 46%, #100e0c 100%)',
            }}
          >
            {/* Ghosted index numeral behind the copy */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-0.5 -top-2 font-display text-[40px] font-bold leading-none text-white/[0.045] sm:-right-1 sm:-top-3 sm:text-[64px]"
            >
              {feature.index}
            </span>

            {/* Warm wash bleeding in from the lit corner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-5 -top-5 h-14 w-14 rounded-full sm:-left-6 sm:-top-6 sm:h-20 sm:w-20"
              style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.16), transparent 70%)' }}
            />

            {/* Header row: index chip + eyebrow */}
            <div className="relative flex items-center gap-1.5 sm:gap-2.5">
              <span className="flex h-[15px] items-center rounded-full bg-heat-500/15 px-1.5 font-mono text-[8px] font-medium tracking-[0.14em] text-heat-300 ring-1 ring-inset ring-heat-400/25 sm:h-[18px] sm:px-2 sm:text-[9px] sm:tracking-[0.18em]">
                {feature.index}
              </span>
              <span className="text-[7px] font-medium uppercase tracking-[0.24em] text-white/35 sm:text-[8.5px] sm:tracking-[0.32em]">
                {feature.kicker}
              </span>
            </div>

            <p className="relative mt-2 font-display text-[11.5px] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:mt-3 sm:text-[15px]">
              {feature.title}
            </p>

            {/* Hairline divider */}
            <div className="relative mt-2 h-px w-full bg-gradient-to-r from-white/12 via-white/5 to-transparent sm:mt-3" />

            <p className="relative mt-2 text-[9.5px] leading-relaxed text-white/55 sm:mt-3 sm:text-[11.5px]">
              {feature.body}
            </p>

            {/* Spec footer, the one hard number, treated like an instrument
                value, which is what makes the whole card read as technical
                rather than marketing. */}
            {feature.spec ? (
              <div className="relative mt-2.5 flex items-baseline gap-1.5 sm:mt-3.5">
                <span className="font-display text-[13px] font-bold leading-none text-heat-400 sm:text-[17px]">
                  {feature.spec}
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.18em] text-white/40 sm:text-[9px] sm:tracking-[0.22em]">
                  {feature.specLabel}
                </span>
              </div>
            ) : null}
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
   * unlocked label whose corner most directly faces the camera; every other
   * label reads this and stays hidden. This is what makes the reveal strictly
   * sequential, as the mat turns and a new corner comes forward it takes over,
   * and the previous callouts drop away rather than lingering two-at-a-time.
   */
  const activeIdRef = useRef(null);
  useFrame(() => {
    let bestId = null;
    let best = 0.12; // ignore corners barely edge-on to the camera
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
            progressRef={progressRef}
            activeIdRef={activeIdRef}
          />
        ))}
    </group>
  );
}

export { FEATURES };
export default memo(HeatingSheetModel);
