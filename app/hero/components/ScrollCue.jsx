'use client';

/**
 * The scroll affordance: a 1px hairline with a warm luminance trickling down
 * it, as if heat were finding its way to the next section.
 *
 * Not a bouncing mouse glyph, not a chevron. Those are the two most common
 * hero cues on the web and both announce that the page expects to have to
 * explain itself. This one retires permanently the instant the visitor scrolls
 * — an affordance that outstays its usefulness becomes decoration.
 */
export default function ScrollCue() {
  return <span className="hero__cue" aria-hidden="true" />;
}
