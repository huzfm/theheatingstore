'use client';

import { memo, useMemo, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CableModel from './CableModel';
import { MAT_W, MAT_L, CABLE_SPACING } from './constants';
import { meshAlpha } from '@/lib/textures';

/**
 * Feature callouts, each anchored to a corner of the mat with an `azimuth`:
 * the direction that corner faces in the mat's local space.
 *
 * Visibility uses that azimuth rather than per-face normals and camera dot
 * products. The mat is flat, so every face normal points straight up — a
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
    body: 'Adapts section by section — cold spots draw more, warm spots less.',
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
    body: 'Fixed cable spacing across the mat — no hot stripes, no cold patches.',
    spec: '50 mm',
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
 * Opacity is written straight to the DOM each frame — routing it through
 * state would re-render four Html portals every frame. No backdrop-blur: a
 * blurred backdrop over a moving WebGL canvas forces the compositor to
 * re-sample the canvas behind every card each frame, which is expensive. The
 * layered dark gradient fill reads the same and costs nothing.
 */
function FeatureLabel({ feature, rotationRef, progressRef }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  useFrame(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // The camera looks down -Z, so this corner faces us when
    // cos(rotY + azimuth) ≈ 1.
    const facing = Math.cos(rotationRef.current + feature.azimuth);
    const unlocked = progressRef.current >= feature.unlock ? 1 : 0;
    const opacity = Math.min(1, Math.max(0, (facing - 0.1) / 0.5)) * unlocked;

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
        className="relative w-[200px] select-none sm:w-[248px]"
      >
        {/* ── Connector tail ───────────────────────────────────────────
            A leader dropping from the card's bottom edge to a glowing node.
            Integral to the card (not separately anchored), so it reads as
            "pinned to the mat" and tracks the card cleanly as it fades.
            drei's <Html center> centers the whole wrapper, so a separately
            positioned node can't reliably land on the 3D corner — this keeps
            the whole readout self-contained. */}
        <div className="pointer-events-none absolute left-8 top-full flex flex-col items-center">
          <span
            className="h-9 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(255,176,97,0.9), rgba(255,176,97,0.15))' }}
          />
          <span
            className="h-[7px] w-[7px] rounded-full bg-heat-400"
            style={{ boxShadow: '0 0 0 4px rgba(255,138,61,0.12), 0 0 18px 4px rgba(255,138,61,0.8)' }}
          />
        </div>

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl p-[1px]"
          style={{
            // Gradient border: bright warm at top-left, fading to hairline —
            // one of the cheapest ways to make a card read as lit.
            background:
              'linear-gradient(150deg, rgba(255,176,97,0.55), rgba(255,255,255,0.08) 32%, rgba(255,255,255,0.04) 70%)',
            boxShadow: '0 30px 70px -24px rgba(0,0,0,0.95), 0 2px 10px -2px rgba(0,0,0,0.6)',
          }}
        >
          <div
            className="relative overflow-hidden rounded-[15px] px-5 pb-4 pt-4"
            style={{
              background:
                'linear-gradient(158deg, #1c1813 0%, #131110 46%, #100e0c 100%)',
            }}
          >
            {/* Ghosted index numeral behind the copy */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 -top-3 font-display text-[64px] font-bold leading-none text-white/[0.045]"
            >
              {feature.index}
            </span>

            {/* Warm wash bleeding in from the lit corner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.16), transparent 70%)' }}
            />

            {/* Header row: index chip + eyebrow */}
            <div className="relative flex items-center gap-2.5">
              <span className="flex h-[18px] items-center rounded-full bg-heat-500/15 px-2 font-mono text-[9px] font-medium tracking-[0.18em] text-heat-300 ring-1 ring-inset ring-heat-400/25">
                {feature.index}
              </span>
              <span className="text-[8.5px] font-medium uppercase tracking-[0.32em] text-white/35">
                {feature.kicker}
              </span>
            </div>

            <p className="relative mt-3 font-display text-[15px] font-semibold leading-[1.15] tracking-[-0.01em] text-white">
              {feature.title}
            </p>

            {/* Hairline divider */}
            <div className="relative mt-3 h-px w-full bg-gradient-to-r from-white/12 via-white/5 to-transparent" />

            <p className="relative mt-3 text-[11.5px] leading-relaxed text-white/55">
              {feature.body}
            </p>

            {/* Spec footer — the one hard number, treated like an instrument
                value, which is what makes the whole card read as technical
                rather than marketing. */}
            {feature.spec ? (
              <div className="relative mt-3.5 flex items-baseline gap-1.5">
                <span className="font-display text-[17px] font-bold leading-none text-heat-400">
                  {feature.spec}
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-white/40">
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
 * The cold tail: the unheated supply lead that runs from the mat back to the
 * thermostat, joined by a moulded factory splice. Every real mat has one,
 * and its absence is a detail the eye notices without being able to name —
 * a heating mat with no way of connecting to anything reads as a prop.
 */
function ColdTail() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-MAT_W / 2 + 0.1, 0.01, MAT_L / 2 - 0.1),
        new THREE.Vector3(-MAT_W / 2 - 0.35, 0.01, MAT_L / 2 + 0.05),
        new THREE.Vector3(-MAT_W / 2 - 0.75, 0.01, MAT_L / 2 + 0.32),
        new THREE.Vector3(-MAT_W / 2 - 1.15, 0.01, MAT_L / 2 + 0.3),
      ]),
    []
  );

  // A cold tail is thicker than the heating cable but not by much — at the
  // previous 0.026 it read as a garden hose bolted to the mat.
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 40, 0.009, 6, false),
    [curve]
  );

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#151515" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Moulded joint where cold tail meets heating cable */}
      <mesh position={[-MAT_W / 2 - 0.3, 0.012, MAT_L / 2 + 0.02]} rotation={[0, 0.5, Math.PI / 2]}>
        <capsuleGeometry args={[0.014, 0.06, 3, 8]} />
        <meshStandardMaterial color="#262626" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * The heating mat: fibreglass scrim, cable at real spacing, cold tail and
 * factory splice.
 */
function HeatingSheetModel({ rotationRef, progressRef, showLabels = true }) {
  const mesh = useMemo(() => meshAlpha(), []);

  return (
    <group>
      {/* Fibreglass scrim. Real mats are an open weave you can see through,
          so this is an alpha cut-out rather than a solid backing slab —
          light passes between the strands and the layer below shows through,
          which is what makes it read as mesh and not as card. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[MAT_W, MAT_L]} />
        {/* Lower opacity and no alphaTest: the hard cutout rendered as a
            drawn wireframe grid. A soft translucent scrim reads as fabric,
            which is what it is. */}
        <meshStandardMaterial
          color="#a49d90"
          alphaMap={mesh}
          alphaMap-repeat={[8, 6]}
          transparent
          opacity={0.28}
          roughness={0.85}
          metalness={0}
          envMapIntensity={0.5}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group position={[0, 0.018, 0]}>
        <CableModel width={MAT_W} length={MAT_L} spacing={CABLE_SPACING} />
      </group>

      <ColdTail />

      {showLabels &&
        FEATURES.map((f) => (
          <FeatureLabel
            key={f.id}
            feature={f}
            rotationRef={rotationRef}
            progressRef={progressRef}
          />
        ))}
    </group>
  );
}

export { FEATURES };
export default memo(HeatingSheetModel);
