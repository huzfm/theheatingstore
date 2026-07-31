'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import HeatingSheetModel from './HeatingSheetModel';
import StudioEnvironment from './StudioEnvironment';
import { RAIL_CALLOUTS, RAIL_KEYS, sampleRail } from '@/lib/story-rail';
import { clamp, damp, fadeBand, PALETTE } from '@/lib/three-utils';
import { retainTextures, releaseTextures, groundShadow } from '@/lib/textures';

/**
 * The About story rail's 3D panel: the heating mat alone, lit as a product
 * shot, reacting to which paragraph of the left column is currently being
 * read.
 *
 * Deliberately NOT the layered cross-section from FloorCutawayScene, that
 * sequence is /working's set piece (components/sections/FloorRevealSection),
 * and rebuilding it here would make the two pages compete. This scene reuses
 * the same mat, studio rig and performance posture, but the subject is the
 * product itself rather than the build-up around it.
 */

/**
 * Baked soft shadow, grounding the mat. Same reasoning as the cutaway scene's
 * GroundShadow: a real-time depth pass every frame is a lot to pay for a blur
 * under a flat object.
 *
 * It tightens as the camera drops toward the mat, which is the direction a
 * contact shadow actually goes, wide and soft from above, compact and darker
 * from a low raking angle.
 */
function GroundShadow({ railState }) {
  const ref = useRef(null);
  const map = useMemo(() => groundShadow(), []);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const dt = Math.min(delta, 0.05);
    // Camera y runs ~1.15 (raking) to ~4.7 (overhead).
    const height = clamp((railState.y - 1.15) / 3.55, 0, 1);
    const spread = 0.82 + height * 0.3;
    mesh.scale.x = damp(mesh.scale.x, spread, 3, dt);
    mesh.scale.y = damp(mesh.scale.y, spread, 3, dt);
    mesh.material.opacity = damp(mesh.material.opacity, 0.78 - height * 0.22, 3, dt);
  });

  return (
    <mesh ref={ref} position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[9, 7]} />
      <meshBasicMaterial map={map} transparent opacity={0.78} depthWrite={false} color="#000000" />
    </mesh>
  );
}

/**
 * One anchored callout.
 *
 * Opacity is written straight to the DOM in useFrame rather than held in
 * state, these sit inside an Html portal over a live canvas, and re-rendering
 * them every frame would be the most expensive thing on the page. Same
 * approach as FeatureLabel in HeatingSheetModel, minus the spec footer and the
 * azimuth facing test (these two are anchored to fixed points and gated purely
 * on scroll, because the mat here never makes a full turn).
 */
function RailCallout({ callout, progressRef }) {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  useFrame(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // fadeBand feathers both ends, so the label eases in and out instead of
    // popping at the band edges.
    const opacity = fadeBand(progressRef.current, callout.band[0], callout.band[1], 0.07);

    wrap.style.opacity = opacity.toFixed(3);
    if (cardRef.current) {
      cardRef.current.style.transform = `translateY(${((1 - opacity) * 12).toFixed(1)}px)`;
    }
  });

  return (
    <Html position={callout.anchor} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      <div
        ref={wrapRef}
        style={{ opacity: 0, transition: 'opacity 120ms linear' }}
        className="relative w-[190px] select-none sm:w-[236px]"
      >
        {/* Leader dropping to a glowing node on the mat */}
        <div className="pointer-events-none absolute left-6 top-full flex flex-col items-center">
          <span
            className="h-7 w-px sm:h-9"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,176,97,0.9), rgba(255,176,97,0.12))',
            }}
          />
          <span
            className="h-[6px] w-[6px] rounded-full bg-heat-400"
            style={{ boxShadow: '0 0 0 4px rgba(255,138,61,0.12), 0 0 18px 4px rgba(255,138,61,0.8)' }}
          />
        </div>

        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl p-[1px]"
          style={{
            background:
              'linear-gradient(150deg, rgba(255,176,97,0.5), rgba(255,255,255,0.07) 34%, rgba(255,255,255,0.04) 72%)',
            boxShadow: '0 30px 70px -24px rgba(0,0,0,0.95)',
          }}
        >
          <div
            className="relative overflow-hidden rounded-[15px] px-4 pb-3.5 pt-3.5"
            style={{ background: 'linear-gradient(158deg, #1c1813 0%, #131110 46%, #100e0c 100%)' }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.16), transparent 70%)' }}
            />
            <span className="relative text-[8px] font-medium uppercase tracking-[0.3em] text-white/35">
              {callout.kicker}
            </span>
            <p className="relative mt-2.5 font-display text-[14px] font-semibold leading-[1.15] text-white">
              {callout.title}
            </p>
            <div className="relative mt-2.5 h-px w-full bg-gradient-to-r from-white/12 via-white/5 to-transparent" />
            <p className="relative mt-2.5 text-[11px] leading-relaxed text-white/55">
              {callout.body}
            </p>
          </div>
        </div>
      </div>
    </Html>
  );
}

