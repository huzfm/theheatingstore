'use client';

import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
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
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: EASE }}
						className='overflow-hidden'>
						<div className='px-7 pb-6 pt-1 flex gap-4'>
							<div className='w-7 flex-shrink-0' />
							<p className='uhi-faq-a'>{a}</p>
						</div>
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

	return (
		<>
			<style>{CSS}</style>

			<main className='uhi-root w-full overflow-hidden'>
				<div aria-hidden className='uhi-aura'>
					<span className='uhi-orb uhi-orb-1' />
					<span className='uhi-orb uhi-orb-2' />
					<span className='uhi-orb uhi-orb-3' />
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

								<motion.h1 variants={heroItem} className='uhi-h text-4xl lg:text-6xl leading-[1.15] mb-0'>
									Electric Hamam &amp; Underfloor Heating
									<span className='uhi-h-accent font-light'> in Kashmir &amp; Across India</span>
								</motion.h1>

								<motion.p variants={heroItem} className='uhi-sub mt-6 max-w-lg'>
									Electric hamam systems engineered for Kashmir winters silent radiant warmth rising from beneath your floor. No radiators. No cold spots. Built to retain heat for hours during power cuts.
								</motion.p>

								<motion.div variants={heroItem} className='flex gap-3 mt-8'>
									<Link href='/SpaceVerification' className='uhi-btn-primary'>
										Verify My Space
									</Link>
									<Link href='/contact' className='uhi-btn-ghost'>
										Talk to Expert
									</Link>
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
							className='uhi-h text-4xl text-center mb-12'>
							Premium Heating Brands
						</motion.h2>

						<div className='grid md:grid-cols-3 gap-8'>
							{brands.map((brand, i) => (
								<motion.div
									key={brand.name}
									variants={brandCardVariants(i % 3)}
									initial='hidden'
									whileInView='show'
									viewport={{ once: true, amount: 0.2 }}
									transition={{ delay: (i % 3) * 0.08 }}
									whileHover={{ y: -8 }}
									className='uhi-card uhi-brand-card'>
									<h3 className='uhi-brand-name'>{brand.name}</h3>
									<p className='uhi-brand-origin'>{brand.origin}</p>
									<p className='uhi-brand-desc'>{brand.desc}</p>
								</motion.div>
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
							<div className='relative sm:h-[660px] rounded-3xl overflow-hidden'>
								<img
									src='https://images.unsplash.com/photo-1733094151451-4222a842cfd1?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
									alt='India service network map'
									className='object-cover w-full h-full'
								/>
								<div className='uhi-map-veil' />
							</div>

							<div className='space-y-6'>
								{serviceNetwork.map((region, i) => (
									<motion.div
										key={region.region}
										initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
										whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
										viewport={{ once: true, amount: 0.3 }}
										transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
										className='uhi-card uhi-region'>
										<h3 className='uhi-region-title'>{region.region}</h3>

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

						<div className='max-w-3xl mx-auto space-y-3'>
							{faqs.map((f, i) => (
								<PremiumFaqItem key={f.q} q={f.q} a={f.a} index={i} />
							))}
						</div>

						<div className='mt-14 text-center'>
							<p className='uhi-sub text-sm mb-5'>Still have questions?</p>
							<Link href='/contact' className='uhi-btn-primary inline-flex items-center gap-2'>
								Talk to Our Expert
								<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
									<path d='M5 12h14M12 5l7 7-7 7' />
								</svg>
							</Link>
						</div>
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
.uhi-orb { position:absolute; border-radius:50%; }
.uhi-orb-1 { top:-8%; left:6%; width:46vw; height:46vw; max-width:720px; max-height:720px; background: radial-gradient(circle, rgba(232,147,58,0.28), transparent 62%); animation: uhi-drift 24s ease-in-out infinite; }
.uhi-orb-2 { top:8%; right:0%; width:40vw; height:40vw; max-width:620px; max-height:620px; background: radial-gradient(circle, rgba(255,126,95,0.18), transparent 62%); animation: uhi-drift2 30s ease-in-out infinite; }
.uhi-orb-3 { top:44%; left:36%; width:38vw; height:38vw; max-width:560px; max-height:560px; background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: uhi-drift 34s ease-in-out infinite reverse; }
.uhi-vignette { position:absolute; inset:0; z-index:0; pointer-events:none; background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%); }

@keyframes uhi-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
@keyframes uhi-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }
@keyframes uhi-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes uhi-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }

/* badge */
.uhi-badge {
	display:inline-flex; align-items:center; gap:9px; margin-bottom:20px;
	padding:8px 22px; border-radius:999px;
	font-family:var(--font-body); font-size:10px; font-weight:600;
	text-transform:uppercase; letter-spacing:0.32em; color:${C.amberLt};
	background: rgba(232,147,58,0.08);
	border:1px solid rgba(232,147,58,0.22);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4);
	backdrop-filter: blur(12px);
}
.uhi-badge-dot { width:6px; height:6px; border-radius:50%; background:${C.coral}; box-shadow:0 0 8px rgba(255,126,95,0.9); flex-shrink:0; animation: uhi-blink 2s ease-in-out infinite; }

/* headings */
.uhi-h {
	font-family:var(--font-heading);
	font-weight:600; line-height:1.06; letter-spacing:-0.01em;
	color:${C.text}; margin:0;
	text-shadow:0 2px 40px rgba(0,0,0,0.4);
}
.uhi-h-accent {
	font-weight:300;
	background:linear-gradient(100deg,#E8933A,#F5B97A 30%,#FF7E5F 55%,#F5B97A 80%,#E8933A);
	background-size:200% auto; -webkit-background-clip:text; background-clip:text;
	-webkit-text-fill-color:transparent; color:transparent;
	animation: uhi-shimmer 6s linear infinite;
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

/* buttons */
.uhi-btn-primary { position:relative; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:14px 32px; font-family:var(--font-body); font-size:14px; font-weight:600; color:#fff; background:linear-gradient(to right,#FF7E5F,#FFB88C); box-shadow:0 22px 60px rgba(255,126,95,0.4); text-decoration:none; white-space:nowrap; transition:transform .35s cubic-bezier(0.16,1,0.3,1), box-shadow .35s ease; }
.uhi-btn-primary:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 28px 80px rgba(255,126,95,0.5); }
.uhi-btn-ghost { display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:13px 32px; font-family:var(--font-body); font-size:14px; font-weight:600; color:${C.text}; text-decoration:none; white-space:nowrap; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(20,13,8,0.5); backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px); border:1px solid ${C.glassBorder}; transition:background .25s ease, border-color .25s ease, transform .25s ease; }
.uhi-btn-ghost:hover { background: rgba(232,147,58,0.12); border-color: rgba(232,147,58,0.4); transform:translateY(-2px); }

/* brand cards */
.uhi-brand-card { padding:32px; transition:transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s ease; }
.uhi-brand-card:hover { box-shadow:0 40px 90px rgba(0,0,0,0.5), 0 0 40px -8px rgba(232,147,58,0.4); }
.uhi-brand-card:hover::after { opacity:1; }
.uhi-brand-name { font-family:var(--font-heading); font-size:24px; font-weight:600; color:${C.text}; margin:0; }
.uhi-brand-origin { font-family:var(--font-body); font-size:11px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:${C.amberLt}; margin-top:6px; }
.uhi-brand-desc { font-family:var(--font-body); font-size:13px; color:${C.soft}; margin-top:16px; line-height:1.7; }

/* service network */
.uhi-map-veil { position:absolute; inset:0; background:linear-gradient(165deg, transparent 40%, rgba(10,6,3,0.7) 100%); pointer-events:none; }
.uhi-region { padding:28px; }
.uhi-region-title { font-family:var(--font-body); font-size:15px; font-weight:600; color:${C.text}; margin:0 0 14px; }
.uhi-chip { display:inline-flex; align-items:center; padding:6px 14px; border-radius:999px; font-family:var(--font-body); font-size:12px; font-weight:500; color:${C.amberLt}; background:rgba(255,255,255,0.05); border:1px solid ${C.glassBorder}; transition:transform .28s cubic-bezier(0.16,1,0.3,1), background .28s, border-color .28s; }
.uhi-chip:hover { transform:translateY(-2px) scale(1.03); background:rgba(232,147,58,0.14); border-color:rgba(232,147,58,0.4); }

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

@media (prefers-reduced-motion: reduce) {
	.uhi-orb, .uhi-h-accent, .uhi-badge-dot { animation:none !important; }
}
`;
