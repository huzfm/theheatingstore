'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../../theme';
import { Icon } from '../../icons';

// Directional clip-path wipe — moving forward, the frame reveals from the
// right and the outgoing image tucks away to the left; reversed for "back".
const wipeVariants = {
	enter: (dir) => ({ clipPath: dir >= 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }),
	center: { clipPath: 'inset(0 0 0 0)', transition: { duration: 1, ease: EASE } },
	exit: (dir) => ({ clipPath: dir >= 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', transition: { duration: 0.7, ease: EASE } }),
};

const fadeVariants = {
	enter: { opacity: 0 },
	center: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
	exit: { opacity: 0, transition: { duration: 0.35, ease: EASE } },
};

export function ProcessVisual({ step, direction, onPrev, onNext, canPrev, canNext, priority }) {
	const reduced = useReducedMotion();
	const variants = reduced ? fadeVariants : wipeVariants;

	const handleDragEnd = (_e, info) => {
		const { offset, velocity } = info;
		if ((offset.x < -60 || velocity.x < -500) && canNext) onNext();
		else if ((offset.x > 60 || velocity.x > 500) && canPrev) onPrev();
	};

	return (
		<div className='whc-proc-stage'>
			<motion.div
				className='whc-proc-frame'
				drag={reduced ? false : 'x'}
				dragElastic={0.08}
				dragConstraints={{ left: 0, right: 0 }}
				onDragEnd={handleDragEnd}
				style={{ touchAction: 'pan-y' }}>
				<AnimatePresence custom={direction} initial={false}>
					<motion.div key={step.num} custom={direction} variants={variants} initial='enter' animate='center' exit='exit' className='whc-proc-imgwrap'>
						<Image src={step.img} alt={step.title} fill priority={priority} sizes='(max-width: 1024px) 100vw, 640px' className='whc-proc-img' draggable={false} />
					</motion.div>
				</AnimatePresence>

				<div className='whc-proc-shade' aria-hidden />

				<div className='whc-proc-icon' aria-hidden>
					<step.IconComp size={18} color='#F5B97A' />
				</div>

				<div className='whc-proc-ghost' aria-hidden>
					<AnimatePresence mode='wait' initial={false}>
						<motion.span
							key={step.num}
							initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
							transition={{ duration: 0.5, ease: EASE }}>
							{step.num}
						</motion.span>
					</AnimatePresence>
				</div>

				<div className='whc-proc-controls'>
					<button type='button' className='whc-proc-ctrl' aria-label='Previous step' onClick={onPrev} disabled={!canPrev}>
						<Icon.ChevronLeft size={17} color='#FBF3EA' />
					</button>
					<button type='button' className='whc-proc-ctrl' aria-label='Next step' onClick={onNext} disabled={!canNext}>
						<Icon.ChevronRight size={17} color='#FBF3EA' />
					</button>
				</div>
			</motion.div>
		</div>
	);
}
