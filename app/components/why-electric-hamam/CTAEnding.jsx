'use client';

import { CTA_LABEL } from './content';

/**
 * The final frame. Deliberately bare, existing CTA text only, nothing else
 * competing for attention on the way out of the sequence. Label and button
 * chrome arrive together with the beat, as one composition, matching every
 * other chapter (see usePinnedTimeline: only `root` is animated).
 *
 * Per-letter spans exist only for the hover micro-interaction (a lift on
 * mouseover), not a scroll reveal, the whole word is present from the
 * moment the card is.
 */
export default function CTAEnding({ rootRef, ctaHref }) {
  const letters = CTA_LABEL.split('');

  return (
    <div ref={rootRef} className="weh-beat weh-cta-ending">
      <a href={ctaHref} className="weh-cta-ending-link">
        <span className="weh-cta-ending-word">
          {letters.map((ch, i) => (
            <span key={i} className="weh-cta-ending-letter" style={{ transitionDelay: `${i * 14}ms` }}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </span>
        <span className="weh-cta-ending-chrome">
          <span className="weh-cta-ending-arrow" aria-hidden="true">
            <svg width="22" height="20" viewBox="0 0 10 9" fill="none">
              <path
                d="M5.47 8.65V6.55L8.33 3.75V4.9L5.47 2.1V0L9.32 3.84V4.82L5.47 8.65ZM0 5.11V3.54H8.61V5.11H0Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="weh-cta-ending-underline" aria-hidden="true">
            <span className="weh-cta-ending-underline-r" />
            <span className="weh-cta-ending-underline-l" />
          </span>
        </span>
      </a>
    </div>
  );
}
