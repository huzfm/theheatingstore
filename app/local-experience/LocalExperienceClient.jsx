'use client';

import { motion, AnimatePresence, useInView, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE, identical to WhyChooseUsClient's `C` object so this page reads as
// a continuation of the same dark design system.
// ─────────────────────────────────────────────────────────────────────────────

const C = {
	amber: '#E8933A',
	amberLt: '#F5B97A',
	coral: '#FF7E5F',
	text: '#FBF3EA',
	soft: 'rgba(251,243,234,0.60)',
	mute: 'rgba(251,243,234,0.40)',
	line: 'rgba(255,255,255,0.09)',
	glass: 'rgba(255,255,255,0.045)',
	glassBorder: 'rgba(255,255,255,0.10)',
};

const EASE = [0.16, 1, 0.3, 1];

// Small floating proof-points for the hero glass rail. Every value here is
// lifted verbatim from facts already stated in the `faqs` copy below (cold
// rating, retention window, warranty length, replacement SLA), not new
// marketing claims, just resurfaced as scannable chips.
const heroStats = [
	{ value: '−20°C', label: 'Cold-climate rated' },
	{ value: '4–6 hrs', label: 'Heat retention post power-cut' },
	{ value: '25+ yrs', label: 'Product warranty' },
];

// Cursor-magnet interaction: an element eases toward the pointer within a
// capped radius and settles back on release, the same "object with mass"
// physics already established for the site's CTA links, reimplemented here
// with framer-motion springs (already a dependency of this file) rather
// than pulling gsap into a component that doesn't otherwise use it.
function useMagnetic({ strength = 0.35, max = 16, disabled = false } = {}) {
	const ref = useRef(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
	const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

	const onMouseMove = (e) => {
		if (disabled || !ref.current) return;
		const r = ref.current.getBoundingClientRect();
		const dx = e.clientX - (r.left + r.width / 2);
		const dy = e.clientY - (r.top + r.height / 2);
		x.set(Math.max(-max, Math.min(max, dx * strength)));
		y.set(Math.max(-max, Math.min(max, dy * strength)));
	};
	const onMouseLeave = () => {
		x.set(0);
		y.set(0);
	};

	return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave };
}

// Cursor-tilt interaction for cards: a light 3D rotation toward the pointer,
// capped low so it reads as a subtle physical response rather than a gimmick.
function useTilt({ max = 6, disabled = false } = {}) {
	const ref = useRef(null);
	const rotateX = useMotionValue(0);
	const rotateY = useMotionValue(0);
	const springX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
	const springY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });

	const onMouseMove = (e) => {
		if (disabled || !ref.current) return;
		const r = ref.current.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width - 0.5;
		const py = (e.clientY - r.top) / r.height - 0.5;
		rotateY.set(px * max * 2);
		rotateX.set(py * -max * 2);
	};
	const onMouseLeave = () => {
		rotateX.set(0);
		rotateY.set(0);
	};

	return {
		ref,
		style: { rotateX: springX, rotateY: springY, transformPerspective: 800 },
		onMouseMove,
		onMouseLeave,
	};
}

/**
 * Three.js is lazy: the canvas only enters the bundle once a visitor is near
 * the hero, so it costs nothing elsewhere on the page. ssr:false because
 * WebGL has no server render.
 */
const HeroScene3D = dynamic(() => import('./HeroScene3D'), {
	ssr: false,
	loading: () => null,
});

// ─────────────────────────────────────────────────────────────────────────────
// DATA (content preserved verbatim, only the `origin` field is new — see
// Step 0 bug fix: brand.origin was rendered but never populated)
// ─────────────────────────────────────────────────────────────────────────────

