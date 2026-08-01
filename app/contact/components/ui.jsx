'use client';

import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { EASE } from '@/components/sections/WhyChooseUs/theme';
import { useMagnetic } from '../hooks';

export function Badge({ children }) {
	return (
		<div className='brand-badge'>
			<span className='brand-badge-dot' />
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

// Magnetic wrapper for internal CTAs — plain crawlable <Link> underneath,
// the magnet transform lives on a motion.div shell around it.
export function MagneticCTA({ href, className, children, disabled }) {
	const magnet = useMagnetic({ disabled });
	return (
		<motion.div ref={magnet.ref} onMouseMove={magnet.onMouseMove} onMouseLeave={magnet.onMouseLeave} style={{ ...magnet.style, display: 'inline-block' }}>
			<Link href={href} className={className}>
				{children}
			</Link>
		</motion.div>
	);
}

// Same magnet physics for external / non-routable CTAs (tel:, mailto:, wa.me)
// where a plain <a> is required instead of next/link.
export function MagneticAnchor({ href, className, children, disabled, ...rest }) {
	const magnet = useMagnetic({ disabled });
	return (
		<motion.div ref={magnet.ref} onMouseMove={magnet.onMouseMove} onMouseLeave={magnet.onMouseLeave} style={{ ...magnet.style, display: 'inline-block' }}>
			<a href={href} className={className} {...rest}>
				{children}
			</a>
		</motion.div>
	);
}

export function SectionKicker({ index, label }) {
	return (
		<span className='ct-kicker'>
			<span className='ct-kicker-index'>{index}</span>
			{label}
		</span>
	);
}
