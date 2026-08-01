'use client';

import { useReducedMotion } from 'framer-motion';
import { PHONE_DISPLAY, PHONE_TEL } from '../data';
import { Reveal, MagneticCTA, MagneticAnchor } from './ui';
import { useIsDesktop } from '../hooks';

export default function FinalCta() {
	const isDesktop = useIsDesktop();
	const reduced = useReducedMotion();
	const pointerFxDisabled = !isDesktop || reduced;

	return (
		<section className='ct-section ct-final' aria-labelledby='final-cta-heading'>
			<Reveal amount={0.3}>
				<div className='ct-final-panel'>
					<span className='ct-final-glow' aria-hidden='true' />

					<Reveal amount={0.5} delay={0.05}>
						<h2 id='final-cta-heading' className='ct-final-title'>
							Your floor should feel as considered as the room above it.
						</h2>
					</Reveal>

					<Reveal amount={0.5} delay={0.14}>
						<div className='ct-final-actions'>
							<MagneticCTA href='#consultation' className='ct-btn-primary' disabled={pointerFxDisabled}>
								Start a Conversation
							</MagneticCTA>
							<MagneticAnchor href={`tel:${PHONE_TEL}`} className='ct-btn-ghost' disabled={pointerFxDisabled}>
								Call Our Team
							</MagneticAnchor>
						</div>
					</Reveal>

					<Reveal amount={0.5} delay={0.22}>
						<p className='ct-final-trust'>{PHONE_DISPLAY} &middot; Monday&#8211;Saturday, 9am&#8211;7pm IST</p>
					</Reveal>
				</div>
			</Reveal>
		</section>
	);
}
