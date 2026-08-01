'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';

export default function HowItWorksCTA() {
	return (
		<section
			className='hiw-noise'
			style={{
				position: 'relative',
				background:
					'radial-gradient(120% 100% at 50% 100%, rgba(232,147,58,0.14), transparent 55%),linear-gradient(180deg,#150d07 0%,#0d0805 100%)',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '110px 20px 120px',
				textAlign: 'center',
			}}>
			<motion.div
				initial={{ opacity: 0, y: 26, filter: 'blur(5px)' }}
				whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
				viewport={{ once: true, amount: 0.4 }}
				transition={{ duration: 0.85, ease: EASE }}
				style={{ maxWidth: 640, margin: '0 auto' }}>
				<h2 className='brand-h' style={{ fontSize: 'clamp(30px,4.4vw,50px)' }}>
					Ready to plan
					<span className='brand-h-accent' style={{ display: 'block' }}>
						your warm floor?
					</span>
				</h2>
				<p className='brand-sub' style={{ marginTop: 22, fontSize: 15.5 }}>
					Tell us about your space — we&rsquo;ll walk you through the
					system, timeline, and what to expect before work begins.
				</p>
				<div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
					<a
						href='/contact'
						className='hiw-btn-primary'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							borderRadius: 999,
							padding: '15px 34px',
							fontSize: 13.5,
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
						href='/contact'
						className='hiw-btn-secondary'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							borderRadius: 999,
							padding: '13px 30px',
							fontSize: 13.5,
							fontWeight: 500,
							color: C.text,
							background: 'rgba(255,255,255,0.05)',
							border: '1px solid rgba(245,185,122,0.35)',
							textDecoration: 'none',
						}}>
						Talk to an Expert
					</a>
				</div>
			</motion.div>
		</section>
	);
}
