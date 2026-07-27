'use client';

import { EYEBROW, TITLE } from './content';

/**
 * The cold open, the section's original eyebrow badge and heading, now
 * playing as their own title card instead of sitting above a carousel.
 *
 * Its own signature transition (see timeline.js's getTitleMotion): a
 * vertical iris/unveil — a clip-path band parting from the center — rather
 * than the generic push-in-from-depth camera every benefit/quote/CTA beat
 * shares. Eyebrow and heading stagger in on their own emberRise curves
 * (getTitleEyebrowMotion/getTitleHeadingMotion) — eyebrow first and quick,
 * heading after a deliberate, widening pause — driven imperatively by
 * usePinnedTimeline, never React state.
 */
export default function TitleScene({ rootRef, eyebrowRef, headingRef }) {
  return (
    <div ref={rootRef} className="weh-beat weh-title-scene">
      <span ref={eyebrowRef} className="weh-title-eyebrow">
        <span className="weh-title-eyebrow-dot" aria-hidden="true" />
        {EYEBROW}
      </span>
      <h2 ref={headingRef} className="weh-title-heading">
        {TITLE}
      </h2>
    </div>
  );
}
