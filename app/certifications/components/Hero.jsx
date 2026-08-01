'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { HERO } from '../data';

// Angles for the four ring labels, evenly spaced starting from the top.
const RING_ANGLES = [-90, 0, 90, 180];

function TechnicalSeal() {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
			whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
			className='cfx-seal-wrap'
			aria-hidden='true'>
			<div className='cfx-seal-ring' style={{ inset: '6%' }} />
			<div className='cfx-seal-ring cfx-seal-ring--dashed' style={{ inset: '15%' }} />
			<div className='cfx-seal-ring cfx-seal-ring--ticks' />
			<div className='cfx-seal-crosshair' />

			<span className='cfx-seal-coord' style={{ top: '2%', left: '4%' }}>
				40.3&deg;N
			</span>
			<span className='cfx-seal-coord' style={{ bottom: '2%', right: '4%' }}>
				74.8&deg;E
			</span>

			<div className='cfx-seal-core'>
				<span
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 34,
						fontWeight: 600,
						letterSpacing: '0.02em',
						color: C.text,
					}}>
					{HERO.seal.center}
				</span>
			</div>

			{HERO.seal.ring.map((label, i) => {
				const angle = (RING_ANGLES[i] * Math.PI) / 180;
				const r = 47;
				const x = 50 + r * Math.cos(angle);
				const y = 50 + r * Math.sin(angle);
				return (
					<motion.span
						key={label}
						className='cfx-seal-label'
						style={{ left: `${x}%`, top: `${y}%` }}
						initial={{ opacity: 0, scale: 0.6 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.6, ease: EASE, delay: 0.6 + i * 0.1 }}>
						{label}
					</motion.span>
				);
			})}
		</motion.div>
	);
}

export default function Hero() {
	return (
		<section
			className='cfx-noise'
			style={{
				position: 'relative',
				overflow: 'hidden',
				background:
					'radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%)',
				fontFamily: 'var(--font-body)',
				color: C.text,
			}}>
			<div className='cfx-blueprint' aria-hidden />
			<div className='cfx-vignette' aria-hidden />

			<div
				className='cfx-hero-grid'
				style={{
					position: 'relative',
					zIndex: 2,
					maxWidth: 1320,
					margin: '0 auto',
					padding: '128px 20px 88px',
				}}>
				<div>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.6 }}
						transition={{ duration: 0.7, ease: EASE }}
						className='cfx-eyebrow'
						style={{ margin: '0 0 26px' }}>
						<span
							style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral, flexShrink: 0 }}
						/>
						{HERO.eyebrow}
					</motion.p>

					<h1 style={{ margin: 0 }}>
						{HERO.heading.map((line, i) => (
							<motion.span
								key={line}
								initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
								whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ duration: 0.85, ease: EASE, delay: 0.12 + i * 0.14 }}
								style={{
									display: 'block',
									fontFamily: 'var(--font-heading)',
									fontSize: 'clamp(36px,5.4vw,68px)',
									fontWeight: i === 1 ? 300 : 600,
									fontStyle: i === 1 ? 'italic' : 'normal',
									lineHeight: 1.05,
									letterSpacing: '-0.01em',
									color: i === 1 ? C.amberLt : C.text,
								}}>
								{line}
							</motion.span>
						))}
					</h1>

					<motion.p
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.85, ease: EASE, delay: 0.42 }}
						style={{
							marginTop: 26,
							fontSize: 'clamp(14.5px,1.8vw,17px)',
							lineHeight: 1.8,
							color: C.soft,
							maxWidth: 520,
						}}>
						{HERO.body}
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
						className='cfx-meta-row'>
						{HERO.meta.map((m) => (
							<div key={m.label} className='cfx-meta-item'>
								<p
									style={{
										margin: '0 0 4px',
										fontSize: 10,
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '0.18em',
										color: C.mute,
									}}>
									{m.label}
								</p>
								<p
									style={{
										margin: 0,
										fontFamily: 'var(--font-heading)',
										fontSize: 20,
										fontWeight: 600,
										color: C.text,
									}}>
									{m.value}
								</p>
							</div>
						))}
					</motion.div>
				</div>

				<TechnicalSeal />
			</div>
		</section>
	);
}