const brands = [
	{
		name: 'ProWarm',
		origin: 'UK',
		desc: "UK's #1 best-selling electric underfloor heating brand with over 300,000 systems sold worldwide. CE certified by SGS to IEC 60335 standards. Every system ships with a Lifetime Warranty and the CableSafe™ Guarantee, if the heating cable is accidentally cut during installation, ProWarm replaces it free of charge.",
	},
	{
		name: 'Warmup',
		origin: 'UK',
		desc: "The world's best-selling floor heating brand since 1994, with over 2.5 million systems installed across 72 countries. ISO 9001:2015 certified and accredited by BEAB, UL, CSA, FIMKO and SEMKO. Winner of the Queen's Award for Enterprise 2020. Every system backed by a Limited Lifetime Warranty and the SafetyNet™ Installation Guarantee.",
	},
	{
		name: 'ThermoSphere',
		origin: 'UK',
		desc: "Designed and manufactured in Great Britain with over 25 years of heating innovation. Features the exclusive TwistedTwin™ cable technology, a twisted dual-conductor construction that eliminates electromagnetic fields, minimises cable stress, and delivers industry-leading longevity. IP68 rated, fully earthed, and backed by a Lifetime Guarantee on every system.",
	},
	{
		name: 'AmberHeat',
		origin: 'India',
		desc: 'Premium CE certified radiant heating systems engineered for extreme cold climates. AmberHeat systems are specified for Kashmir and high-altitude installations where sustained heat retention during power interruptions is critical. Enhanced thermal mass design delivers 4 to 6 hours of residual warmth after power cut, built for Kashmir winters.',
	},
	{
		name: 'FastWarm',
		origin: 'UK / India',
		desc: 'Complete all-in-one heating kits approved to IEC and CE standards, designed for rapid residential and commercial installation. Every kit is supplied in a single box with full-colour instructions and backed by a 25 to 50-year pipe guarantee. Rapid WhatsApp technical support ensures on-site queries are resolved without installation delays.',
	},
	{
		name: 'nVent',
		origin: 'USA',
		desc: "The global leader in electric heat tracing and radiant floor heating, operating across 60+ countries for over 50 years. nVent RAYCHEM pioneered self-regulating heating cable technology and remains the benchmark for industrial-grade residential heating. Systems are IEC certified and backed by a 20-year Total Care Warranty when installed by a Certified PRO installer.",
	},
];

const serviceNetwork = [
	{
		region: 'Jammu & Kashmir',
		places: ['Srinagar', 'Anantnag', 'Kupwara', 'Baramulla', 'Pulwama', 'Budgam', 'Sopore'],
	},
	{
		region: 'North India',
		places: ['Delhi', 'Shimla', 'Manali'],
	},
	{
		region: 'West India',
		places: ['Mumbai', 'Ahmedabad', 'Surat'],
	},
	{
		region: 'Central India',
		places: ['Bhopal', 'Indore'],
	},
	{
		region: 'East India',
		places: ['Kolkata', 'Darjeeling'],
	},
];

const faqs = [
	{
		category: 'Performance',
		q: 'Does electric hamam work in Kashmir winters (-15°C)?',
		a: "Absolutely. Our systems are rated to operate in sub-zero conditions down to -20°C. The layered concrete thermal mass method stores heat for 4–6 hours post power cut, critical for Kashmir's load-shedding schedule. Every installation is cold-climate certified.",
	},
	{
		category: 'Performance',
		q: 'How long does the floor take to heat up?',
		a: 'Typically 30–45 minutes from cold start. With our smart thermostats set on a schedule, the floor is warm before you wake up. Thermal retention means it stays warm long after the system switches off.',
	},
	{
		category: 'Installation',
		q: 'Can it be installed in an existing home without major renovation?',
		a: 'Yes. Our ultra-thin heating mats add only 3–4mm to floor height, no screed pour required in most retrofit cases. We handle everything from survey to commissioning. Zero structural disruption.',
	},
	{
		category: 'Installation',
		q: 'Which floor types are compatible?',
		a: 'All of them, marble, granite, ceramic tile, natural stone, and engineered wood. We have installed across every floor type common to Kashmiri residential and commercial construction.',
	},
	{
		category: 'Cost & Running',
		q: 'What does it cost to run monthly?',
		a: "A typical Kashmir bathroom (50–80 sq ft) costs INR 1000–1500 per month at standard J&K tariff rates. Our smart thermostats cut consumption by 30–40% by learning your usage pattern and Kashmir's power schedules automatically.",
	},
	{
		category: 'Warranty & Support',
		q: 'What warranty do I get?',
		a: 'Every system carries a 10 to 25+ year product warranty, the longest in the industry. Parts and labour are fully covered. No excess, no exclusions for normal use. Fully transferable if you sell the property.',
	},
	{
		category: 'Warranty & Support',
		q: 'What happens if something goes wrong?',
		a: 'We guarantee replacement within 24 hours anywhere in India. Our 0.01% fault rate across 2 million+ global installations means this almost never happens, but when it does, we respond the same day.',
	},
	{
		category: 'Warranty & Support',
		q: 'Do you service systems installed years ago?',
		a: 'Yes. We support every system we have ever installed. Our Srinagar team handles ongoing servicing, thermostat upgrades, and zone expansions for existing customers at preferential rates.',
	},
];

// Derived from `faqs.category`, not hand-maintained, so the tab list can
// never drift out of sync with the data it filters.
const faqCategories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))];

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLES
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ children }) {
	return (
		<div className='uhi-badge'>
			<span className='uhi-badge-dot' />
			{children}
		</div>
	);
}

