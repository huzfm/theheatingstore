'use client';

/**
 * The tier 0/1 fallback: reduced-motion visitors, mobile, and low-power
 * hardware never receive the WebGL cutaway, so this has to be a complete
 * hero on its own rather than an empty backdrop waiting for a canvas that
 * will never arrive.
 *
 * Built entirely from gradients rather than an image: it costs nothing to
 * request, cannot fail to load, and matches the 3D scene's own palette
 * exactly because both are authored against the same copper/amber tokens —
 * a visitor moving from a phone to a desktop session sees the same room,
 * just rendered at a different fidelity.
 */
export default function HeroPoster() {
  return (
    <div className="hero__poster" aria-hidden="true">
      <div className="hero__poster-sky" />
      <div className="hero__poster-glow" />
      <div className="hero__poster-band" />
      <div className="hero__poster-lines" />
    </div>
  );
}
