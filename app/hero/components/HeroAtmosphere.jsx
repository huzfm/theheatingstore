'use client';

/**
 * Screen-locked atmosphere: the legibility scrim, the vignette, and the grain.
 *
 * These sit above the 3D canvas / poster as flat DOM layers rather than
 * inside the 3D scene itself. A vignette is a property of the frame, not of
 * the room — if it moved with the camera it would stop reading as the edge of
 * the image and start reading as a dark ring drifting around inside it.
 */
export default function HeroAtmosphere() {
  return (
    <>
      <div className="hero__fx hero__scrim" aria-hidden="true" />
      <div className="hero__fx hero__vignette" aria-hidden="true" />
      <div className="hero__fx hero__grain" aria-hidden="true" />
      <div className="hero__fx hero__seam" aria-hidden="true" />
    </>
  );
}
