'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import StudioEnvironment from './StudioEnvironment';
import { clamp, damp, lerp, PALETTE } from '@/lib/three-utils';
import {
  marbleAlbedo,
  marbleRoughness,
  radialGlow,
  retainTextures,
  releaseTextures,
} from '@/lib/textures';

/**
 * "When the power goes out", the About hero panel.
 *
 * A polished stone hamam floor, warm from beneath. Every 13 seconds the
 * room's cool light flickers and cuts, and for a few seconds the floor's
 * warmth is the only light left in the room; then the grid comes back. Snow
 * drifts through the whole thing and dims out as it nears the warm floor.
 *
 * This is deliberately NOT the heating mat. That model is the subject of the
 * story rail further down the page (components/sections/About/StoryRail), and
 * showing the same product twice on one page reads as a repeated asset. The
 * hero argues the *outcome*, the sentence sitting next to it is "We keep
 * Kashmir warm when the power goes out", and leaves the hardware to the rail.
 */

/* ── The load-shedding cycle, in seconds ──────────────────────────────
   Timings are for a panel someone glances at while reading a headline: the
   lit stretch is long enough that the cut is a surprise rather than a
   strobe, and the dark stretch is long enough to register as an outage
   rather than a blink. */
const CYCLE = 13;
const CUT_START = 8.5; // flicker begins
const DARK_START = 9.2; // fully out
const RETURN_START = 11.8; // grid comes back
const RETURN_END = 13;

/**
 * Room light level, 0 (blackout) → 1 (lit), for a given time.
 *
 * The flicker is hand-authored rather than noise-driven: a real cut has a
 * shape, it catches, half-recovers, then goes, and random jitter reads as a
 * broken shader instead of a failing supply.
 */
function roomLevelAt(time) {
  const p = time % CYCLE;

  if (p < CUT_START) return 1;

  if (p < DARK_START) {
    const f = (p - CUT_START) / (DARK_START - CUT_START);
    if (f < 0.18) return 1;
    if (f < 0.26) return 0.12;
    if (f < 0.4) return 0.85;
    if (f < 0.5) return 0.04;
    if (f < 0.58) return 0.45;
    return 0;
  }

  if (p < RETURN_START) return 0;

  // Mains returning: a fast surge to slightly over, settling back down 
  // the way a light actually comes back on.
  const f = (p - RETURN_START) / (RETURN_END - RETURN_START);
  const eased = f * f * (3 - 2 * f);
  return Math.min(1, eased * 1.12);
}

/** True while the grid is down, drives the instrument readout in the panel. */
function gridDownAt(time) {
  const p = time % CYCLE;
  return p >= DARK_START && p < RETURN_START;
}

/* ── Snow ──────────────────────────────────────────────────────────── */

const SNOW_COUNT = 320;
const SNOW_AREA = { x: 13, y: 7.5, z: 9 };

/**
 * Cold falling snow that dims out as it approaches the floor.
 *
 * Per-point brightness needs vertex colours, PointsMaterial has a single
 * uniform opacity, so a fade band near the floor is impossible without them.
 * Writing 320 colours a frame is a rounding error next to a draw call, and it
 * buys the detail the whole idea rests on: the cold visibly stops at the warm
 * floor instead of falling through it.
 */
