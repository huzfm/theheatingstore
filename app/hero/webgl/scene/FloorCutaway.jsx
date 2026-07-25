'use client';

import { memo, useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { marbleAlbedo, marbleRoughness, insulationAlbedo, concreteAlbedo, groundShadow } from '@/lib/textures';
import { damp, mapRange, smoothstep } from '../../lib/ease';
import { heroState } from '../../lib/signals';
import { STAGE, warmthAt } from '../../lib/sceneTimeline';
import { FLOOR_W, FLOOR_D, FLOOR_LIFT } from './dimensions';

/**
 * The floor, in section: a finish slab split into two halves that lift open
 * like a pair of hatch doors to expose the pipe network, hold for the
 * ignition, then close again, insulation and subfloor sit static beneath,
 * visible only once the slabs have physically rotated clear of them.
 *
 * The whole assembly hovers at `FLOOR_LIFT` above its own contact shadow
 * rather than sitting on a modelled floor, staged like an object on
 * display, not a room built around one. Real occlusion rather than a
 * dissolve for the reveal itself: the WhyElectricHamam floor section a few
 * scrolls below this one reveals its build-up by fading tiles out, and doing
 * the same thing here would make two consecutive sections perform an
 * identical trick. A hinged reveal is different choreography that happens to
 * serve the same idea, literally "the floor separates" rather than "the
 * floor dissolves".
 */

const FINISH_H = 0.12;
const FINISH_Y = 0.18;
const HALF_W = FLOOR_W / 2;

const INSULATION_H = 0.08;
const INSULATION_Y = -0.01;
const SUBFLOOR_H = 0.22;
const SUBFLOOR_Y = -0.17;

/** One hinged half of the finish slab, pivoting on its outer (wall-side) edge. */
function SlabHalf({ side, albedo, roughness }) {
  const pivotRef = useRef(null);
  const edgeGlowRef = useRef(null);
  const sign = side === 'left' ? 1 : -1;
  const hingeX = (side === 'left' ? -1 : 1) * (HALF_W / 2 + 0.05);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = heroState.sceneProgress;

    const openT = smoothstep(0, 1, mapRange(p, ...STAGE.split));
    const closeT = smoothstep(0, 1, mapRange(p, ...STAGE.close));
    const open = Math.max(0, openT - closeT);

    const pivot = pivotRef.current;
    if (!pivot) return;

    pivot.rotation.z = damp(pivot.rotation.z, sign * open * 0.5, 5, dt);
    pivot.position.y = damp(pivot.position.y, FINISH_Y + open * 0.035, 5, dt);

    const warmth = warmthAt(p);
    if (edgeGlowRef.current) {
      edgeGlowRef.current.material.opacity = open * (0.15 + warmth * 0.7);
    }
  });

  return (
    <group ref={pivotRef} position={[hingeX, FINISH_Y, 0]}>
      <RoundedBox
        args={[HALF_W, FINISH_H, FLOOR_D]}
        radius={0.01}
        smoothness={2}
        position={[-sign * (HALF_W / 2), 0, 0]}
      >
        <meshStandardMaterial
          map={albedo}
          roughnessMap={roughness}
          color="#efeadf"
          roughness={0.26}
          metalness={0.02}
          envMapIntensity={1.3}
        />
      </RoundedBox>

      {/* The cut edge, a thin additive strip standing in for pipe-glow
          bouncing up onto the slab's exposed cross-section. */}
      <mesh ref={edgeGlowRef} position={[-sign * HALF_W * 0.02, -FINISH_H / 2 + 0.002, 0]}>
        <boxGeometry args={[0.03, 0.004, FLOOR_D * 0.98]} />
        <meshBasicMaterial color="#ff9a52" transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GroundShadow() {
  const map = useMemo(() => groundShadow(), []);
  return (
    <mesh position={[0, SUBFLOOR_Y - SUBFLOOR_H / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[FLOOR_W + 3.2, FLOOR_D + 3.2]} />
      <meshBasicMaterial map={map} transparent opacity={0.5} depthWrite={false} color="#000000" />
    </mesh>
  );
}

function FloorCutaway() {
  const marbleMap = useMemo(() => marbleAlbedo(), []);
  const marbleRough = useMemo(() => marbleRoughness(), []);
  const insulationMap = useMemo(() => insulationAlbedo(), []);
  const concreteMap = useMemo(() => concreteAlbedo(), []);

  return (
    <group>
      {/* The exhibit itself, floating clear of its own shadow. */}
      <group position={[0, FLOOR_LIFT, 0]}>
        <RoundedBox
          args={[FLOOR_W, SUBFLOOR_H, FLOOR_D]}
          radius={0.02}
          smoothness={2}
          position={[0, SUBFLOOR_Y, 0]}
        >
          <meshStandardMaterial map={concreteMap} color="#45413a" roughness={1} metalness={0} />
        </RoundedBox>

        <RoundedBox args={[FLOOR_W - 0.1, INSULATION_H, FLOOR_D - 0.1]} radius={0.015} smoothness={2} position={[0, INSULATION_Y, 0]}>
          <meshStandardMaterial map={insulationMap} map-repeat={[5, 4]} color="#3d3930" roughness={1} metalness={0} envMapIntensity={0.3} />
        </RoundedBox>

        <SlabHalf side="left" albedo={marbleMap} roughness={marbleRough} />
        <SlabHalf side="right" albedo={marbleMap} roughness={marbleRough} />
      </group>

      <GroundShadow />
    </group>
  );
}

export default memo(FloorCutaway);
export { FINISH_Y, INSULATION_Y, INSULATION_H, SUBFLOOR_Y };
