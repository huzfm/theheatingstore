'use client';

import { memo, useMemo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { TIMELINE } from '@/lib/floor-timeline';
import { damp, stageProgress, smoothstep, clamp } from '@/lib/three-utils';
import { marbleAlbedo, marbleRoughness, adhesiveAlbedo } from '@/lib/textures';
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
 * These must stay ordered, tile above adhesive, adhesive above mat, and
 * the gaps must stay tight. Two things were wrong before: the tiles sat at
 * y = 0 so the adhesive rendered *on top of* the finished floor, and the
 * slabs were ~140mm thick on a 4m floor, which reads as stacked paving.
 */
const TILE_Y = 0.13;
const TILE_H = 0.085;
const ADHESIVE_Y = 0.052;
const ADHESIVE_H = 0.055;

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

/**
 * Tile adhesive, combed with a notched trowel.
 *
 * The ridges are the recognisable thing, this is the layer a tiler actually
 * spreads, and the comb pattern identifies it instantly. Rendered as a
 * texture rather than modelled ridges: real geometry here would be a few
 * thousand extra triangles for a layer that's on screen for a second.
 */
function AdhesiveLayerImpl({ progressRef }) {
  const ref = useRef(null);
  const albedo = useMemo(() => adhesiveAlbedo(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = smoothstep(stageProgress(progressRef.current, ...TIMELINE.screed));
    const mesh = ref.current;
    if (!mesh) return;

    mesh.position.y = damp(mesh.position.y, ADHESIVE_Y + t * 2.4, 6, dt);
    mesh.position.z = damp(mesh.position.z, -t * 0.4, 6, dt);
    mesh.rotation.x = damp(mesh.rotation.x, t * 0.13, 6, dt);
    mesh.material.opacity = 1 - clamp((t - 0.2) / 0.8);
    mesh.visible = mesh.material.opacity > 0.01;
  });

  return (
    <RoundedBox
      ref={ref}
      args={[W - 0.05, ADHESIVE_H, L - 0.05]}
      radius={0.005}
      smoothness={2}
      position={[0, ADHESIVE_Y, 0]}
    >
      {/* Tiled 7x so the comb ridges are a fine trowel pattern. At 1x the
          26 ridges spanned the full 4m slab, 150mm notches, which rendered
          as brown corrugated cardboard. */}
      <meshStandardMaterial
        map={albedo}
        map-repeat={[7, 7]}
        color="#7d7568"
        roughness={0.96}
        metalness={0.02}
        envMapIntensity={0.4}
        transparent
        opacity={1}
      />
    </RoundedBox>
  );
}

export const TileLayer = memo(TileLayerImpl);
export const AdhesiveLayer = memo(AdhesiveLayerImpl);
export { W as LAYER_W, L as LAYER_L };