function BrandCard({ brand, colIndex, delay, tiltDisabled }) {
	const tilt = useTilt({ max: 5, disabled: tiltDisabled });
	return (
		<motion.div
			ref={tilt.ref}
			variants={brandCardVariants(colIndex)}
			initial='hidden'
			whileInView='show'
			viewport={{ once: true, amount: 0.2 }}
			transition={{ delay }}
			whileHover={{ y: -8 }}
			onMouseMove={tilt.onMouseMove}
			onMouseLeave={tilt.onMouseLeave}
			style={tilt.style}
			className='uhi-card uhi-brand-card'>
			<span className='uhi-brand-mark' aria-hidden='true'>{brand.name.charAt(0)}</span>
			<h3 className='uhi-brand-name'>{brand.name}</h3>
			<span className='uhi-brand-origin'>{brand.origin}</span>
			<p className='uhi-brand-desc'>{brand.desc}</p>
		</motion.div>
	);
}

// Magnetic wrapper for the site's Link CTAs: forwards the magnet transform
// onto a motion.div shell so Link itself stays a plain, fully-crawlable
// anchor underneath, no motion(Link) ref-forwarding surprises.
function MagneticCTA({ href, className, children, disabled }) {
	const magnet = useMagnetic({ disabled });
	return (
		<motion.div
			ref={magnet.ref}
			onMouseMove={magnet.onMouseMove}
			onMouseLeave={magnet.onMouseLeave}
			style={{ ...magnet.style, display: 'inline-block' }}>
			<Link href={href} className={className}>
				{children}
			</Link>
		</motion.div>
	);
}

// Column-alternating stagger: even columns rise from further below than odd
// ones, so the grid arrives with intention rather than as a uniform block.
function brandCardVariants(colIndex) {
	const y = colIndex % 2 === 0 ? 46 : 30;
	return {
		hidden: { opacity: 0, y, scale: 0.95, filter: 'blur(5px)' },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			filter: 'blur(0px)',
			transition: { duration: 0.8, ease: EASE },
		},
	};
}

const placeVariants = {
	hidden: { opacity: 0, y: 8, scale: 0.9 },
	show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } },
};

function PremiumFaqItem({ q, a, index }) {
	const [open, setOpen] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 24, scale: 0.97 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ delay: index * 0.08, duration: 0.7, ease: EASE }}
			className={`uhi-card uhi-faq group ${open ? 'is-open' : ''}`}>
			<button onClick={() => setOpen(!open)} className='flex justify-between w-full text-left items-center gap-4 px-7 py-5'>
				<div className='flex items-center gap-4'>
					<motion.span
						initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
						whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ delay: index * 0.08 + 0.1, duration: 0.5, ease: EASE }}
						className='uhi-faq-index'>
						{index + 1}
					</motion.span>
					<span className='uhi-faq-q'>{q}</span>
				</div>
				<span className={`uhi-faq-toggle ${open ? 'is-open' : ''}`}>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke={open ? '#fff' : C.amberLt} strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
				</span>
			</button>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1, transition: { height: { type: 'spring', stiffness: 210, damping: 26, mass: 0.9 }, opacity: { duration: 0.35, delay: 0.05 } } }}
						exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.28, ease: EASE }, opacity: { duration: 0.15 } } }}
						className='overflow-hidden'>
						<motion.div
							initial={{ y: -8, filter: 'blur(4px)' }}
							animate={{ y: 0, filter: 'blur(0px)', transition: { duration: 0.4, delay: 0.08, ease: EASE } }}
							exit={{ y: -6, filter: 'blur(3px)', transition: { duration: 0.15 } }}
							className='px-7 pb-6 pt-1 flex gap-4'>
							<div className='w-7 flex-shrink-0' />
							<p className='uhi-faq-a'>{a}</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

const heroContainer = {
	hidden: {},
	show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const heroItem = {
	hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
	show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE } },
};

