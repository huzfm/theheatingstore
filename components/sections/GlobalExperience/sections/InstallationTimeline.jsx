'use client';

import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import Eyebrow from '../ui/Eyebrow';
import { process } from '../data';
import { EASE } from '../theme';
import '../styles/timeline.css';

export default function InstallationTimeline() {
	const railRef = useRef(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: railRef,
		offset: ['start 0.8', 'end 0.45'],
	});

	return (
		<section className='ge-section ge-tl'>
			<div className='ge-container'>
				<div className='ge-tl-head'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>Process / 05 Stages</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-tl-heading'
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
						Our Installation Process
					</motion.h2>
				</div>

				<div ref={railRef} className='ge-tl-rail'>
					<div className='ge-tl-track' aria-hidden='true'>
						<motion.div
							className='ge-tl-track-fill'
							style={
								prefersReducedMotion
									? { scaleX: 1 }
									: { scaleX: scrollYProgress }
							}
						/>
					</div>

					<ol className='ge-tl-grid'>
						{process.map((step, i) => (
							<motion.li
								key={step.title}
								className='ge-tl-step'
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{
									delay: i * 0.09,
									duration: 0.7,
									ease: EASE,
								}}>
								<span className='ge-tl-node' aria-hidden='true' />
								<span className='ge-numeral ge-tl-num'>
									{String(i + 1).padStart(2, '0')}
								</span>
								<span className='ge-tl-category'>{step.category}</span>
								<h3 className='ge-tl-title'>{step.title}</h3>
								<p className='ge-tl-desc'>{step.desc}</p>
								<span className='ge-tl-detail'>{step.detail}</span>
							</motion.li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
