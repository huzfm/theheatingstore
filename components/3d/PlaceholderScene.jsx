'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneReducedMotion } from './scene-context';
import { PALETTE } from '@/lib/three-utils';

/**
 * Pipeline smoke test, a rounded slab and a torus on the brand accent.
 *
 * Exists purely to prove the R3F path end to end (dynamic import → Canvas →
 * default lights → animated frame loop) before any product geometry is built
 * on top of it. Safe to delete once real scenes exist.
 */
export default function PlaceholderScene() {
  const slabRef = useRef(null);
  const ringRef = useRef(null);
  const reduced = useSceneReducedMotion();

  useFrame((state, delta) => {
    // Under reduced motion the objects hold their pose, the scene still
    // renders and lights correctly, it just doesn't move on its own.
    if (reduced) return;
    if (slabRef.current) slabRef.current.rotation.y += delta * 0.35;
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.5;
      ringRef.current.rotation.z -= delta * 0.25;
    }
  });

  return (
    <group>
      <mesh ref={slabRef} position={[-1.15, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={PALETTE.bone100}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      <mesh ref={ringRef} position={[1.15, 0, 0]}>
        <torusGeometry args={[0.62, 0.22, 24, 64]} />
        <meshStandardMaterial
          color={PALETTE.heat500}
          roughness={0.25}
          metalness={0.35}
          emissive={PALETTE.heat600}
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}
