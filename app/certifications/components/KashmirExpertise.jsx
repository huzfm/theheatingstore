'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { KASHMIR_POINTS } from '../data';

export default function KashmirExpertise() {
	return (
		<section
			className='cfx-noise cfx-kashmir'
			style={{
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '104px 20px',
			}}>
			<div className='cfx-kashmir-grid' style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<div>
					<motion.p
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.6 }}
						transition={{ duration: 0.6, ease: EASE }}
						className='cfx-eyebrow'
						style={{ margin: '0 0 20px' }}>
						<span style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral }} />
						Kashmir Expertise
					</motion.p>
					<h2 style={{ margin: 0 }}>
						<motion.span
							initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.8, ease: EASE }}
							style={{
								display: 'block',
								fontFamily: 'var(--font-heading)',
								fontSize: 'clamp(28px,3.6vw,42px)',
								fontWeight: 600,
								lineHeight: 1.15,
								color: C.text,
							}}>
							International standards.
						</motion.span>
						<motion.span
							initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
							className='brand-h-accent'
							style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,3.6vw,42px)', lineHeight: 1.15 }}>
							Kashmir-specific execution.
						</motion.span>
					</h2>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
						style={{ marginTop: 24, fontSize: 15, lineHeight: 1.85, color: C.soft, maxWidth: 400 }}>
						Certifications set the baseline. Ours are engineered further,
						for conditions certification bodies elsewhere never test for.
					</motion.p>
				</div>

				<div className='cfx-kashmir-list'>
					{KASHMIR_POINTS.map((p, i) => (
						<motion.div
							key={p.label}
							className='cfx-kashmir-item'
							initial={{ opacity: 0, x: 16 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}>
							<span
								style={{
									fontFamily: 'ui-monospace, monospace',
									fontSize: 12,
									color: C.amberLt,
									paddingTop: 3,
								}}>
								{String(i + 1).padStart(2, '0')}
							</span>
							<div>
								<p style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: C.text }}>{p.label}</p>
								<p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.75, color: C.soft }}>
									{p.desc}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