function Snow({ roomRef }) {
  const pointsRef = useRef(null);
  const map = useMemo(() => radialGlow(), []);

  const { positions, colors, speeds, sway } = useMemo(() => {
    const pos = new Float32Array(SNOW_COUNT * 3);
    const col = new Float32Array(SNOW_COUNT * 3);
    const spd = new Float32Array(SNOW_COUNT);
    const swy = new Float32Array(SNOW_COUNT);

    // Deterministic, so the panel is identical on every load.
    let seed = 20110;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < SNOW_COUNT; i += 1) {
      pos[i * 3] = (rand() - 0.5) * SNOW_AREA.x;
      pos[i * 3 + 1] = rand() * SNOW_AREA.y;
      pos[i * 3 + 2] = (rand() - 0.5) * SNOW_AREA.z - 1.5;
      col[i * 3] = 1;
      col[i * 3 + 1] = 1;
      col[i * 3 + 2] = 1;
      spd[i] = 0.28 + rand() * 0.55;
      swy[i] = rand() * Math.PI * 2;
    }

    return { positions: pos, colors: col, speeds: spd, sway: swy };
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const pos = points.geometry.attributes.position.array;
    const col = points.geometry.attributes.color.array;

    // Snow is lit by the room, so it goes nearly dark during a cut, but not
    // fully, or the outage just looks like the snow stopped.
    const room = 0.22 + roomRef.current * 0.78;

    for (let i = 0; i < SNOW_COUNT; i += 1) {
      const iy = i * 3 + 1;
      pos[iy] -= speeds[i] * dt;
      // Lateral drift, each flake on its own phase.
      pos[i * 3] += Math.sin(t * 0.4 + sway[i]) * dt * 0.12;

      if (pos[iy] < 0) {
        pos[iy] = SNOW_AREA.y;
        pos[i * 3] = (pos[i * 3] % SNOW_AREA.x) || 0;
      }

      // Melt band: full brightness above 1.9, gone by 0.35. This is the
      // "warm floor" doing its job, stated without a single label.
      const fade = clamp((pos[iy] - 0.35) / 1.55);
      const v = fade * room;
      // Cool cast, snow lit by winter daylight is blue, not white.
      col[i * 3] = v * 0.78;
      col[i * 3 + 1] = v * 0.86;
      col[i * 3 + 2] = v;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* ── The warm floor ────────────────────────────────────────────────── */

/**
 * Heat pooling up through the stone: three additive radial washes just above
 * the floor, each breathing on its own period so the pool never pulses in
 * unison (which is what makes a glow read as a CSS animation).
 *
 * Additive quads rather than emissive geometry or a bloom pass, this is the
 * same call FloorCutawayScene made, and for the same reason: a full-screen HDR
 * post pass is the single most expensive thing you can put on a marketing page.
 */
const POOLS = [
  { pos: [-0.6, 0.014, -0.4], scale: 7.2, color: PALETTE.heat600, opacity: 0.42, period: 6.5, phase: 0 },
  { pos: [1.5, 0.016, 0.9], scale: 5.0, color: PALETTE.heat500, opacity: 0.34, period: 8.2, phase: 2.1 },
  { pos: [-1.9, 0.012, 1.6], scale: 3.8, color: PALETTE.heat400, opacity: 0.26, period: 5.4, phase: 4.3 },
];

function HeatPools({ roomRef }) {
  const refs = useRef([]);
  const map = useMemo(() => radialGlow(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // The floor's own output never changes, but with the room lights gone
    // there is nothing competing with it, so it's allowed to read a little
    // stronger. This is eye adaptation, not the heating working harder.
    const dark = 1 - roomRef.current;

    for (let i = 0; i < POOLS.length; i += 1) {
      const mesh = refs.current[i];
      if (!mesh) continue;
      const pool = POOLS[i];
      const breath = 1 + Math.sin((t / pool.period) * Math.PI * 2 + pool.phase) * 0.16;
      mesh.material.opacity = pool.opacity * breath * (1 + dark * 0.22);
      mesh.scale.setScalar(pool.scale * (1 + Math.sin((t / pool.period) * Math.PI * 2 + pool.phase) * 0.04));
    }
  });

  return (
    <group>
      {POOLS.map((pool, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={pool.pos}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={pool.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={map}
            color={pool.color}
            transparent
            opacity={pool.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Slow thermal columns lifting off the floor. Four sprites is enough, the
 * effect is peripheral, and any more starts to read as smoke, which is not
 * the association a heating company wants.
 */
const PLUMES = [
  { x: -1.2, z: 0.2, dur: 11, delay: 0 },
  { x: 1.1, z: -0.9, dur: 13.5, delay: 4.2 },
  { x: 2.2, z: 1.3, dur: 12.2, delay: 7.8 },
  { x: -2.4, z: 1.0, dur: 14.5, delay: 2.6 },
];

function HeatPlumes() {
  const refs = useRef([]);
  const map = useMemo(() => radialGlow(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < PLUMES.length; i += 1) {
      const sprite = refs.current[i];
      if (!sprite) continue;
      const plume = PLUMES[i];
      const f = ((t + plume.delay) % plume.dur) / plume.dur;
      sprite.position.y = f * 2.4;
      sprite.scale.setScalar(0.7 + f * 1.9);
      // Fades in off the floor and out before the top, so neither end pops.
      sprite.material.opacity = Math.sin(f * Math.PI) * 0.09;
    }
  });

  return (
    <group>
      {PLUMES.map((plume, i) => (
        <sprite
          key={i}
          position={[plume.x, 0, plume.z]}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <spriteMaterial
            map={map}
            color={PALETTE.heat600}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/**
 * A single seamless slab rather than a tile grid.
 *
 * A grid of tiles with grout lines is the fastest way to make a 3D floor read
 * as a diagram (the same trap FloorLayers documents), and a hamam floor is
 * large-format stone anyway. One plane also means the veining can run
 * continuously into the fog, which is what gives the panel its depth.
 */
/** Stone under room light vs. stone lit only by the floor's own warmth. */
const COOL_STONE = new THREE.Color('#e9e2d6');
const WARM_STONE = new THREE.Color('#c88b52');

function StoneFloor({ roomRef }) {
  const materialRef = useRef(null);
  const albedo = useMemo(() => marbleAlbedo(), []);
  const roughness = useMemo(() => marbleRoughness(), []);

  useEffect(() => {
    for (const tex of [albedo, roughness]) {
      if (!tex) continue;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      tex.needsUpdate = true;
    }
  }, [albedo, roughness]);

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    const dt = Math.min(delta, 0.05);
    const room = roomRef.current;

    /**
     * envMapIntensity is what actually sells the blackout.
     *
     * Dimming the lights alone leaves the studio reflections blazing away on
     * polished stone, so the floor stays bright and the cut doesn't land. The
     * environment is the room; when the room loses power, its reflection has
     * to go with it. It never reaches zero, a warm floor still throws enough
     * light to catch its own polish.
     */
    mat.envMapIntensity = damp(mat.envMapIntensity, lerp(0.22, 1.5, room), 6, dt);
    // Warm tint deepens in the dark, when the only light source left is heat.
    mat.color.lerp(room > 0.5 ? COOL_STONE : WARM_STONE, 1 - Math.exp(-3 * dt));
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[22, 22]} />
      <meshStandardMaterial
        ref={materialRef}
        map={albedo}
        roughnessMap={roughness}
        color="#e9e2d6"
        roughness={0.24}
        metalness={0.04}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

/* ── Rig ───────────────────────────────────────────────────────────── */

function SceneRig({ idle, onGridChange }) {
  const roomRef = useRef(1);
  const coolKeyRef = useRef(null);
  const coolFillRef = useRef(null);
  const ambientRef = useRef(null);
  const heatLightRef = useRef(null);
  const gridDownRef = useRef(false);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    /* Frozen mid-cycle under reduced motion: a lit room, no flicker, no
       cut. The caller also disables the idle drift, so the panel becomes a
       still product shot rather than a loop nobody asked for. */
    const target = idle ? roomLevelAt(t) : 1;

    /**
     * damp toward the target rather than snapping.
     *
     * The flicker function returns hard steps on purpose, but a real filament
     * or LED driver has fall and rise time, so stepping the light instantly
     * looks digital. Damping the steps gives them a physical edge while
     * keeping the authored rhythm intact.
     */
    roomRef.current = damp(roomRef.current, target, 14, dt);
    const room = roomRef.current;

    if (coolKeyRef.current) coolKeyRef.current.intensity = room * 1.5;
    if (coolFillRef.current) coolFillRef.current.intensity = room * 0.55;
    if (ambientRef.current) ambientRef.current.intensity = 0.05 + room * 0.26;

    // The warm floor light is the constant. It is the only thing in this
    // scene that does not care whether the grid is up.
    if (heatLightRef.current) {
      heatLightRef.current.intensity = 3.1 + Math.sin(t * 0.55) * 0.35;
    }

    // Two state updates per 13s cycle, cheap enough to drive the panel's
    // instrument readout from the same clock the visuals run on, so the label
    // can never disagree with what's on screen.
    if (idle && onGridChange) {
      const down = gridDownAt(t);
      if (down !== gridDownRef.current) {
        gridDownRef.current = down;
        onGridChange(down);
      }
    }

    /* Slow push and drift, so the panel is never completely still. */
    if (idle) {
      state.camera.position.x = Math.sin(t * 0.09) * 0.34;
      state.camera.position.y = 1.15 + Math.sin(t * 0.13) * 0.06;
    }
    state.camera.lookAt(0, 0.22, -1.1);
  });

  return (
    <group>
      {/* Cool room light, this is what the outage takes away. */}
      <directionalLight ref={coolKeyRef} position={[-3.5, 5, 2.5]} intensity={1.5} color="#cfe0ff" />
      <directionalLight ref={coolFillRef} position={[4, 3, -3]} intensity={0.55} color="#9fc0ff" />
      <ambientLight ref={ambientRef} intensity={0.31} />

      {/* Warm light in the floor, constant, whatever the grid is doing. */}
      <pointLight
        ref={heatLightRef}
        position={[0, 0.35, 0.2]}
        intensity={3.1}
        distance={9}
        decay={1.6}
        color={PALETTE.heat500}
      />

      <StoneFloor roomRef={roomRef} />
      <HeatPools roomRef={roomRef} />
      <HeatPlumes />
      <Snow roomRef={roomRef} />
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
 * @param {boolean} active  run the render loop (false parks it when off screen)
 * @param {boolean} idle    the load-shedding cycle and camera drift; false
 *                          holds a lit, still room for reduced motion
 * @param {(down: boolean) => void} onGridChange fires when the grid cuts or
 *                          returns, so the panel's readout can follow it
 * @param {() => void} onReady fired once the GL context exists
 */
export default function BlackoutFloorScene({
  active = true,
  idle = true,
  onGridChange,
  onReady,
}) {
  const [dpr, setDpr] = useState(1.25);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 1.15, 4.6], fov: 42, near: 0.1, far: 40 }}
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

      {/* Fog is doing real work here: it's what turns a flat plane into a room
          that recedes into darkness, and it's why the floor needs no walls. */}
      <fog attach="fog" args={['#0a0a0a', 4.5, 13]} />

      <StudioEnvironment />
      <SceneRig idle={idle} onGridChange={onGridChange} />
      <TextureCleanup />
    </Canvas>
  );
}
