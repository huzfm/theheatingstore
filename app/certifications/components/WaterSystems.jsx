'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { WATER_SYSTEM_STAGES } from '../data';

export default function WaterSystems() {
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
			<div className='cfx-water-grid' style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<div>
					<motion.p
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.6 }}
						transition={{ duration: 0.6, ease: EASE }}
						className='cfx-eyebrow'
						style={{ margin: '0 0 16px' }}>
						<span style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral }} />
						Hydronic
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
						whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.06 }}
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(28px,3.6vw,44px)',
							fontWeight: 600,
							lineHeight: 1.12,
							margin: 0,
						}}>
						Water-Based Standards
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
						style={{ marginTop: 18, fontSize: 15, lineHeight: 1.85, color: C.soft, maxWidth: 440 }}>
						WRAS-approved pipes and fittings, complying with Water Supply
						Regulations and Scottish Byelaws — every manifold assembly meets
						strict hygienic standards, engineered for a 50-year service life.
					</motion.p>
				</div>

				<div className='cfx-water-flow'>
					<div className='cfx-water-line' aria-hidden />
					<motion.div
						className='cfx-water-line-fill'
						aria-hidden
						initial={{ scaleY: 0 }}
						whileInView={{ scaleY: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1.4, ease: EASE }}
					/>
					{WATER_SYSTEM_STAGES.map((stage, i) => (
						<motion.div
							key={stage.label}
							className='cfx-water-node'
							initial={{ opacity: 0, x: 16 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, amount: 0.6 }}
							transition={{ duration: 0.6, ease: EASE, delay: i * 0.09 }}>
							<span className='cfx-water-dot' aria-hidden />
							<p
								style={{
									margin: 0,
									fontFamily: 'var(--font-heading)',
									fontSize: 18,
									fontWeight: 600,
									color: C.text,
								}}>
								{stage.label}
							</p>
							<p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.6, color: C.soft }}>
								{stage.detail}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
