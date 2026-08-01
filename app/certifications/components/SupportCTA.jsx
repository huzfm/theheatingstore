'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { SUPPORT_POINTS } from '../data';

export default function SupportCTA() {
	return (
		<section
			style={{
				position: 'relative',
				background: '#0d0805',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '0 20px 120px',
			}}>
			<motion.div
				initial={{ opacity: 0, y: 28, scale: 0.98 }}
				whileInView={{ opacity: 1, y: 0, scale: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.85, ease: EASE }}
				className='cfx-cta'
				style={{ maxWidth: 1320, margin: '0 auto' }}>
				<div className='cfx-cta-grid' aria-hidden />

				<div style={{ position: 'relative', zIndex: 1 }}>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							gap: 32,
						}}>
						<div style={{ maxWidth: 560 }}>
							<h2 style={{ margin: 0 }}>
								<span
									style={{
										display: 'block',
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(28px,3.6vw,42px)',
										fontWeight: 600,
										lineHeight: 1.15,
										color: C.text,
									}}>
									Engineered correctly.
								</span>
								<span className='brand-h-accent' style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,3.6vw,42px)', lineHeight: 1.15 }}>
									Supported locally.
								</span>
							</h2>
							<p style={{ marginTop: 20, fontSize: 15, lineHeight: 1.85, color: C.soft }}>
								Our Kashmir-based technical team provides ongoing support to
								ensure every installation meets the highest standards.
							</p>
						</div>

						<div style={{ textAlign: 'right' }}>
							<p
								style={{
									margin: 0,
									fontFamily: 'var(--font-heading)',
									fontSize: 32,
									fontWeight: 600,
									color: C.amberLt,
								}}>
								24/7
							</p>
							<p
								style={{
									margin: '4px 0 0',
									fontSize: 11,
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.2em',
									color: C.mute,
								}}>
								Technical Helpline
							</p>
						</div>
					</div>

					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
							gap: '10px 32px',
							marginTop: 44,
							paddingTop: 32,
							borderTop: '1px solid rgba(255,255,255,0.08)',
						}}>
						{SUPPORT_POINTS.map((point) => (
							<div key={point} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
								<span
									style={{
										width: 5,
										height: 5,
										borderRadius: '50%',
										background: C.amber,
										flexShrink: 0,
									}}
								/>
								<span style={{ fontSize: 13.5, color: C.soft }}>{point}</span>
							</div>
						))}
					</div>

					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 40 }}>
						<a href='/contact' className='cfx-btn-primary'>
							Talk to an Engineer
							<svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
								<path
									d='M3 7h8M8 4l3 3-3 3'
									stroke='white'
									strokeWidth='1.4'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</a>
						<a href='/how-it-works' className='cfx-btn-secondary'>
							Explore Installation
						</a>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
