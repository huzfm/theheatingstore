'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { staggerContainer, staggerItem } from '@/components/sections/WhyChooseUs/theme';
import { BRANDS } from '@/app/lib/brandsData';
import { Reveal, SectionKicker } from './ui';

const TRUST = [
	{ val: '2M+', label: 'systems installed worldwide' },
	{ val: '0.01%', label: 'fault rate across our network' },
	{ val: 'Since 2011', label: 'sourcing and installing heating technology' },
];

// Real manufacturer logos (app/lib/brandsData — the same set WhyChooseUs's
// Brands section reads from), not a lettered avatar standing in for one.
function BrandRow({ brand, index, isDimmed, onFocusRow, onBlurRow }) {
	return (
		<motion.div variants={staggerItem}>
			<Link
				href={`/brands/${brand.slug}`}
				className={`le-brand-row${isDimmed ? ' is-dimmed' : ''}`}
				style={{ '--accent': brand.accentColor }}
				onMouseEnter={onFocusRow}
				onMouseLeave={onBlurRow}
				onFocus={onFocusRow}
				onBlur={onBlurRow}
				aria-label={`View ${brand.name} products — ${brand.tag.toLowerCase()} heating systems, ${brand.warranty}`}>
				<span className='le-brand-row-accent' aria-hidden='true' />
				<span className='le-brand-row-index' aria-hidden='true'>
					{String(index + 1).padStart(2, '0')}
				</span>
				<span className='le-brand-row-logo'>
					<img src={brand.img} alt={`${brand.name} logo`} loading='lazy' />
				</span>
				<span className='le-brand-row-body'>
					<span className='le-brand-row-heading'>
						<span className='le-brand-row-name'>{brand.name}</span>
						<span className='le-brand-row-tag'>{brand.tag}</span>
					</span>
					<span className='le-brand-row-meta'>
						{brand.origin} · Est. {brand.established} · {brand.certifications.slice(0, 3).join(' · ')}
					</span>
				</span>
				<span className='le-brand-row-warranty'>{brand.warranty}</span>
				<span className='le-brand-row-cta'>
					View products
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<path d='M5 12h14M13 6l6 6-6 6' />
					</svg>
				</span>
			</Link>
		</motion.div>
	);
}

export default function TechnologyBrands() {
	const [hovered, setHovered] = useState(null);

	return (
		<section className='le-section' aria-labelledby='brands-heading'>
			<div className='le-brands-head'>
				<Reveal amount={0.2}>
					<SectionKicker index='02' label='Technology Partners' />
					<h2 id='brands-heading' className='le-h le-h--section'>
						The Technology
						<br />
						Behind the <span className='le-h-accent'>Warmth</span>
					</h2>
				</Reveal>
				<Reveal amount={0.2} delay={0.1}>
					<p className='le-brands-story'>
						A stone courtyard floor in Srinagar and a commercial hamam installation place different demands on a heating system, so our range spans a small number of manufacturers rather than one, each selected on cable engineering and certification, then matched to the climate it&rsquo;s built for.
					</p>
				</Reveal>
			</div>

			<motion.div
				className='le-brand-list'
				variants={staggerContainer}
				initial='hidden'
				whileInView='show'
				viewport={{ once: true, amount: 0.1 }}>
				{BRANDS.map((brand, i) => (
					<BrandRow
						key={brand.slug}
						brand={brand}
						index={i}
						isDimmed={hovered !== null && hovered !== i}
						onFocusRow={() => setHovered(i)}
						onBlurRow={() => setHovered(null)}
					/>
				))}
			</motion.div>

			<Reveal amount={0.3} className='le-brands-trust'>
				{TRUST.map((t) => (
					<div key={t.label} className='le-brands-trust-item'>
						<p>{t.val}</p>
						<span>{t.label}</span>
					</div>
				))}
			</Reveal>
		</section>
	);
}
