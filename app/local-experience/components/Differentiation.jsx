'use client';

import { Reveal, SectionKicker } from './ui';

// Every figure and claim below already appears in `faqs` (see ../data.js) —
// this section just resurfaces it as an architectural specification rather
// than another card grid.
const POINTS = [
	{
		title: 'Silent Radiant Warmth',
		desc: 'No radiators, no vents, no moving parts. Heat radiates evenly from beneath the floor, so there is no operating sound and no cold spots at the edges of a room.',
	},
	{
		title: 'Cold-Climate Engineering',
		desc: 'Every system is rated to operate in sub-zero conditions down to −20°C and certified specifically for Kashmir winters, not adapted after the fact from a milder climate.',
	},
	{
		title: 'Thermal Mass Retention',
		desc: 'A layered concrete thermal mass stores heat for 4–6 hours after a power cut, engineered around Kashmir’s load-shedding schedule rather than a stable grid.',
	},
	{
		title: 'Smart Temperature Control',
		desc: 'Scheduled smart thermostats cut consumption by 30–40%, learning your routine and Kashmir’s power schedule automatically so the floor is warm before you need it.',
	},
];

export default function Differentiation() {
	return (
		<section className='le-section' aria-labelledby='differentiation-heading'>
			<Reveal amount={0.3}>
				<SectionKicker index='01' label='What Makes It Different' />
			</Reveal>

			<div className='le-diff-grid'>
				<Reveal amount={0.3} delay={0.05}>
					<h2 id='differentiation-heading' className='le-diff-statement'>
						Heat that rises from beneath you.
					</h2>
				</Reveal>
				<Reveal amount={0.3} delay={0.15}>
					<div className='le-diff-support'>
						<p className='le-sub'>
							Electric hamam replaces the guesswork of radiators and portable heaters with one continuous radiant plane underfoot, built specifically for Kashmir&rsquo;s winters and engineered to keep working when the power doesn&rsquo;t.
						</p>
					</div>
				</Reveal>
			</div>

			<div className='le-diff-list'>
				{POINTS.map((p, i) => (
					<Reveal key={p.title} amount={0.3} delay={i * 0.06} y={20}>
						<div className='le-diff-row'>
							<span className='le-diff-num'>{String(i + 1).padStart(2, '0')}</span>
							<div>
								<h3 className='le-diff-title'>{p.title}</h3>
								<p className='le-diff-desc'>{p.desc}</p>
							</div>
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}
