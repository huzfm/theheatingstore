'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createSerpentinePath } from '@/components/3d/CableModel';
import { radialGlow } from '@/lib/textures';
import { pipeSheath, thermalFlow } from '../textures';
import { heroState } from '../../lib/signals';
import { warmthAt, calmAt } from '../../lib/sceneTimeline';
import { FLOOR_W, FLOOR_D, FLOOR_LIFT } from './dimensions';

/**
 * The underfloor heating pipe network, the whole reason the floor opens.
 *
 * A wider, sparser serpentine than the WhyElectricHamam heating mat's cable
 * (real PEX runs 150–300 mm spacing against a cable's 50 mm), at pipe rather
 * than cable proportions. No manifold header this time, the previous pass
 * added one for verisimilitude and it read as plumbing-diagram clutter
 * competing with the one thing this shot needs to say clearly: heat is
 * flowing through this floor. Colour and flow speed both answer `warmthAt`
 * from the shared scene timeline, so the pipe is always telling the same
 * part of the story the camera and the floor are.
 */

const PIPE_RADIUS = 0.042;
const SPACING = 0.58;
const PIPE_Y = 0.075 + FLOOR_LIFT;

const COLD_COLOR = new THREE.Color('#4c5a68');
// A muted copper/amber rather than the brand's promotional orange (PALETTE.heat500)
//, this scene is meant to feel luxurious, not like a marketing accent colour.
const WARM_COLOR = new THREE.Color('#d99a5c').multiplyScalar(1.5);

function PipeNetwork() {
  const materialRef = useRef(null);
  const pulseRefs = useRef([]);
  const pulseCount = 3;

  const sheath = useMemo(() => pipeSheath(), []);
  const flow = useMemo(() => thermalFlow(), []);
  const glow = useMemo(() => radialGlow(), []);

  const curve = useMemo(
    () =>
      createSerpentinePath({
        width: FLOOR_D - 0.7,
        length: FLOOR_W - 1.4,
        spacing: SPACING,
        margin: 0.15,
      }),
    [],
  );

  // The serpentine is authored in the mat's local X/Z; rotate the whole run
  // 90° so its long straight passes run across the room's depth rather than
  // its width, which reads better under the camera's path through the scene.
  const geometry = useMemo(() => {
    const segments = Math.min(2200, Math.round(curve.getLength() * 12));
    return new THREE.TubeGeometry(curve, segments, PIPE_RADIUS, 10, false);
  }, [curve]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    if (flow) {
      flow.wrapS = THREE.RepeatWrapping;
      flow.repeat.set(4, 1);
      flow.needsUpdate = true;
    }
    if (sheath) {
      sheath.wrapS = THREE.RepeatWrapping;
      sheath.repeat.set(curve.getLength() * 1.4, 1);
      sheath.needsUpdate = true;
    }
  }, [flow, sheath, curve]);

  const emissive = useMemo(() => COLD_COLOR.clone(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const progress = heroState.sceneProgress;
    const warmth = warmthAt(progress);
    // The closing shot's stillness, the water keeps circulating (a real
    // system never fully stops), but the rate it visibly travels at eases
    // toward a slow idle rather than holding its full ignition pace into the
    // last frame the visitor sees.
    const stillness = 1 - calmAt(progress) * 0.75;

    if (flow) flow.offset.x = (flow.offset.x - dt * (0.05 + warmth * 0.45) * stillness) % 1;

    if (materialRef.current) {
      emissive.copy(COLD_COLOR).lerp(WARM_COLOR, warmth);
      materialRef.current.emissive.copy(emissive);
      materialRef.current.emissiveIntensity = 0.25 + warmth * 1.5;
    }

    const t = state.clock.elapsedTime;
    for (let i = 0; i < pulseRefs.current.length; i += 1) {
      const sprite = pulseRefs.current[i];
      if (!sprite) continue;
      const phase = (t * (0.05 + warmth * 0.09) * stillness + i / pulseCount) % 1;
      curve.getPointAt(phase, sprite.position);
      sprite.position.y += PIPE_RADIUS + 0.02;
      const s = 0.1 + Math.sin(phase * Math.PI) * 0.07;
      sprite.scale.setScalar(s);
      sprite.material.opacity = warmth * 0.85;
    }
  });

  return (
    <group rotation={[0, Math.PI / 2, 0]} position={[0, PIPE_Y, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={materialRef}
          map={sheath}
          emissiveMap={flow}
          color="#cdc6b8"
          emissive="#4c5a68"
          emissiveIntensity={0.25}
          roughness={0.5}
          metalness={0.08}
          envMapIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {Array.from({ length: pulseCount }).map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
        >
          <spriteMaterial
            map={glow}
            color="#e0a468"
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
            toneMapped={false}
            opacity={0}
          />
        </sprite>
      ))}
    </group>
  );
}

export default memo(PipeNetwork);
