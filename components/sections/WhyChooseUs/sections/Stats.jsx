'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../theme';
import { STATS } from '../data';
import { Reveal } from '../ui/Reveal';
import { Counter } from '../ui/Counter';
import { SectionHeading } from '../ui/SectionHeading';
import '../styles/stats.css';

// ─────────────────────────────────────────────────────────────────────────────
// STATS — editorial proof index. STATS[0] anchors the row as the primary
// figure; every remaining entry falls into the secondary line. Purely
// index-driven so the layout adapts to however many stats data.js defines.
// ─────────────────────────────────────────────────────────────────────────────

export default function Stats() {
	const prefersReducedMotion = useReducedMotion();
	const [primary, ...secondary] = STATS;

	return (
		<div className='whc-pad whc-pad-tight'>
			<Reveal amount={0.3}>
				<SectionHeading
					badge='Since 2011'
					title='Fifteen years in the field,'
					accent='measured in results.'
					sub='From a single installation in Srinagar to systems now running across nine countries — these are the numbers behind every warranty we issue.'
				/>
			</Reveal>

			<motion.div
				className='whc-stats-rule'
				initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
				whileInView={{ scaleX: 1, opacity: 1 }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
				aria-hidden='true'
			/>

			<div className='whc-stats-row'>
				{primary && (
					<Reveal
						amount={0.4}
						delay={0.1}
						className='whc-stat-primary'
						role='group'
						aria-label={`${primary.display} — ${primary.label}`}>
						<div className='whc-stat-kicker'>
							<primary.IconComp size={14} color={primary.color} />
							<span style={{ color: primary.color }}>{primary.tag}</span>
						</div>
						<p className='whc-stat-primary-num'>
							<Counter display={primary.display} />
						</p>
						<span className='whc-stat-accentline' style={{ background: primary.color }} aria-hidden='true' />
						<p className='whc-stat-primary-label'>{primary.label}</p>
						<p className='whc-stat-primary-sub'>{primary.sub}</p>
					</Reveal>
				)}

				{secondary.length > 0 && (
					<>
						<motion.div
							className='whc-stats-divider'
							initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
							whileInView={{ scaleY: 1, opacity: 1 }}
							viewport={{ once: true, amount: 0.6 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
							aria-hidden='true'
						/>

						<div className='whc-stats-secondary'>
							{secondary.map((s, i) => (
								<Reveal
									key={s.label}
									amount={0.4}
									delay={0.22 + i * 0.1}
									className='whc-stat-item'
									role='group'
									aria-label={`${s.display} — ${s.label}`}>
									<div className='whc-stat-kicker whc-stat-kicker--sm'>
										<s.IconComp size={12} color={s.color} />
										<span style={{ color: s.color }}>{s.tag}</span>
									</div>
									<p className='whc-stat-num'>
										<Counter display={s.display} />
									</p>
									<span className='whc-stat-accentline whc-stat-accentline--sm' style={{ background: s.color }} aria-hidden='true' />
									<p className='whc-stat-label'>{s.label}</p>
									<p className='whc-stat-sub'>{s.sub}</p>
								</Reveal>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
