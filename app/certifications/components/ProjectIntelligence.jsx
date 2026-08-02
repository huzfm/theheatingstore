'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { PROJECT_INTELLIGENCE } from '../data';

export default function ProjectIntelligence() {
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
					Project Intelligence
				</motion.h2>

				<div className='cfx-intel-row'>
					{PROJECT_INTELLIGENCE.map((item, i) => (
						<motion.div
							key={item.n}
							className='cfx-intel-item'
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}>
							<span
								style={{
									fontFamily: 'var(--font-heading)',
									fontSize: 40,
									fontWeight: 600,
									color: 'rgba(245,185,122,0.28)',
								}}>
								{item.n}
							</span>
							<p
								style={{
									margin: '14px 0 12px',
									fontFamily: 'var(--font-heading)',
									fontSize: 19,
									fontWeight: 600,
									letterSpacing: '0.01em',
									color: C.text,
								}}>
								{item.title}
							</p>
							<p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.85, color: C.soft }}>{item.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
