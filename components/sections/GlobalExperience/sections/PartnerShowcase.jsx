'use client';

import { motion } from 'framer-motion';
import Eyebrow from '../ui/Eyebrow';
import { brands } from '../data';
import { EASE } from '../theme';
import '../styles/partners.css';

function DocTile({ brand, index }) {
	const num = String(index + 1).padStart(2, '0');
	return (
		<motion.a
			href={brand.pdf}
			target='_blank'
			rel='noopener noreferrer'
			className='ge-doc-tile'
			initial={{ opacity: 0, y: 26 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ delay: index * 0.06, duration: 0.7, ease: EASE }}>
			<span className='ge-doc-index'>{num}</span>

			<div className='ge-doc-paper'>
				<div className='ge-doc-paper-top'>
					<img
						src={brand.logo}
						alt={`${brand.name} logo`}
						className='ge-doc-logo'
					/>
					<span className='ge-doc-pdf-badge'>PDF</span>
				</div>
				<div className='ge-doc-lines' aria-hidden='true'>
					<span className='ge-doc-line' style={{ width: '100%' }} />
					<span className='ge-doc-line' style={{ width: '78%' }} />
					<span className='ge-doc-line' style={{ width: '60%' }} />
				</div>
				<div className='ge-doc-open'>
					<span>Open Document</span>
					<svg viewBox='0 0 24 24' fill='none' aria-hidden='true'>
						<path
							d='M7 17L17 7M17 7H9M17 7V15'
							stroke='currentColor'
							strokeWidth='1.6'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</div>
			</div>

			<div className='ge-doc-meta'>
				<p className='ge-doc-name'>{brand.name}</p>
				<span className='ge-doc-underline' aria-hidden='true' />
				<p className='ge-doc-title'>{brand.docTitle}</p>
				<p className='ge-doc-sub'>
					{brand.docType} &middot; {brand.docPages}
				</p>
			</div>
		</motion.a>
	);
}

export default function PartnerShowcase() {
	return (
		<section className='ge-section ge-doc'>
			<div className='ge-container'>
				<div className='ge-doc-head'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>Technology Partners</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-doc-heading'
						initial={{ opacity: 0, y: 22 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
						Brands We Work With
					</motion.h2>
					<motion.p
						className='ge-doc-sub-copy'
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
						Hover over any brand to access the official installation
						documentation.
					</motion.p>
				</div>

				<div className='ge-doc-row'>
					{brands.map((b, i) => (
						<DocTile brand={b} index={i} key={b.name} />
					))}
				</div>
			</div>
		</section>
	);
}
