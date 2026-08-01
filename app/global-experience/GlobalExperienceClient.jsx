'use client';

import {
	motion,
	AnimatePresence,
	useInView,
	useScroll,
	useTransform,
	useReducedMotion,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Flag from 'react-world-flags';

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE, identical to WhyChooseUsClient's `C` object so this page reads as
// a continuation of the same dark design system. The hero section departs
// from this palette on purpose, borrowing HomeHero's copper/ivory tokens
// (see `.gec-hero` in the CSS below) since it sits directly on a photograph.
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA (content preserved verbatim)
// ─────────────────────────────────────────────────────────────────────────────

const countries = [
	{ name: 'United Kingdom', code: 'GB' },
	{ name: 'Sweden', code: 'SE' },
	{ name: 'Netherlands', code: 'NL' },
	{ name: 'Finland', code: 'FI' },
	{ name: 'France', code: 'FR' },
	{ name: 'Turkey', code: 'TR' },
	{ name: 'UAE', code: 'AE' },
	{ name: 'Bhutan', code: 'BT' },
];

const projects = [
	{
		label: 'Residential Homes',
		image:
			'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
		desc: 'Warm, energy-efficient heating for every room in modern family homes.',
	},
	{
		label: 'Homes',
		image:
			'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
		desc: 'Premium underfloor systems tailored for high-end villa interiors.',
	},
	{
		label: 'Hotels & Resorts',
		image:
			'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
		desc: 'Consistent, silent comfort across lobbies, suites and spa areas.',
	},
	{
		label: 'Mosques & Religious Buildings',
		image:
			'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80',
		desc: 'Gentle radiant warmth across Kashmiri mosque prayer halls and sacred spaces, designed for winter prayers and power cut resilience.',
	},
	{
		label: 'Commercial Offices',
		image:
			'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
		desc: 'Zone-controlled heating that keeps workspaces productive year-round.',
	},
	{
		label: 'Renovation Projects',
		image:
			'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&q=80',
		desc: 'Ultra-thin mat systems that retrofit seamlessly into existing floors.',
	},
];

// Featured/secondary split for the redesigned bento-style grid. Mosques &
// Religious Buildings carries the longest description, so it anchors the
// larger featured slot; the rest fill the secondary grid in original order.
const featuredProject = projects.find(
	(p) => p.label === 'Mosques & Religious Buildings'
);
const secondaryProjects = projects.filter(
	(p) => p.label !== 'Mosques & Religious Buildings'
);

const brands = [
	{
		name: 'ProWarm',
		logo: '/brandimages/prowarm.webp',
		pdf: '/PDFs/prowarm.pdf',
		docTitle: 'Installation Brochure',
		docPages: '24 pages',
		docType: 'Brochure',
	},
	{
		name: 'Warmup',
		logo: '/brandimages/warmup.webp',
		pdf: '/PDFs/Warmup-OM-Tempo-V1.3.pdf',
		docTitle: 'Tempo Owner Manual',
		docPages: '32 pages',
		docType: 'Manual',
	},
	{
		name: 'Danfoss',
		logo: '/brandimages/danfoss.webp',
		pdf: '/PDFs/Danfoss.pdf',
		docTitle: 'Hydronic Floor Heating Guide',
		docPages: '12 pages',
		docType: 'Handbook',
	},
	{
		name: 'Thermosphere',
		logo: '/brandimages/thermosphere.webp',
		pdf: '/PDFs/ThermoSphere%20Ultimate_Instructions.pdf',
		docTitle: 'Ultimate Cable Instructions',
		docPages: '31 pages',
		docType: 'Instructions',
	},
	{
		name: 'FastWarm',
		logo: '/brandimages/fastwarm.webp',
		pdf: '/PDFs/fastwarm.pdf',
		docTitle: 'Mat System Manual',
		docPages: '15 pages',
		docType: 'Manual',
	},
	{
		name: 'Amberheat',
		logo: '/brandimages/amberheat.webp',
		pdf: '/PDFs/Amber-Installation-Guide.pdf',
		docTitle: 'AmberMat Installation Guide',
		docPages: '12 pages',
		docType: 'Guide',
	},
	{
		name: 'Nvent',
		logo: '/brandimages/nvent.png',
		pdf: '/PDFs/nvent.pdf',
		docTitle: 'Nventß Installation Guide',
		docPages: '12 pages',
		docType: 'Guide',
	},
];

const process = [
	{
		title: 'Heating System Design',
		desc: 'Every project begins with a custom heating layout. Our engineers calculate heat loss, insulation levels, and floor type to design a system that delivers consistent radiant warmth.',
	},
	{
		title: 'Product Selection',
		desc: 'We choose the correct heating cable wattage between 10W and 50W depending on the building requirements and climate conditions.',
	},
	{
		title: 'Certified Installation',
		desc: 'Installation is performed by trained teams with experience installing electric floor heating systems in both residential and commercial buildings.',
	},
	{
		title: 'System Testing',
		desc: 'Before floor finishing, the system undergoes electrical safety checks, insulation resistance testing, and thermostat calibration.',
	},
	{
		title: 'Warranty Registration',
		desc: 'All installations are registered online with manufacturer documentation and warranty verification.',
	},
];

const faqs = [
	{
		q: 'What is electric underfloor heating?',
		a: 'Electric underfloor heating is a radiant heating system installed beneath the floor surface using heating cables or mats. It warms the floor evenly and distributes heat across the entire room.',
	},
	{
		q: 'How much electricity does underfloor heating use?',
		a: 'Energy consumption depends on room size and insulation, but modern systems are highly efficient and often use less energy than traditional heating methods.',
	},
	{
		q: 'How long does underfloor heating last?',
		a: 'High-quality heating cables are designed to last over 25 years with minimal maintenance.',
	},
	{
		q: 'Can underfloor heating be installed under tiles or wood?',
		a: 'Yes. Electric floor heating systems work perfectly under ceramic tiles, natural stone, engineered wood, laminate, and some vinyl floors.',
	},
	{
		q: 'Is underfloor heating safe in bathrooms?',
		a: 'Yes. Systems are fully waterproof and protected with insulation layers and ground-fault safety devices.',
	},
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const staggerContainer = {
	hidden: {},
	show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const staggerItem = {
	hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
	show: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.8, ease: EASE },
	},
};

const flagContainerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.15,
		},
	},
};

