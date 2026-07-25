'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import StudioEnvironment from '@/components/3d/StudioEnvironment';
import { DPR } from '@/lib/three-utils';
import { heroState } from '../lib/signals';
import { warmthAt, calmAt } from '../lib/sceneTimeline';
import Backdrop from './scene/Backdrop';
import FloorCutaway from './scene/FloorCutaway';
import PipeNetwork from './scene/PipeNetwork';
import CameraRig from './scene/CameraRig';
import Atmosphere from './scene/Atmosphere';

/**
 * FIRST HEAT — the floating exhibit.
 *
 * Cool morning light to start; warm amber as the system fires. Both the key
 * light and the fog answer the same `warmthAt(sceneProgress)` the floor and
 * the pipes do, so the room's light and the system's state can never
 * disagree. Softer and lower-contrast than a literal room rig would need —
 * there are no walls here to bounce light off, so the lighting itself has to
 * do the work of feeling like a large, gentle skylight rather than a hard
 * directional source. No real-time shadow maps: the ground shadow is a
 * single baked texture (see FloorCutaway) and every surface reads its shape
 * from the environment map instead, which is what keeps this scrubbing
 * smoothly at 60fps across the whole pinned scroll.
 */

const COLD_KEY = new THREE.Color('#c3d6f0');
const WARM_KEY = new THREE.Color('#e8c399');
const COLD_FOG = new THREE.Color('#12161c');
const WARM_FOG = new THREE.Color('#1c130c');

const BASE_EXPOSURE = 1.02;

function LightingRig() {
  const keyRef = useRef(null);
  const rimRef = useRef(null);
  const tmp = useRef(new THREE.Color()).current;

  useFrame(({ scene, gl }, delta) => {
    const dt = Math.min(delta, 0.05);
    const progress = heroState.sceneProgress;
    const warmth = warmthAt(progress);

    if (keyRef.current) {
      tmp.copy(COLD_KEY).lerp(WARM_KEY, warmth);
      keyRef.current.color.copy(tmp);
      keyRef.current.intensity = 1.05 + warmth * 0.4;
    }
    if (rimRef.current) {
      rimRef.current.intensity = 0.45 + warmth * 0.75;
    }
    if (scene.fog) {
      tmp.copy(COLD_FOG).lerp(WARM_FOG, warmth * 0.65);
      scene.fog.color.lerp(tmp, Math.min(1, dt * 3));
    }

    // The closing shot's "reduce exposure ~20%, keep only the warm glow
    // from the pipes" — a real exposure drop on the renderer rather than
    // dimming individual lights, so it uniformly darkens everything tone-
    // mapped (the key/rim/ambient/hemisphere, the backdrop) in one motion.
    // The pipe network and its glow sprites are `toneMapped={false}` (see
    // PipeNetwork.jsx) specifically so exposure has no effect on them —
    // they're the one light source meant to hold its brightness while
    // everything else recedes.
    const targetExposure = BASE_EXPOSURE * (1 - calmAt(progress) * 0.2);
    gl.toneMappingExposure += (targetExposure - gl.toneMappingExposure) * Math.min(1, dt * 3);
  });

  return (
    <>
      {/* A generous ambient + hemisphere base stands in for the bounce a
          real room's walls would give — the void has none, so the fill has
          to be authored rather than borrowed from the environment. */}
      <ambientLight intensity={0.58} />
      <hemisphereLight args={['#eef2fa', '#1c1712', 0.5]} />
      <directionalLight ref={keyRef} position={[-3.2, 6, 3]} intensity={1.05} color="#c3d6f0" />
      <directionalLight position={[4.5, 2.2, 2.5]} intensity={0.32} color="#d8e4ff" />
      <directionalLight ref={rimRef} position={[-0.5, 3, -4]} intensity={0.45} color="#ffe9d2" />
    </>
  );
}

export default function HeroScene({
  onReady,
  onCanvasCreated,
  active = true,
  reduced = false,
  quality = 'high',
}) {
  const [dpr, setDpr] = useState(DPR[1]);

  return (
    <Canvas
      className="hero__canvas3d"
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [3.2, 3.0, 9.0], fov: 30, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: BASE_EXPOSURE,
      }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={(state) => {
        onCanvasCreated?.(state);
        // First committed frame — safe to cross-fade the DOM poster out.
        requestAnimationFrame(() => onReady?.());
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr(DPR[0])}
        onIncline={() => setDpr(DPR[1])}
        flipflops={3}
        onFallback={() => setDpr(0.85)}
      />

      <color attach="background" args={['#12161c']} />
      <fog attach="fog" args={['#12161c', 7, 20]} />

      <StudioEnvironment />
      <LightingRig />

      <Backdrop />
      <FloorCutaway />
      <PipeNetwork />
      <Atmosphere quality={quality} />
      <CameraRig reduced={reduced} />
    </Canvas>
  );
}
