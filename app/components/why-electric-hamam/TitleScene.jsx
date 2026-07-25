'use client';

import { EYEBROW, TITLE } from './content';

/**
 * The cold open — the section's original eyebrow badge and heading, now
 * playing as their own title card instead of sitting above a carousel.
 */
export default function TitleScene({ rootRef }) {
  return (
    <div ref={rootRef} className="weh-beat weh-title-scene">
      <span className="weh-title-eyebrow">
        <span className="weh-title-eyebrow-dot" aria-hidden="true" />
        {EYEBROW}
      </span>
      <h2 className="weh-title-heading">{TITLE}</h2>
    </div>
  );
}