// Tuned for a controlled, premium settle rather than a bouncy one: lower
// stiffness, higher damping, added mass, and a much subtler starting rotate.
const flagCardVariants = {
	hidden: {
		opacity: 0,
		y: 28,
		rotate: -3,
	},
	show: {
		opacity: 1,
		y: 0,
		rotate: 0,
		transition: {
			type: 'spring',
			stiffness: 90,
			damping: 18,
			mass: 0.9,
		},
	},
};

// Layered reveal: alternating y-travel by column position, ease-based (not
// spring) so the grid matches the standard reveal system elsewhere on the
// site. Spring is reserved for the hover lift only.
function projectCardVariants(colIndex) {
	const y = [52, 34, 60][colIndex % 3];
	return {
		hidden: { opacity: 0, y, scale: 0.95 },
		show: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.8, ease: EASE },
		},
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLES
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ children }) {
	return (
		<div className='gec-badge'>
			<span className='gec-badge-dot' />
			{children}
		</div>
	);
}

// Blur-in numeric reveal, identical pattern to WhyChooseUsClient's Counter.
function Counter({ display }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount: 0.5 });
	const [val, setVal] = useState(' ');
	useEffect(() => {
		if (!seen) return;
		const t = setTimeout(() => setVal(display), 160);
		return () => clearTimeout(t);
	}, [seen, display]);
	return (
		<motion.span
			ref={ref}
			initial={{ opacity: 0, filter: 'blur(6px)' }}
			animate={seen ? { opacity: 1, filter: 'blur(0px)' } : {}}
			transition={{ duration: 0.7, ease: EASE }}>
			{val}
		</motion.span>
	);
}

// Rebuilt to match UnderfloorHeatingIndiaClient's `PremiumFaqItem` markup and
// motion convention (gec- prefixed) since that component isn't exported as a
// shared module. The answer now fades in slightly after the panel expands so
// text doesn't pop in instantly at full height.
function FaqItem({ q, a, index }) {
	const [open, setOpen] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 24, scale: 0.97 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ delay: index * 0.08, duration: 0.7, ease: EASE }}
			className={`gec-card gec-faq group ${open ? 'is-open' : ''}`}>
			<button
				onClick={() => setOpen(!open)}
				className='flex justify-between w-full text-left items-center gap-4 px-7 py-5'>
				<div className='flex items-center gap-4'>
					<motion.span
						initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
						whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{
							delay: index * 0.08 + 0.1,
							duration: 0.5,
							ease: EASE,
						}}
						className='gec-faq-index'>
						{index + 1}
					</motion.span>
					<span className='gec-faq-q'>{q}</span>
				</div>
				<span className={`gec-faq-toggle ${open ? 'is-open' : ''}`}>
					<svg
						width='12'
						height='12'
						viewBox='0 0 24 24'
						fill='none'
						stroke={open ? '#fff' : C.amberLt}
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'>
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
						transition={{ duration: 0.45, ease: EASE }}
						className='overflow-hidden'>
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.35, ease: EASE, delay: 0.1 }}
							className='px-7 pb-6 pt-1 flex gap-4'>
							<div className='w-7 flex-shrink-0' />
							<p className='gec-faq-a'>{a}</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

function FlagCard({ country }) {
	return (
		<motion.div
			variants={flagCardVariants}
			className='gec-card gec-flag-card p-6 text-center flex flex-col items-center gap-4'>
			<div className='relative flex items-center justify-center'>
				<div className='absolute inset-0 rounded-full bg-gradient-to-br from-[#E8933A]/25 to-[#FF7E5F]/15 blur-xl scale-[2]' />
				<Flag
					code={country.code}
					style={{
						width: '72px',
						height: '48px',
						borderRadius: '8px',
						boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
						position: 'relative',
					}}
				/>
			</div>
			<p className='font-bold tracking-wide text-[#FBF3EA] text-[15px]'>
				{country.name}
			</p>
		</motion.div>
	);
}

