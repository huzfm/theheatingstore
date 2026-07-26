'use client';

import { QUOTE } from './content';

/**
 * The emotional finale. Minimal composition, soft warm background — the one
 * deliberate palette shift away from the benefit scenes, so it reads as the
 * sequence's turn toward warmth rather than another chapter. Its own pacing
 * (see timeline.js's getQuoteMotion) is slower and more spacious than a
 * benefit scene's: entry settles rather than arrives, and HOLD is
 * stretched well past the standard share so it can be read slowly.
 *
 * Mark and quote text carry two independent, deliberately unequal reveals
 * (getQuoteMarkMotion/getQuoteTextMotion, driven imperatively by
 * usePinnedTimeline, never React state): the mark arrives first, quick and
 * quiet — a stage direction, not a second headline — before the quote
 * itself lands with more presence. Attribution stays plain nested DOM,
 * inheriting the card's own single resolve like every other beat.
 */
export default function QuoteScene({ rootRef, markRef, textRef }) {
  return (
    <div ref={rootRef} className="weh-beat weh-quote-scene">
      <div className="weh-quote-inner">
        <span ref={markRef} className="weh-quote-mark" aria-hidden="true">
          &ldquo;
        </span>
        <p ref={textRef} className="weh-quote-text">
          {QUOTE.text}
        </p>
        <div className="weh-quote-attribution">
          <span className="weh-quote-name-row">
            <span className="weh-quote-dot" aria-hidden="true" />
            <span className="weh-quote-name">
              {QUOTE.name} <span className="weh-quote-role">— {QUOTE.role}</span>
            </span>
          </span>
          <span className="weh-quote-source">{QUOTE.source}</span>
        </div>
      </div>
    </div>
  );
}
