'use client';

import { memo } from 'react';

/**
 * A large editorial photograph panel, always framed (soft shadow + glass
 * edge) so it reads as a placed photograph rather than a raw background —
 * true even at Mode B's near-full-bleed size, it just loses the whitespace
 * margin, not the frame treatment. Three independent motions land on this
 * one element, all written imperatively by usePinnedTimeline (never React
 * state):
 *  - `frameRef`  the clip-path "door" that opens once as the scene enters
 *  - `sweepRef`  a diagonal light sweep that crosses the frame as it opens
 *  - `imageRef`  the continuous slow Ken Burns drift for as long as it's held
 *
 * `strongScrim` swaps the default caption-strip scrim for a side-anchored
 * gradient (see `.weh-image-panel-scrim--strong` in WhyElectricHamam.jsx,
 * same warm-ink tone as this file's own shadows) strong enough to carry
 * body text directly over the photo; `textSide` picks which side darkens.
 */
function ImagePanel({ src, alt, accent, imageRef, frameRef, sweepRef, className = '', strongScrim = false, textSide = 'left' }) {
  return (
    <div className={`weh-image-panel ${className}`} style={{ '--weh-accent': accent }}>
      <div ref={frameRef} className="weh-image-panel-frame">
        <img ref={imageRef} src={src} alt={alt} loading="lazy" decoding="async" className="weh-image-panel-img" />
        <div
          className={
            strongScrim
              ? `weh-image-panel-scrim weh-image-panel-scrim--strong weh-image-panel-scrim--${textSide}`
              : 'weh-image-panel-scrim'
          }
        />
        <div ref={sweepRef} className="weh-image-panel-sweep" aria-hidden="true" />
        <div className="weh-image-panel-edge" />
      </div>
    </div>
  );
}

export default memo(ImagePanel);
