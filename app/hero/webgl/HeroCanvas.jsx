'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import HeroScene from './HeroScene';

/**
 * The WebGL entry point, everything failure-mode and lifecycle related, so
 * `HeroScene` itself can stay pure scene content.
 *
 * Mounted once `useCapabilityTier` has confirmed a desktop-class device with
 * WebGL2. Unlike the previous photographic hero, this scene *is* the hero's
 * primary visual rather than a decorative enhancement over a complete DOM
 * fallback, see `HeroClient` for why that changes how eagerly it mounts.
 * `HeroPoster` behind it is still a complete experience on its own for
 * everyone who never gets here, so nothing about this failing is a broken
 * page, just a plainer one.
 */
export default function HeroCanvas({ onReady, onLost, active, reduced, quality }) {
  const [failed, setFailed] = useState(false);
  const cleanupRef = useRef(null);

  const handleCreated = useCallback(
    ({ gl }) => {
      const canvas = gl.domElement;

      const lost = (event) => {
        event.preventDefault();
        setFailed(true);
        onLost?.();
      };

      canvas.addEventListener('webglcontextlost', lost);
      cleanupRef.current = () => canvas.removeEventListener('webglcontextlost', lost);
    },
    [onLost],
  );

  useEffect(() => () => cleanupRef.current?.(), []);

  if (failed) return null;

  return (
    <Suspense fallback={null}>
      <HeroScene
        onReady={onReady}
        onCanvasCreated={handleCreated}
        active={active}
        reduced={reduced}
        quality={quality}
      />
    </Suspense>
  );
}
