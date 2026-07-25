'use client';

import { QUOTE } from './content';

/**
 * The emotional finale. Minimal composition, soft warm background — the one
 * deliberate palette shift away from the benefit scenes, so it reads as the
 * sequence's turn toward warmth rather than another chapter.
 *
 * Mark, quote, and attribution all sit on one frosted glass card and arrive
 * together with the beat (see usePinnedTimeline: only `root` is animated) —
 * a single complete composition to read, not a sequence of reveals.
 */
export default function QuoteScene({ rootRef }) {
  return (
    <div ref={rootRef} className="weh-beat weh-quote-scene">
      <div className="weh-quote-inner">
        <span className="weh-quote-mark" aria-hidden="true">
          &ldquo;
        </span>
        <p className="weh-quote-text">{QUOTE.text}</p>
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