/**
 * Reused across frames, sampleRail writes into this rather than allocating a
 * fresh object 60 times a second. SceneRig fills it and GroundShadow reads it;
 * a frame of lag between the two is not perceivable in a soft blur.
 */
const RAIL_STATE = { y: 1.15, z: 7.1, yaw: -0.34, tilt: 0, level: 0 };

/**
 * Fixed pose for the hero panel: a raised 3/4 product angle with the cable at
 * full output. `yaw` is unused in turntable mode, the mat turns continuously
 * instead, but is kept so the object matches the shape sampleRail writes.
 *
 * Chosen to be visibly different from where the story rail comes to rest
 * (flat-on, y 2.9 / z 6.9). The two panels are on the same page a few screens
 * apart, and an identical framing twice reads as a repeated asset.
 */
const TURNTABLE_POSE = { y: 2.35, z: 6.15, yaw: 0, tilt: 0.06, level: 1 };

function SceneRig({ progressRef, idle, showCallouts, turntable }) {
  const matRef = useRef(null);
  const driftRef = useRef(null);
  const rotationRef = useRef(0);
  const levelRef = useRef(0);
  const heatLightRef = useRef(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    // Both branches write the same shared object, so GroundShadow has one
    // place to read the current camera height from either way.
    const target = turntable
      ? Object.assign(RAIL_STATE, TURNTABLE_POSE)
      : sampleRail(progressRef.current, RAIL_STATE);

    /* ── Mat attitude ─────────────────────────────────────────────────
       damp on top of an already-smoothed keyframe sample. The keyframes
       remove the kinks between states; the damp adds the slight lag that
       makes the mat feel like it has weight rather than being welded to
       the scrollbar. */
    if (matRef.current) {
      if (turntable) {
        // ~63s per revolution. Slow enough to read as a considered product
        // shot rather than a spinning logo, fast enough that the studio
        // speculars visibly travel across the cable while you read the copy.
        if (idle) rotationRef.current += dt * 0.1;
        matRef.current.rotation.y = rotationRef.current;
      } else {
        rotationRef.current = damp(rotationRef.current, target.yaw, 4, dt);
        matRef.current.rotation.y = rotationRef.current;
      }
      matRef.current.rotation.z = damp(matRef.current.rotation.z, target.tilt, 4, dt);
    }

    // Cable brightness. Read by CableModel in its own useFrame.
    levelRef.current = damp(levelRef.current, target.level, 3, dt);

    // Warm spill under the mat, tracking the cable, this is what sells the
    // ignition beat, because the light lands on the shadow plane too.
    if (heatLightRef.current) {
      heatLightRef.current.intensity = levelRef.current * 2.4;
    }

    /* ── Camera ───────────────────────────────────────────────────────
       Responsive framing, same technique as FloorCutawayScene: `fov` is the
       VERTICAL field of view, so a narrow column crops the mat's width. The
       right rail is roughly 4:5, hence a portrait DESIGN_ASPECT rather than
       the cutaway's 1.6. Reading state.size every frame means this tracks
       window resize and device rotation with no listener of its own. */
    const DESIGN_ASPECT = 1.15;
    const aspect = state.size.width / state.size.height;
    const fit = Math.min(2.2, Math.max(1, DESIGN_ASPECT / aspect));

    state.camera.position.y = damp(state.camera.position.y, target.y * fit, 3, dt);
    state.camera.position.z = damp(state.camera.position.z, target.z * fit, 3, dt);
    state.camera.lookAt(0, 0, 0);

    /* ── Idle ─────────────────────────────────────────────────────────
       A slow yaw drift and an even slower vertical breath, layered on the
       scroll state so the panel is never completely still between beats.
       Both are off under reduced motion. */
    if (driftRef.current && idle) {
      // The yaw drift is skipped in turntable mode, a sine wobble layered on
      // a constant rotation just makes the turn look like it's stuttering.
      if (!turntable) driftRef.current.rotation.y = Math.sin(t * 0.18) * 0.045;
      driftRef.current.position.y = Math.sin(t * 0.5) * 0.014;
    }
  });

  return (
    <group ref={driftRef}>
      {/* No shadow-casting lights, the environment map does the shaping and
          the baked plane below approximates the contact shadow. */}
      <directionalLight position={[-4.5, 7, 4]} intensity={1.3} color="#fff3e4" />
      <directionalLight position={[5, 3, -6]} intensity={0.5} color="#9fc0ff" />
      <ambientLight intensity={0.24} />
      <pointLight ref={heatLightRef} position={[0, -0.22, 0]} intensity={0} distance={7} color={PALETTE.heat500} />

      <group ref={matRef}>
        <HeatingSheetModel
          rotationRef={rotationRef}
          progressRef={progressRef}
          levelRef={levelRef}
          showLabels={false}
        />
        {/* Callouts are scroll-gated, so they need a progressRef. In turntable
            mode there isn't one. */}
        {showCallouts && progressRef
          ? RAIL_CALLOUTS.map((c) => (
              <RailCallout key={c.id} callout={c} progressRef={progressRef} />
            ))
          : null}
      </group>

      <GroundShadow railState={RAIL_STATE} />
    </group>
  );
}