export default function UnderfloorHeatingIndiaClient() {
	const heroRef = useRef(null);
	const heroIn = useInView(heroRef, { once: true });
	const reduced = useReducedMotion();

	const [isDesktop, setIsDesktop] = useState(false);
	const [nearby, setNearby] = useState(false);
	const [activeFaqCategory, setActiveFaqCategory] = useState('All');
	const visibleFaqs = activeFaqCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeFaqCategory);

	useEffect(() => {
		const mq = window.matchMedia('(min-width: 1024px)');
		const sync = () => setIsDesktop(mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	}, []);

	// Mount the WebGL canvas only while the hero is near the viewport, and only
	// on desktop, matching the discipline in WhyElectricHamam.jsx.
	useEffect(() => {
		const el = heroRef.current;
		if (!el || reduced || !isDesktop) return undefined;
		const io = new IntersectionObserver(([entry]) => setNearby(entry.isIntersecting), { rootMargin: '400px 0px' });
		io.observe(el);
		return () => io.disconnect();
	}, [reduced, isDesktop]);

	const show3D = isDesktop && nearby && !reduced;
	const pointerFxDisabled = !isDesktop || reduced;

	// Aura orbs drift toward the cursor on a soft rAF lag, each at a
	// different depth so the parallax reads as layered rather than flat.
	// Writes transform directly to the DOM nodes (no React state) so this
	// never competes with the scroll-triggered framer-motion animations
	// above it, same discipline as the presence layer in WhyElectricHamam.jsx.
	const orb1Ref = useRef(null);
	const orb2Ref = useRef(null);
	const orb3Ref = useRef(null);
	useEffect(() => {
		if (reduced || !isDesktop) return undefined;
		let raf = 0;
		let targetX = 0;
		let targetY = 0;
		let curX = 0;
		let curY = 0;

		const apply = () => {
			curX += (targetX - curX) * 0.05;
			curY += (targetY - curY) * 0.05;
			if (orb1Ref.current) orb1Ref.current.style.transform = `translate3d(${curX * 0.4}px, ${curY * 0.4}px, 0)`;
			if (orb2Ref.current) orb2Ref.current.style.transform = `translate3d(${curX * -0.3}px, ${curY * -0.3}px, 0)`;
			if (orb3Ref.current) orb3Ref.current.style.transform = `translate3d(${curX * 0.55}px, ${curY * -0.4}px, 0)`;
			raf = requestAnimationFrame(apply);
		};
		const onMove = (e) => {
			targetX = e.clientX - window.innerWidth / 2;
			targetY = e.clientY - window.innerHeight / 2;
		};

		window.addEventListener('pointermove', onMove, { passive: true });
		raf = requestAnimationFrame(apply);
		return () => {
			window.removeEventListener('pointermove', onMove);
			cancelAnimationFrame(raf);
		};
	}, [reduced, isDesktop]);

	return (
		<>
			<style>{CSS}</style>

			<main className='uhi-root w-full overflow-hidden'>
				<div aria-hidden className='uhi-aura'>
					<div ref={orb1Ref} className='uhi-orb-slot uhi-orb-slot-1'>
						<span className='uhi-orb uhi-orb-1' />
					</div>
					<div ref={orb2Ref} className='uhi-orb-slot uhi-orb-slot-2'>
						<span className='uhi-orb uhi-orb-2' />
					</div>
					<div ref={orb3Ref} className='uhi-orb-slot uhi-orb-slot-3'>
						<span className='uhi-orb uhi-orb-3' />
					</div>
				</div>
				<div aria-hidden className='uhi-vignette' />

				<div className='relative z-[2] max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-32'>
					{/* HERO */}
					<section ref={heroRef}>
						<div className='grid lg:grid-cols-2 gap-14 items-center'>
							<motion.div variants={heroContainer} initial='hidden' animate={heroIn ? 'show' : 'hidden'} style={{ position: 'relative' }}>
								{show3D && (
									<div aria-hidden className='uhi-hero-3d'>
										<HeroScene3D />
									</div>
								)}

								<motion.div variants={heroItem}>
									<Badge>Kashmir #1 Seller · Since 2011</Badge>
								</motion.div>

								<motion.h1 variants={heroItem} className='uhi-h uhi-h--hero mb-0'>
									Electric Hamam &amp; Underfloor Heating
									<span className='uhi-h-accent font-light'> in Kashmir &amp; Across India</span>
								</motion.h1>

								<motion.p variants={heroItem} className='uhi-sub mt-6 max-w-lg'>
									Electric hamam systems engineered for Kashmir winters silent radiant warmth rising from beneath your floor. No radiators. No cold spots. Built to retain heat for hours during power cuts.
								</motion.p>

								<motion.div variants={heroItem} className='flex gap-3 mt-8'>
									<MagneticCTA href='/SpaceVerification' className='uhi-btn-primary' disabled={pointerFxDisabled}>
										Verify My Space
									</MagneticCTA>
									<MagneticCTA href='/contact' className='uhi-btn-ghost' disabled={pointerFxDisabled}>
										Talk to Expert
									</MagneticCTA>
								</motion.div>
							</motion.div>

							<div style={{ perspective: 1200 }}>
								<motion.div
									initial={{ opacity: 0, y: 60, rotateX: 8, scale: 0.94 }}
									animate={heroIn ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
									transition={{ duration: 1, ease: EASE }}
									style={{ transformStyle: 'preserve-3d' }}
									className='relative h-[480px]'>
									<img src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c' alt='Luxury home' className='object-cover rounded-3xl w-full h-full uhi-hero-img' />
									<div aria-hidden className='uhi-hero-shine' />

									<motion.div
										initial={{ opacity: 0, y: 16, scale: 0.92 }}
										animate={heroIn ? { opacity: 1, y: 0, scale: 1 } : {}}
										transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
										className='uhi-stat-rail'>
										{heroStats.map((stat) => (
											<div key={stat.label} className='uhi-stat-chip'>
												<span className='uhi-stat-value'>{stat.value}</span>
												<span className='uhi-stat-label'>{stat.label}</span>
											</div>
										))}
									</motion.div>
								</motion.div>
							</div>
						</div>
					</section>

					{/* BRANDS */}
					<section>
						<motion.h2
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}
							className='uhi-h text-4xl text-center mb-10'>
							Premium Heating Brands
						</motion.h2>

						<div className='grid md:grid-cols-3 gap-8 mt-12'>
							{brands.map((brand, i) => (
								<BrandCard key={brand.name} brand={brand} colIndex={i % 3} delay={(i % 3) * 0.08} tiltDisabled={pointerFxDisabled} />
							))}
						</div>
					</section>

					{/* SERVICE NETWORK */}
					<section>
						<motion.h2
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}
							className='uhi-h text-4xl text-center mb-12'>
							Our Service Network
						</motion.h2>

						<div className='grid lg:grid-cols-2 gap-14 items-center'>
							<div className='relative sm:h-[660px] rounded-3xl overflow-hidden uhi-map-frame'>
								<img
									src='https://images.unsplash.com/photo-1733094151451-4222a842cfd1?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
									alt='India service network map'
									className='object-cover w-full h-full uhi-map-img'
								/>
								<div className='uhi-map-veil' />

								{/* Decorative live-network overlay: ambient pulse nodes and traced
								    connection lines, not literal geographic pins. */}
								<svg aria-hidden viewBox='0 0 100 100' preserveAspectRatio='none' className='uhi-map-svg'>
									<g className='uhi-map-routes'>
										<path d='M22 30 Q 40 20 52 42 T 76 58' />
										<path d='M52 42 Q 60 68 34 78' />
									</g>
									{[
										[22, 30],
										[52, 42],
										[76, 58],
										[34, 78],
									].map(([cx, cy], i) => (
										<g key={`${cx}-${cy}`} className='uhi-map-node' style={{ animationDelay: `${i * 0.6}s` }}>
											<circle cx={cx} cy={cy} r='2.6' className='uhi-map-node-ring' />
											<circle cx={cx} cy={cy} r='1' className='uhi-map-node-core' />
										</g>
									))}
								</svg>
							</div>

							<div className='space-y-6 mt-22'>
								{serviceNetwork.map((region, i) => (
									<motion.div
										key={region.region}
										initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
										whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
										viewport={{ once: true, amount: 0.3 }}
										transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
										className='uhi-card uhi-region'>
										<div className='uhi-region-head'>
											<span className='uhi-region-index'>{String(i + 1).padStart(2, '0')}</span>
											<h3 className='uhi-region-title'>{region.region}</h3>
										</div>

										<motion.div
											initial='hidden'
											whileInView='show'
											viewport={{ once: true, amount: 0.3 }}
											transition={{ staggerChildren: 0.03, delayChildren: i * 0.1 + 0.15 }}
											className='flex flex-wrap gap-2'>
											{region.places.map((place) => (
												<motion.span key={place} variants={placeVariants} className='uhi-chip'>
													{place}
												</motion.span>
											))}
										</motion.div>
									</motion.div>
								))}
							</div>
						</div>
					</section>

					{/* FAQ */}
					<section className='relative'>
						<div className='text-center mb-16'>
							<Badge>Common Questions</Badge>
							<h2 className='uhi-h text-4xl lg:text-5xl leading-tight'>
								Everything You Need
								<span className='uhi-h-accent font-light block'>To Know</span>
							</h2>
							<p className='uhi-sub mt-4 max-w-md mx-auto'>Straight answers about electric hamam and underfloor heating for Kashmir homes.</p>
						</div>

						<div className='flex flex-wrap justify-center gap-2 mb-10'>
							{faqCategories.map((cat) => (
								<button
									key={cat}
									type='button'
									onClick={() => setActiveFaqCategory(cat)}
									aria-pressed={activeFaqCategory === cat}
									className={`uhi-faq-tab ${activeFaqCategory === cat ? 'is-active' : ''}`}>
									{cat}
								</button>
							))}
						</div>

						<div className='max-w-3xl mx-auto space-y-3'>
							{visibleFaqs.map((f, i) => (
								<PremiumFaqItem key={f.q} q={f.q} a={f.a} index={i} />
							))}
						</div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.7, ease: EASE }}
							className='uhi-faq-closing mt-14'>
							<p className='uhi-sub text-sm mb-5'>Still have questions?</p>
							<MagneticCTA href='/contact' className='uhi-btn-primary inline-flex items-center gap-2' disabled={pointerFxDisabled}>
								Talk to Our Expert
								<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14M12 5l7 7-7 7' />
								</svg>
							</MagneticCTA>
						</motion.div>
					</section>
				</div>
			</main>
		</>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
