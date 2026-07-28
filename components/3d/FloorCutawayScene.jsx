'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import HeatingSheetModel from './HeatingSheetModel';
import StudioEnvironment from './StudioEnvironment';
import { CarpetLayer } from './FloorLayers';
import { InsulationLayer, SubfloorLayer } from './BaseLayers';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep, mapRange } from '@/lib/three-utils';
import { retainTextures, releaseTextures, groundShadow, setMaxAnisotropy } from '@/lib/textures';

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
  const carpetLightRef = useRef(null);
  // Pinned at 0 and never written: this cutaway is the mat before power-on,
  // a matte product shot. CableModel's emissive/glow is entirely gated on
  // this ref (see its useFrame), so leaving it at 0 keeps the cable inert
  // without touching the emissive/shell code that the About page's ignition
  // beat (StoryMatScene) still relies on.
  const levelRef = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = progressRef.current;

    const carpetT = smoothstep(stageProgress(p, ...TIMELINE.carpetRoll));
    const subfloorBeat = smoothstep(stageProgress(p, ...TIMELINE.subfloorFocus));
    const rise = smoothstep(stageProgress(p, ...TIMELINE.matRise));
    const spin = stageProgress(p, ...TIMELINE.rotate);

    // The subfloor beat only owns the frame in the gap between the carpet
    // clearing and the mat taking over; fading it out as `rise` climbs
    // means the two beats hand off smoothly instead of both pulling on
    // the camera at once mid-transition.
    const subfloor = subfloorBeat * (1 - rise);

    if (matRef.current) {
      // 0.4 rather than 0.65, the larger lift left an obvious empty gap
      // between the mat and the insulation it's supposed to sit on.
      matRef.current.position.y = damp(matRef.current.position.y, rise * 0.4, 5, dt);

      // A quarter turn as it lifts, then a full 360°. The lift's tilt unwinds
      // by (1 - spin) so the turn ends at exactly 360°, square to camera 
      // rather than 405°, which would leave the mat sitting askew. Both terms
      // are absolute, so scrubbing back rewinds to the same angle.
      const target = rise * Math.PI * 0.25 * (1 - spin) + spin * Math.PI * 2;
      rotationRef.current = damp(rotationRef.current, target, 7, dt);
      matRef.current.rotation.y = rotationRef.current;
      matRef.current.rotation.z = damp(matRef.current.rotation.z, rise * 0.07 * (1 - spin), 5, dt);
    }

    /**
     * Camera beats, one term per stage of the story, all summed onto the
     * same base position and blended by the same continuous progress value
     * driving everything else. Nothing here is a discrete jump: every term
     * is already 0 or 1 well outside its own window, so stages hand off by
     * fading in/out rather than snapping.
     *
     *  - Carpet intro:   wide and slightly elevated, an establishing shot
     *                    of the room before anything moves.
     *  - Carpet rolling: a slow lateral track that swings out alongside the
     *                    roll and settles back centred as it completes,
     *                    rather than sitting locked off while it moves.
     *  - Subfloor:       lower and closer than the intro, angled more
     *                    steeply down onto the flat engineered surface.
     *  - Mat reveal:     pushes in tighter than any earlier beat and tilts
     *                    slightly off-centre to show the cable's serpentine
     *                    pattern edge-on, this is the payoff the sequence
     *                    has been building to.
     *  - Rotation:       eases back out and recentres to give the full turn
     *                    room to read (see the "cropped corners" note below).
     *
     * The rise/spin coefficients are the original mat-reveal framing, kept
     * as-is: at full turn the mat's diagonal is wider than its face, so
     * holding the close framing cropped its corners off the edge of the
     * viewport.
     */
    const camX = Math.sin(carpetT * Math.PI) * 0.55;
    const camY = 3.05 - carpetT * 0.1 - subfloor * 0.35 - rise * 0.55 + spin * 0.15;
    const camZ = 7.1 - carpetT * 0.3 - subfloor * 1.05 - rise * 0.85 + spin * 0.6;

    const lookX = rise * 0.16 * (1 - spin);
    const lookY = rise * 0.42 - subfloor * 0.1;
    const lookZ = carpetT * -0.3;

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

    state.camera.position.x = damp(state.camera.position.x, camX * fit, 3.5, dt);
    state.camera.position.y = damp(state.camera.position.y, camY * fit, 3.5, dt);
    state.camera.position.z = damp(state.camera.position.z, camZ * fit, 3.5, dt);
    state.camera.lookAt(lookX, lookY, lookZ);

    // Fog is distance-based, but on a narrow phone the camera dollies back by
    // `fit` to keep the wide mat framed, which would push the layers deeper
    // into the fog and visibly darken them toward the near-black fog colour.
    // Scaling the fog bounds by the same factor keeps the perceived fog
    // density constant across aspect ratios, so mobile reads as bright as
    // desktop.
    if (state.scene.fog) {
      state.scene.fog.near = 9 * fit;
      state.scene.fog.far = 21 * fit;
    }

    if (groupRef.current && !reduced) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.18) * 0.04;
    }

    /**
     * Carpet key-light sweep, a dedicated warm light leaning in hardest
     * during the carpet's establishing shot (before the roll starts, see
     * `carpetIntro` below), so the medallion/pile detail reads as a lit
     * textile rather than a flat, ambient-only print. Its position drifts
     * on a slow ~17s sine loop, an ease-in-out swing by construction, in
     * the same "barely perceptible, clearly present over time" register as
     * HomeHero's hhero-breathe/hhero-drift loops. Gated on `reduced` the
     * same way the group sway above is, so reduced motion holds it at a
     * single static, flattering angle instead of animating.
     */
    const carpetIntro = 1 - smoothstep(mapRange(p, 0, TIMELINE.carpetRoll[0], 0, 1));
    if (carpetLightRef.current) {
      const period = 17;
      const drift = reduced ? 0 : (state.clock.elapsedTime / period) * Math.PI * 2;
      carpetLightRef.current.position.set(
        -2.4 + Math.sin(drift) * 1.7,
        5.4,
        2.8 + Math.cos(drift) * 1.1
      );
      const targetIntensity = 1.1 + carpetIntro * 1.7;
      carpetLightRef.current.intensity = damp(
        carpetLightRef.current.intensity,
        targetIntensity,
        4,
        dt
      );
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
      {/* Carpet key-light sweep, see the useFrame block above for the
          intro-intensity ramp and slow drift. Warm and close in hue to the
          copper glow of the DOM atmosphere behind it, so the two read as
          one lighting scheme rather than two competing sources. */}
      <directionalLight ref={carpetLightRef} position={[-2.4, 5.4, 2.8]} intensity={1.1} color="#ffdcae" />

      <CarpetLayer progressRef={progressRef} />

      <group ref={matRef}>
        <HeatingSheetModel
          rotationRef={rotationRef}
          progressRef={progressRef}
          showLabels={!reduced}
          levelRef={levelRef}
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
 * Raises every layer's textures to the real GPU's max anisotropy once the
 * renderer exists. `finish()` in lib/textures.js can only bake a conservative
 * default, it runs before any GL context is available to ask; this is what
 * actually fixes the soft, fuzzy look ground-plane-angled textures (mesh
 * backing, carpet) get from mipmap minification at this camera's raking
 * angle. All layers mount together in the same commit, so by the time this
 * effect runs every texture they create is already in the cache.
 */
function AnisotropyTuner() {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    setMaxAnisotropy(gl.capabilities.getMaxAnisotropy());
  }, [gl]);
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
 *  - DPR ranges 1–2 (device pixel ratio capped at 2x, never below native 1x
 *    so the canvas doesn't upscale and read as soft), and PerformanceMonitor
 *    drops it toward the floor on machines that can't hold framerate, so weak
 *    GPUs degrade instead of stuttering.
 *  - frameloop parks at 'never' whenever the section is off screen.
 */
export default function FloorCutawayScene({
  progressRef,
  active = true,
  reduced = false,
}) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 3.05, 7.1], fov: 38, near: 0.1, far: 60 }}
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
        onDecline={() => setDpr(1.25)}
        onIncline={() => setDpr(2)}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />

      {/* No `<color attach="background">`: gl.alpha is already true, so
          leaving the scene background unset clears to transparent,
          letting FloorRevealSection's scrim/glow/grain DOM layers show
          through wherever the 3D scene itself has no geometry. */}
      <fog attach="fog" args={['#0a0705', 9, 21]} />

      <StudioEnvironment />
      <SceneRig progressRef={progressRef} reduced={reduced} />
      <TextureCleanup />
      <AnisotropyTuner />
    </Canvas>
  );
}
