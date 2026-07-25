'use client';

import { memo, useMemo, useRef } from 'react';
import { GradientTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { radialGlow } from '@/lib/textures';
import { heroState } from '../../lib/signals';
import { warmthAt, calmAt } from '../../lib/sceneTimeline';

/**
 * The void: an infinity-cove backdrop standing in for a room.
 *
 * The previous version of this scene modelled an actual room — back wall,
 * glazing, mullions, an exterior skyline, a bench for scale. It read as an
 * architectural demo, and worse, it competed with the copy column for
 * attention exactly where the copy column needed the frame to be quiet.
 *
 * A luxury product shot doesn't build a room around the object; it builds a
 * seamless cove that recedes and lets the object hold every bit of the
 * attention. This is that cove: one large inside-out sphere carrying a
 * static vertical gradient, plus a single soft warm bounce that rises behind
 * the exhibit as `warmthAt` climbs — the room's temperature told through
 * light, with nothing else in the frame to compete with it.
 */
function Cove() {
  return (
    <mesh scale={30}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial side={THREE.BackSide} toneMapped={false} fog={false}>
        <GradientTexture stops={[0, 0.52, 1]} colors={['#12161c', '#191510', '#241a11']} size={256} />
      </meshBasicMaterial>
    </mesh>
  );
}

function WarmBounce() {
  const ref = useRef(null);
  const glow = useMemo(() => radialGlow(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const progress = heroState.sceneProgress;
    const warmth = warmthAt(progress);
    const material = ref.current?.material;
    if (!material) return;
    // Only a light ease-down for the closing shot — unlike the rest of the
    // rig (dimmed via a real exposure drop in HeroScene.jsx), this sprite is
    // `toneMapped={false}` and exposure doesn't touch it, which is exactly
    // why it's the one glow meant to stay legible while everything else
    // recedes. Still eases slightly so it reads as "the room settling" and
    // not as a light source pointedly ignoring the request.
    const target = (0.08 + warmth * 0.46) * (1 - calmAt(progress) * 0.15);
    material.opacity += (target - material.opacity) * Math.min(1, dt * 2.5);
  });

  return (
    <sprite ref={ref} position={[0.5, 0.35, -4.6]} scale={[9, 5.4, 1]}>
      <spriteMaterial
        map={glow}
        color="#d99a5c"
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        toneMapped={false}
        opacity={0.08}
      />
    </sprite>
  );
}

function Backdrop() {
  return (
    <group>
      <Cove />
      <WarmBounce />
    </group>
  );
}

export default memo(Backdrop);
