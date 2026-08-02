'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { staggerContainer, staggerItem } from '@/components/sections/WhyChooseUs/theme';
import { Badge, MagneticCTA } from './ui';
import { useIsDesktop } from '../hooks';

// Full-bleed photographic hero — the hamam floor's own glowing cable pattern
// is the visual proof of the product, so it stays uncovered rather than
// competing with a synthetic overlay. Matches WhyChooseUs's Hero structure:
// one dominant plate image, a scrim tuned for text legibility, no floating
// dashboard elements.
export default function Hero() {
	const heroRef = useRef(null);
	const reduced = useReducedMotion();
	const isDesktop = useIsDesktop();
	const pointerFxDisabled = !isDesktop || reduced;

	return (
		<section ref={heroRef} className='le-hero' aria-label='Electric hamam and underfloor heating in Kashmir and across India'>
			<div className='le-hero-plate'>
				<Image
					src='/images/local.png'
					alt='Glowing serpentine underfloor heating cable radiating warmth beneath a marble hamam floor'
					fill
					priority
					sizes='100vw'
					style={{ objectFit: 'cover', objectPosition: '50% 45%' }}
				/>
			</div>
			<div aria-hidden className='le-hero-scrim' />
			<div aria-hidden className='le-hero-textscrim' />
			<div aria-hidden className='le-hero-grain' />

			<div className='le-hero-inner'>
				<motion.div variants={staggerContainer} initial='hidden' animate='show'>
					<motion.div variants={staggerItem}>
						<Badge>Kashmir #1 Seller · Since 2011</Badge>
					</motion.div>

					<motion.h1 variants={staggerItem} className='le-hero-title'>
						Electric Hamam &amp;
						<br />
						Underfloor Heating
						<em>In Kashmir &amp; Across India</em>
					</motion.h1>

					<motion.p variants={staggerItem} className='le-hero-lede'>
						Silent radiant warmth that rises from beneath your floor. No radiators, no cold spots, engineered to keep working through Kashmir&rsquo;s winters and its power cuts.
					</motion.p>

					<motion.div variants={staggerItem} className='le-hero-actions'>
						<MagneticCTA href='/SpaceVerification' className='le-btn-primary' disabled={pointerFxDisabled}>
							Verify My Space
						</MagneticCTA>
						<MagneticCTA href='/contact' className='le-btn-ghost' disabled={pointerFxDisabled}>
							Talk to Expert
						</MagneticCTA>
					</motion.div>
				</motion.div>
			</div>

			<div className='le-hero-scrollcue' aria-hidden>
				<span className='le-hero-scrollcue-line' />
				Scroll
			</div>
		</section>
	);
}
