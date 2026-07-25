'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { DPR } from '@/lib/three-utils';
import { SceneMotionContext } from './scene-context';

/**
 * Base <Canvas> wrapper — the single place camera, renderer and lighting
 * defaults live, so an individual scene only declares its own geometry.
 *
 * Before this existed, FloorCutawayScene and ReasonIcon3D each hand-rolled
 * their own camera, `gl` block and light rig. They drifted (different tone
 * mapping, different exposure), which is why the same warm accent read as two
 * different oranges across the site.
 *
 * What this handles for every scene:
 *  - ACES filmic tone mapping + alpha, so scenes composite over page content
 *  - a DPR ceiling that self-tunes downward on machines that drop frames
 *  - frameloop parked at 'never' while the canvas is off screen — an idle 3D
 *    section costs nothing once it's scrolled past
 *  - a default three-point light rig, overridable per scene
 *  - prefers-reduced-motion published on a context children can read
 *
 * NOTE: this is the raw component. Do NOT import it directly into a page —
 * Three.js has no server runtime and would break the build. Import the
 * lazy-loaded `@/components/3d/Scene3D` instead, which wraps this in a
 * dynamic import with `ssr: false`.
 */

/**
 * The default light rig: key, fill, ambient wash and a warm bounce.
 *
 * Deliberately lights only — no Environment. An environment map costs a
 * cubemap render and most scenes don't need one; the scenes that do (polished
 * stone, anything metallic) pass `<StudioEnvironment />` as `environment`.
 */
function DefaultLights({ accent }) {
  return (
    <>
      {/* Base wash so shadow sides never crush to pure black. */}
      <ambientLight intensity={0.55} />

      {/* Warm sky over cool ground — cheap approximation of a real room. */}
      <hemisphereLight args={['#fff0dc', '#1a1714', 0.5]} />

      {/* Key: high and camera-left, matching the studio rig's direction so
          scenes using either lighting path agree on where the sun is. */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.3}
        color="#fff0dc"
      />

      {/* Fill from the opposite side, tinted with the brand accent — this is
          what ties a 3D object to the warm palette without recolouring it. */}
      <directionalLight position={[-4, 2, 3]} intensity={0.65} color={accent} />
    </>
  );
}

export default function SceneCanvas({
  children,
  /** Merged over the default camera; pass only what differs. */
  camera,
  /** Merged over the default `gl` block. */
  gl,
  /** Replaces the default light rig entirely when provided. */
  lights,
  /** Extra scene-level nodes rendered before children (e.g. StudioEnvironment). */
  environment,
  /** Accent colour for the fill light. Defaults to the brand heat tone. */
  accent = '#ff8a3d',
  /** Solid background colour. Omit to keep the canvas transparent. */
  background,
  /** Set false to force the frameloop off regardless of visibility. */
  active = true,
  /** Disable the off-screen frameloop pause for scenes that must always run. */
  pauseWhenOffscreen = true,
  className = '',
  style,
  ...rest
}) {
  const hostRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Starts true so the first paint renders a frame even if the observer has
  // not fired yet — a canvas that boots blank and fills in late is worse than
  // one wasted frame.
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(DPR[1]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || !pauseWhenOffscreen) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Start rendering slightly before the canvas enters view, so it has
      // settled by the time the user actually sees it.
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pauseWhenOffscreen]);

  const running = active && visible;

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <Canvas
        dpr={dpr}
        frameloop={running ? 'always' : 'never'}
        camera={{ position: [0, 1.4, 5], fov: 40, near: 0.1, far: 100, ...camera }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
          ...gl,
        }}
        {...rest}
      >
        {/* Steps DPR down when frames start dropping and back up when there's
            headroom, so scenes self-tune per machine rather than being fixed
            at whatever looked fine on the dev box. */}
        <PerformanceMonitor
          onDecline={() => setDpr(DPR[0])}
          onIncline={() => setDpr(DPR[1])}
          flipflops={3}
          onFallback={() => setDpr(DPR[0])}
        />

        {background ? <color attach="background" args={[background]} /> : null}

        {lights ?? <DefaultLights accent={accent} />}
        {environment}

        <SceneMotionContext.Provider value={!!reduceMotion}>
          {children}
        </SceneMotionContext.Provider>
      </Canvas>
    </div>
  );
}