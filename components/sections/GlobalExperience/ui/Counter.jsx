'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EASE } from '../theme';

// Blur-in numeric reveal for large architectural statistics.
export default function Counter({ display, className = '' }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount: 0.5 });
	const [val, setVal] = useState(' ');

	useEffect(() => {
		if (!seen) return;
		const t = setTimeout(() => setVal(display), 140);
		return () => clearTimeout(t);
	}, [seen, display]);

	return (
		<motion.span
			ref={ref}
			className={className}
			initial={{ opacity: 0, filter: 'blur(8px)' }}
			animate={seen ? { opacity: 1, filter: 'blur(0px)' } : {}}
			transition={{ duration: 0.8, ease: EASE }}>
			{val}
		</motion.span>
	);
}