function TextureCleanup() {
  useEffect(() => {
    retainTextures();
    return () => releaseTextures();
  }, []);
  return null;
}

/**
 * Canvas wrapper. Performance posture inherited from FloorCutawayScene:
 * no EffectComposer, no real-time shadow maps, DPR capped and auto-degraded
 * by PerformanceMonitor, and the render loop parked whenever the section is
 * off screen.
 *
 * @param {object} progressRef  0→1 scroll position, written by ScrollTrigger
 * @param {boolean} active      run the render loop
 * @param {boolean} idle        continuous drift/breath (off for reduced motion)
 * @param {boolean} showCallouts anchored labels (off on small viewports)
 * @param {boolean} turntable   fixed hero pose with a slow continuous turn,
 *                              ignoring progressRef entirely
 * @param {() => void} onReady  fired once the GL context exists, so the caller
 *                              can cross-fade from its placeholder
 */
export default function StoryMatScene({
  progressRef,
  active = true,
  idle = true,
  showCallouts = true,
  turntable = false,
  onReady,
}) {
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{
        position: turntable
          ? [0, TURNTABLE_POSE.y, TURNTABLE_POSE.z]
          : [0, RAIL_KEYS[0].y, RAIL_KEYS[0].z],
        fov: 38,
        near: 0.1,
        far: 60,
      }}
      onCreated={onReady}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      style={{ pointerEvents: 'none' }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.4)}
        flipflops={3}
        onFallback={() => setDpr(0.85)}
      />

      {/* Transparent background: the panel's own CSS gradient shows through,
          so the canvas sits in the page's warm wash rather than punching a
          flat black rectangle into it. */}
      <fog attach="fog" args={['#0a0a0a', 8, 20]} />

      <StudioEnvironment />
      <SceneRig
        progressRef={progressRef}
        idle={idle}
        showCallouts={showCallouts}
        turntable={turntable}
      />
      <TextureCleanup />
    </Canvas>
  );
}
