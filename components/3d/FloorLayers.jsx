'use client';

import { memo, useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep, clamp } from '@/lib/three-utils';
import { marbleAlbedo, marbleRoughness } from '@/lib/textures';
import { MAT_W, MAT_L } from './constants';

const W = MAT_W + 0.5;
const L = MAT_L + 0.5;

/**
 * Large-format tiles: 3 x 2 rather than the previous 4 x 3.
 *
 * Real premium floors use big-format porcelain (600mm and up), small tiles
 * read as a bathroom from 1995, and more importantly a dense grid of small
 * squares reads as a *grid*, which is exactly the "diagram" look we're
 * trying to escape. Fewer, larger slabs with a tight grout line is the
 * contemporary look and lets the marble veining actually be visible.
 */
const COLS = 3;
const ROWS = 2;
const GROUT = 0.018;

/**
 * Stack heights, measured from the heating mat at y = 0.
 *
 * The slabs sit straight on the mat now. There used to be a combed adhesive
 * bed between the two, and the tiles were parked at 0.13 to clear it; with
 * that layer gone, leaving them there would have left 100mm of daylight
 * between the floor and the mat it is supposed to be bonded to.
 *
 * 0.0155 is the underside: enough to clear the cable, which stands ~9mm proud
 * of the scrim, and nothing more. Thickness is unchanged, the slabs were
 * already at the limit before they start reading as stacked paving rather
 * than as a floor. CarpetLayer lies on the top face at 0.1005, so the two
 * numbers have to move together.
 */
const TILE_Y = 0.058;
const TILE_H = 0.085;

function TileLayerImpl({ progressRef }) {
  const meshRefs = useRef([]);

  const albedo = useMemo(() => marbleAlbedo(), []);
  const roughness = useMemo(() => marbleRoughness(), []);

  const tiles = useMemo(() => {
    const tw = (W - GROUT * (COLS + 1)) / COLS;
    const tl = (L - GROUT * (ROWS + 1)) / ROWS;
    const out = [];

    for (let ix = 0; ix < COLS; ix += 1) {
      for (let iz = 0; iz < ROWS; iz += 1) {
        const x = -W / 2 + GROUT + tw / 2 + ix * (tw + GROUT);
        const z = -L / 2 + GROUT + tl / 2 + iz * (tl + GROUT);
        const d = (ix / (COLS - 1) + iz / (ROWS - 1)) / 2;

        out.push({
          key: `${ix}-${iz}`,
          position: [x, TILE_Y, z],
          size: [tw, TILE_H, tl],
          delay: d,
          // Deterministic per-tile variation, so no two lift identically.
          tiltX: (((ix * 7 + iz * 13) % 10) / 10 - 0.5) * 0.42,
          tiltZ: (((ix * 3 + iz * 11) % 10) / 10 - 0.5) * 0.38,
          drift: (((ix * 5 + iz * 17) % 10) / 10 - 0.5) * 0.55,
          // Each tile samples a different part of the marble sheet, so the
          // veining doesn't repeat tile to tile the way a tiled texture does.
          offset: [(ix * 0.37) % 1, (iz * 0.53) % 1],
        });
      }
    }
    return out;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = stageProgress(progressRef.current, TIMELINE.tile[0], TIMELINE.tile[1] + 0.05);
    const spread = 0.45;

    for (let i = 0; i < tiles.length; i += 1) {
      const mesh = meshRefs.current[i];
      const tile = tiles[i];
      if (!mesh) continue;

      const local = smoothstep(clamp((t - tile.delay * spread) / (1 - spread)));

      mesh.position.y = damp(mesh.position.y, TILE_Y + local * 3.0, 6, dt);
      mesh.position.x = damp(mesh.position.x, tile.position[0] + local * tile.drift, 6, dt);
      mesh.position.z = damp(mesh.position.z, tile.position[2] - local * 0.45, 6, dt);
      mesh.rotation.x = damp(mesh.rotation.x, local * tile.tiltX, 6, dt);
      mesh.rotation.z = damp(mesh.rotation.z, local * tile.tiltZ, 6, dt);

      // Solid through the first third of the lift, dissolving only once clear.
      mesh.material.opacity = 1 - clamp((local - 0.35) / 0.65);
      mesh.visible = mesh.material.opacity > 0.01;
    }
  });

  return (
    <group>
      {tiles.map((tile, i) => (
        <RoundedBox
          key={tile.key}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          args={tile.size}
          radius={0.008}
          smoothness={2}
          creaseAngle={0.5}
          position={tile.position}
        >
          {/* Standard rather than physical: clearcoat is a materially more
              expensive shader, and with a proper environment map to reflect,
              a low-roughness standard material is indistinguishable here. */}
          <meshStandardMaterial
            map={albedo}
            roughnessMap={roughness}
            color="#f0ece4"
            roughness={0.28}
            metalness={0.02}
            envMapIntensity={1.4}
            transparent
            opacity={1}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

export const TileLayer = memo(TileLayerImpl);
export { W as LAYER_W, L as LAYER_L, TILE_Y, TILE_H };
