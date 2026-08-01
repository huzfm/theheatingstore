'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { TECHNICAL } from '../data';
import SceneRadiant from './scenes/SceneRadiant';

export default function TechnicalPrecision() {
	return (
		<section
			className='hiw-noise'
			style={{
				position: 'relative',
				background: 'linear-gradient(180deg,#0f0906 0%,#150d07 100%)',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '96px 20px',
			}}>
			<div className='hiw-tech-grid' style={{ maxWidth: 1320, margin: '0 auto' }}>
				<motion.div
					initial={{ opacity: 0, y: 32, scale: 0.97 }}
					whileInView={{ opacity: 1, y: 0, scale: 1 }}
					viewport={{ once: true, amount: 0.25 }}
					transition={{ duration: 0.9, ease: EASE }}
					className='hiw-glass'
					style={{ borderRadius: 24, padding: '14px 10px', height: 380 }}>
					<SceneRadiant active />
				</motion.div>

				<div>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: EASE }}
						className='brand-kicker'
						style={{ margin: '0 0 18px' }}>
						{TECHNICAL.tag}
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
						whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
						className='brand-h'
						style={{ fontSize: 'clamp(26px,3.4vw,40px)' }}>
						{TECHNICAL.title}
						<span className='brand-h-accent' style={{ display: 'block' }}>
							{TECHNICAL.titleAccent}
						</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
						className='brand-sub'
						style={{ marginTop: 22 }}>
						{TECHNICAL.desc}
					</motion.p>

					<div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
						{TECHNICAL.points.map((pt, i) => (
							<motion.div
								key={pt.label}
								initial={{ opacity: 0, x: 16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
								className='hiw-glass'
								style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '13px 18px', borderRadius: 14 }}>
								<span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{pt.label}</span>
								<span style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.5 }}>{pt.detail}</span>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
