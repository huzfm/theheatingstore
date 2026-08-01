'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { SAFETY_STAGES } from '../data';

export default function SafetySequence() {
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
			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<motion.h2
					initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(28px,3.6vw,44px)',
						fontWeight: 600,
						margin: '0 0 44px',
					}}>
					Safety &amp; Installation
				</motion.h2>

				<div className='cfx-safety-row'>
					{SAFETY_STAGES.map((s, i) => (
						<motion.div
							key={s.code}
							className='cfx-safety-item'
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}>
							<span
								style={{
									fontFamily: 'ui-monospace, monospace',
									fontSize: 12,
									letterSpacing: '0.1em',
									color: C.mute,
								}}>
								{s.n}
							</span>
							<p
								style={{
									margin: '16px 0 0',
									fontFamily: 'var(--font-heading)',
									fontSize: 'clamp(22px,2.6vw,28px)',
									fontWeight: 600,
									lineHeight: 1.15,
									color: C.text,
								}}>
								{s.code}
							</p>
							<p style={{ margin: '10px 0 14px', fontSize: 13.5, fontWeight: 600, color: C.amberLt }}>
								{s.title}
							</p>
							<p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.8, color: C.soft }}>{s.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
