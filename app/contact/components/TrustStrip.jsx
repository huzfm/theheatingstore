'use client';

import { TRUST_STRIP } from '../data';
import { Reveal } from './ui';

export default function TrustStrip() {
	return (
		<section className='ct-trust-strip' aria-label='Service commitments'>
			<Reveal amount={0.4}>
				<div className='ct-trust-strip-inner'>
					{TRUST_STRIP.map((t) => (
						<div key={t.label} className='ct-trust-item'>
							<span className='ct-trust-label'>{t.label}</span>
							<span className='ct-trust-value'>{t.value}</span>
						</div>
					))}
				</div>
			</Reveal>
		</section>
	);
}
