'use client';

import dynamic from 'next/dynamic';

/**
 * Lazy entry point for every 3D scene — import THIS, not SceneCanvas.
 *
 * Two reasons the dynamic import lives here rather than at each call site:
 *  1. Three.js touches `window`/`document` at module scope, so it cannot be
 *     evaluated during SSR — hence `ssr: false`.
 *  2. three + fiber + drei is a large dependency. Behind a dynamic import it
 *     lands in its own chunk and never blocks first paint on pages that don't
 *     render a scene.
 *
 * Usage:
 *   <Scene3D camera={{ position: [0, 2, 6] }} style={{ height: 420 }}>
 *     <MyScene />
 *   </Scene3D>
 *
 * `loading` renders on the server and until the chunk arrives, so callers get
 * a reserved box instead of a layout shift when the canvas mounts.
 */
const Scene3D = dynamic(() => import('./SceneCanvas'), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  ),
});

export default Scene3D;
