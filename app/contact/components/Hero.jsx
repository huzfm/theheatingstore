'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/components/sections/WhyChooseUs/theme';
import { PHONE_DISPLAY, PHONE_TEL } from '../data';
import { Badge, MagneticCTA, MagneticAnchor } from './ui';
import { useIsDesktop } from '../hooks';

// Architectural floor-plan diagram standing in for a literal photo — an
// L-shaped room outline with underfloor "isotherm" contours and two
// margin-note annotations, drawn like a technical drawing rather than a
// dashboard graphic. Static geometry; only the isotherm opacity breathes.
function BlueprintPanel() {
	return (
		<svg className='ct-blueprint-svg' viewBox='0 0 100 120' role='img' aria-label='Architectural floor plan diagram showing underfloor heating zones'>
			<path className='ct-bp-outline' d='M15 20 H85 V55 H60 V95 H15 Z' vectorEffect='non-scaling-stroke' />
			<path className='ct-bp-partition' d='M45 20 V55' vectorEffect='non-scaling-stroke' />

			<g className='ct-bp-iso'>
				<ellipse cx='37' cy='75' rx='9' ry='6' />
				<ellipse cx='37' cy='75' rx='17' ry='11.5' />
				<ellipse cx='37' cy='75' rx='25' ry='17' />
			</g>
			<circle className='ct-bp-core' cx='37' cy='75' r='1.4' />

			<path className='ct-bp-lead' d='M37 75 L58 66 L80 66' vectorEffect='non-scaling-stroke' />
			<circle className='ct-bp-pin' cx='37' cy='75' r='1' />
			<text x='81' y='64.5' className='ct-bp-label'>ZONE 01</text>
			<text x='81' y='69.5' className='ct-bp-sublabel'>UNDERFLOOR CABLE</text>

			<path className='ct-bp-lead' d='M45 35 L64 24 L80 24' vectorEffect='non-scaling-stroke' />
			<circle className='ct-bp-pin' cx='45' cy='35' r='1' />
			<text x='81' y='22.5' className='ct-bp-label'>ZONE 02</text>
			<text x='81' y='27.5' className='ct-bp-sublabel'>AMBIENT AIR</text>
		</svg>
	);
}

export default function Hero() {
	const reduce = useReducedMotion();
	const isDesktop = useIsDesktop();
	const pointerFxDisabled = !isDesktop || reduce;

	return (
		<section className='ct-hero' aria-label='Contact The Heating Store'>
			<div className='ct-hero-inner'>
				{/* LEFT — copy */}
				<motion.div variants={staggerContainer} initial='hidden' animate='show'>
					<motion.div variants={staggerItem}>
						<Badge>Get In Touch</Badge>
					</motion.div>

					<motion.h1 variants={staggerItem} className='brand-h ct-hero-title'>
						Let&rsquo;s design <span className='brand-h-accent'>warmth</span>
						<br />
						for your space.
					</motion.h1>

					<motion.p variants={staggerItem} className='ct-hero-lede'>
						From a first phone call to the day your floor is warm, our engineers design and install radiant heating built for Kashmir&rsquo;s climate, not adapted from a catalogue.
					</motion.p>

					<motion.div variants={staggerItem} className='ct-hero-actions'>
						<MagneticCTA href='#consultation' className='ct-btn-primary' disabled={pointerFxDisabled}>
							Start Your Consultation
						</MagneticCTA>
						<MagneticAnchor href={`tel:${PHONE_TEL}`} className='ct-btn-ghost' disabled={pointerFxDisabled}>
							Call Our Team
						</MagneticAnchor>
					</motion.div>

					<motion.div variants={staggerItem} className='ct-availability'>
						<span className='ct-availability-dot' />
						Currently accepting new projects &middot; typical response within 24 hours
					</motion.div>
				</motion.div>

				{/* RIGHT — architectural diagram */}
				<motion.div
					initial={{ opacity: 0, y: reduce ? 0 : 32, scale: 0.98 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
					className='ct-hero-visual'>
					<span className='ct-corner ct-corner-tl' aria-hidden />
					<span className='ct-corner ct-corner-tr' aria-hidden />
					<span className='ct-corner ct-corner-bl' aria-hidden />
					<span className='ct-corner ct-corner-br' aria-hidden />

					<div className='ct-hero-visual-glow' aria-hidden />
					<div className='ct-hero-visual-grid' aria-hidden />
					<BlueprintPanel />

					<div className='ct-hero-visual-titleblock'>
						<span>Floor Plan &middot; Ref. EH&#8211;K01</span>
						<span>Scale N.T.S.</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
