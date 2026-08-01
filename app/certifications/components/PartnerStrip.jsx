'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { PARTNERS, PARTNERS_NOTE } from '../data';

export default function PartnerStrip() {
	return (
		<section
			className='cfx-noise'
			style={{
				position: 'relative',
				background: '#0d0805',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '80px 20px 96px',
			}}>
			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<motion.h2
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.7, ease: EASE }}
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(20px,2.6vw,28px)',
						fontWeight: 600,
						margin: '0 0 28px',
					}}>
					Kashmir-Installed Technology Partners
				</motion.h2>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 0.8, ease: EASE }}
					className='cfx-glass cfx-partners'
					style={{ borderRadius: 20, overflow: 'hidden' }}>
					{PARTNERS.map((p) => (
						<Link
							key={p.slug}
							href={`/brands/${p.slug}`}
							className='cfx-partner'
							aria-label={`View ${p.name} products`}>
							<span
								style={{
									fontFamily: 'ui-monospace, monospace',
									fontSize: 11,
									letterSpacing: '0.1em',
									color: C.mute,
								}}>
								{p.n}
							</span>
							<p
								className='cfx-partner-name'
								style={{
									margin: '18px 0 0',
									fontFamily: 'var(--font-heading)',
									fontSize: 'clamp(22px,2.2vw,28px)',
									fontWeight: 600,
									letterSpacing: '0.01em',
									color: C.text,
								}}>
								{p.name}
							</p>
							<span className='cfx-partner-bar' aria-hidden />
						</Link>
					))}
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
					style={{
						marginTop: 26,
						maxWidth: 720,
						fontSize: 14.5,
						lineHeight: 1.8,
						color: C.soft,
					}}>
					{PARTNERS_NOTE}
				</motion.p>
			</div>
		</section>
	);
}
