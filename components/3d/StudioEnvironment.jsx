'use client';

import { memo } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import { PALETTE } from '@/lib/three-utils';

/**
 * A photographic studio, built from emissive planes and baked into an
 * environment map in-scene.
 *
 * Why this and not `<Environment preset="studio" />`: the presets stream an
 * HDRI from a CDN at runtime. That's a multi-megabyte third-party request on
 * a marketing page — a slow load, a privacy surface, and a hard failure if
 * the CDN is unreachable. Lightformers cost one 256px cubemap render and
 * ship with the bundle.
 *
 * More importantly it's what makes the surfaces read as real: a flat `color`
 * lit by point lights has nothing to reflect, so polished stone looks like
 * plastic. Giving it actual bright shapes to mirror is the entire difference
 * between "3D box" and "product photograph".
 */
function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Key: a large softbox high and slightly left, the way a product
          photographer would rig it. Warm, to match the heat accent. */}
      <Lightformer
        form="rect"
        intensity={3.2}
        color="#fff4e6"
        position={[-3.5, 5, 3]}
        rotation={[-Math.PI / 3, 0, 0]}
        scale={[9, 6, 1]}
      />

      {/* Fill: cooler, opposite side, half the strength — keeps the shadow
          side from going dead black without flattening the form. */}
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#cfe0ff"
        position={[5, 2.5, 1]}
        rotation={[0, -Math.PI / 2.6, 0]}
        scale={[7, 5, 1]}
      />

      {/* Rim / kicker from behind: draws a bright edge along the top of each
          slab, which is what separates the layers from the black background
          when they're stacked. */}
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#ffffff"
        position={[0, 3, -6]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 4, 1]}
      />

      {/* Two narrow strips overhead — these show up as elongated speculars
          travelling across the polished stone as it rotates. Pure product
          photography trick, and the thing the eye reads as "expensive". */}
      <Lightformer
        form="rect"
        intensity={4}
        color="#ffffff"
        position={[-1.5, 6, -1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.6, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#ffe9d2"
        position={[2, 6, 1.5]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.4, 7, 1]}
      />

      {/* Warm ground bounce, standing in for light thrown back by the cable */}
      <Lightformer
        form="circle"
        intensity={1.6}
        color={PALETTE.heat600}
        position={[0, -2.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[6, 6, 1]}
      />
    </Environment>
  );
}

export default memo(StudioEnvironment);
