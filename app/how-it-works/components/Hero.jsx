'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';

export default function Hero() {
	const reduce = useReducedMotion();

	return (
		<section
			className='hiw-hero hiw-noise'
			style={{
				position: 'relative',
				overflow: 'hidden',
				background:
					'radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%)',
				fontFamily: 'var(--font-body)',
				color: C.text,
			}}>
			<div aria-hidden className='hiw-vignette' />

			<div
				style={{
					position: 'relative',
					zIndex: 2,
					maxWidth: 1320,
					margin: '0 auto',
					padding: '128px 20px 88px',
					display: 'grid',
					gridTemplateColumns: '1.05fr 0.95fr',
					gap: 56,
					alignItems: 'center',
				}}
				className='hiw-hero-grid'>
				{/* LEFT — copy */}
				<div>
					<motion.p
						initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						transition={{ duration: 0.8, ease: EASE }}
						className='brand-badge'
						style={{ margin: '0 0 26px' }}>
						<span className='brand-badge-dot' />
						How It Works
					</motion.p>

					<motion.h1
						initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
						className='brand-h'
						style={{ fontSize: 'clamp(34px,5vw,62px)' }}>
						From Site Survey to
						<span className='brand-h-accent' style={{ display: 'block' }}>
							Silent, Even Warmth.
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						transition={{ duration: 0.9, ease: EASE, delay: 0.26 }}
						className='brand-sub'
						style={{ marginTop: 24, maxWidth: 480 }}>
						Four stages, one team: a free CAD survey, NICEIC certified
						cable laying to BS 7671, thermostat commissioning, and a
						25 year warranty at the end of it.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
						style={{ marginTop: 38, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
						<a
							href='/contact'
							className='hiw-btn-primary'
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 8,
								borderRadius: 999,
								padding: '15px 32px',
								fontSize: 13,
								fontWeight: 600,
								color: 'white',
								background: 'linear-gradient(to right,#FF7E5F,#FFB88C)',
								boxShadow: '0 22px 60px rgba(255,126,95,0.35)',
								textDecoration: 'none',
							}}>
							Book Installation
							<svg width='14' height='14' viewBox='0 0 14 14' fill='none'>
								<path
									d='M3 7h8M8 4l3 3-3 3'
									stroke='white'
									strokeWidth='1.4'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</a>
						<a
							href='#journey'
							className='hiw-btn-secondary'
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 8,
								borderRadius: 999,
								padding: '13px 28px',
								fontSize: 13,
								fontWeight: 500,
								color: C.text,
								background: 'rgba(255,255,255,0.05)',
								border: '1px solid rgba(245,185,122,0.35)',
								textDecoration: 'none',
							}}>
							See the Process
							<span style={{ color: C.amberLt }}>↓</span>
						</a>
					</motion.div>
				</div>

				{/* RIGHT — framed technical photo */}
				<motion.div
					initial={{ opacity: 0, y: reduce ? 0 : 40, scale: 0.97 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 1, ease: EASE, delay: 0.2 }}
					style={{ position: 'relative' }}>
					<div
						className='hiw-glass'
						style={{
							position: 'relative',
							borderRadius: 24,
							overflow: 'hidden',
							aspectRatio: '4 / 5',
						}}>
						<Image
							src='/images/howitworks.png'
							alt='Cross-section of an electric underfloor heating cable installed over insulation board beneath a timber floor finish'
							fill
							priority
							sizes='(max-width: 900px) 90vw, 560px'
							style={{ objectFit: 'cover' }}
						/>
						<div
							aria-hidden
							style={{
								position: 'absolute',
								inset: 0,
								background: 'linear-gradient(180deg, rgba(13,8,5,0) 45%, rgba(13,8,5,0.75) 100%)',
							}}
						/>
						<div style={{ position: 'absolute', left: 20, bottom: 20, right: 20 }}>
							<p
								style={{
									fontSize: 10,
									fontWeight: 600,
									letterSpacing: '0.2em',
									textTransform: 'uppercase',
									color: C.amberLt,
									margin: '0 0 4px',
								}}>
								Actual Installation
							</p>
							<p style={{ fontSize: 13, color: C.text, margin: 0 }}>
								Cable, insulation and screed build-up beneath a timber finish
							</p>
						</div>
					</div>

					
				</motion.div>
			</div>
		</section>
	);
}
