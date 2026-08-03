'use client';

import {
	motion,
	useScroll,
	useTransform,
	useReducedMotion,
} from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Eyebrow from '../ui/Eyebrow';
import Counter from '../ui/Counter';
import { heroStats } from '../data';
import { staggerContainer, staggerItem, EASE } from '../theme';
import '../styles/hero.css';

// Cinematic, asymmetric, editorial hero — an architecture-magazine cover
// rather than a centered SaaS hero block. Content anchors lower-left over a
// full-bleed photograph; a horizontal statistics strip closes the viewport.
export default function Hero() {
	const heroRef = useRef(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
	const plateScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);

	return (
		<section
			ref={heroRef}
			className='ge-hero'
			aria-label='Electric hamam and underfloor heating installed across Kashmir, India and worldwide'>
			<motion.div
				className='ge-hero-plate'
				style={
					prefersReducedMotion
						? undefined
						: { y: plateY, scale: plateScale }
				}>
				<Image
					src='/images/global.png'
					alt='Electric heating cable technology beneath a finished floor'
					className='ge-hero-plate-img'
					width={1536}
					height={1024}
					priority
					sizes='100vw'
					quality={78}
				/>
			</motion.div>
			<div className='ge-hero-scrim' aria-hidden='true' />
			<div className='ge-grain' style={{ opacity: 0.06, mixBlendMode: 'overlay' }} aria-hidden='true' />

			{/* corner framing marks — quiet technical/architectural detail */}
			<span className='ge-hero-corner ge-hero-corner-tl' aria-hidden='true' />
			<span className='ge-hero-corner ge-hero-corner-br' aria-hidden='true' />
			<div className='ge-hero-coord' aria-hidden='true'>
				34.0837&deg; N, 74.7973&deg; E &mdash; SRINAGAR
			</div>

			{/* mobile-only metadata — desktop Eyebrow/coord are hidden ≤640px and
			    replaced by this dedicated small-screen composition; the desktop
			    markup above is untouched */}
			<motion.div
				className='ge-hero-meta-m'
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15, duration: 0.8, ease: EASE }}>
				<span className='ge-hero-meta-m-tick' aria-hidden='true' />
				<span className='ge-hero-meta-m-label'>Global Experience</span>
				<span className='ge-hero-meta-m-route'>Kashmir &rarr; India &rarr; World</span>
			</motion.div>
			<motion.div
				className='ge-hero-coord-m'
				aria-hidden='true'
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.8, ease: EASE }}>
				<span>34.0837&deg; N</span>
				<span>74.7973&deg; E</span>
				<span className='ge-hero-coord-m-city'>Srinagar</span>
			</motion.div>

			<div className='ge-hero-inner'>
				<motion.div
					className='ge-hero-main'
					variants={staggerContainer}
					initial='hidden'
					animate='show'>
					<motion.div variants={staggerItem} className='ge-hero-eyebrow-wrap'>
						<Eyebrow>Global Experience / Kashmir &rarr; India &rarr; World</Eyebrow>
					</motion.div>
					<motion.h1 variants={staggerItem} className='ge-hero-title'>
						Electric Hamam &amp;
						<br />
						Underfloor Heating
						<span className='ge-hero-title-accent block'>
							in Kashmir &amp; Across India
						</span>
					</motion.h1>
					<motion.p variants={staggerItem} className='ge-hero-lede'>
						Our electric hamam systems are trusted in Kashmir homes, luxury
						villas, hotels, mosques, and commercial projects. With over
						500,000 installations across Kashmir and India since 2011, our
						teams deliver underfloor heating expertise built for -15&deg;C
						winters and power cut resilience.
					</motion.p>
				</motion.div>

				<motion.div
					className='ge-hero-bottom'
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.9, ease: EASE }}>
					<div className='ge-hero-stats'>
						{heroStats.map((s, i) => (
							<div className='ge-hero-stat' key={s.label}>
								{i > 0 && <span className='ge-hero-stat-divider' aria-hidden='true' />}
								<span className='ge-hero-stat-num'>
									<Counter display={s.value} />
								</span>
								<span className='ge-hero-stat-label'>{s.label}</span>
							</div>
						))}
					</div>

					<div className='ge-hero-scroll' aria-hidden='true'>
						<span className='ge-hero-scroll-label'>Scroll</span>
						<span className='ge-hero-scroll-line'>
							<motion.span
								className='ge-hero-scroll-tick'
								animate={
									prefersReducedMotion
										? undefined
										: { y: ['0%', '260%', '0%'] }
								}
								transition={{
									duration: 2.2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							/>
						</span>
					</div>

					{/* mobile-only scroll cue — sits in normal flow below the stats
					    rail so it can never overlap wrapped stat labels; desktop's
					    .ge-hero-scroll above is hidden below 640px */}
					<div className='ge-hero-scroll-m' aria-hidden='true'>
						<span className='ge-hero-scroll-m-num'>01</span>
						<span className='ge-hero-scroll-m-line'>
							<motion.span
								className='ge-hero-scroll-m-tick'
								animate={
									prefersReducedMotion
										? undefined
										: { x: ['-100%', '330%', '-100%'] }
								}
								transition={{
									duration: 2.2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							/>
						</span>
						<span className='ge-hero-scroll-m-label'>Scroll</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
