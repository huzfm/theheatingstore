'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { WARRANTY } from '../data';

function WarrantyPanel({ item, i }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.5 });

	return (
		<div ref={ref} className='cfx-warranty-panel'>
			<span aria-hidden className='cfx-warranty-watermark'>
				{item.value}
			</span>
			<motion.p
				initial={{ opacity: 0, filter: 'blur(10px)' }}
				animate={inView ? { opacity: 1, filter: 'blur(0px)' } : {}}
				transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
				style={{
					margin: 0,
					fontFamily: 'var(--font-heading)',
					fontSize: 'clamp(56px,7vw,96px)',
					fontWeight: 600,
					lineHeight: 1,
					color: C.text,
				}}>
				{item.value}
				{item.unit && (
					<span style={{ fontSize: '0.32em', fontWeight: 600, marginLeft: 10, color: C.amberLt }}>
						{item.unit}
					</span>
				)}
			</motion.p>
			<motion.p
				initial={{ opacity: 0, y: 12 }}
				animate={inView ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6, ease: EASE, delay: 0.2 + i * 0.1 }}
				style={{
					margin: '18px 0 12px',
					fontSize: 12,
					fontWeight: 600,
					textTransform: 'uppercase',
					letterSpacing: '0.2em',
					color: C.amberLt,
				}}>
				{item.label}
			</motion.p>
			<motion.p
				initial={{ opacity: 0, y: 12 }}
				animate={inView ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6, ease: EASE, delay: 0.3 + i * 0.1 }}
				style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.soft, maxWidth: 360, position: 'relative' }}>
				{item.desc}
			</motion.p>
		</div>
	);
}

export default function Warranty() {
	return (
		<section
			className='cfx-noise'
			style={{
				position: 'relative',
				background: 'linear-gradient(180deg,#0f0906 0%,#150d07 100%)',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '96px 20px',
			}}>
			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<motion.h2
					initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					className='brand-h'
					style={{ margin: '0 0 44px' }}>
					Protection Architecture
				</motion.h2>

				<div className='cfx-warranty-grid' style={{ borderRadius: 20, overflow: 'hidden' }}>
					{WARRANTY.map((item, i) => (
						<WarrantyPanel key={item.label} item={item} i={i} />
					))}
				</div>
			</div>
		</section>
	);
}
