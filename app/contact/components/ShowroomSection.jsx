'use client';

import { useReducedMotion } from 'framer-motion';
import { SHOWROOM } from '../data';
import { Reveal, SectionKicker, MagneticAnchor } from './ui';
import { useIsDesktop } from '../hooks';

export default function ShowroomSection() {
	const isDesktop = useIsDesktop();
	const reduced = useReducedMotion();
	const pointerFxDisabled = !isDesktop || reduced;

	return (
		<section className='ct-section' aria-labelledby='showroom-heading'>
			<div className='ct-showroom-grid'>
				<Reveal amount={0.3}>
					<SectionKicker index='05' label='Showroom' />
					<h2 id='showroom-heading' className='brand-h ct-h--section'>
						Visit us <span className='brand-h-accent'>in Srinagar.</span>
					</h2>
					<p className='brand-sub' style={{ marginTop: 18, maxWidth: 400 }}>
						See finished cable and mat samples, thermostat controls, and layered flooring cross-sections in person before you commit to a system.
					</p>

					<dl className='ct-showroom-facts'>
						<div>
							<dt>Address</dt>
							<dd>{SHOWROOM.address}</dd>
						</div>
						<div>
							<dt>Hours</dt>
							<dd>{SHOWROOM.hours}</dd>
						</div>
					</dl>

					<MagneticAnchor href={SHOWROOM.mapsUrl} target='_blank' rel='noopener noreferrer' className='ct-btn-ghost' disabled={pointerFxDisabled}>
						Get Directions
					</MagneticAnchor>
				</Reveal>

				<Reveal amount={0.25} delay={0.1}>
					<a href={SHOWROOM.mapsUrl} target='_blank' rel='noopener noreferrer' className='ct-map-frame' aria-label='Open Electric Hamam Kashmir showroom location in Google Maps'>
						<iframe
							src={SHOWROOM.embedSrc}
							width='100%'
							height='100%'
							style={{ border: 0, display: 'block', pointerEvents: 'none' }}
							allowFullScreen
							loading='lazy'
							referrerPolicy='no-referrer-when-downgrade'
							title='Electric Hamam Kashmir, Srinagar Showroom'
						/>
						<span className='ct-map-frame-overlay'>
							<span className='ct-map-frame-city'>{SHOWROOM.city}</span>
							<span className='ct-map-frame-cta'>
								Open in Maps
								<svg width='13' height='13' viewBox='0 0 14 14' fill='none'>
									<path d='M3 7h8M8 4l3 3-3 3' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
								</svg>
							</span>
						</span>
					</a>
				</Reveal>
			</div>
		</section>
	);
}