.uhi-root {
	position: relative;
	isolation: isolate;
	color: ${C.text};
	background:
		radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),
		linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%);
}
.uhi-root::before {
	content:''; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.04;
	background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.uhi-aura { position:absolute; inset:-10%; z-index:0; pointer-events:none; filter: blur(14px); }
/* slot = parallax target (JS-driven transform, no CSS animation on it);
   orb = the actual gradient + its own independent drift keyframes. Splitting
   the two onto separate nodes means the pointer-follow transform and the
   ambient drift transform never fight over the same element's property. */
.uhi-orb-slot { position:absolute; }
.uhi-orb-slot-1 { top:-8%; left:6%; width:46vw; height:46vw; max-width:720px; max-height:720px; }
.uhi-orb-slot-2 { top:8%; right:0%; width:40vw; height:40vw; max-width:620px; max-height:620px; }
.uhi-orb-slot-3 { top:44%; left:36%; width:38vw; height:38vw; max-width:560px; max-height:560px; }
.uhi-orb { position:absolute; inset:0; border-radius:50%; }
.uhi-orb-1 { background: radial-gradient(circle, rgba(232,147,58,0.28), transparent 62%); animation: uhi-drift 24s ease-in-out infinite; }
.uhi-orb-2 { background: radial-gradient(circle, rgba(255,126,95,0.18), transparent 62%); animation: uhi-drift2 30s ease-in-out infinite; }
.uhi-orb-3 { background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: uhi-drift 34s ease-in-out infinite reverse; }
.uhi-vignette { position:absolute; inset:0; z-index:0; pointer-events:none; background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%); }

