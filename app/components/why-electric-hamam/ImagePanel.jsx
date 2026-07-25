'use client';

import { memo } from 'react';

/**
 * A large editorial photograph panel, never full-bleed, always framed by
 * whitespace so it reads as a placed photograph rather than a background.
 * Three independent motions land on this one element, all written
 * imperatively by usePinnedTimeline (never React state):
 *  - `frameRef`  the clip-path "door" that opens once as the scene enters
 *  - `sweepRef`  a diagonal light sweep that crosses the frame as it opens
 *  - `imageRef`  the continuous slow Ken Burns drift for as long as it's held
 */
function ImagePanel({ src, alt, accent, imageRef, frameRef, sweepRef, className = '' }) {
  return (
    <div className={`weh-image-panel ${className}`} style={{ '--weh-accent': accent }}>
      <div ref={frameRef} className="weh-image-panel-frame">
        <img ref={imageRef} src={src} alt={alt} loading="lazy" decoding="async" className="weh-image-panel-img" />
        <div className="weh-image-panel-scrim" />
        <div ref={sweepRef} className="weh-image-panel-sweep" aria-hidden="true" />
        <div className="weh-image-panel-edge" />
      </div>
    </div>
  );
}

export default memo(ImagePanel);
