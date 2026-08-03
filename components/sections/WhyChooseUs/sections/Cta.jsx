'use client';

import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { C } from '../theme';
import { CTA_INCLUDED } from '../data';
import { Reveal } from '../ui/Reveal';
import HeroCTAs from '@/components/ui/HeroCTAs';
import '../styles/cta.css';

export default function Cta() {
	const panelRef = useRef(null);
	const frameRef = useRef(0);
	const prefersReducedMotion = useReducedMotion();

	// Very subtle cursor-following glow — desktop mouse only. Skipped entirely
	// under reduced motion and for touch/pen input, and throttled to one write
	// per frame so it never competes with Lenis/ScrollTrigger for the main thread.
	const handlePointerMove = useCallback(
		(e) => {
			if (prefersReducedMotion || e.pointerType !== 'mouse') return;
			const { clientX, clientY } = e;
			if (frameRef.current) return;
			frameRef.current = requestAnimationFrame(() => {
				frameRef.current = 0;
				const el = panelRef.current;
				if (!el) return;
				const rect = el.getBoundingClientRect();
				el.style.setProperty('--mx', `${((clientX - rect.left) / rect.width) * 100}%`);
				el.style.setProperty('--my', `${((clientY - rect.top) / rect.height) * 100}%`);
			});
		},
		[prefersReducedMotion]
	);

	useEffect(() => () => frameRef.current && cancelAnimationFrame(frameRef.current), []);

	return (
		<div className='whc-pad whc-pad-tight'>
			<Reveal amount={0.2}>
				<div ref={panelRef} className='whc-cta' onPointerMove={handlePointerMove}>
					<span className='whc-cta-field' aria-hidden='true' />
					<span className='whc-cta-glow' aria-hidden='true' />

					<div className='whc-cta-inner'>
						<div className='whc-cta-main'>
							<span className='whc-cta-rule' aria-hidden='true' />

							<Reveal amount={0.6} delay={0.02}>
								<p className='whc-eyebrow'>Start Your Project</p>
							</Reveal>

							<Reveal amount={0.5} delay={0.12} y={22}>
								<h2 className='whc-cta-title'>
									Every floor is different.{' '}
									<span className='whc-h-accent'>Your heating system should be too.</span>
								</h2>
							</Reveal>

							<Reveal amount={0.4} delay={0.3}>
								<p className='whc-cta-desc'>
									From custom-mapped cable layouts to a 25-year warranty, every system is engineered
									around your space, not fitted to it after the fact.
								</p>
							</Reveal>

							<Reveal amount={0.3} delay={0.4}>
								<ul className='whc-cta-list'>
									{CTA_INCLUDED.map((s) => (
										<li key={s.text} className='whc-cta-list-item'>
											<s.IconComp size={13} color={C.amberLt} />
											<span>{s.text}</span>
										</li>
									))}
								</ul>
							</Reveal>
						</div>

						<span className='whc-cta-divider' aria-hidden='true' />

						<div className='whc-cta-actions'>
							<Reveal amount={0.5} delay={0.45} y={16}>
								<HeroCTAs />
							</Reveal>

							<Reveal amount={0.5} delay={0.65} y={10}>
								<p className='whc-cta-trust'>Up to 25-year warranty · 0.01% fault rate · 2M+ systems since 2011</p>
							</Reveal>
						</div>
					</div>
				</div>
			</Reveal>
		</div>
	);
}
