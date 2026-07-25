'use client';

import { useEffect, useRef } from 'react';
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

/**
 * A number that counts up from zero the first time it enters the viewport,
 * and smoothly tweens between values whenever `value` changes afterwards
 * (used by the configurator, where cost/area update live).
 *
 * The digits are written directly to a span's textContent from a motion-value
 * subscription. Formatting a number through React state at 60fps would
 * re-render the whole card every frame for what is ultimately one text node.
 */
export default function CounterNumber({
  value = 0,
  from = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = true,
  duration = 1.6,
  once = true,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once, margin: '0px 0px -12% 0px' });
  const hasStarted = useRef(false);

  const motionValue = useMotionValue(from);
  // Stiffness/damping tuned to land in roughly `duration` seconds with a
  // fast start and a long settle, reads as "counting", not "sliding".
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const format = (n) => {
    const fixed = Number(n).toFixed(decimals);
    if (!separator) return fixed;
    const [int, dec] = fixed.split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dec ? `${grouped}.${dec}` : grouped;
  };

  // Start (or re-target) the count.
  useEffect(() => {
    if (reduceMotion) {
      motionValue.jump?.(value);
      spring.jump?.(value);
      if (ref.current) ref.current.textContent = format(value);
      return;
    }

    if (!inView && !hasStarted.current) return;

    if (!hasStarted.current) {
      hasStarted.current = true;
      spring.jump?.(from);
    }

    motionValue.set(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduceMotion]);

  // Paint each frame's value.
  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = format(latest);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decimals, separator]);

  return (
    <span className={className} {...rest}>
      {prefix}
      {/* Server-renders as `from` so there's no layout jump on hydration and
          the value is present for crawlers / no-JS. */}
      <span ref={ref}>{format(reduceMotion ? value : from)}</span>
      {suffix}
    </span>
  );
}