@keyframes uhi-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
@keyframes uhi-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }
@keyframes uhi-pulse { 0%{box-shadow:0 0 0 0 rgba(255,126,95,0.55)} 70%{box-shadow:0 0 0 8px rgba(255,126,95,0)} 100%{box-shadow:0 0 0 0 rgba(255,126,95,0)} }

/* badge, pulse-ring dot treatment aligned with HomeHero's .hhero__eyebrow-dot */
.uhi-badge {
	display:inline-flex; align-items:center; gap:9px; margin-bottom:20px;
	padding:8px 22px; border-radius:999px;
	font-family:var(--font-body); font-size:10px; font-weight:600;
	text-transform:uppercase; letter-spacing:0.14em; color:${C.amberLt};
	background: rgba(232,147,58,0.08);
	border:1px solid rgba(232,147,58,0.22);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4);
	backdrop-filter: blur(12px);
}
.uhi-badge-dot { width:6px; height:6px; border-radius:50%; background:${C.coral}; flex-shrink:0; animation: uhi-pulse 2.4s ease-out infinite; }

/* headings */
.uhi-h {
	font-family:var(--font-heading);
	font-weight:600; line-height:1.06; letter-spacing:-0.01em;
	color:${C.text}; margin:0;
	text-shadow:0 2px 40px rgba(0,0,0,0.4);
}
/* hero title only, uppercase/fluid-scale/tight-leading treatment aligned with HomeHero's .hhero__title */
.uhi-h--hero {
	text-transform:uppercase;
	line-height:0.98;
	font-size:clamp(2.25rem, 5vw, 4.25rem);
}
.uhi-h-accent {
	font-weight:300;
	background:linear-gradient(100deg,${C.amber},${C.amberLt} 45%,${C.coral} 100%);
	-webkit-background-clip:text; background-clip:text;
	-webkit-text-fill-color:transparent; color:transparent;
}
.uhi-sub { font-family:var(--font-body); font-size:16px; line-height:1.75; color:${C.soft}; font-weight:400; }

/* glass card base, identical recipe to WhyChooseUsClient's .whc-card */
.uhi-card {
	position:relative;
	background:
		linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
		rgba(20,13,8,0.5);
	backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
	border:1px solid ${C.glassBorder};
	border-radius:24px;
	box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
}
.uhi-card::after {
	content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
	opacity:0; transition:opacity .5s ease;
	background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
	-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite:xor; mask-composite:exclude;
}