function ProjectCard({ project, index, featured = false }) {
	const col = index % 3;
	return (
		<motion.div
			variants={projectCardVariants(col)}
			initial='hidden'
			whileInView='show'
			viewport={{ once: true, margin: '-60px' }}
			transition={{ delay: index * 0.07 }}
			whileHover={{
				y: -8,
				transition: { type: 'spring', stiffness: 300, damping: 20 },
			}}
			className={`gec-card group relative overflow-hidden cursor-default ${
				featured ? 'gec-project-featured' : ''
			}`}>
			{/* Image */}
			<div
				className={`relative overflow-hidden ${
					featured ? 'gec-project-img-featured' : 'gec-project-img'
				}`}>
				<img
					src={project.image}
					alt={project.label}
					className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
				/>
				{/* Gradient overlay */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent' />
				{/* Label on image */}
				<div className='absolute bottom-4 left-4 right-4'>
					<p
						className={`text-white font-bold leading-tight drop-shadow-md ${
							featured ? 'text-xl' : 'text-sm'
						}`}>
						{project.label}
					</p>
				</div>
			</div>
			{/* Description */}
			<div className='px-5 py-4'>
				<p
					className={`text-[rgba(251,243,234,0.60)] leading-relaxed ${
						featured ? 'text-sm' : 'text-[12px]'
					}`}>
					{project.desc}
				</p>
			</div>
		</motion.div>
	);
}

function DocLines() {
	return (
		<div className='space-y-1.5 w-full px-1'>
			<div className='h-1.5 bg-[rgba(255,255,255,0.12)] rounded-full w-full' />
			<div className='h-1.5 bg-[rgba(255,255,255,0.12)] rounded-full w-4/5' />
		</div>
	);
}

function BrandCard({ brand, index }) {
	const [hovered, setHovered] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
			whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
			viewport={{ once: true, amount: 0.25 }}
			transition={{ delay: index * 0.06, duration: 0.7, ease: EASE }}
			whileHover={{ y: -4 }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className='gec-card gec-brand-card group relative flex flex-col overflow-hidden'>
			<div className='gec-brand-top'>
				<span className='gec-brand-pdf-tag'>PDF</span>
				<div className='gec-brand-logo-wrap'>
					<img
						src={brand.logo}
						alt={`${brand.name} logo`}
						className='gec-brand-logo'
					/>
				</div>
				<div className='gec-brand-doc-mock'>
					<div className='gec-brand-doc-header'>
						<div className='gec-brand-doc-icon'>
							<span>PDF</span>
						</div>
						<div className='flex flex-col gap-1 overflow-hidden'>
							<div className='gec-brand-doc-line w-16' />
							<div className='gec-brand-doc-line w-10 opacity-60' />
						</div>
					</div>
					<DocLines />
				</div>
			</div>
			<div className='gec-brand-info'>
				<p className='gec-brand-name'>{brand.name}</p>
				<p className='gec-brand-doctitle'>{brand.docTitle}</p>
				<div className='flex items-center gap-2 mt-1'>
					<span className='gec-brand-type'>{brand.docType}</span>
					<span className='gec-brand-pages'>{brand.docPages}</span>
				</div>
			</div>

			<motion.a
				href={brand.pdf}
				target='_blank'
				rel='noopener noreferrer'
				initial={false}
				animate={{
					opacity: hovered ? 1 : 0,
					backdropFilter: hovered ? 'blur(6px)' : 'blur(0px)',
				}}
				transition={{ duration: 0.35, ease: EASE }}
				className='gec-brand-overlay absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer'>
				<motion.div
					animate={hovered ? { y: [0, 4, 0] } : { y: 0 }}
					transition={{
						repeat: Infinity,
						duration: 1.2,
						ease: 'easeInOut',
					}}
					className='gec-brand-overlay-btn'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3'
						/>
					</svg>
				</motion.div>
				<p className='gec-brand-overlay-title'>Open Document</p>
				<p className='gec-brand-overlay-sub'>{brand.docTitle}</p>
			</motion.a>
		</motion.div>
	);
}

function CheckItem({ children, index }) {
	return (
		<motion.li
			initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
			whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ delay: index * 0.09, duration: 0.6, ease: EASE }}
			className='gec-check-item'>
			<span className='gec-check-icon' aria-hidden='true'>
				<svg viewBox='0 0 24 24' fill='none'>
					<path
						d='M5 13l4 4L19 7'
						stroke='currentColor'
						strokeWidth='2.5'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</span>
			<span>{children}</span>
		</motion.li>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — full-bleed background-image hero, restyled with HomeHero's exact
// copper/ivory tokens and typography treatment (see Phase 0 research). Only
// this section departs from the page's amber/coral `C` system.
// ─────────────────────────────────────────────────────────────────────────────

function GlobalHero() {
	const heroRef = useRef(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const plateY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);

	return (
		<section
			ref={heroRef}
			className='gec-hero'
			aria-label='Electric hamam and underfloor heating installed across Kashmir, India and worldwide'>
			<motion.div
				className='gec-hero-plate'
				style={prefersReducedMotion ? undefined : { y: plateY }}>
				<img
					src='/images/floor1.jpg'
					alt='Electric heating cable technology beneath a finished floor'
					className='gec-hero-plate-img'
				/>
			</motion.div>
			<div className='gec-hero-scrim' aria-hidden='true' />
			<div className='gec-hero-glow' aria-hidden='true' />
			<div className='gec-hero-grain' aria-hidden='true' />

			<div className='gec-hero-inner'>
				<motion.div variants={staggerContainer} initial='hidden' animate='show'>
					<motion.div variants={staggerItem}>
						<Badge>Global Experience</Badge>
					</motion.div>
					<motion.h1 variants={staggerItem} className='gec-hero-title'>
						Electric Hamam &amp; Underfloor Heating
						<span className='gec-hero-accent block'>
							in Kashmir &amp; Across India
						</span>
					</motion.h1>
					<motion.p variants={staggerItem} className='gec-hero-lede'>
						Our electric hamam systems are trusted in Kashmir homes, luxury
						villas, hotels, mosques, and commercial projects. With over
						500,000 installations across Kashmir and India since 2011, our
						teams deliver underfloor heating expertise built for -15C
						winters and power cut resilience.
					</motion.p>
					<motion.div variants={staggerItem} className='gec-hero-stats'>
						<div className='gec-hero-stat'>
							<span className='gec-hero-stat-num'>
								<Counter display='500,000+' />
							</span>
							<span className='gec-hero-stat-label'>
								Installations in Kashmir &amp; India
							</span>
						</div>
						<div className='gec-hero-stat'>
							<span className='gec-hero-stat-num'>
								<Counter display='2,000,000+' />
							</span>
							<span className='gec-hero-stat-label'>
								Installations Worldwide
							</span>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTALLATION PROCESS — connected horizontal rail on desktop, scroll-scrubbed
// via useScroll/useTransform; collapses to a connected vertical stepper on
// mobile.
// ─────────────────────────────────────────────────────────────────────────────

function InstallationProcess() {
	const railRef = useRef(null);
	const prefersReducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: railRef,
		offset: ['start 0.8', 'end 0.4'],
	});

	return (
		<section>
			<motion.h2
				className='gec-h text-4xl text-center mb-14'
				initial={{ opacity: 0, x: -24, filter: 'blur(6px)' }}
				whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8, ease: EASE }}>
				Our Installation Process
			</motion.h2>

			<div ref={railRef} className='gec-process-wrap'>
				<div className='gec-process-rail-track' aria-hidden='true'>
					<motion.div
						className='gec-process-rail'
						style={
							prefersReducedMotion
								? { scaleX: 1 }
								: { scaleX: scrollYProgress }
						}
					/>
					<div className='gec-process-dots'>
						{process.map((step) => (
							<span key={step.title} className='gec-process-dot' />
						))}
					</div>
				</div>

				<div className='gec-process-grid'>
					{process.map((step, i) => (
						<motion.div
							key={step.title}
							initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.4 }}
							transition={{
								delay: i * 0.1,
								duration: 0.7,
								ease: EASE,
							}}
							whileHover={{ y: -6 }}
							className='gec-card gec-process-card'>
							<span className='gec-process-node'>{i + 1}</span>
							<h3 className='gec-process-title'>{step.title}</h3>
							<p className='gec-process-desc'>{step.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// WARRANTY — full-width banner, visually distinct from the surrounding
// sections, breaking out of the max-w-7xl content column.
// ─────────────────────────────────────────────────────────────────────────────

function WarrantyBanner() {
	return (
		<section className='gec-warranty'>
			<div className='gec-warranty-inner'>
				<motion.h2
					className='gec-h text-4xl mb-5'
					initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, ease: EASE }}>
					Reliability &amp; Warranty
				</motion.h2>
				<motion.p
					className='text-sm text-[rgba(251,243,234,0.60)] max-w-2xl mx-auto leading-relaxed'
					initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ delay: 0.1, duration: 0.7, ease: EASE }}>
					Our heating systems are built to last. Most installations are
					backed by warranties of up to 25 years, with extremely low
					repair rates thanks to advanced cable insulation and strict
					installation standards.
				</motion.p>

				<motion.div
					className='gec-warranty-stats'
					initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ delay: 0.2, duration: 0.8, ease: EASE }}>
					<div className='gec-warranty-stat'>
						<p className='gec-warranty-num'>
							<Counter display='25+' />
						</p>
						<p className='gec-warranty-label'>Years Warranty</p>
					</div>
					<div className='gec-warranty-divider' aria-hidden='true' />
					<div className='gec-warranty-stat'>
						<p className='gec-warranty-num'>
							<Counter display='0.01%' />
						</p>
						<p className='gec-warranty-label'>Repair Rate</p>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function GlobalExperienceClient() {
	return (
		<>
			<style>{CSS}</style>
			<main className='gec-root w-full overflow-hidden'>
				<div aria-hidden className='gec-aura'>
					<span className='gec-orb gec-orb-1' />
					<span className='gec-orb gec-orb-2' />
					<span className='gec-orb gec-orb-3' />
				</div>
				<div aria-hidden className='gec-vignette' />

				{/* HERO */}
				<GlobalHero />

				<div className='relative z-[2] max-w-7xl mx-auto px-6 pt-20 pb-28 space-y-28'>
					{/* GLOBAL INSTALLATIONS */}
					<section>
						<motion.p
							className='gec-flags-intro'
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.6, ease: EASE }}>
							From the Himalayas to the Gulf — trusted in homes and
							landmark builds worldwide.
						</motion.p>
						<motion.h2
							className='gec-h text-4xl text-center mb-12'
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}>
							Our Global Installations
						</motion.h2>

						<motion.div
							className='gec-flags-row'
							variants={flagContainerVariants}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, margin: '-80px' }}>
							{countries.map((c) => (
								<div className='gec-flag-cell' key={c.name}>
									<FlagCard country={c} />
								</div>
							))}
						</motion.div>
					</section>

					{/* INSTALLATION PROCESS */}
					<InstallationProcess />

					{/* TECHNOLOGY */}
					<section className='grid lg:grid-cols-2 gap-14 items-center'>
						<motion.div
							initial={{ opacity: 0, y: 40, scale: 0.96 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.9, ease: EASE }}
							className='gec-tech-image-wrap relative h-[400px]'>
							<img
								src='/images/floor2.webp'
								className='gec-tech-image object-cover w-full h-full'
								alt='Heating cable technology'
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}>
							<h2 className='gec-h text-4xl mb-6'>
								Technology Behind Our Kashmir Systems
							</h2>
							<p className='text-sm text-[rgba(251,243,234,0.60)] leading-relaxed mb-6'>
								Our heating cables use advanced fluoropolymer insulation
								and multi-layer conductive cores that provide consistent
								radiant heat distribution. These systems are designed to
								operate safely beneath flooring materials while
								maintaining optimal energy efficiency.
							</p>
							<ul className='gec-check-list'>
								<CheckItem index={0}>
									Fluoropolymer heating cable construction
								</CheckItem>
								<CheckItem index={1}>
									Variable wattage heating technology
								</CheckItem>
								<CheckItem index={2}>
									Waterproof insulation layers
								</CheckItem>
								<CheckItem index={3}>
									Compliance with international IEC electrical
									standards
								</CheckItem>
							</ul>
						</motion.div>
					</section>

					{/* BRANDS */}
					<section>
						<motion.h2
							className='gec-h text-4xl text-center mb-4'
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}>
							Brands We Work With
						</motion.h2>
						<motion.p
							className='text-center text-sm text-[rgba(251,243,234,0.60)] mb-12'
							initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								delay: 0.15,
								duration: 0.6,
								ease: EASE,
							}}>
							Hover over any brand card to access the official
							installation documentation.
						</motion.p>
						<div className='grid md:grid-cols-3 lg:grid-cols-6 gap-5'>
							{brands.map((b, i) => (
								<BrandCard key={b.name} brand={b} index={i} />
							))}
						</div>
					</section>

					{/* PROJECTS WE SERVE */}
					<section>
						<motion.h2
							className='gec-h text-4xl text-center mb-4'
							initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								x: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}>
							Projects We Serve
						</motion.h2>
						<motion.p
							className='text-center text-sm text-[rgba(251,243,234,0.60)] mb-12'
							initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{
								delay: 0.15,
								duration: 0.6,
								ease: EASE,
							}}>
							From intimate homes to grand commercial spaces, we heat
							them all.
						</motion.p>
						<div className='gec-projects-grid'>
							{featuredProject && (
								<ProjectCard
									project={featuredProject}
									index={0}
									featured
								/>
							)}
							<div className='gec-projects-secondary'>
								{secondaryProjects.map((p, i) => (
									<ProjectCard
										key={p.label}
										project={p}
										index={i + 1}
									/>
								))}
							</div>
						</div>
					</section>
				</div>

				{/* WARRANTY */}
				<WarrantyBanner />

				<div className='relative z-[2] max-w-7xl mx-auto px-6 pt-28 pb-32'>
					{/* FAQ */}
					<section>
						<motion.h2
							className='gec-h text-4xl text-center mb-12'
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}>
							Frequently Asked Questions
						</motion.h2>
						<div className='max-w-3xl mx-auto space-y-3'>
							{faqs.map((f, i) => (
								<FaqItem key={f.q} q={f.q} a={f.a} index={i} />
							))}
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

