'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { EASE } from '@/components/sections/WhyChooseUs/theme';
import { useMagnetic } from '../hooks';

export function Badge({ children }) {
	return (
		<div className='le-badge'>
			<span className='le-badge-dot' />
			{children}
		</div>
	);
}

export function Reveal({ children, y = 26, x = 0, delay = 0, amount = 0.2, className, ...rest }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount });
	return (
		<motion.div
			ref={ref}
			className={className}
			initial={{ opacity: 0, y, x, filter: 'blur(4px)' }}
			animate={seen ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' } : {}}
			transition={{ duration: 0.9, ease: EASE, delay }}
			{...rest}>
			{children}
		</motion.div>
	);
}

// Magnetic wrapper for the site's Link CTAs: forwards the magnet transform
// onto a motion.div shell so Link itself stays a plain, fully-crawlable
// anchor underneath, no motion(Link) ref-forwarding surprises.
export function MagneticCTA({ href, className, children, disabled }) {
	const magnet = useMagnetic({ disabled });
	return (
		<motion.div
			ref={magnet.ref}
			onMouseMove={magnet.onMouseMove}
			onMouseLeave={magnet.onMouseLeave}
			style={{ ...magnet.style, display: 'inline-block' }}>
			<Link href={href} className={className}>
				{children}
			</Link>
		</motion.div>
	);
}

export function SectionKicker({ index, label }) {
	return (
		<span className='le-kicker'>
			<span className='le-kicker-index'>{index}</span>
			{label}
		</span>
	);
}
