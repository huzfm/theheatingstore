'use client';

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../../theme';
import { Icon } from '../../icons';

export function ProcessNav({ steps, active, onGoTo, onPrev, onNext, canPrev, canNext }) {
	const reduced = useReducedMotion();
	const current = steps[active];
	const total = steps.length;

	return (
		<div className='whc-proc-nav'>
			{/* Desktop — accordion journey list with an animated progress rail */}
			<div className='whc-proc-desktop'>
			<LayoutGroup id='whc-process-rail'>
				<ol className='whc-proc-list'>
					{steps.map((step, i) => {
						const isActive = i === active;
						return (
							<li key={step.num}>
								<button type='button' className={`whc-proc-row${isActive ? ' is-active' : ''}`} onClick={() => onGoTo(i)} aria-current={isActive ? 'step' : undefined}>
									<span className='whc-proc-rail'>
										<span className='whc-proc-rail-line' />
										{isActive && (
											<motion.span
												layoutId='whc-proc-marker'
												className='whc-proc-rail-dot'
												transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 40 }}
											/>
										)}
									</span>
									<span className='whc-proc-row-body'>
										<span className='whc-proc-row-head'>
											<span className='whc-proc-row-num'>{step.num}</span>
											<span className='whc-proc-row-title'>{step.title}</span>
										</span>
										<AnimatePresence initial={false}>
											{isActive && (
												<motion.span
													className='whc-proc-row-desc'
													initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
													animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
													exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
													transition={{ duration: 0.45, ease: EASE }}>
													<span className='whc-proc-row-desc-in'>{step.desc}</span>
												</motion.span>
											)}
										</AnimatePresence>
									</span>
								</button>
							</li>
						);
					})}
				</ol>
			</LayoutGroup>

			<div className='whc-proc-foot'>
				<span className='whc-proc-count'>
					<b>{current.num}</b> / {String(total).padStart(2, '0')}
				</span>
				<div className='whc-proc-arrows'>
					<button type='button' className='whc-proc-ctrl' aria-label='Previous step' onClick={onPrev} disabled={!canPrev}>
						<Icon.ChevronLeft size={16} color='#FBF3EA' />
					</button>
					<button type='button' className='whc-proc-ctrl' aria-label='Next step' onClick={onNext} disabled={!canNext}>
						<Icon.ChevronRight size={16} color='#FBF3EA' />
					</button>
				</div>
			</div>
			</div>

			{/* Mobile — compact numbered tracker + active step summary */}
			<div className='whc-proc-mobile'>
				<div className='whc-proc-chips' role='tablist' aria-label='Process steps'>
					{steps.map((step, i) => (
						<button key={step.num} type='button' role='tab' aria-selected={i === active} className={`whc-proc-chip${i === active ? ' is-active' : ''}`} onClick={() => onGoTo(i)}>
							{step.num}
						</button>
					))}
				</div>
				<div className='whc-bar' style={{ marginTop: 14 }}>
					<motion.span animate={{ width: `${((active + 1) / total) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
				</div>

				<AnimatePresence mode='wait' initial={false}>
					<motion.div
						key={current.num}
						className='whc-proc-mobile-info'
						initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
						transition={{ duration: 0.4, ease: EASE }}>
						<h3 className='whc-proc-mobile-title'>{current.title}</h3>
						<p className='whc-proc-mobile-desc'>{current.desc}</p>
					</motion.div>
				</AnimatePresence>

				<div className='whc-proc-foot' style={{ marginTop: 4 }}>
					<span className='whc-proc-count'>
						<b>{current.num}</b> / {String(total).padStart(2, '0')}
					</span>
					<div className='whc-proc-arrows'>
						<button type='button' className='whc-proc-ctrl' aria-label='Previous step' onClick={onPrev} disabled={!canPrev}>
							<Icon.ChevronLeft size={16} color='#FBF3EA' />
						</button>
						<button type='button' className='whc-proc-ctrl' aria-label='Next step' onClick={onNext} disabled={!canNext}>
							<Icon.ChevronRight size={16} color='#FBF3EA' />
						</button>
					</div>
				</div>
			</div>

			<span className='whc-sr-only' aria-live='polite'>
				Step {active + 1} of {total}: {current.title}
			</span>
		</div>
	);
}