const GRAIN_SVG =
	"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const CSS = `
.gec-root {
	position: relative;
	isolation: isolate;
	color: ${C.text};
	background:
		radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),
		linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%);
}
.gec-root::before {
	content:''; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.04;
	background-image:${GRAIN_SVG};
}

.gec-aura { position:absolute; inset:-10%; z-index:0; pointer-events:none; filter: blur(14px); }
.gec-orb { position:absolute; border-radius:50%; }
.gec-orb-1 { top:-8%; left:6%; width:46vw; height:46vw; max-width:720px; max-height:720px; background: radial-gradient(circle, rgba(232,147,58,0.28), transparent 62%); animation: gec-drift 24s ease-in-out infinite; }
.gec-orb-2 { top:8%; right:0%; width:40vw; height:40vw; max-width:620px; max-height:620px; background: radial-gradient(circle, rgba(255,126,95,0.18), transparent 62%); animation: gec-drift2 30s ease-in-out infinite; }
.gec-orb-3 { top:44%; left:36%; width:38vw; height:38vw; max-width:560px; max-height:560px; background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: gec-drift 34s ease-in-out infinite reverse; }
.gec-vignette { position:absolute; inset:0; z-index:0; pointer-events:none; background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%); }

@keyframes gec-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
@keyframes gec-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }
@keyframes gec-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes gec-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }

