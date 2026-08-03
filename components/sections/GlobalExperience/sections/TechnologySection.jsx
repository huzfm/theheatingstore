'use client';

import { motion } from 'framer-motion';
import Eyebrow from '../ui/Eyebrow';
import { technicalSpecs } from '../data';
import { EASE } from '../theme';
import '../styles/technology.css';

function SpecRow({ text, index }) {
	return (
		<motion.div
			className='ge-tech-row'
			initial={{ opacity: 0, x: -16 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ delay: index * 0.08, duration: 0.6, ease: EASE }}>
			<span className='ge-numeral ge-tech-row-num'>
				{String(index + 1).padStart(2, '0')}
			</span>
			<span className='ge-tech-row-marker' aria-hidden='true' />
			<span className='ge-tech-row-text'>{text}</span>
		</motion.div>
	);
}

export default function TechnologySection() {
	return (
		<section className='ge-section ge-tech'>
			<div className='ge-container ge-tech-grid'>
				<motion.div
					className='ge-tech-image-col'
					initial={{ opacity: 0, clipPath: 'inset(0 0 12% 0)' }}
					whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 1, ease: EASE }}>
					<div className='ge-tech-frame' aria-hidden='true'>
						<span className='ge-tech-tick ge-tech-tick-tl' />
						<span className='ge-tech-tick ge-tech-tick-br' />
						<span className='ge-tech-ruler' />
					</div>
					<div className='ge-tech-image-wrap'>
						<img
							src='/images/floor2.webp'
							alt='Heating cable technology beneath a finished floor'
							className='ge-tech-image'
						/>
					</div>
				</motion.div>

				<div className='ge-tech-copy-col'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>Engineered for Kashmir</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-tech-heading'
						initial={{ opacity: 0, y: 22 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
						Technology Behind
						<br />
						Our Kashmir Systems
					</motion.h2>
					<motion.p
						className='ge-tech-lede'
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>
						Our heating cables use advanced fluoropolymer insulation and
						multi-layer conductive cores that provide consistent radiant
						heat distribution. These systems are designed to operate safely
						beneath flooring materials while maintaining optimal energy
						efficiency.
					</motion.p>

					<div className='ge-tech-specs'>
						{technicalSpecs.map((spec, i) => (
							<SpecRow text={spec} index={i} key={spec} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
