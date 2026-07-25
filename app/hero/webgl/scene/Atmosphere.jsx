'use client';

import { memo, useMemo, useRef } from 'react';
import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { radialGlow } from '@/lib/textures';
import { heroState } from '../../lib/signals';
import { warmthAt } from '../../lib/sceneTimeline';
import { FLOOR_LIFT } from './dimensions';

/**
 * Cheap volumetric light, staged as a soft skylight falling onto the exhibit
 * rather than sunlight through a window — there is no window in this scene
 * any more. A real volumetric pass (raymarched fog, or postprocessing
 * god-rays through a light-source mesh) means an extra full-screen sample
 * per frame; three soft additive sprites angled down from above read as
 * light at a tiny fraction of the cost.
 *
 * Dust motes are `drei`'s `Sparkles`, which already batches to one draw call.
 */
const SHAFTS = [
  { x: -1.3, scale: [1.3, 4.4, 1], rot: -0.14 },
  { x: 0.2, scale: [1.1, 4, 1], rot: -0.04 },
  { x: 1.4, scale: [1.2, 4.2, 1], rot: 0.08 },
];

const SHAFT_Y = FLOOR_LIFT + 2.6;

function LightShaft({ x, scale, rot }) {
  const ref = useRef(null);
  const glow = useMemo(() => radialGlow(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const warmth = warmthAt(heroState.sceneProgress);
    const target = 0.045 + warmth * 0.12;
    const material = ref.current?.material;
    if (material) material.opacity += (target - material.opacity) * Math.min(1, dt * 3);
  });

  return (
    <sprite ref={ref} position={[x, SHAFT_Y, -0.6]} scale={scale} rotation={[0, 0, rot]}>
      <spriteMaterial
        map={glow}
        color="#fff1de"
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        toneMapped={false}
        opacity={0.045}
      />
    </sprite>
  );
}

function Atmosphere({ quality = 'high' }) {
  return (
    <group>
      {SHAFTS.map((shaft) => (
        <LightShaft key={shaft.x} {...shaft} />
      ))}

      {quality === 'high' && (
        <Sparkles
          count={30}
          scale={[4.6, 2, 3.2]}
          position={[0, FLOOR_LIFT + 0.7, -0.2]}
          size={1.2}
          speed={0.1}
          opacity={0.1}
          color="#ffcf9c"
          noise={0.35}
        />
      )}
    </group>
  );
}

export default memo(Atmosphere);
