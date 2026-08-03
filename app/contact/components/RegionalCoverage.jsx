'use client';

import { REGIONS } from '../data';
import { Reveal, SectionKicker } from './ui';

export default function RegionalCoverage() {
	return (
		<section className='ct-section' aria-labelledby='coverage-heading'>
			<Reveal amount={0.3}>
				<SectionKicker index='04' label='Regional Coverage' />
				<h2 id='coverage-heading' className='brand-h ct-h--section'>
					Where we <span className='brand-h-accent'>work.</span>
				</h2>
			</Reveal>

			<div className='ct-regions-list'>
				{REGIONS.map((r, i) => (
					<Reveal key={r.name} amount={0.2} delay={i * 0.08}>
						<div className='ct-region-row'>
							<span className='ct-region-code'>{r.code}</span>
							<div className='ct-region-body'>
								<h3 className='ct-region-name'>{r.name}</h3>
								<p className='ct-region-summary'>{r.summary}</p>
								<div className='ct-region-areas'>
									{r.areas.map((a) => (
										<span key={a} className='ct-region-area'>
											{a}
										</span>
									))}
								</div>
							</div>
							<div className='ct-region-response'>
								<span className='ct-region-response-label'>Typical Response</span>
								<span className='ct-region-response-value'>{r.response}</span>
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
