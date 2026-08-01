'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import { EASE } from '@/components/sections/WhyChooseUs/theme';
import { serviceNetwork } from '../data';
import { Reveal, SectionKicker } from './ui';

// Stylised radial layout, not a literal map — same discipline as the
// original "decorative live-network overlay" comment this replaces. Index 0
// (Jammu & Kashmir) is the hub every other region radiates from, since it's
// the home base the rest of the network is dispatched from.
const NODE_POS = [
	{ x: 50, y: 18 },
	{ x: 74, y: 34 },
	{ x: 24, y: 50 },
	{ x: 50, y: 64 },
	{ x: 78, y: 78 },
];
const ROUTE_CONTROL = [null, { x: 68, y: 20 }, { x: 30, y: 28 }, { x: 46, y: 40 }, { x: 72, y: 52 }];

function NetworkViz({ activeIndex }) {
	const hub = NODE_POS[0];
	return (
		<svg className='le-network-svg' viewBox='0 0 100 100' role='img' aria-label="Network map of the heating store's service regions across India, radiating from the Kashmir hub">
			{serviceNetwork.slice(1).map((region, idx) => {
				const i = idx + 1;
				const pos = NODE_POS[i];
				const c = ROUTE_CONTROL[i];
				return <path key={region.region} className={`le-network-route${activeIndex === i ? ' is-active' : ''}`} d={`M ${hub.x} ${hub.y} Q ${c.x} ${c.y} ${pos.x} ${pos.y}`} />;
			})}

			{serviceNetwork.map((region, i) => {
				const pos = NODE_POS[i];
				const isHub = i === 0;
				return (
					<g key={region.region} className={`le-network-node${activeIndex === i ? ' is-active' : ''}`}>
						<circle className='le-network-node-ring' cx={pos.x} cy={pos.y} r={isHub ? 4.2 : 2.8} />
						<circle
							className='le-network-node-core'
							cx={pos.x}
							cy={pos.y}
							r={isHub ? 2.2 : activeIndex === i ? 1.7 : 1.3}
							fill={isHub ? '#F5B97A' : activeIndex === i ? '#FF7E5F' : 'rgba(251,243,234,0.45)'}
						/>
						<text x={pos.x} y={pos.y + (isHub ? -7 : -5.5)} textAnchor='middle' className={isHub ? 'le-network-hub-label' : 'le-network-node-label'}>
							{isHub ? 'SRINAGAR HUB' : region.region.replace(' India', '')}
						</text>
					</g>
				);
			})}
		</svg>
	);
}

function RegionRow({ region, index, isActive, onActivate }) {
	const panelId = useId();
	return (
		<div className={`le-network-row${isActive ? ' is-active' : ''}`} onMouseEnter={onActivate}>
			<button type='button' className='le-network-row-head' aria-expanded={isActive} aria-controls={panelId} onClick={onActivate} onFocus={onActivate}>
				<span className='le-network-row-index'>{String(index + 1).padStart(2, '0')}</span>
				<span className='le-network-row-title'>{region.region}</span>
				<span className='le-network-row-count'>{region.places.length} cities</span>
			</button>
			<AnimatePresence initial={false}>
				{isActive && (
					<motion.div id={panelId} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} style={{ overflow: 'hidden' }}>
						<div className='le-network-chips'>
							{region.places.map((place) => (
								<span key={place} className='le-network-chip'>
									{place}
								</span>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function ServiceNetwork() {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<section className='le-section' aria-labelledby='network-heading'>
			<Reveal amount={0.2}>
				<SectionKicker index='04' label='Service Network' />
				<h2 id='network-heading' className='le-h le-h--section'>
					Engineered Here.
					<br />
					Supported <span className='le-h-accent'>Across India</span>.
				</h2>
			</Reveal>

			<div className='le-network-grid' style={{ marginTop: 48 }}>
				<Reveal amount={0.2} delay={0.08}>
					<div className='le-network-viz'>
						<NetworkViz activeIndex={activeIndex} />
					</div>
				</Reveal>

				<Reveal amount={0.2} delay={0.14}>
					<div className='le-network-list'>
						{serviceNetwork.map((region, i) => (
							<RegionRow key={region.region} region={region} index={i} isActive={activeIndex === i} onActivate={() => setActiveIndex(i)} />
						))}
					</div>
				</Reveal>
			</div>
		</section>
	);
}
