'use client';

import { proofStats } from '../data';
import { Reveal } from './ui';

export default function ProofRail() {
	return (
		<div className='le-proof-rail'>
			{proofStats.map((s, i) => (
				<Reveal key={s.label} className='le-proof-item' amount={0.4} delay={i * 0.06} y={16}>
					<p className='le-proof-value'>{s.value}</p>
					<p className='le-proof-label'>{s.label}</p>
				</Reveal>
			))}
		</div>
	);
}
