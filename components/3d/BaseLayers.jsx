'use client';

import { memo, useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep } from '@/lib/three-utils';
import { insulationAlbedo, concreteAlbedo } from '@/lib/textures';
import { LAYER_W, LAYER_L } from './FloorLayers';

/**
 * Insulation board.
 *
 * Gets a foil face on top, a thin, low-roughness, high-metalness plane 
 * because that reflective skin is both what real boards have and what sells
 * the layer visually: it catches the cable's glow from above and throws it
 * back, which is exactly the board's actual job.
 */
function InsulationLayerImpl({ progressRef }) {
  const ref = useRef(null);
  const boardRef = useRef(null);
  const foilRef = useRef(null);
  const albedo = useMemo(() => insulationAlbedo(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = smoothstep(stageProgress(progressRef.current, ...TIMELINE.baseRecede));
    const group = ref.current;
    if (!group) return;

    // Comes into focus as the carpet clears: envMapIntensity ramps up over
    // the same window the carpet rolls through, so this board reads as
    // "revealed" rather than having simply been sitting there uncovered.
    const exposure = smoothstep(stageProgress(progressRef.current, ...TIMELINE.carpetRoll));

    group.position.y = damp(group.position.y, -0.075 - t * 0.6, 5, dt);
    const opacity = 1 - t * 0.85;
    group.children.forEach((child) => {
      if (child.material) child.material.opacity = opacity;
    });
    group.visible = opacity > 0.02;

    if (boardRef.current) boardRef.current.envMapIntensity = 0.25 + exposure * 0.2;
    if (foilRef.current) foilRef.current.envMapIntensity = 0.45 + exposure * 0.35;
  });

  return (
    <group ref={ref} position={[0, -0.075, 0]}>
      <RoundedBox
        args={[LAYER_W - 0.04, 0.11, LAYER_L - 0.04]}
        radius={0.008}
        smoothness={2}
      >
        {/* Much darker than it looks like it should be: under the studio
            rig the previous value blew out to pure white, which read as a
            featureless foam block and stole focus from the mat. */}
        <meshStandardMaterial
          ref={boardRef}
          map={albedo}
          map-repeat={[3, 3]}
          color="#3a3630"
          roughness={1}
          metalness={0}
          envMapIntensity={0.25}
          transparent
          opacity={1}
        />
      </RoundedBox>

      {/* Reflective foil facing */}
      <mesh position={[0, 0.057, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LAYER_W - 0.06, LAYER_L - 0.06]} />
        <meshStandardMaterial
          ref={foilRef}
          color="#55504a"
          roughness={0.42}
          metalness={0.55}
          envMapIntensity={0.45}
          transparent
          opacity={1}
        />
      </mesh>
    </group>
  );
}

/**
 * Concrete subfloor, the structural base everything else sits on.
 * Deliberately the darkest, roughest surface in the stack so it recedes and
 * lets the mat hold focus.
 */
function SubfloorLayerImpl({ progressRef }) {
  const ref = useRef(null);
  const materialRef = useRef(null);
  const albedo = useMemo(() => concreteAlbedo(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = smoothstep(stageProgress(progressRef.current, ...TIMELINE.baseRecede));
    const exposure = smoothstep(stageProgress(progressRef.current, ...TIMELINE.carpetRoll));
    const mesh = ref.current;
    if (!mesh) return;

    mesh.position.y = damp(mesh.position.y, -0.235 - t * 1.0, 5, dt);
    mesh.material.opacity = 1 - t * 0.9;
    mesh.visible = mesh.material.opacity > 0.02;
    if (materialRef.current) materialRef.current.envMapIntensity = 0.35 + exposure * 0.25;
  });

  return (
    <RoundedBox
      ref={ref}
      args={[LAYER_W - 0.02, 0.2, LAYER_L - 0.02]}
      radius={0.006}
      smoothness={2}
      position={[0, -0.235, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        ref={materialRef}
        map={albedo}
        color="#46423c"
        roughness={1}
        metalness={0}
        envMapIntensity={0.35}
        transparent
        opacity={1}
      />
    </RoundedBox>
  );
}

export const InsulationLayer = memo(InsulationLayerImpl);
export const SubfloorLayer = memo(SubfloorLayerImpl);
