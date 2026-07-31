'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { EASE } from '../theme';

export function Reveal({ children, y = 26, x = 0, delay = 0, amount = 0.15, ...rest }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount });
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y, x }}
			animate={seen ? { opacity: 1, y: 0, x: 0 } : {}}
			transition={{ duration: 0.9, ease: EASE, delay }}
			{...rest}>
			{children}
		</motion.div>
	);
}
