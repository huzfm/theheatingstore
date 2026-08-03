'use client';

import { useReducedMotion } from 'framer-motion';
import { Reveal, MagneticCTA } from './ui';
import { useIsDesktop } from '../hooks';

export default function FinalCta() {
	const isDesktop = useIsDesktop();
	const reduced = useReducedMotion();
	const pointerFxDisabled = !isDesktop || reduced;

	return (
		<section className='le-section le-final' aria-labelledby='final-cta-heading'>
			<Reveal amount={0.3}>
				<div className='le-final-panel'>
					<span className='le-final-glow' aria-hidden='true' />

					<Reveal amount={0.5} delay={0.05}>
						<h2 id='final-cta-heading' className='le-final-title'>
							Warmth, engineered for the way you live.
						</h2>
					</Reveal>

					<Reveal amount={0.5} delay={0.14}>
						<p className='le-final-desc'>Every Kashmir home is different. From a bespoke space survey to a system rated for −20°C and backed by a 25+ year warranty, we engineer around the floor you have, not a generic template.</p>
					</Reveal>

					<Reveal amount={0.5} delay={0.24}>
						<div className='le-final-actions'>
							<MagneticCTA href='/SpaceVerification' className='le-btn-primary' disabled={pointerFxDisabled}>
								Verify My Space
							</MagneticCTA>
							<MagneticCTA href='/contact' className='le-btn-ghost' disabled={pointerFxDisabled}>
								Talk to an Expert
							</MagneticCTA>
						</div>
					</Reveal>

					<Reveal amount={0.5} delay={0.32}>
						<p className='le-final-trust'>25+ year warranty · 2M+ systems worldwide · Kashmir engineering since 2011</p>
					</Reveal>
				</div>
			</Reveal>
		</section>
	);
}
