'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';

export default function JourneyStage({ stage, index, isActive, onActivate, SceneComponent }) {
	const ref = useRef(null);
	const inView = useInView(ref, { margin: '-42% 0px -42% 0px' });

	useEffect(() => {
		if (inView) onActivate(index);
	}, [inView, index, onActivate]);

	return (
		<div ref={ref} className='hiw-stage' style={{ opacity: isActive ? 1 : 0.55, transition: 'opacity 0.4s ease' }}>
			{/* Mobile-only visual, desktop shows the sticky rail scene instead */}
			<div className='hiw-glass hiw-stage-visual-mobile'>
				<div style={{ height: 220 }}>
					<SceneComponent active={isActive} />
				</div>
			</div>

			<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
				<span
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 15,
						fontWeight: 600,
						color: C.amberLt,
					}}>
					{stage.num}
				</span>
				<p className='brand-kicker' style={{ margin: 0 }}>
					{stage.tag}
				</p>
			</div>

			<motion.h3
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.4 }}
				transition={{ duration: 0.6, ease: EASE }}
				className='brand-h'
				style={{ fontSize: 'clamp(24px,2.8vw,34px)' }}>
				{stage.title}
				<span className='brand-h-accent' style={{ display: 'block' }}>
					{stage.titleAccent}
				</span>
			</motion.h3>

			<div
				style={{
					height: 2,
					width: 56,
					borderRadius: 999,
					background: `linear-gradient(90deg,${C.amber},transparent)`,
					margin: '22px 0 22px',
				}}
			/>

			<p style={{ fontSize: 'clamp(13.5px,1.6vw,15.5px)', lineHeight: 1.8, color: C.soft, marginBottom: 26 }}>
				{stage.desc}
			</p>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26 }}>
				{stage.points.map((pt) => (
					<div
						key={pt.label}
						className='hiw-glass'
						style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '13px 18px', borderRadius: 14 }}>
						<span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{pt.label}</span>
						<span style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.5 }}>{pt.detail}</span>
					</div>
				))}
			</div>

			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '16px 20px',
					borderRadius: 14,
					background: 'rgba(232,147,58,0.06)',
					border: '1px solid rgba(232,147,58,0.16)',
				}}>
				<p
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 24,
						fontWeight: 600,
						color: C.amberLt,
						margin: 0,
						flexShrink: 0,
					}}>
					{stage.stat.value}
				</p>
				<div style={{ width: 1, height: 30, background: 'rgba(245,185,122,0.25)', flexShrink: 0 }} />
				<p style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.5, margin: 0 }}>{stage.stat.label}</p>
			</div>
		</div>
	);
}
