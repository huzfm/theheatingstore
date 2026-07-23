'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Headline that reveals word by word on scroll-into-view.
 *
 * Each word sits in an overflow-hidden line box and slides up from below it,
 * so words appear to rise out of the page rather than fade in place — the
 * mask edge is what makes it feel typeset rather than animated.
 *
 * Under reduced motion the whole thing renders as plain static text.
 */
export function RevealText({
  children,
  as = 'h2',
  className = '',
  delay = 0,
  stagger = 0.055,
  once = true,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.h2;

  const text = typeof children === 'string' ? children : '';

  if (reduceMotion || !text) {
    const Static = as;
    return (
      <Static className={className} {...rest}>
        {children}
      </Static>
    );
  }

  const words = text.split(' ');

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -15% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
      {...rest}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          // inline-block + clipped box gives each word its own mask line.
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: {
                y: '0%',
                opacity: 1,
                transition: { duration: 0.9, ease: EASE },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Generic "fade + rise on scroll into view" wrapper for body copy, buttons,
 * cards — anything that isn't a headline. Keeps the entrance easing identical
 * everywhere so the site feels like one system.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
  duration = 0.85,
  once = true,
  ...rest
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers a set of children (cards, list items, steps) as the group scrolls
 * in. Children are wrapped in RevealItem.
 */
export function RevealGroup({
  children,
  className = '',
  stagger = 0.09,
  delay = 0,
  once = true,
  ...rest
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '0px 0px -12% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = '', y = 28, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: EASE },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
