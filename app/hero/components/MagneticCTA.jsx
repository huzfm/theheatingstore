'use client';

import { useRef } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';
import { ArrowIcon } from './icons';

/**
 * A hero CTA.
 *
 * Arrival is a charge, not a fade: `--charge` scales the fill from the leading
 * edge while the border clips open in step with it, so the button reads as
 * current filling a bar. Nothing scales up, nothing bounces, and the old skewed
 * shine sweep is gone, it was the single most template-looking gesture on the
 * page.
 *
 * The layers are separate elements rather than pseudo-elements because the
 * ignition timeline drives `--charge` on the root and each layer needs to
 * interpret it differently: the fill scales, the border clips, the field
 * responds to the pointer instead.
 */
export default function MagneticCTA({
  href,
  variant = 'primary',
  magnetic = true,
  children,
}) {
  const ref = useRef(null);
  useMagnetic(ref, { enabled: magnetic });

  return (
    <a
      ref={ref}
      href={href}
      data-cta
      data-cursor-target
      className={`hero__cta hero__cta--${variant}`}
    >
      <span className="hero__cta-field" aria-hidden="true" />
      <span className="hero__cta-fill" aria-hidden="true" />
      <span className="hero__cta-edge" aria-hidden="true" />
      <span className="hero__cta-label">
        <span>{children}</span>
        <span className="hero__cta-arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      </span>
    </a>
  );
}
