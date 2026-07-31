'use client';

import { motion } from 'framer-motion';
import { countryContainer, countryItem } from '../../theme';
import { COUNTRIES } from '../../data';
import { Flag } from '../../ui/Flag';

// Presentation-only proof strip — restates figures already established
// elsewhere (Stats' "Systems Installed" card, the Hero lede, and Stats'
// "Since 2011" badge), so nothing here is a new or exaggerated claim.
const PROOF = [
	{ value: '2M+', label: 'Systems worldwide' },
	{ value: '500K+', label: 'In India alone' },
	{ value: '2011', label: 'Operating since' },
];

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL PRESENCE — the "trusted globally" half. A single editorial figure
// (country count) anchors a quiet ledger of countries, closed out by a
// restrained proof strip. No map, no flashy globe — the list itself is the
// geography.
// ─────────────────────────────────────────────────────────────────────────────

export function GlobalPresence() {
	return (
		<div className='whc-col whc-col-global'>
			<span className='whc-col-kicker'>02 — Global Reach</span>

			<div className='whc-global-figure'>
				<span className='whc-global-number'>{String(COUNTRIES.length).padStart(2, '0')}</span>
				<span className='whc-global-figure-label'>
					Countries
					<br />
					specifying our systems
				</span>
			</div>

			<motion.ul
				className='whc-country-ledger'
				variants={countryContainer}
				initial='hidden'
				whileInView='show'
				viewport={{ once: true, amount: 0.3 }}
				aria-label={`${COUNTRIES.length} countries where our systems are installed`}>
				{COUNTRIES.map((c, i) => (
					<motion.li key={c.name} variants={countryItem} className='whc-country-row'>
						<span className='whc-country-idx' aria-hidden='true'>{String(i + 1).padStart(2, '0')}</span>
						<Flag code={c.code} name={c.name} />
						<span className='whc-country-name'>{c.name}</span>
					</motion.li>
				))}
			</motion.ul>

			<div className='whc-proof-strip'>
				{PROOF.map((p) => (
					<div key={p.label} className='whc-proof-item'>
						<p className='whc-proof-value'>{p.value}</p>
						<p className='whc-proof-label'>{p.label}</p>
					</div>
				))}
			</div>
		</div>
	);
}
