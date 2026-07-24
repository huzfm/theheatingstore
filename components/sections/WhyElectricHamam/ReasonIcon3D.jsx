'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The section's two genuinely-3D visuals, sharing ONE persistent canvas:
 *
 *  - 'cable' — a serpentine underfloor heating cable, built as a TubeGeometry
 *    that follows the real boustrophedon path, with a bright heat bead running
 *    through it. This *is* the product, not an abstract stand-in.
 *  - 'floor' — the floor cross-section: finish → screed → cable → insulation →
 *    slab, as stacked thin slabs viewed at an angle.
 *
 * Performance:
 *  - geometry is useMemo'd, so it is built once per visual, never per frame;
 *  - all motion is imperative (refs + useFrame), so scrolling never re-renders
 *    the React tree;
 *  - the parent MOUNTS this only while the section is near the viewport and
 *    unmounts it when far away, so there's no GPU burn behind the rest of the
 *    page. (We deliberately don't toggle `frameloop` for that — R3F doesn't
 *    reliably restart the loop after it's been set to 'never', which leaves the
 *    entrance stuck at scale 0.)
 */

function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

/* Serpentine cable path in the XZ plane, smoothed into rounded U-turns. */
function useCableCurve() {
  return useMemo(() => {
    const rows = 5;
    const halfW = 1.15;
    const zStart = -0.85;
    const gap = (0.85 * 2) / (rows - 1);
    const pts = [];
    for (let i = 0; i < rows; i += 1) {
      const z = zStart + i * gap;
      const ltr = i % 2 === 0;
      pts.push(new THREE.Vector3(ltr ? -halfW : halfW, 0, z));
      pts.push(new THREE.Vector3(ltr ? halfW : -halfW, 0, z));
      if (i < rows - 1) {
        // lift the U-turn slightly out so CatmullRom rounds it like a bend
        pts.push(new THREE.Vector3(ltr ? halfW + 0.22 : -halfW - 0.22, 0, z + gap / 2));
      }
    }
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, []);
}

function Cable({ color }) {
  const group = useRef(null);
  const bead = useRef(null);
  const t = useRef(0.001);
  const flow = useRef(0);
  const curve = useCableCurve();
  const tube = useMemo(
    () => new THREE.TubeGeometry(curve, 160, 0.055, 10, false),
    [curve]
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    t.current = Math.min(1, t.current + d * 2.4);
    flow.current = (flow.current + d * 0.16) % 1;
    if (group.current) {
      group.current.scale.setScalar(easeOutBack(t.current));
      group.current.rotation.y += d * 0.25;
    }
    if (bead.current) {
      const p = curve.getPointAt(flow.current);
      bead.current.position.set(p.x, p.y, p.z);
    }
  });

  return (
    <group ref={group} rotation={[-Math.PI * 0.4, 0, 0]} scale={0.001}>
      {/* mat base */}
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <boxGeometry args={[2.9, 0.06, 2.2]} />
        <meshStandardMaterial color="#161412" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* the cable */}
      <mesh geometry={tube}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
      {/* travelling heat bead */}
      <mesh ref={bead}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#fff2e0" emissive="#ffd9a8" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

const FLOOR_LAYERS = [
  { y: 0.30, h: 0.10, color: '#e6ddd2', label: 'finish' }, // tile / finish
  { y: 0.17, h: 0.14, color: '#847d74', label: 'screed' }, // screed
  { y: 0.04, h: 0.06, color: null, label: 'cable', heat: true }, // heating cable
  { y: -0.10, h: 0.16, color: '#d47f33', label: 'insulation' }, // insulation
  { y: -0.30, h: 0.16, color: '#3a352f', label: 'slab' }, // slab
];

function Floor({ color }) {
  const group = useRef(null);
  const t = useRef(0.001);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    t.current = Math.min(1, t.current + d * 2.4);
    if (group.current) {
      group.current.scale.setScalar(easeOutBack(t.current));
      // Hold a 3/4 view of the stack's FRONT face so the layered profile
      // (finish → screed → cable → insulation → slab) reads as a cross-section;
      // a gentle sway adds life without turning it edge-on.
      group.current.rotation.y = -0.42 + Math.sin(performance.now() / 3200) * 0.14;
    }
  });

  return (
    <group ref={group} rotation={[-0.16, -0.42, 0]} scale={0.001}>
      {FLOOR_LAYERS.map((l) =>
        l.heat ? (
          // cable layer: a row of emissive beads sitting in a thin channel
          <group key={l.label} position={[0, l.y, 0]}>
            <mesh>
              <boxGeometry args={[2.2, l.h, 1.5]} />
              <meshStandardMaterial color="#1c1a17" roughness={0.8} metalness={0.1} />
            </mesh>
            {[-0.8, -0.4, 0, 0.4, 0.8].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <sphereGeometry args={[0.07, 12, 12]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.9}
                  roughness={0.3}
                />
              </mesh>
            ))}
          </group>
        ) : (
          <mesh key={l.label} position={[0, l.y, 0]}>
            <boxGeometry args={[2.2, l.h, 1.5]} />
            <meshStandardMaterial
              color={l.color}
              emissive={l.color}
              emissiveIntensity={0.14}
              roughness={0.7}
              metalness={0.12}
            />
          </mesh>
        )
      )}
    </group>
  );
}

export default function ReasonIcon3D({ variant = 'cable', color = '#ff8a3d' }) {
  return (
    <Canvas
      flat
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.1, 4.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#fff0dc', '#1a1714', 0.5]} />
      <directionalLight position={[3, 5, 4]} intensity={1.35} color="#fff0dc" />
      <directionalLight position={[-4, 2, 3]} intensity={0.7} color={color} />
      <group key={variant}>
        {variant === 'floor' ? <Floor color={color} /> : <Cable color={color} />}
      </group>
    </Canvas>
  );
}
