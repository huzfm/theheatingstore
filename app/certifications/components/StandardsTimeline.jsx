'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { STANDARDS_TIMELINE } from '../data';

export default function StandardsTimeline() {
	const [active, setActive] = useState(0);
	const current = STANDARDS_TIMELINE[active];

	return (
		<section
			className='cfx-noise'
			style={{
				position: 'relative',
				background: '#0d0805',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '96px 20px',
			}}>
			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1320, margin: '0 auto' }}>
				<motion.h2
					initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(28px,3.6vw,44px)',
						fontWeight: 600,
						margin: '0 0 44px',
					}}>
					Built Around Standards
				</motion.h2>

				<div className='cfx-timeline-grid'>
					<div className='cfx-timeline-list' role='tablist' aria-label='Technical standards'>
						{STANDARDS_TIMELINE.map((item, i) => {
							const isActive = i === active;
							return (
								<button
									key={item.code}
									type='button'
									role='tab'
									id={`standard-tab-${i}`}
									aria-selected={isActive}
									aria-controls='standard-panel'
									className='cfx-timeline-btn'
									onClick={() => setActive(i)}
									onFocus={() => setActive(i)}>
									<span
										style={{
											fontFamily: 'ui-monospace, monospace',
											fontSize: 12,
											color: isActive ? C.amberLt : C.mute,
											transition: 'color .4s ease',
										}}>
										{item.n}
									</span>
									<span style={{ flex: 1 }}>
										<span
											style={{
												display: 'block',
												fontSize: 15.5,
												fontWeight: isActive ? 600 : 500,
												color: isActive ? C.text : C.soft,
												transition: 'color .4s ease',
											}}>
											{item.tag}
										</span>
										<span
											style={{
												display: 'block',
												marginTop: 3,
												fontFamily: 'ui-monospace, monospace',
												fontSize: 11.5,
												letterSpacing: '0.04em',
												color: isActive ? C.amberLt : C.mute,
												transition: 'color .4s ease',
											}}>
											{item.code}
										</span>
									</span>
									{isActive && (
										<motion.span
											layoutId='standard-indicator'
											aria-hidden
											style={{
												width: 6,
												height: 6,
												borderRadius: '50%',
												background: C.amber,
												boxShadow: `0 0 10px 2px rgba(232,147,58,0.6)`,
												flexShrink: 0,
											}}
											transition={{ duration: 0.4, ease: EASE }}
										/>
									)}
								</button>
							);
						})}
					</div>

					<div
						id='standard-panel'
						role='tabpanel'
						aria-labelledby={`standard-tab-${active}`}
						className='cfx-glass cfx-timeline-detail'
						style={{ borderRadius: 20 }}>
						<AnimatePresence mode='wait'>
							<motion.div
								key={current.code}
								initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
								animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
								exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
								transition={{ duration: 0.5, ease: EASE }}>
								<p
									style={{
										margin: 0,
										fontFamily: 'ui-monospace, monospace',
										fontSize: 12,
										letterSpacing: '0.08em',
										color: C.amberLt,
									}}>
									{current.n} / {String(STANDARDS_TIMELINE.length).padStart(2, '0')}
								</p>
								<h3
									style={{
										margin: '16px 0 6px',
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(22px,2.6vw,30px)',
										fontWeight: 600,
										color: C.text,
									}}>
									{current.tag}
								</h3>
								<p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 600, color: C.amberLt }}>
									{current.code}
								</p>
								<p style={{ margin: 0, fontSize: 15, lineHeight: 1.85, color: C.soft, maxWidth: 520 }}>
									{current.desc}
								</p>
								{current.ref && (
									<p
										style={{
											marginTop: 20,
											fontFamily: 'ui-monospace, monospace',
											fontSize: 12,
											color: C.mute,
										}}>
										{current.ref}
									</p>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}
