'use client';

import { C } from '../theme';
import { Icon } from '../icons';
import { MARQUEE } from '../data';
import '../styles/marquee.css';

export default function Marquee() {
	return (
		<section className='whc-marquee' aria-label='Certifications and compliance'>
			<div className='whc-marquee-inner'>
				<div className='whc-marquee-label'>
					<Icon.BadgeCheck size={12} color={C.amberLt} />
					<span>Certified &amp; Compliant</span>
				</div>

				<span className='whc-marquee-rule' aria-hidden='true' />

				{/* accessible, single-read list — the animated/static copies below are decorative */}
				<p className='whc-sr-only'>Certifications: {MARQUEE.join(', ')}.</p>

				<div className='whc-marquee-viewport' aria-hidden='true'>
					<div className='whc-marquee-track'>
						{[...MARQUEE, ...MARQUEE].map((item, i) => (
							<span className='whc-marquee-group' key={i}>
								<span className='whc-marquee-item'>{item}</span>
								<span className='whc-marquee-sep' />
							</span>
						))}
					</div>
				</div>

				<div className='whc-marquee-static' aria-hidden='true'>
					{MARQUEE.map((item) => (
						<span className='whc-marquee-item' key={item}>
							{item}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
