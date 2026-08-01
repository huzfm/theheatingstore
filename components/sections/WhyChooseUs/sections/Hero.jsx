'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Icon } from '../icons';
import { staggerContainer, staggerItem } from '../theme';
import { AVATARS } from '../data';
import { Badge } from '../ui/Badge';
import '../styles/hero.css';

// ─────────────────────────────────────────────────────────────────────────────
// HERO — full-bleed background-image hero, restyled with HomeHero's exact
// copper/ivory tokens (see Phase 0 research). Only this section departs from
// the page's amber/coral `C` system — the shared Badge/SectionHeading classes
// used everywhere else are untouched, which is why the hero renders its own
// markup here instead of going through SectionHeading.
// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
	const heroRef = useRef(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);

	const HEAT = '#ff8a3d';
const HEAT_DEEP = '#f2681c';

	return (
		<section
			ref={heroRef}
			className='whc-hero'
			aria-label='Why homeowners, architects and builders choose The Heating Store'>
			<motion.div className='whc-hero-plate' style={prefersReducedMotion ? undefined : { y: plateY }}>
				<img
					src='/images/f.png'
					alt='Luxury heated interior with warm timber flooring'
					className='whc-hero-plate-img'
				/>
			</motion.div>
			<div className='whc-hero-scrim' aria-hidden='true' />
			<div className='whc-hero-glow' aria-hidden='true' />
			<div className='whc-hero-grain' aria-hidden='true' />

			<div className='whc-hero-inner'>
				<motion.div variants={staggerContainer} initial='hidden' animate='show'>
					<motion.div variants={staggerItem}>
						<Badge variant='hero'>Why Choose Us</Badge>
					</motion.div>
					<motion.h1 variants={staggerItem} className='whc-hero-title'>
    Why Homeowners, Architects
    <span
        className='whc-hero-accent block'
        style={{
            background: `linear-gradient(100deg, ${HEAT}, ${HEAT_DEEP})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }}
    >
        &amp; Builders Choose The Heating Store
    </span>
</motion.h1>
					<motion.p variants={staggerItem} className='whc-hero-lede'>
						Awarded Jammu &amp; Kashmir's most trusted underfloor heating provider for five consecutive
						years. 500,000+ successful installations, 99% client satisfaction rate, and an
						industry-leading lifetime warranty on every system we install.
					</motion.p>

					<motion.div variants={staggerItem} className='whc-hero-proof'>
						<div className='whc-avatars'>
							{AVATARS.map((src, i) => (
								<div key={i} className='whc-avatar' style={{ marginLeft: i === 0 ? 0 : -10 }}>
									<img src={src} alt='Satisfied customer' />
								</div>
							))}
							<div className='whc-avatar whc-avatar-more'>+</div>
						</div>
						<div>
							<div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
								{[1, 2, 3, 4, 5].map((n) => (
									<Icon.Star key={n} />
								))}
							</div>
							<p className='whc-hero-proof-text'>
								<strong>300,000+ customers</strong> trust us across India &amp; beyond
							</p>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
