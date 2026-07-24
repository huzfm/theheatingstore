'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import HeatingSheetModel from './HeatingSheetModel';
import StudioEnvironment from './StudioEnvironment';
import { TileLayer, AdhesiveLayer } from './FloorLayers';
import { InsulationLayer, SubfloorLayer } from './BaseLayers';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep } from '@/lib/three-utils';
import { retainTextures, releaseTextures, groundShadow } from '@/lib/textures';

/**
 * Baked shadow plane, in place of drei's ContactShadows.
 *
 * ContactShadows renders a depth pass into a render target every frame. For
 * a stack that only ever moves vertically, a single pre-drawn gradient is
 * visually near-identical and costs one textured quad. It fades as the
 * layers lift, so the ground darkening tracks what's actually above it.
 */
function GroundShadow({ progressRef }) {
  const ref = useRef(null);
  const map = useMemo(() => groundShadow(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const recede = smoothstep(stageProgress(progressRef.current, ...TIMELINE.baseRecede));
    if (ref.current) {
      ref.current.material.opacity = damp(ref.current.material.opacity, 0.7 - recede * 0.45, 4, dt);
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[11, 9]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={0.7}
        depthWrite={false}
        color="#000000"
      />
    </mesh>
  );
}

/**
 * Camera and the mat. Each floor layer owns its own animation (see
 * FloorLayers / BaseLayers), leaving this file the two genuinely global
 * concerns: where the camera is, and how the mat moves.
 */
function SceneRig({ progressRef, reduced }) {
  const matRef = useRef(null);
  const rotationRef = useRef(0);
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = progressRef.current;

    const rise = smoothstep(stageProgress(p, ...TIMELINE.matRise));
    const spin = stageProgress(p, ...TIMELINE.rotate);

    if (matRef.current) {
      // 0.4 rather than 0.65 — the larger lift left an obvious empty gap
      // between the mat and the insulation it's supposed to sit on.
      matRef.current.position.y = damp(matRef.current.position.y, rise * 0.4, 5, dt);

      // A quarter turn as it lifts, then a full 360°. The lift's tilt unwinds
      // by (1 - spin) so the turn ends at exactly 360° — square to camera —
      // rather than 405°, which would leave the mat sitting askew. Both terms
      // are absolute, so scrubbing back rewinds to the same angle.
      const target = rise * Math.PI * 0.25 * (1 - spin) + spin * Math.PI * 2;
      rotationRef.current = damp(rotationRef.current, target, 7, dt);
      matRef.current.rotation.y = rotationRef.current;
      matRef.current.rotation.z = damp(matRef.current.rotation.z, rise * 0.07 * (1 - spin), 5, dt);
    }

    // Pulls in for the mat reveal, then eases back out for the rotation —
    // at full turn the mat's diagonal is wider than its face, so holding the
    // close framing cropped its corners off the edge of the viewport.
    const camY = 2.75 - rise * 0.35 + spin * 0.15;
    const camZ = 6.5 - rise * 0.5 + spin * 0.6;

    /**
     * Responsive framing.
     *
     * A perspective camera's `fov` is the VERTICAL field of view, so the
     * horizontal view narrows with the aspect ratio. The mat is wide, so on
     * a portrait phone the same camera crops its left/right edges off screen.
     *
     * Visible width at a given distance is proportional to aspect, so to keep
     * the mat framed we dolly the camera back by DESIGN_ASPECT / aspect once
     * the viewport is narrower than the design aspect. Reading state.size
     * every frame means this also tracks device rotation and window resize
     * with no extra listeners. Clamped so an ultra-tall viewport doesn't send
     * the camera to infinity. Scaling camY and camZ together dollies straight
     * back along the view ray without changing the viewing angle.
     */
    const DESIGN_ASPECT = 1.6;
    const aspect = state.size.width / state.size.height;
    const fit = Math.min(2.35, Math.max(1, DESIGN_ASPECT / aspect));

    state.camera.position.y = damp(state.camera.position.y, camY * fit, 3.5, dt);
    state.camera.position.z = damp(state.camera.position.z, camZ * fit, 3.5, dt);
    state.camera.lookAt(0, rise * 0.42, 0);

    if (groupRef.current && !reduced) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* No shadow-casting lights. The environment map does the shaping, and
          a real-time shadow map re-rendered every frame with 10+ casters was
          a large part of the scroll jank for a shadow the baked plane below
          already approximates. */}
      <directionalLight position={[-4.5, 7, 4]} intensity={1.35} color="#fff3e4" />
      <directionalLight position={[5, 3, -6]} intensity={0.5} color="#9fc0ff" />
      <ambientLight intensity={0.22} />

      <TileLayer progressRef={progressRef} />
      <AdhesiveLayer progressRef={progressRef} />

      <group ref={matRef}>
        <HeatingSheetModel
          rotationRef={rotationRef}
          progressRef={progressRef}
          showLabels={!reduced}
        />
      </group>

      <InsulationLayer progressRef={progressRef} />
      <SubfloorLayer progressRef={progressRef} />
      <GroundShadow progressRef={progressRef} />
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
 * Canvas wrapper.
 *
 * Performance posture, after the previous pass was too heavy to scroll:
 *  - no EffectComposer. A full-screen HDR target with 4x MSAA at 1.75 DPR
 *    was the single biggest cost; the cable's glow is now additive sprites
 *    plus an emissive material, which is a fraction of the price.
 *  - no real-time shadow maps (see SceneRig).
 *  - DPR capped at 1.4, and PerformanceMonitor drops it further on machines
 *    that can't hold framerate, so weak GPUs degrade instead of stuttering.
 *  - frameloop parks at 'never' whenever the section is off screen.
 */
export default function FloorCutawayScene({
  progressRef,
  active = true,
  reduced = false,
}) {
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 2.75, 6.5], fov: 38, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        // Down from 1.1: the studio rig was overexposing every pale surface
        // to flat white, killing all the texture detail underneath.
        toneMappingExposure: 0.85,
      }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Steps DPR down when frames start dropping and back up when there's
          headroom, so the scene self-tunes per machine instead of being
          fixed at whatever looked fine on the dev box. */}
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.4)}
        flipflops={3}
        onFallback={() => setDpr(0.85)}
      />

      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 9, 21]} />

      <StudioEnvironment />
      <SceneRig progressRef={progressRef} reduced={reduced} />
      <TextureCleanup />
    </Canvas>
  );
}
