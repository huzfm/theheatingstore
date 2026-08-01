'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';

export default function JourneyRail({ stages, activeIndex, progress, SceneComponent, sceneKey }) {
	const current = stages[activeIndex];

	return (
		<div className='hiw-rail'>
			<p className='brand-kicker' style={{ margin: '0 0 22px' }}>
				The Process
			</p>

			<div className='hiw-rail-stepper'>
				<div className='hiw-rail-track' aria-hidden />
				<motion.div className='hiw-rail-fill' aria-hidden style={{ scaleY: progress }} />
				<ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }}>
					{stages.map((s, i) => {
						const isActive = i === activeIndex;
						const isDone = i < activeIndex;
						return (
							<li
								key={s.num}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 14,
									marginBottom: i === stages.length - 1 ? 0 : 30,
								}}>
								<span
									style={{
										position: 'relative',
										zIndex: 1,
										width: 28,
										height: 28,
										flexShrink: 0,
										borderRadius: '50%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: 'var(--font-heading)',
										fontSize: 12,
										fontWeight: 600,
										color: isActive || isDone ? 'white' : C.amberLt,
										background:
											isActive || isDone
												? `linear-gradient(135deg,${C.amber},${C.coral})`
												: 'rgba(232,147,58,0.1)',
										border: isActive || isDone ? '1px solid transparent' : '1px solid rgba(232,147,58,0.28)',
									}}>
									{isDone ? '✓' : s.num}
								</span>
								<span
									style={{
										fontSize: 12.5,
										fontWeight: isActive ? 600 : 500,
										color: isActive ? C.text : C.soft,
										letterSpacing: '0.02em',
									}}>
									{s.tag}
								</span>
							</li>
						);
					})}
				</ol>
			</div>

			<div className='hiw-glass hiw-rail-scene'>
				<div
					aria-hidden
					style={{
						position: 'absolute',
						top: 12,
						left: 18,
						fontFamily: 'var(--font-heading)',
						fontSize: 64,
						fontWeight: 600,
						color: 'rgba(245,185,122,0.08)',
						letterSpacing: '-0.03em',
						lineHeight: 1,
					}}>
					{current.num}
				</div>
				<div style={{ position: 'relative', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<AnimatePresence mode='wait'>
						<motion.div
							key={sceneKey}
							style={{ width: '100%', height: '100%' }}
							initial={{ opacity: 0, scale: 1.03, filter: 'blur(3px)' }}
							animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, scale: 0.98, filter: 'blur(3px)' }}
							transition={{ duration: 0.5, ease: EASE }}>
							<SceneComponent active />
						</motion.div>
					</AnimatePresence>
				</div>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '14px 20px 18px',
						borderTop: `1px solid ${C.glassBorder}`,
					}}>
					<span style={{ fontSize: 12, color: C.soft, letterSpacing: '0.06em' }}>{current.tag}</span>
					<span style={{ fontSize: 11, color: C.soft, letterSpacing: '0.1em' }}>
						{String(activeIndex + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}
					</span>
				</div>
			</div>
		</div>
	);
}
