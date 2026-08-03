'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import { EASE } from '@/components/sections/WhyChooseUs/theme';
import { faqCategories, faqs } from '../data';
import { Badge, MagneticCTA, Reveal } from './ui';
import { useIsDesktop } from '../hooks';

function FaqRow({ f, index }) {
	const [open, setOpen] = useState(false);
	const panelId = useId();

	return (
		<div className='le-faq-row'>
			<button type='button' id={`${panelId}-btn`} className='le-faq-row-btn' aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
				<span className='le-faq-row-left'>
					<span className='le-faq-index'>{String(index + 1).padStart(2, '0')}</span>
					<span className='le-faq-q'>{f.q}</span>
				</span>
				<span className={`le-faq-toggle${open ? ' is-open' : ''}`} aria-hidden='true'>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
				</span>
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						id={panelId}
						role='region'
						aria-labelledby={`${panelId}-btn`}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.4, ease: EASE }}
						style={{ overflow: 'hidden' }}>
						<p className='le-faq-a'>{f.a}</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function FaqSection() {
	const isDesktop = useIsDesktop();
	const reduced = useReducedMotion();
	const [activeCategory, setActiveCategory] = useState('All');
	const visibleFaqs = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory);

	return (
		<section className='le-section' aria-labelledby='faq-heading'>
			<Reveal amount={0.3} className='le-faq-head'>
				<Badge>Common Questions</Badge>
				<h2 id='faq-heading' className='le-h le-h--section'>
					Everything You Need
					<br />
					<span className='le-h-accent'>To Know</span>
				</h2>
				<p className='le-sub' style={{ marginTop: 16 }}>
					Straight answers about electric hamam and underfloor heating for Kashmir homes.
				</p>
			</Reveal>

			<div className='le-faq-tabs' role='group' aria-label='Filter questions by category'>
				{faqCategories.map((cat) => (
					<button key={cat} type='button' aria-pressed={activeCategory === cat} onClick={() => setActiveCategory(cat)} className={`le-faq-tab${activeCategory === cat ? ' is-active' : ''}`}>
						{cat}
					</button>
				))}
			</div>

			<div className='le-faq-list'>
				{visibleFaqs.map((f, i) => (
					<Reveal key={f.q} amount={0.3} delay={Math.min(i, 5) * 0.05} y={16}>
						<FaqRow f={f} index={i} />
					</Reveal>
				))}
			</div>

			<Reveal amount={0.4} className='le-faq-closing'>
				<p>Still have questions?</p>
				<MagneticCTA href='/contact' className='le-btn-primary' disabled={!isDesktop || reduced}>
					Talk to Our Expert
				</MagneticCTA>
			</Reveal>
		</section>
	);
}
