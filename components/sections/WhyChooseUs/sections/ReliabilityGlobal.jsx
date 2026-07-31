'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../theme';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { LocalReliability } from './reliability/LocalReliability';
import { GlobalPresence } from './reliability/GlobalPresence';
import '../styles/reliability.css';

// ─────────────────────────────────────────────────────────────────────────────
// RELIABILITY + GLOBAL — "Proven locally. Trusted globally." One continuous
// editorial composition (no boxed cards) chained off Stats' hairline-divider
// grid immediately above it: local engineering proof on the left, global
// reach on the right, split by a single vertical rule.
// ─────────────────────────────────────────────────────────────────────────────

export default function ReliabilityGlobal() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<div className='whc-pad whc-pad-tight'>
			<Reveal amount={0.3}>
				<SectionHeading
					badge='Engineered For Extremes'
					title="Proven through Kashmir's winters,"
					accent='trusted across nine countries.'
					sub="The same systems that hold through one of the subcontinent's harshest winters now run quietly beneath floors from the Gulf to Scandinavia — engineered once, proven everywhere they go."
				/>
			</Reveal>

			<div className='whc-reli-grid'>
				<Reveal x={-24} y={0} delay={0.05} amount={0.1}>
					<LocalReliability />
				</Reveal>

				<motion.div
					className='whc-reli-divider'
					initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
					whileInView={{ scaleY: 1, opacity: 1 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 1, ease: EASE, delay: 0.2 }}
					aria-hidden='true'
				/>

				<Reveal x={24} y={0} delay={0.1} amount={0.1}>
					<GlobalPresence />
				</Reveal>
			</div>
		</div>
	);
}