/* hero */
.uhi-hero-3d { position:absolute; inset:-15% -10%; z-index:0; pointer-events:none; opacity:0.55; -webkit-mask-image:radial-gradient(60% 60% at 50% 45%, #000 40%, transparent 75%); mask-image:radial-gradient(60% 60% at 50% 45%, #000 40%, transparent 75%); }
.uhi-hero-img { box-shadow:0 50px 130px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06); }
.uhi-hero-shine { position:absolute; inset:0; border-radius:inherit; pointer-events:none; background:linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.16) 45%, transparent 60%); background-size:220% 220%; animation: uhi-hero-shine-sweep 7s ease-in-out infinite; }
@keyframes uhi-hero-shine-sweep { 0%{background-position:120% 0%} 50%{background-position:-20% 100%} 100%{background-position:120% 0%} }

.uhi-stat-rail { position:absolute; left:20px; right:20px; bottom:20px; display:flex; gap:10px; flex-wrap:wrap; z-index:2; }
.uhi-stat-chip {
	flex:1 1 auto; min-width:104px;
	padding:12px 14px; border-radius:16px;
	background: linear-gradient(180deg, rgba(20,13,8,0.55), rgba(20,13,8,0.75));
	backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
	border:1px solid rgba(255,255,255,0.14);
	box-shadow: 0 14px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
	display:flex; flex-direction:column; gap:2px;
}
.uhi-stat-value { font-family:var(--font-heading); font-size:17px; font-weight:600; color:${C.text}; line-height:1.1; }
.uhi-stat-label { font-family:var(--font-body); font-size:10px; color:${C.soft}; letter-spacing:0.02em; line-height:1.3; }

/* buttons */
.uhi-btn-primary { position:relative; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:14px 32px; font-family:var(--font-body); font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:#fff; background:linear-gradient(to right,#FF7E5F,#FFB88C); box-shadow:0 22px 60px rgba(255,126,95,0.4); text-decoration:none; white-space:nowrap; transition:transform .35s cubic-bezier(0.16,1,0.3,1), box-shadow .35s ease; }
.uhi-btn-primary::before, .uhi-btn-ghost::before {
	content:''; position:absolute; inset:0; pointer-events:none;
	background:linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%);
	background-size:220% 220%; background-position:150% 0%;
	transition: background-position .7s cubic-bezier(0.16,1,0.3,1);
}
.uhi-btn-primary:hover::before, .uhi-btn-ghost:hover::before { background-position:-50% 100%; }
.uhi-btn-primary:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 28px 80px rgba(255,126,95,0.5); }
.uhi-btn-ghost { position:relative; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:13px 32px; font-family:var(--font-body); font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:${C.text}; text-decoration:none; white-space:nowrap; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(20,13,8,0.5); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); border:1px solid ${C.glassBorder}; transition:background .25s ease, border-color .25s ease, transform .25s ease; }
.uhi-btn-ghost:hover { background: rgba(232,147,58,0.12); border-color: rgba(232,147,58,0.4); transform:translateY(-2px); }

/* brand cards */
.uhi-brand-card { padding:32px; transition:box-shadow .5s ease; will-change: transform; }
.uhi-brand-card:hover { box-shadow:0 40px 90px rgba(0,0,0,0.5), 0 0 40px -8px rgba(232,147,58,0.4); }
.uhi-brand-card:hover::after { opacity:1; }
.uhi-brand-mark {
	display:flex; align-items:center; justify-content:center;
	width:48px; height:48px; border-radius:50%; margin-bottom:18px;
	font-family:var(--font-heading); font-size:19px; font-weight:600; color:#fff;
	background:linear-gradient(135deg,${C.amber},${C.coral});
	box-shadow:0 10px 26px -8px rgba(255,126,95,0.55), inset 0 1px 0 rgba(255,255,255,0.25);
}
.uhi-brand-name { font-family:var(--font-heading); font-size:24px; font-weight:600; color:${C.text}; margin:0; }
.uhi-brand-origin {
	display:inline-flex; align-items:center; margin-top:10px;
	padding:4px 12px; border-radius:999px;
	font-family:var(--font-body); font-size:10px; font-weight:600; letter-spacing:0.1em;
	text-transform:uppercase; color:${C.amberLt};
	background:rgba(232,147,58,0.1); border:1px solid rgba(232,147,58,0.22);
}
.uhi-brand-desc { font-family:var(--font-body); font-size:13px; color:${C.soft}; margin-top:16px; line-height:1.7; }

