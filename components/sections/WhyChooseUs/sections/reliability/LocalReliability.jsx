'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { C, EASE, listStagger, listItem } from '../../theme';
import { RELIABILITY } from '../../data';

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL RELIABILITY — the "proven locally" half of the section's story. A
// qualitative cold-to-warm indicator stands in for a literal thermal image
// (no fabricated temperatures), followed by RELIABILITY rendered as a
// numbered index rather than icon cards.
// ─────────────────────────────────────────────────────────────────────────────

export function LocalReliability() {
	const prefersReducedMotion = useReducedMotion();

	return (
		<div className='whc-col whc-col-local'>
			<span className='whc-col-kicker'>01 — Local Proof</span>
			<h3 className='whc-col-title'>Built for Kashmiri Winters.</h3>
			<p className='whc-col-sub'>
				Every system is engineered for decades of silent, flawless operation through one of the subcontinent's harshest winters — so you never have to think about your floor again.
			</p>

			<div className='whc-thermal' role='img' aria-label='Engineered to run from sub-zero winters to a consistently warm floor'>
				<span className='whc-thermal-label whc-thermal-label--cold'>Sub-zero winters</span>
				<span className='whc-thermal-bar'>
					<motion.span
						initial={prefersReducedMotion ? false : { scaleX: 0 }}
						whileInView={{ scaleX: 1 }}
						viewport={{ once: true, amount: 0.6 }}
						transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
						style={{ transformOrigin: 'left center' }}
					/>
				</span>
				<span className='whc-thermal-label whc-thermal-label--warm'>Even warmth, floor to floor</span>
			</div>

			<motion.ul
				className='whc-reli-list'
				variants={listStagger}
				initial='hidden'
				whileInView='show'
				viewport={{ once: true, amount: 0.2 }}>
				{RELIABILITY.map((f, i) => (
					<motion.li key={f.title} variants={listItem} className='whc-reli-row'>
						<span className='whc-reli-num' aria-hidden='true'>{String(i + 1).padStart(2, '0')}</span>
						<span className='whc-reli-icon'>
							<f.IconComp size={18} color={C.amberLt} />
						</span>
						<div>
							<p className='whc-reli-title'>{f.title}</p>
							<p className='whc-reli-desc'>{f.desc}</p>
						</div>
					</motion.li>
				))}
			</motion.ul>
		</div>
	);
}
