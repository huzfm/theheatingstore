'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { staggerContainer, staggerItem } from '../theme';
import { BRANDS } from '@/app/lib/brandsData';
import { CAPABILITY } from '../data';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { Icon } from '../icons';
import '../styles/brands.css';

// ─────────────────────────────────────────────────────────────────────────────
// BRAND ROW — one line of the technology index. Logo stays the visual anchor;
// name, provenance and warranty are always legible (never hover-gated), hover
// only adds emphasis: accent bar, full-colour logo, arrow shift.
// ─────────────────────────────────────────────────────────────────────────────

function BrandRow({ brand, index, isDimmed, onFocusRow, onBlurRow }) {
	return (
		<motion.div variants={staggerItem}>
			<Link
				href={`/brands/${brand.slug}`}
				className={`whc-brand-row${isDimmed ? ' is-dimmed' : ''}`}
				style={{ '--accent': brand.accentColor }}
				onMouseEnter={onFocusRow}
				onMouseLeave={onBlurRow}
				onFocus={onFocusRow}
				onBlur={onBlurRow}
				aria-label={`View ${brand.name} products — ${brand.tag.toLowerCase()} heating systems, ${brand.warranty}`}>
				<span className='whc-brand-row-accent' aria-hidden='true' />
				<span className='whc-brand-row-index' aria-hidden='true'>
					{String(index + 1).padStart(2, '0')}
				</span>
				<span className='whc-brand-row-logo'>
					<img src={brand.img} alt={`${brand.name} logo`} loading='lazy' />
				</span>
				<span className='whc-brand-row-body'>
					<span className='whc-brand-row-heading'>
						<span className='whc-brand-row-name'>{brand.name}</span>
						<span className='whc-brand-row-tag'>{brand.tag}</span>
					</span>
					<span className='whc-brand-row-meta'>
						{brand.origin} · Est. {brand.established} · {brand.certifications.slice(0, 3).join(' · ')}
					</span>
				</span>
				<span className='whc-brand-row-warranty'>{brand.warranty}</span>
				<span className='whc-brand-row-cta'>
					View products
					<Icon.ArrowRight size={14} />
				</span>
			</Link>
		</motion.div>
	);
}

export default function Brands() {
	const [hovered, setHovered] = useState(null);

	return (
		<div className='whc-pad whc-pad-tight whc-brands'>
			<div className='whc-brands-top'>
				<Reveal amount={0.2}>
					<SectionHeading
						badge='Technology Partners'
						title='World-class heating technology,'
						accent='matched to your space'
					/>
				</Reveal>

				<Reveal amount={0.2} delay={0.1}>
					<div className='whc-brands-story'>
						<p>
							A stone courtyard floor in Srinagar, a heritage renovation in Gulmarg, and a commercial hamam
							installation each place different demands on a heating system, floor build-up, insulation and power
							reliability all change what &ldquo;right&rdquo; looks like. That&rsquo;s why our range spans a small
							number of manufacturers rather than one, each selected on cable engineering and certification, then
							matched to the project it suits.
						</p>
						<div className='whc-brands-pills'>
							{CAPABILITY.map((item) => (
								<span key={item.label} className='whc-brands-pill'>
									{item.label}
								</span>
							))}
						</div>
					</div>
				</Reveal>
			</div>

			<motion.div
				className='whc-brand-list'
				variants={staggerContainer}
				initial='hidden'
				whileInView='show'
				viewport={{ once: true, amount: 0.1 }}>
				{BRANDS.map((b, i) => (
					<BrandRow
						key={b.slug}
						brand={b}
						index={i}
						isDimmed={hovered !== null && hovered !== i}
						onFocusRow={() => setHovered(i)}
						onBlurRow={() => setHovered(null)}
					/>
				))}
			</motion.div>

			<Reveal amount={0.3} className='whc-brands-bottom'>
				<div className='whc-brands-trust'>
					{[
						{ val: '500K+', label: 'systems installed across India' },
						{ val: '2M+', label: 'systems installed worldwide' },
						{ val: 'Since 2011', label: 'sourcing and installing heating technology' },
					].map((s) => (
						<div key={s.label} className='whc-brands-trust-item'>
							<p>{s.val}</p>
							<span>{s.label}</span>
						</div>
					))}
				</div>
				<p className='whc-brands-footnote'>
					Every system is backed by its manufacturer warranty and our Kashmir installation warranty.{' '}
					<a href='/contact'>Talk to our experts to find the right fit →</a>
				</p>
			</Reveal>
		</div>
	);
}
