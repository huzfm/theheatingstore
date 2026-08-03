'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { TRUST_STATS } from '../data';

export default function TrustProof() {
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
			<div style={{ maxWidth: 1320, margin: '0 auto' }}>
				<motion.div
					initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{ maxWidth: 620, marginBottom: 48 }}>
					<p className='brand-kicker' style={{ margin: '0 0 18px' }}>
						Proof, Not Promises
					</p>
					<h2 className='brand-h' style={{ fontSize: 'clamp(28px,3.8vw,44px)' }}>
						What the process
						<span className='brand-h-accent' style={{ display: 'block' }}>
							actually looks like.
						</span>
					</h2>
				</motion.div>

				{/* Stat rail */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
					className='hiw-glass hiw-stat-rail'>
					{TRUST_STATS.map((s) => (
						<div key={s.label} className='hiw-stat-rail-item'>
							<p
								style={{
									fontFamily: 'var(--font-heading)',
									fontSize: 'clamp(24px,2.6vw,32px)',
									fontWeight: 600,
									color: C.amberLt,
									margin: 0,
								}}>
								{s.value}
							</p>
							<p style={{ fontSize: 12, color: C.soft, margin: '4px 0 0' }}>{s.label}</p>
						</div>
					))}
				</motion.div>

				{/* Real project photography */}
				<motion.div
					initial={{ opacity: 0, y: 32 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.9, ease: EASE }}
					className='hiw-glass'
					style={{ marginTop: 40, borderRadius: 24, overflow: 'hidden' }}>
					<div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 8' }}>
						<Image
							src='/images/floor2.webp'
							alt='Underfloor heating cable and tile installation in progress over a screed subfloor'
							fill
							sizes='(max-width: 1024px) 100vw, 1280px'
							style={{ objectFit: 'cover' }}
						/>
						<div
							aria-hidden
							style={{
								position: 'absolute',
								inset: 0,
								background: 'linear-gradient(180deg, rgba(13,8,5,0) 55%, rgba(13,8,5,0.82) 100%)',
							}}
						/>
						<div style={{ position: 'absolute', left: 24, bottom: 22, right: 24 }}>
							<p
								style={{
									fontSize: 10,
									fontWeight: 600,
									letterSpacing: '0.2em',
									textTransform: 'uppercase',
									color: C.amberLt,
									margin: '0 0 4px',
								}}>
								Project in Progress
							</p>
							<p style={{ fontSize: 13.5, color: C.text, margin: 0, maxWidth: 480 }}>
								Cable laid to CAD spec and tiled over, on site, before the floor finish is signed off.
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
