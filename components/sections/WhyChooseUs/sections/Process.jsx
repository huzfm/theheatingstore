'use client';

import { useCallback, useRef, useState } from 'react';
import { PROCESS } from '../data';
import { Badge } from '../ui/Badge';
import { Reveal } from '../ui/Reveal';
import { ProcessNav } from './process/ProcessNav';
import { ProcessVisual } from './process/ProcessVisual';
import '../styles/process.css';

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS — an editorial, data-driven journey from first call to lifetime cover
// ─────────────────────────────────────────────────────────────────────────────

export default function Process() {
	const ref = useRef(null);
	// [index, direction] — direction drives which way the image wipes.
	const [[active, direction], setStep] = useState([0, 0]);

	const goTo = useCallback(
		(i) => {
			const next = Math.max(0, Math.min(PROCESS.length - 1, i));
			if (next === active) return;
			setStep([next, next > active ? 1 : -1]);
		},
		[active]
	);
	const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
	const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

	// Arrow-key support bubbles up from any focused control inside the section.
	const handleKeyDown = (e) => {
		if (e.key === 'ArrowRight') goNext();
		else if (e.key === 'ArrowLeft') goPrev();
	};

	const canPrev = active > 0;
	const canNext = active < PROCESS.length - 1;

	return (
		<div ref={ref} id='process' className='whc-process' onKeyDown={handleKeyDown}>
			<div className='whc-pad whc-pad-tight'>
				<Reveal amount={0.15}>
					<div className='whc-proc-intro'>
						<Badge>Our Process</Badge>
						<h2 className='whc-h'>
							From First Call to <span className='whc-h-accent'>Lifetime Cover.</span>
						</h2>
						<p className='whc-sub'>Five steps, one dedicated team — from your first conversation to a heating system backed for life.</p>
					</div>
				</Reveal>

				<Reveal amount={0.1} delay={0.08}>
					<div className='whc-proc-shell'>
						<ProcessVisual step={PROCESS[active]} direction={direction} onPrev={goPrev} onNext={goNext} canPrev={canPrev} canNext={canNext} priority={active === 0} />
						<ProcessNav steps={PROCESS} active={active} onGoTo={goTo} onPrev={goPrev} onNext={goNext} canPrev={canPrev} canNext={canNext} />
					</div>
				</Reveal>
			</div>
		</div>
	);
}
