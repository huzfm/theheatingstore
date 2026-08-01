'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { EASE } from '../theme';

export function Counter({ display }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount: 0.5 });
	const [val, setVal] = useState(' ');
	useEffect(() => {
		if (!seen) return;
		const t = setTimeout(() => setVal(display), 160);
		return () => clearTimeout(t);
	}, [seen, display]);
	return (
		<motion.span
			ref={ref}
			initial={{ opacity: 0, filter: 'blur(6px)' }}
			animate={seen ? { opacity: 1, filter: 'blur(0px)' } : {}}
			transition={{ duration: 0.7, ease: EASE }}>
			{val}
		</motion.span>
	);
}
