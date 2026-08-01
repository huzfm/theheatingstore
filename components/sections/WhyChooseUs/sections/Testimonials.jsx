'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { C, EASE } from '../theme';
import { Icon } from '../icons';
import { TESTIMONIALS } from '../data';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import '../styles/testimonials.css';

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS — one featured customer story at a time, not a card grid.
// Desktop pairs a large editorial quote panel with a quiet index rail (mirrors
// Stats' primary/secondary asymmetry). Mobile swaps to a single swipeable
// panel with the same nav language. `active`/`direction` are lifted to the
// top so both compositions share one source of truth.
// ─────────────────────────────────────────────────────────────────────────────

const slideVariants = {
	enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 26 : -26, filter: 'blur(3px)' }),
	center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
	exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -26 : 26, filter: 'blur(3px)', transition: { duration: 0.35, ease: EASE } }),
};

const slideVariantsReduced = {
	enter: { opacity: 0 },
	center: { opacity: 1, transition: { duration: 0.25 } },
	exit: { opacity: 0, transition: { duration: 0.15 } },
};

function QuoteBody({ t }) {
	return (
		<>
			<div className='whc-testi-stars' aria-hidden='true'>
				{[1, 2, 3, 4, 5].map((n) => (
					<Icon.Star key={n} size={11} />
				))}
			</div>
			<blockquote className='whc-testi-quote'>{t.text}</blockquote>
			<div className='whc-testi-identity'>
				<span className='whc-testi-monogram' aria-hidden='true'>
					{t.initials}
				</span>
				<div className='whc-testi-identity-body'>
					<p className='whc-testi-name'>{t.name}</p>
					<p className='whc-testi-role'>{t.role}</p>
				</div>
				<span className='whc-testi-tag'>{t.tag}</span>
			</div>
		</>
	);
}

export default function Testimonials() {
	const [active, setActive] = useState(0);
	const [direction, setDirection] = useState(1);
	const prefersReducedMotion = useReducedMotion();
	const total = TESTIMONIALS.length;
	const t = TESTIMONIALS[active];
	const variants = prefersReducedMotion ? slideVariantsReduced : slideVariants;

	const goTo = (i, dir) => {
		const next = ((i % total) + total) % total;
		if (next === active) return;
		setDirection(dir);
		setActive(next);
	};
	const handleNext = () => goTo(active + 1, 1);
	const handlePrev = () => goTo(active - 1, -1);
	const handleRailSelect = (i) => goTo(i, i > active ? 1 : -1);

	const handleDragEnd = (_e, info) => {
		const { offset, velocity } = info;
		if (offset.x < -50 || velocity.x < -400) handleNext();
		else if (offset.x > 50 || velocity.x > 400) handlePrev();
	};

	return (
		<div className='whc-pad whc-pad-tight'>
			<Reveal amount={0.2}>
				<SectionHeading
					badge='Customer Stories'
					title='Specified by professionals,'
					accent='chosen again, project after project.'
					sub='From a 5,000 sq ft penthouse to a 60-unit residential development — architects and builders on why they keep coming back.'
				/>
			</Reveal>

			{/* ═══ DESKTOP / TABLET — featured quote + index rail ═══ */}
			<Reveal amount={0.15} delay={0.12}>
				<div className='whc-testi-stage'>
					<div className='whc-testi-panel whc-card' aria-live='polite'>
						<span className='whc-testi-mark' aria-hidden='true'>
							<Icon.Quote size={168} color={C.amber} opacity={0.06} />
						</span>
						<AnimatePresence mode='wait' custom={direction} initial={false}>
							<motion.div
								key={active}
								className='whc-testi-panel-inner'
								custom={direction}
								variants={variants}
								initial='enter'
								animate='center'
								exit='exit'>
								<QuoteBody t={t} />
							</motion.div>
						</AnimatePresence>
					</div>

					<div className='whc-testi-rail'>
						<div className='whc-testi-rail-count' aria-hidden='true'>
							<span className='whc-testi-rail-current'>{String(active + 1).padStart(2, '0')}</span>
							<span className='whc-testi-rail-sep'>/</span>
							<span className='whc-testi-rail-total'>{String(total).padStart(2, '0')}</span>
						</div>

						<div className='whc-testi-rail-list' aria-label='Customer stories'>
							{TESTIMONIALS.map((item, i) => (
								<button
									key={item.name}
									type='button'
									className={`whc-testi-rail-item${i === active ? ' is-active' : ''}`}
									aria-current={i === active ? 'true' : undefined}
									aria-label={`View testimonial from ${item.name}, ${item.tag}`}
									onClick={() => handleRailSelect(i)}>
									<span className='whc-testi-rail-index'>{String(i + 1).padStart(2, '0')}</span>
									<span className='whc-testi-rail-body'>
										<span className='whc-testi-rail-name'>{item.name}</span>
										<span className='whc-testi-rail-tag'>{item.tag}</span>
									</span>
								</button>
							))}
						</div>

						<div className='whc-testi-rail-nav'>
							<button
								type='button'
								className='whc-testi-nav-btn whc-testi-nav-btn--prev'
								onClick={handlePrev}
								aria-label='Previous customer story'>
								<Icon.ChevronLeft size={16} />
							</button>
							<span className='whc-bar' style={{ flex: 1 }}>
								<motion.span
									animate={{ width: `${((active + 1) / total) * 100}%` }}
									transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
								/>
							</span>
							<button
								type='button'
								className='whc-testi-nav-btn whc-testi-nav-btn--next'
								onClick={handleNext}
								aria-label='Next customer story'>
								<Icon.ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>
			</Reveal>

			{/* ═══ MOBILE — single swipeable story ═══ */}
			<div className='whc-testi-mobile'>
				<div className='whc-testi-mobile-stage' aria-live='polite'>
					<AnimatePresence mode='wait' custom={direction} initial={false}>
						<motion.div
							key={active}
							className='whc-testi-mobile-panel whc-card'
							custom={direction}
							variants={variants}
							initial='enter'
							animate='center'
							exit='exit'
							drag='x'
							dragElastic={0.12}
							dragConstraints={{ left: 0, right: 0 }}
							onDragEnd={handleDragEnd}>
							<span className='whc-testi-mark' aria-hidden='true'>
								<Icon.Quote size={110} color={C.amber} opacity={0.07} />
							</span>
							<QuoteBody t={t} />
						</motion.div>
					</AnimatePresence>
				</div>

				<div className='whc-testi-mobile-nav'>
					<button
						type='button'
						className='whc-testi-nav-btn whc-testi-nav-btn--prev'
						onClick={handlePrev}
						aria-label='Previous customer story'>
						<Icon.ChevronLeft size={16} />
					</button>
					<span className='whc-testi-mobile-count'>
						<span className='whc-bar'>
							<motion.span
								animate={{ width: `${((active + 1) / total) * 100}%` }}
								transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
							/>
						</span>
						<span className='whc-testi-mobile-count-text'>
							{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
						</span>
					</span>
					<button
						type='button'
						className='whc-testi-nav-btn whc-testi-nav-btn--next'
						onClick={handleNext}
						aria-label='Next customer story'>
						<Icon.ChevronRight size={16} />
					</button>
				</div>
			</div>

			<p className='whc-testi-note'>
				Every installation is backed by our 25+ year product warranty and CE/ISO-certified systems.{' '}
				<a href='/contact'>Talk to our experts today</a>.
			</p>
		</div>
	);
}
