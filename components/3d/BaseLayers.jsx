'use client';

import { memo, useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep } from '@/lib/three-utils';
import { insulationAlbedo } from '@/lib/textures';
import { LAYER_W, LAYER_L } from './FloorLayers';

/**
 * Insulation board, and the bottom of the stack.
 *
 * There was a structural concrete slab under this. It went with the move to a
 * four-layer cutaway: it was the one layer the visitor is told explicitly not
 * to worry about ("below this line, nothing needs to change"), which makes it
 * the obvious thing to cut when the sequence needs to be shorter. The board's
 * underside is now the floor of the shot, which is why the ground shadow in
 * FloorCutawayScene sits where it does.
 *
 * Gets a foil face on top, a thin, low-roughness, high-metalness plane 
 * because that reflective skin is both what real boards have and what sells
 * the layer visually: it catches the cable's glow from above and throws it
 * back, which is exactly the board's actual job.
 */
function InsulationLayerImpl({ progressRef }) {
  const ref = useRef(null);
  const foilRef = useRef(null);
  const albedo = useMemo(() => insulationAlbedo(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = smoothstep(stageProgress(progressRef.current, ...TIMELINE.baseRecede));
    const group = ref.current;
    if (!group) return;

    group.position.y = damp(group.position.y, -0.075 - t * 0.6, 5, dt);
    const opacity = 1 - t * 0.85;
    group.children.forEach((child) => {
      if (child.material) child.material.opacity = opacity;
    });
    group.visible = opacity > 0.02;
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

export const InsulationLayer = memo(InsulationLayerImpl);
