'use client';

import { CONTACT_METHODS } from '../data';
import { Reveal, SectionKicker, MagneticAnchor } from './ui';
import { useIsDesktop } from '../hooks';
import { useReducedMotion } from 'framer-motion';

export default function ContactMethods() {
	const isDesktop = useIsDesktop();
	const reduced = useReducedMotion();
	const pointerFxDisabled = !isDesktop || reduced;
	const { primary, supporting } = CONTACT_METHODS;

	return (
		<section className='ct-section' aria-labelledby='methods-heading'>
			<Reveal amount={0.3}>
				<SectionKicker index='02' label='Reach Us' />
				<h2 id='methods-heading' className='brand-h ct-h--section'>
					Choose the way <span className='brand-h-accent'>you work best.</span>
				</h2>
			</Reveal>

			<div className='ct-methods-grid'>
				{/* Primary channel */}
				<Reveal amount={0.25} delay={0.05}>
					<div className='ct-method-primary'>
						<span className='ct-method-primary-num'>01</span>
						<p className='ct-method-tag'>{primary.tag}</p>
						<h3 className='ct-method-primary-title'>{primary.title}</h3>
						<p className='ct-method-primary-desc'>{primary.desc}</p>
						<p className='ct-method-meta'>{primary.meta}</p>
						<MagneticAnchor href={primary.href} className='ct-btn-primary' disabled={pointerFxDisabled}>
							{primary.cta}
						</MagneticAnchor>
					</div>
				</Reveal>

				{/* Supporting channels — editorial list, not equal-weight cards */}
				<Reveal amount={0.25} delay={0.12}>
					<div className='ct-method-list'>
						{supporting.map((m, i) => (
							<a
								key={m.tag}
								href={m.href}
								target={m.external ? '_blank' : undefined}
								rel={m.external ? 'noopener noreferrer' : undefined}
								className='ct-method-row'>
								<span className='ct-method-row-num'>{String(i + 2).padStart(2, '0')}</span>
								<span className='ct-method-row-body'>
									<span className='ct-method-row-tag'>{m.tag}</span>
									<span className='ct-method-row-title'>{m.title}</span>
									<span className='ct-method-row-desc'>{m.desc}</span>
									<span className='ct-method-row-cta'>
										{m.cta}
										<svg width='13' height='13' viewBox='0 0 14 14' fill='none'>
											<path d='M3 7h8M8 4l3 3-3 3' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
										</svg>
									</span>
								</span>
							</a>
						))}
					</div>
				</Reveal>
			</div>
		</section>
	);
}
