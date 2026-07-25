'use client';

import { createContext, useContext } from 'react';

/**
 * Reduced-motion flag published INSIDE the R3F tree.
 *
 * Lives in its own module, with no `three` / `@react-three/*` imports, so a
 * scene child can read the flag without dragging the whole Three.js bundle
 * into whatever module imports it. Putting this in SceneCanvas.jsx would make
 * every consumer pull in the renderer transitively.
 *
 * R3F renders through its own reconciler root, so a provider mounted outside
 * <Canvas> does not reach components inside it. SceneCanvas therefore mounts
 * the provider within the Canvas tree.
 */
export const SceneMotionContext = createContext(false);

/** Read inside any scene child to soften or stop idle animation. */
export function useSceneReducedMotion() {
  return useContext(SceneMotionContext);
}