/* badge, restyled to match HomeHero's eyebrow chip exactly (only usage site
   is the hero, so it can adopt the hero's ivory/hairline palette wholesale) */
.gec-badge {
	display:inline-flex; align-items:center; gap:.6rem; margin-bottom:0;
	padding:.5rem .95rem .5rem .7rem; border-radius:999px;
	font-family:var(--font-body); font-size:.72rem; font-weight:600;
	text-transform:uppercase; letter-spacing:.14em; color:rgba(246,242,236,0.85);
	background: rgba(246,242,236,0.05);
	border:1px solid rgba(246,242,236,0.14);
	backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
	line-height:1.2;
}
.gec-badge-dot { width:7px; height:7px; border-radius:50%; background:#e7c39b; flex-shrink:0; animation: gec-badge-pulse 2.4s ease-out infinite; }
@keyframes gec-badge-pulse {
	0%   { box-shadow: 0 0 0 0 rgba(224,150,74,.55); }
	70%  { box-shadow: 0 0 0 8px rgba(224,150,74,0); }
	100% { box-shadow: 0 0 0 0 rgba(224,150,74,0); }
}

/* headings, used by every section below the hero */
.gec-h {
	font-family:var(--font-heading);
	font-weight:600; line-height:1.06; letter-spacing:-0.01em;
	color:${C.text}; margin:0;
	text-shadow:0 2px 40px rgba(0,0,0,0.4);
}
.gec-h-accent {
	font-weight:300;
	background:linear-gradient(100deg,#E8933A,#F5B97A 30%,#FF7E5F 55%,#F5B97A 80%,#E8933A);
	background-size:200% auto; -webkit-background-clip:text; background-clip:text;
	-webkit-text-fill-color:transparent; color:transparent;
	animation: gec-shimmer 6s linear infinite;
}
.gec-stat-num { font-family:var(--font-heading); font-weight:600; }

/* glass card base, identical recipe to WhyChooseUsClient's .whc-card */
.gec-card {
	position:relative;
	background:
		linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
		rgba(20,13,8,0.5);
	backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
	border:1px solid ${C.glassBorder};
	border-radius:24px;
	box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
	transition: transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s ease, border-color .5s ease;
}
.gec-card::after {
	content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
	opacity:0; transition:opacity .5s ease;
	background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
	-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite:xor; mask-composite:exclude;
}
.gec-card:hover::after { opacity:1; }

/* ── hero ─────────────────────────────────────────────────────────────── */

.gec-hero {
	--ink: #0a0705;
	--copper: #a86b3f;
	--copper-light: #c99669;
	--copper-bright: #e7c39b;
	--ivory: #f6f2ec;
	--muted: rgba(246,242,236,0.62);
	--hairline: rgba(246,242,236,0.14);

	position:relative; z-index:2; width:100%; min-height:100svh;
	display:flex; align-items:flex-end; overflow:hidden; isolation:isolate;
	background: var(--ink); color: var(--ivory);
}
.gec-hero-plate { position:absolute; inset:0; z-index:0; will-change:transform; overflow:hidden; }
.gec-hero-plate-img {
	position:absolute; inset:-6% -2%; width:104%; height:112%;
	object-fit:cover; object-position:50% 55%;
	animation: gec-hero-drift 34s ease-in-out infinite alternate;
}
@keyframes gec-hero-drift {
	from { transform: scale(1.02) translate3d(0,0,0); }
	to   { transform: scale(1.09) translate3d(-1.4%,-1%,0); }
}
.gec-hero-scrim {
	position:absolute; inset:0; z-index:1; pointer-events:none;
	background: linear-gradient(180deg, rgba(13,8,5,0.2) 0%, rgba(13,8,5,0.55) 60%, rgba(13,8,5,0.92) 100%);
}
.gec-hero-glow {
	position:absolute; left:-8%; bottom:-20%; width:56vw; height:56vw; max-width:820px; max-height:820px;
	z-index:1; pointer-events:none;
	background: radial-gradient(circle, rgba(224,150,74,0.28) 0%, rgba(168,107,63,0.12) 40%, transparent 68%);
	filter: blur(10px);
	animation: gec-hero-breathe 7s ease-in-out infinite alternate;
}
@keyframes gec-hero-breathe { from{opacity:.65} to{opacity:1} }
.gec-hero-grain {
	position:absolute; inset:0; z-index:2; pointer-events:none; opacity:.25; mix-blend-mode:overlay;
	background-image:${GRAIN_SVG};
}

.gec-hero-inner {
	position:relative; z-index:3; width:100%; max-width:1320px; margin:0 auto;
	padding: 8rem clamp(1.25rem,5vw,3rem) 5.5rem;
}
.gec-hero-inner .gec-badge { margin-bottom:1.4rem; }

.gec-hero-title {
	margin:0; max-width:46rem;
	font-family: var(--font-heading);
	font-weight:400;
	font-size: clamp(2.6rem, 5.4vw, 4.2rem);
	line-height:0.98; letter-spacing:-0.01em; text-transform:uppercase;
	color: var(--ivory);
}
.gec-hero-accent {
	font-weight:400;
	background: linear-gradient(100deg, var(--copper-light) 0%, var(--copper-bright) 45%, var(--copper) 100%);
	-webkit-background-clip:text; background-clip:text; color:transparent;
}
.gec-hero-lede {
	margin:1.25rem 0 0; max-width:34rem;
	font-size: clamp(1rem,1.35vw,1.15rem); line-height:1.55; color: var(--muted);
}
.gec-hero-stats {
	display:flex; flex-wrap:wrap; gap:clamp(1.25rem,4vw,3rem);
	margin:2.75rem 0 0; padding-top:1.5rem; border-top:1px solid var(--hairline);
	max-width:40rem;
}
.gec-hero-stat { display:flex; flex-direction:column; gap:.35rem; }
.gec-hero-stat-num {
	font-family: var(--font-heading); font-weight:400;
	font-size: clamp(1.9rem,3vw,2.5rem); color: var(--ivory); line-height:1;
}
.gec-hero-stat-label {
	font-size:.72rem; font-weight:500; letter-spacing:.09em; text-transform:uppercase; color: var(--muted);
}

@media (max-width:900px) {
	.gec-hero-scrim { background: linear-gradient(180deg, rgba(13,8,5,0.35) 0%, rgba(13,8,5,0.6) 45%, rgba(13,8,5,0.94) 100%); }
	.gec-hero-inner { padding-top:6.5rem; padding-bottom:4.5rem; }
}
@media (max-width:560px) {
	.gec-hero-stats { gap:1.25rem 1.75rem; }
}

/* ── global installations (flags) ────────────────────────────────────── */

.gec-flags-intro { text-align:center; font-size:.82rem; letter-spacing:.02em; color:${C.mute}; margin-bottom:.85rem; }

.gec-flags-row {
	display:flex; gap:1rem; overflow-x:auto; scroll-snap-type:x mandatory;
	padding:.25rem .25rem .75rem; margin:0 -6px;
}
.gec-flag-cell { scroll-snap-align:start; flex:0 0 auto; width:150px; }

@media (min-width:768px) {
	.gec-flags-row { display:grid; grid-template-columns:repeat(4,1fr); overflow:visible; gap:1.75rem 1.5rem; margin:0; padding:.5rem 0 0; }
	.gec-flag-cell { width:auto; }
	.gec-flag-cell:nth-child(4n+2) { margin-top:26px; }
	.gec-flag-cell:nth-child(4n+3) { margin-top:-12px; }
}

.gec-flag-card:hover { transform:translateY(-6px); box-shadow:0 30px 70px rgba(0,0,0,0.5), 0 0 34px -8px rgba(232,147,58,0.55); border-color:rgba(232,147,58,0.4); }

/* ── installation process ─────────────────────────────────────────────── */

.gec-process-wrap { position:relative; }

.gec-process-rail-track {
	position:relative; height:2px; background:rgba(255,255,255,0.1); border-radius:999px;
	margin:0 4px 3.25rem; display:none;
}
.gec-process-rail { position:absolute; inset:0; border-radius:999px; transform-origin:left center; background:linear-gradient(90deg,${C.amber},${C.coral}); }
.gec-process-dots { position:absolute; inset:0; top:-5px; display:flex; justify-content:space-between; }
.gec-process-dot { width:11px; height:11px; border-radius:50%; background:linear-gradient(135deg,${C.amber},${C.coral}); box-shadow:0 0 10px rgba(232,147,58,0.6); }

.gec-process-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; position:relative; }
.gec-process-card { padding:1.75rem 1.5rem; position:relative; }
.gec-process-node {
	display:inline-flex; align-items:center; justify-content:center;
	width:44px; height:44px; border-radius:50%;
	font-family:var(--font-heading); font-weight:700; font-size:1.05rem;
	background: linear-gradient(135deg, rgba(232,147,58,0.22), rgba(255,126,95,0.14));
	border:1px solid rgba(232,147,58,.35); color:${C.amberLt};
	box-shadow: 0 8px 22px -8px rgba(232,147,58,.5);
	transition: box-shadow .35s ease, border-color .35s ease, transform .35s ease;
}
.gec-process-title { font-family:var(--font-heading); font-weight:600; color:${C.text}; font-size:1.05rem; margin:1rem 0 0; }
.gec-process-desc { font-size:.8rem; color:${C.soft}; line-height:1.65; margin:.65rem 0 0; }

.gec-process-card:not(:last-child)::after {
	content:''; position:absolute; left:2.7rem; bottom:-1.5rem; width:2px; height:1.5rem;
	background: linear-gradient(180deg, rgba(232,147,58,.5), rgba(255,126,95,.15));
}
.gec-process-card:hover .gec-process-node { box-shadow:0 12px 28px -6px rgba(232,147,58,.7); border-color:rgba(232,147,58,.6); transform:translateY(-2px); }

@media (min-width:768px) {
	.gec-process-rail-track { display:block; }
	.gec-process-grid { grid-template-columns:repeat(5,1fr); gap:1.5rem; }
	.gec-process-card:not(:last-child)::after { display:none; }
	.gec-process-node { width:48px; height:48px; font-size:1.1rem; }
}

/* ── technology ───────────────────────────────────────────────────────── */

.gec-tech-image-wrap {
	position:relative; border-radius:28px; overflow:hidden;
	box-shadow: 0 40px 90px -30px rgba(0,0,0,.65);
}
.gec-tech-image-wrap::before {
	content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
	background: radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(13,8,5,.55) 100%);
}
.gec-tech-image-wrap::after {
	content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
	background: linear-gradient(180deg, rgba(13,8,5,0) 60%, rgba(13,8,5,.6) 100%);
}
.gec-tech-image { position:relative; z-index:0; }

