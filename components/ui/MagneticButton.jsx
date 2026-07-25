'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

const VARIANTS = {
  solid:
    'bg-heat-500 text-ink-950 hover:bg-heat-400 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)]',
  outline:
    'border border-bone-500/30 text-bone-100 hover:border-heat-500/60 hover:text-white',
  ghost: 'text-bone-300 hover:text-white',
};

const SIZES = {
  sm: 'px-5 py-2.5 text-[13px]',
  md: 'px-7 py-3.5 text-sm',
  lg: 'px-9 py-4.5 text-[15px]',
};

/**
 * A button that leans toward the cursor while the pointer is near it, and
 * tilts in 3D as the pointer crosses its face.
 *
 * Three coupled effects, all driven by one pointermove:
 *  - translate: the whole button drifts toward the pointer (the "magnet")
 *  - rotateX/rotateY: perspective tilt away from the pointer position
 *  - the inner label translates further than the shell, which reads as depth
 *
 * Every value runs through a spring, so releasing the pointer settles rather
 * than snaps. Fully disabled under prefers-reduced-motion, the button keeps
 * its colour-only hover states.
 */
export default function MagneticButton({
  children,
  as = 'button',
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  strength = 0.35,
  tilt = 9,
  radius = 1.6,
  className = '',
  cursorLabel,
  ...rest
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const spring = { stiffness: 260, damping: 22, mass: 0.6 };
  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);

  // Tilt is inverted on X so the button appears to press away from the
  // pointer, the way a physical surface under a fingertip would.
  const rotateX = useSpring(useTransform(my, [-60, 60], [tilt, -tilt]), spring);
  const rotateY = useSpring(useTransform(mx, [-60, 60], [-tilt, tilt]), spring);

  const handleMove = (e) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Only pull once the pointer is inside the magnetic radius; beyond it the
    // button should sit perfectly still rather than twitch at long range.
    const dist = Math.hypot(dx, dy);
    const maxDist = (Math.max(rect.width, rect.height) / 2) * radius;
    if (dist > maxDist) {
      mx.set(0);
      my.set(0);
      return;
    }

    const falloff = 1 - dist / maxDist;
    mx.set(dx * strength * falloff);
    my.set(dy * strength * falloff);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const Component = motion[as] || motion.button;
  const isLink = as === 'a';

  return (
    <motion.div
      // The listener lives on a padded wrapper so the magnet engages before
      // the pointer technically reaches the button.
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="inline-block p-6 -m-6"
      style={{ perspective: 700 }}
    >
      <Component
        ref={ref}
        href={isLink ? href : undefined}
        onClick={onClick}
        data-cursor="hover"
        data-cursor-label={cursorLabel}
        style={{ x, y, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={[
          'group relative inline-flex items-center justify-center gap-2.5',
          'rounded-full font-medium tracking-tight',
          'transition-colors duration-300 will-change-transform',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heat-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950',
          VARIANTS[variant] ?? VARIANTS.solid,
          SIZES[size] ?? SIZES.md,
          className,
        ].join(' ')}
        {...rest}
      >
        {/* Label sits on its own Z plane and travels slightly further than
            the shell, the parallax between the two is what sells the depth. */}
        <motion.span
          className="relative z-10 inline-flex items-center gap-2.5"
          style={{ transform: 'translateZ(22px)' }}
        >
          {children}
        </motion.span>

        {/* Sheen that sweeps across on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/20 blur-md transition-all duration-700 ease-out group-hover:left-[140%]" />
        </span>
      </Component>
    </motion.div>
  );
}
