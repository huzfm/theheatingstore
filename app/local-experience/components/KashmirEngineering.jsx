'use client';

import { useMemo } from 'react';
import { Reveal, SectionKicker } from './ui';

// Deterministic pseudo-random flake field (no Math.random) so server and
// client markup match exactly, no hydration mismatch on a purely decorative
// CSS animation. Hidden outright under prefers-reduced-motion in the
// stylesheet.
function useSnowfield(count = 22) {
	return useMemo(
		() =>
			Array.from({ length: count }, (_, i) => ({
				left: (i * 43.7) % 100,
				delay: (i * 0.53) % 7,
				duration: 9 + (i % 6),
				size: 2 + (i % 3),
			})),
		[count]
	);
}

const SPECS = [
	{ value: '−20°C', label: 'Sub-zero operation, cold-climate certified' },
	{ value: '4–6 hrs', label: 'Heat retention after a power cut' },
	{ value: 'Thermal Mass', label: 'Layered concrete stores the warmth' },
	{ value: 'Load-Shedding', label: 'Engineered around Kashmir’s power schedule' },
];

export default function KashmirEngineering() {
	const flakes = useSnowfield();

	return (
		<section className='le-kashmir' aria-labelledby='kashmir-heading'>
			<div aria-hidden className='le-kashmir-scene'>
				<span className='le-kashmir-horizon' />
				<span className='le-kashmir-floorglow' />
			</div>
			<div aria-hidden className='le-kashmir-snow'>
				{flakes.map((f, i) => (
					<span
						key={i}
						className='le-kashmir-flake'
						style={{
							left: `${f.left}%`,
							width: f.size,
							height: f.size,
							animationDelay: `${f.delay}s`,
							animationDuration: `${f.duration}s`,
						}}
					/>
				))}
			</div>

			<div className='le-kashmir-inner'>
				<Reveal amount={0.3}>
					<SectionKicker index='03' label='Kashmir-First Engineering' />
				</Reveal>

				<Reveal amount={0.3} delay={0.08}>
					<h2 id='kashmir-heading' className='le-kashmir-statement'>
						−20°C isn&rsquo;t an edge case. It&rsquo;s the environment we design for.
					</h2>
				</Reveal>

				<Reveal amount={0.3} delay={0.16}>
					<p className='le-kashmir-support'>
						Every installation is cold-climate certified and rated to operate in sub-zero conditions. When Kashmir&rsquo;s grid goes down, a layered concrete thermal mass keeps radiating warmth for hours, built around the reality of load-shedding rather than a stable power supply.
					</p>
				</Reveal>

				<div className='le-kashmir-specs'>
					{SPECS.map((s, i) => (
						<Reveal key={s.label} amount={0.4} delay={0.1 + i * 0.06} y={16}>
							<div className='le-kashmir-spec'>
								<span className='le-kashmir-spec-value'>{s.value}</span>
								<span className='le-kashmir-spec-label'>{s.label}</span>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
