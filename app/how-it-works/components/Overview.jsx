'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';

export default function Overview() {
	return (
		<section
			style={{
				position: 'relative',
				background: '#0f0906',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '88px 20px 40px',
			}}>
			<div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
				<motion.h2
					initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					className='brand-h'
					style={{ fontSize: 'clamp(26px,3.6vw,42px)' }}>
					One system.
					<span className='brand-h-accent'> Four managed stages.</span>
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
					className='brand-sub'
					style={{ marginTop: 20 }}>
					One certified team carries the project from first measurement
					to a system you control from your phone — no surveyor,
					electrician and installer to coordinate yourself.
				</motion.p>
			</div>
		</section>
	);
}