.gec-check-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:.5rem; }
.gec-check-item {
	display:flex; align-items:flex-start; gap:.75rem;
	font-size:.9rem; color:${C.soft}; line-height:1.5;
	padding:.55rem .7rem; margin:0 -0.7rem; border-radius:12px;
	transition: background .3s ease, transform .3s ease;
}
.gec-check-item:hover { background:rgba(255,255,255,.04); transform:translateX(3px); }
.gec-check-icon {
	flex-shrink:0; width:22px; height:22px; border-radius:50%; margin-top:1px;
	display:flex; align-items:center; justify-content:center;
	background:linear-gradient(135deg,${C.amber},${C.coral}); color:#1a0f07;
}
.gec-check-icon svg { width:13px; height:13px; }

/* ── brands ───────────────────────────────────────────────────────────── */

.gec-brand-top {
	position:relative; padding:1.5rem 1.25rem 1.1rem; display:flex; flex-direction:column; align-items:center; gap:.9rem;
	background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.01));
}
.gec-brand-pdf-tag {
	position:absolute; top:.6rem; right:.6rem;
	background: linear-gradient(135deg,${C.amber},${C.coral}); color:#1a0f07;
	font-size:9px; font-weight:800; letter-spacing:.12em; text-transform:uppercase;
	padding:3px 9px; border-radius:999px;
}
.gec-brand-logo-wrap {
	width:100%; height:88px; border-radius:16px; display:flex; align-items:center; justify-content:center;
	background: rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.06); padding:14px;
}
.gec-brand-logo { max-width:100%; max-height:100%; object-fit:contain; }
.gec-brand-doc-mock {
	width:100%; border-radius:14px; padding:.8rem;
	background: rgba(255,255,255,.04); border:1px solid ${C.glassBorder};
}
.gec-brand-doc-header { display:flex; align-items:center; gap:.5rem; padding-bottom:.55rem; margin-bottom:.6rem; border-bottom:1px solid ${C.glassBorder}; }
.gec-brand-doc-icon { width:24px; height:28px; border-radius:4px; background:linear-gradient(135deg,${C.amber},${C.coral}); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gec-brand-doc-icon span { color:#1a0f07; font-size:7px; font-weight:800; }
.gec-brand-doc-line { height:6px; border-radius:999px; background:rgba(255,255,255,.16); }

.gec-brand-info { padding:1rem 1.1rem 1.2rem; display:flex; flex-direction:column; gap:.2rem; }
.gec-brand-name { font-family:var(--font-heading); font-weight:700; color:${C.text}; font-size:.95rem; }
.gec-brand-doctitle { font-size:11px; color:${C.soft}; line-height:1.3; }
.gec-brand-type { font-size:10px; font-weight:600; color:${C.amberLt}; background:rgba(232,147,58,.14); padding:2px 9px; border-radius:999px; }
.gec-brand-pages { font-size:10px; color:${C.mute}; }

.gec-brand-overlay { background: rgba(10,6,3,.9); }
.gec-brand-overlay-btn {
	width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center;
	background: linear-gradient(135deg,${C.amber},${C.coral}); box-shadow:0 14px 34px -10px rgba(232,147,58,.6);
	color:#1a0f07;
}
.gec-brand-overlay-btn svg { width:24px; height:24px; }
.gec-brand-overlay-title { color:#fff; font-weight:700; font-size:.9rem; margin:0; }
.gec-brand-overlay-sub { color:rgba(255,255,255,.7); font-size:.72rem; margin:0; }

/* ── projects we serve ────────────────────────────────────────────────── */

.gec-projects-grid { display:grid; grid-template-columns:1fr; gap:1.5rem; }
.gec-projects-secondary { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
.gec-project-featured { display:flex; flex-direction:column; }
.gec-project-img { aspect-ratio:4/3; }
.gec-project-img-featured { aspect-ratio:16/11; flex:1 1 auto; }

@media (max-width:767px) {
	.gec-projects-secondary { grid-template-columns:1fr 1fr; }
}
@media (max-width:480px) {
	.gec-projects-secondary { grid-template-columns:1fr; }
}
@media (min-width:768px) {
	.gec-projects-grid { grid-template-columns:1.25fr 1fr; gap:1.75rem; align-items:stretch; }
	.gec-project-img-featured { aspect-ratio:auto; min-height:360px; }
}

/* ── warranty ─────────────────────────────────────────────────────────── */

.gec-warranty {
	position:relative; z-index:2; width:100%; padding:6rem 1.5rem; margin:0;
	background:
		radial-gradient(120% 140% at 50% 0%, rgba(232,147,58,0.14), transparent 60%),
		linear-gradient(180deg, rgba(20,13,8,0.6), rgba(13,8,5,0.9));
	border-top:1px solid ${C.line}; border-bottom:1px solid ${C.line};
	overflow:hidden;
}
.gec-warranty::before {
	content:''; position:absolute; inset:0; pointer-events:none; opacity:.05;
	background-image:${GRAIN_SVG};
}
.gec-warranty-inner { position:relative; max-width:52rem; margin:0 auto; text-align:center; }
.gec-warranty-stats { display:flex; align-items:center; justify-content:center; gap:clamp(2rem,6vw,4.5rem); margin-top:3rem; }
.gec-warranty-stat { display:flex; flex-direction:column; gap:.5rem; }
.gec-warranty-num { font-family:var(--font-heading); font-weight:700; font-size:clamp(2.75rem,6vw,4.25rem); color:${C.amberLt}; line-height:1; margin:0; }
.gec-warranty-label { font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; color:${C.soft}; margin:0; }
.gec-warranty-divider { width:1px; height:56px; background:linear-gradient(180deg, transparent, ${C.line} 30%, ${C.line} 70%, transparent); }

@media (max-width:480px) {
	.gec-warranty-stats { gap:1.75rem; }
	.gec-warranty-divider { height:40px; }
}

/* ── faq, identical recipe to UnderfloorHeatingIndiaClient's .uhi-faq ───── */

.gec-faq { overflow:hidden; transition:box-shadow .3s ease, border-color .3s ease; }
.gec-faq.is-open { border-color:rgba(232,147,58,0.4); box-shadow:0 28px 70px rgba(232,147,58,0.15), inset 0 1px 0 rgba(255,255,255,0.06); }
.gec-faq-index { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-body); font-size:12px; font-weight:700; background:rgba(232,147,58,0.12); color:${C.amberLt}; transition:background .3s ease, color .3s ease; }
.gec-faq.is-open .gec-faq-index { background:linear-gradient(135deg,${C.amber},${C.coral}); color:#fff; }
.gec-faq-q { font-family:var(--font-body); font-weight:600; color:${C.text}; font-size:15.5px; line-height:1.45; letter-spacing:.01em; }
.gec-faq-a { font-family:var(--font-body); color:${C.soft}; font-size:13.5px; line-height:1.7; }
.gec-faq-toggle { flex-shrink:0; width:32px; height:32px; border-radius:50%; border:1px solid rgba(232,147,58,0.25); display:flex; align-items:center; justify-content:center; transition:all .3s ease; }
.gec-faq-toggle.is-open { background:linear-gradient(135deg,${C.amber},${C.coral}); border-color:transparent; transform:rotate(45deg); }

@media (prefers-reduced-motion: reduce) {
	.gec-orb, .gec-h-accent, .gec-badge-dot,
	.gec-hero-plate-img, .gec-hero-glow { animation:none !important; }
}
`;