/* service network */
.uhi-map-frame { transition: transform .6s cubic-bezier(0.16,1,0.3,1); }
.uhi-map-img { transition: transform 1.2s cubic-bezier(0.16,1,0.3,1); }
.uhi-map-frame:hover .uhi-map-img { transform: scale(1.05); }
.uhi-map-veil { position:absolute; inset:0; background:linear-gradient(165deg, transparent 40%, rgba(10,6,3,0.7) 100%); pointer-events:none; }
.uhi-map-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.uhi-map-routes path { fill:none; stroke:${C.amberLt}; stroke-width:0.35; stroke-linecap:round; opacity:0.55; stroke-dasharray:3 2.5; animation: uhi-map-dash 5s linear infinite; vector-effect:non-scaling-stroke; }
@keyframes uhi-map-dash { to { stroke-dashoffset:-55; } }
.uhi-map-node-ring { fill:none; stroke:${C.coral}; stroke-width:0.5; opacity:0.7; animation: uhi-map-pulse 2.4s ease-out infinite; transform-origin:center; transform-box:fill-box; }
.uhi-map-node-core { fill:${C.amberLt}; filter: drop-shadow(0 0 3px rgba(232,147,58,0.9)); }
@keyframes uhi-map-pulse { 0%{ transform:scale(0.4); opacity:0.9; } 100%{ transform:scale(2.6); opacity:0; } }
.uhi-region { padding:28px; }
.uhi-region-head { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.uhi-region-index {
	flex-shrink:0; width:34px; height:34px; border-radius:50%;
	display:flex; align-items:center; justify-content:center;
	font-family:var(--font-body); font-size:11px; font-weight:700;
	color:${C.amberLt}; background:rgba(232,147,58,0.12); border:1px solid rgba(232,147,58,0.22);
}
.uhi-region-title { font-family:var(--font-body); font-size:16px; font-weight:600; color:${C.text}; margin:0; letter-spacing:0.01em; }
.uhi-chip { display:inline-flex; align-items:center; padding:7px 15px; border-radius:999px; font-family:var(--font-body); font-size:12px; font-weight:500; color:${C.amberLt}; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); box-shadow:0 6px 16px -8px rgba(0,0,0,0.5); transition:transform .28s cubic-bezier(0.16,1,0.3,1), background .28s, border-color .28s, box-shadow .28s; }
.uhi-chip:hover { transform:translateY(-2px) scale(1.03); background:rgba(232,147,58,0.14); border-color:rgba(232,147,58,0.4); box-shadow:0 10px 22px -8px rgba(232,147,58,0.35); }

/* faq */
.uhi-faq { overflow:hidden; transition:box-shadow .3s ease, border-color .3s ease; }
.uhi-faq.is-open { border-color:rgba(232,147,58,0.35); box-shadow:0 24px 60px rgba(232,147,58,0.12), inset 0 1px 0 rgba(255,255,255,0.06); }
.uhi-faq:hover::after { opacity:1; }
.uhi-faq-index { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-body); font-size:12px; font-weight:700; background:rgba(232,147,58,0.12); color:${C.amberLt}; transition:background .3s ease, color .3s ease; }
.uhi-faq.is-open .uhi-faq-index { background:linear-gradient(135deg,${C.amber},${C.coral}); color:#fff; }
.uhi-faq-q { font-family:var(--font-body); font-weight:600; color:${C.text}; font-size:15px; line-height:1.4; }
.uhi-faq-a { font-family:var(--font-body); color:${C.soft}; font-size:13.5px; line-height:1.7; }
.uhi-faq-toggle { flex-shrink:0; width:32px; height:32px; border-radius:50%; border:1px solid rgba(232,147,58,0.25); display:flex; align-items:center; justify-content:center; transition:all .3s ease; }
.uhi-faq-toggle.is-open { background:linear-gradient(135deg,${C.amber},${C.coral}); border-color:transparent; transform:rotate(45deg); }

.uhi-faq-tab {
	padding:9px 20px; border-radius:999px;
	font-family:var(--font-body); font-size:12px; font-weight:600; letter-spacing:0.04em;
	color:${C.soft}; background:rgba(255,255,255,0.04); border:1px solid ${C.glassBorder};
	transition:color .25s ease, background .25s ease, border-color .25s ease, transform .25s ease;
	cursor:pointer;
}
.uhi-faq-tab:hover { color:${C.text}; border-color:rgba(232,147,58,0.35); transform:translateY(-1px); }
.uhi-faq-tab.is-active { color:#fff; background:linear-gradient(135deg,${C.amber},${C.coral}); border-color:transparent; box-shadow:0 12px 30px -10px rgba(255,126,95,0.55); }

.uhi-faq-closing {
	max-width:560px; margin-left:auto; margin-right:auto; text-align:center;
	padding:36px 32px; border-radius:24px;
	background:linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), rgba(20,13,8,0.4);
	border:1px solid ${C.glassBorder};
}

@media (prefers-reduced-motion: reduce) {
	.uhi-orb, .uhi-badge-dot, .uhi-hero-shine, .uhi-map-routes path, .uhi-map-node-ring { animation:none !important; }
	.uhi-hero-shine { display:none; }
}
`;
