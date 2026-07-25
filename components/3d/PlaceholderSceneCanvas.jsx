'use client';

import SceneCanvas from './SceneCanvas';
import PlaceholderScene from './PlaceholderScene';

/**
 * Canonical composition example: a scene module that owns its own Canvas.
 *
 * This is the pattern to copy for real scenes, the module statically imports
 * SceneCanvas and its geometry, and the *consumer* pulls the whole module in
 * via `dynamic(..., { ssr: false })`. Composing at the page level instead
 * (`<Scene3D><MyScene /></Scene3D>`) forces the page module to import the
 * geometry statically, which puts Three.js back in the server bundle and
 * defeats the lazy load.
 */
export default function PlaceholderSceneCanvas() {
  return (
    <SceneCanvas camera={{ position: [0, 0.6, 5.2], fov: 42 }}>
      <PlaceholderScene />
    </SceneCanvas>
  );
}
