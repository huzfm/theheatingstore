'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { CUSTOMER_EXPERIENCE } from '../data';

export default function CustomerExperience() {
	return (
		<section
			className='hiw-noise'
			style={{
				position: 'relative',
				background: '#0f0906',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '96px 20px',
			}}>
			<div style={{ maxWidth: 1320, margin: '0 auto' }}>
				<motion.div
					initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{ maxWidth: 620, marginBottom: 64 }}>
					<p className='brand-kicker' style={{ margin: '0 0 18px' }}>
						What You Experience
					</p>
					<h2 className='brand-h' style={{ fontSize: 'clamp(28px,3.8vw,44px)' }}>
						Not what we do.
						<span className='brand-h-accent' style={{ display: 'block' }}>
							What it feels like.
						</span>
					</h2>
				</motion.div>

				<div className='hiw-cx-row'>
					{CUSTOMER_EXPERIENCE.map((item, i) => (
						<motion.div
							key={item.phase}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
							className='hiw-cx-item'>
							<div
								style={{
									fontFamily: 'var(--font-heading)',
									fontSize: 'clamp(52px,6vw,84px)',
									fontWeight: 600,
									lineHeight: 1,
									color: 'rgba(245,185,122,0.14)',
									marginBottom: -10,
								}}>
								{item.num}
							</div>
							<p
								style={{
									fontSize: 11,
									fontWeight: 600,
									letterSpacing: '0.3em',
									textTransform: 'uppercase',
									color: C.amberLt,
									margin: '0 0 12px',
								}}>
								{item.phase}
							</p>
							<h3
								style={{
									fontFamily: 'var(--font-heading)',
									fontSize: 'clamp(19px,2vw,23px)',
									fontWeight: 600,
									lineHeight: 1.25,
									margin: '0 0 12px',
								}}>
								{item.title}
							</h3>
							<p style={{ fontSize: 13.5, lineHeight: 1.75, color: C.soft, margin: 0 }}>{item.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
