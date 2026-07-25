'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Dark card with a border that lights up where the cursor is.
 *
 * The trick is two stacked layers sharing one pair of CSS custom properties
 * updated on pointermove:
 *  - a border layer: a radial gradient masked to a 1px inset ring, so the
 *    edge glows only near the pointer
 *  - a surface layer: a much wider, fainter radial wash inside the card
 *
 * Both are pure CSS paint driven by --gx/--gy, so tracking the pointer costs
 * no React renders. Only the lift/scale runs through Framer Motion.
 */
export default function GlowCard({
  children,
  className = '',
  as = 'div',
  lift = -6,
  interactive = true,
  ...rest
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const handleMove = (e) => {
    const el = ref.current;
    if (!el || !interactive) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--gy', `${e.clientY - rect.top}px`);
    el.style.setProperty('--glow', '1');
  };

  const handleLeave = () => {
    ref.current?.style.setProperty('--glow', '0');
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={
        reduceMotion || !interactive ? undefined : { y: lift, scale: 1.012 }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={[
        'group relative isolate overflow-hidden rounded-2xl',
        'bg-ink-900/80 backdrop-blur-sm',
        'ring-1 ring-white/[0.07]',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_50px_-30px_rgba(0,0,0,0.9)]',
        'transition-shadow duration-500',
        interactive
          ? 'hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_30px_70px_-28px_rgba(255,138,61,0.28)]'
          : '',
        className,
      ].join(' ')}
      style={{ '--glow': 0 }}
      {...rest}
    >
      {/* Border glow, gradient clipped to a 1px ring via mask compositing */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glow)] transition-opacity duration-500"
        style={{
          padding: 1,
          background:
            'radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,138,61,0.85), transparent 70%)',
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          maskComposite: 'exclude',
        }}
      />

      {/* Interior wash */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-[var(--glow)] transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(400px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,138,61,0.09), transparent 60%)',
        }}
      />

      {children}
    </Component>
  );
}
