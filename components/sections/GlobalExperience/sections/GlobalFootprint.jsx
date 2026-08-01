'use client';

import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import Eyebrow from '../ui/Eyebrow';
import { countries } from '../data';
import { fadeUp, EASE } from '../theme';
import '../styles/footprint.css';

function CountryTile({ country, index }) {
	const num = String(index + 1).padStart(2, '0');
	return (
		<motion.div
			className='ge-fp-tile'
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ delay: index * 0.06, duration: 0.7, ease: EASE }}>
			<div className='ge-fp-tile-bg' aria-hidden='true' />
			<div className='ge-fp-tile-top'>
				<Flag code={country.code} className='ge-fp-flag' />
				<span className='ge-fp-num'>{num}</span>
			</div>
			<p className='ge-fp-name'>{country.name}</p>
			<span className='ge-fp-line' aria-hidden='true' />
		</motion.div>
	);
}

export default function GlobalFootprint() {
	return (
		<section className='ge-section ge-fp'>
			<div className='ge-container ge-fp-grid'>
				<div className='ge-fp-intro'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>Global Footprint / 08 Markets</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-fp-heading'
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
						Our Global
						<br />
						Installations
					</motion.h2>
					<motion.p
						className='ge-fp-copy'
						variants={fadeUp}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true, amount: 0.5 }}
						transition={{ delay: 0.15 }}>
						From the Himalayas to the Gulf &mdash; trusted in homes and
						landmark builds worldwide.
					</motion.p>
				</div>

				<div className='ge-fp-list'>
					{countries.map((c, i) => (
						<CountryTile country={c} index={i} key={c.name} />
					))}
				</div>
			</div>
		</section>
	);
}
