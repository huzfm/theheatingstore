'use client';

import { motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { COMPLIANCE_PRIMARY, COMPLIANCE_SECONDARY, COMPLIANCE_CHIPS } from '../data';

function Num({ children }) {
	return (
		<span
			style={{
				fontFamily: 'ui-monospace, monospace',
				fontSize: 12,
				letterSpacing: '0.1em',
				color: C.mute,
			}}>
			{children}
		</span>
	);
}

export default function ComplianceSystem() {
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
			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<motion.p
					initial={{ opacity: 0, y: 14 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.6 }}
					transition={{ duration: 0.6, ease: EASE }}
					className='cfx-eyebrow'
					style={{ margin: '0 0 16px' }}>
					<span style={{ width: 6, height: 6, borderRadius: '50%', background: C.coral }} />
					Compliance
				</motion.p>
				<motion.h2
					initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.06 }}
					className='brand-h'
					style={{ margin: 0 }}>
					International Compliance
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
					className='brand-sub'
					style={{ marginTop: 14, maxWidth: 520 }}>
					Standards behind every installation.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.15 }}
					transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
					className='cfx-compliance-grid'
					style={{ marginTop: 44, borderRadius: 20, overflow: 'hidden' }}>
					<div className='cfx-compliance-cell cfx-compliance-primary'>
						<Num>{COMPLIANCE_PRIMARY.n}</Num>
						<p
							style={{
								margin: '18px 0 0',
								fontFamily: 'var(--font-heading)',
								fontSize: 'clamp(48px,6vw,84px)',
								fontWeight: 600,
								lineHeight: 1,
								color: C.text,
							}}>
							{COMPLIANCE_PRIMARY.code}
						</p>
						<p
							style={{
								margin: '10px 0 20px',
								fontSize: 15,
								fontWeight: 600,
								color: C.amberLt,
							}}>
							{COMPLIANCE_PRIMARY.title}
						</p>
						<p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.8, color: C.soft, maxWidth: 420 }}>
							{COMPLIANCE_PRIMARY.desc}
						</p>
						<div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
							{COMPLIANCE_PRIMARY.meta.map((m) => (
								<span
									key={m}
									style={{
										fontFamily: 'ui-monospace, monospace',
										fontSize: 11.5,
										padding: '6px 12px',
										borderRadius: 999,
										color: C.amberLt,
										border: '1px solid rgba(245,185,122,0.28)',
									}}>
									{m}
								</span>
							))}
						</div>
					</div>

					{COMPLIANCE_SECONDARY.map((c) => (
						<div key={c.code} className='cfx-compliance-cell cfx-compliance-secondary'>
							<div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
								<Num>{c.n}</Num>
								<p
									style={{
										margin: 0,
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(24px,2.8vw,32px)',
										fontWeight: 600,
										color: C.text,
									}}>
									{c.code}
								</p>
							</div>
							<p style={{ margin: '8px 0 12px', fontSize: 13.5, fontWeight: 600, color: C.amberLt }}>
								{c.title}
							</p>
							<p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.75, color: C.soft }}>{c.desc}</p>
						</div>
					))}

					<div className='cfx-compliance-chips'>
						{COMPLIANCE_CHIPS.map((chip) => (
							<span key={chip} className='cfx-chip'>
								{chip}
							</span>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
