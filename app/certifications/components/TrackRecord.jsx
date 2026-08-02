'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { TRACK_RECORD } from '../data';

export default function TrackRecord() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.5 });

	return (
		<section
			className='cfx-noise'
			style={{
				position: 'relative',
				background: '#0d0805',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '96px 20px',
			}}>
			<div ref={ref} style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.6 }}
					transition={{ duration: 0.6, ease: EASE }}
					className='cfx-eyebrow'
					style={{ margin: '0 0 16px' }}>
					<span style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral }} />
					Global Scale
				</motion.p>
				<motion.h2
					initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.06 }}
					className='brand-h'
					style={{ margin: 0 }}>
					Proven at Global Scale
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, filter: 'blur(10px)' }}
					animate={inView ? { opacity: 1, filter: 'blur(0px)' } : {}}
					transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
					style={{
						margin: '36px 0 6px',
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(64px,9vw,120px)',
						fontWeight: 600,
						lineHeight: 1,
						background: 'linear-gradient(100deg,#E8933A,#F5B97A 40%,#FF7E5F 70%,#F5B97A)',
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						color: 'transparent',
					}}>
					{TRACK_RECORD.headline}
				</motion.p>
				<p
					style={{
						margin: 0,
						fontSize: 13,
						fontWeight: 600,
						textTransform: 'uppercase',
						letterSpacing: '0.2em',
						color: C.soft,
					}}>
					{TRACK_RECORD.headlineLabel}
				</p>

				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true, amount: 0.3 }}
					variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
					className='cfx-track-map'>
					{TRACK_RECORD.nodes.map((label) => (
						<motion.div
							key={label}
							className='cfx-track-node'
							variants={{
								hidden: { opacity: 0, x: -12 },
								show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
							}}>
							<span className='cfx-track-dot' aria-hidden />
							<span style={{ fontSize: 14, color: C.text, whiteSpace: 'nowrap' }}>{label}</span>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
