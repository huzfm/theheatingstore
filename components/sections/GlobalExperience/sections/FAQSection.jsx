'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Eyebrow from '../ui/Eyebrow';
import { faqs } from '../data';
import { EASE } from '../theme';
import '../styles/faq.css';

function FaqRow({ q, a, index }) {
	const [open, setOpen] = useState(false);
	const num = String(index + 1).padStart(2, '0');
	const panelId = `ge-faq-panel-${index}`;

	return (
		<motion.div
			className={`ge-faq-row${open ? ' is-open' : ''}`}
			initial={{ opacity: 0, y: 18 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ delay: index * 0.06, duration: 0.6, ease: EASE }}>
			<button
				type='button'
				className='ge-faq-trigger'
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((v) => !v)}>
				<span className='ge-numeral ge-faq-num'>{num}</span>
				<span className='ge-faq-q'>{q}</span>
				<span className='ge-faq-toggle' aria-hidden='true'>
					<span className='ge-faq-toggle-h' />
					<span className='ge-faq-toggle-v' />
				</span>
			</button>
			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						id={panelId}
						role='region'
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.45, ease: EASE }}
						className='ge-faq-panel'>
						<div className='ge-faq-panel-inner'>
							<span className='ge-faq-accent' aria-hidden='true' />
							<p className='ge-faq-a'>{a}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default function FAQSection() {
	return (
		<section className='ge-section ge-faq-section'>
			<div className='ge-container ge-faq-grid'>
				<div className='ge-faq-intro'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>FAQ</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-faq-heading'
						initial={{ opacity: 0, y: 22 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
						Frequently Asked
						<br />
						Questions
					</motion.h2>
					<motion.p
						className='ge-faq-copy'
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
						Answers to what homeowners and architects ask us most before
						installation.
					</motion.p>
				</div>

				<div className='ge-faq-list'>
					{faqs.map((f, i) => (
						<FaqRow q={f.q} a={f.a} index={i} key={f.q} />
					))}
				</div>
			</div>
		</section>
	);
}
