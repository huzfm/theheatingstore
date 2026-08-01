'use client';

import { motion } from 'framer-motion';
import Eyebrow from '../ui/Eyebrow';
import Counter from '../ui/Counter';
import { warrantyStats } from '../data';
import { EASE } from '../theme';
import '../styles/warranty.css';

export default function WarrantySection() {
	return (
		<section className='ge-section ge-warranty'>
			<div className='ge-grain' aria-hidden='true' />
			<div className='ge-warranty-glow' aria-hidden='true' />

			<div className='ge-container'>
				<div className='ge-warranty-top'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>Built to Last</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-warranty-heading'
						initial={{ opacity: 0, y: 26 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}>
						Reliability &amp;
						<br />
						Warranty
					</motion.h2>
					<motion.p
						className='ge-warranty-copy'
						initial={{ opacity: 0, y: 18 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}>
						Our heating systems are built to last. Most installations are
						backed by warranties of up to 25 years, with extremely low
						repair rates thanks to advanced cable insulation and strict
						installation standards.
					</motion.p>
				</div>

				<hr className='ge-hr ge-warranty-rule' />

				<div className='ge-warranty-stats'>
					{warrantyStats.map((s, i) => (
						<div className={`ge-warranty-stat ge-warranty-stat-${i}`} key={s.label}>
							<span className='ge-numeral ge-warranty-num'>
								<Counter display={s.value} />
							</span>
							<span className='ge-warranty-label'>{s.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
