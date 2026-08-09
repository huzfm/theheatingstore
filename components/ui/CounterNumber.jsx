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

    // The server renders the REAL value (see the span below), so before the
    // count can run it has to be walked back to `from`. That is done here,
    // on the client, while the counter is still off screen, so the number
    // never visibly snaps backwards; by the time it scrolls into view the
    // count-up is what the user sees.
    if (!hasStarted.current && !inView) {
      if (ref.current) ref.current.textContent = format(from);
      return;
    }

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
      {/* Server-renders the REAL value, not `from`.
          This used to render `from` (0), which meant the HTML Google, every
          LLM crawler and every no-JS visitor received said "0% Customers
          satisfied" and "0+ Systems supplied". The count-up is re-armed on
          the client by the effect above. */}
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  );
}
