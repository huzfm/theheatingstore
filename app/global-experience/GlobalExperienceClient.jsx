'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Flag from 'react-world-flags';

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

const flagCardVariants = {
	hidden: {
		opacity: 0,
		y: 40,
		rotate: -6,
	},
	show: {
		opacity: 1,
		y: 0,
		rotate: 0,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 14,
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

// Rebuilt to match UnderfloorHeatingIndiaClient's `PremiumFaqItem` exactly
// (same markup, motion and class-naming convention, gec- prefixed) since
// that component isn't exported as a shared module.
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
						transition={{ duration: 0.3, ease: EASE }}
						className='overflow-hidden'>
						<div className='px-7 pb-6 pt-1 flex gap-4'>
							<div className='w-7 flex-shrink-0' />
							<p className='gec-faq-a'>{a}</p>
						</div>
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
			className='gec-card gec-flag-card p-5 text-center flex flex-col items-center gap-3'>
			<div className='relative'>
				<div className='absolute inset-0 rounded-full bg-[#B86B45]/10 blur-md scale-150' />
				<Flag
					code={country.code}
					style={{
						width: '68px',
						height: '44px',
						borderRadius: '6px',
						boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
						position: 'relative',
					}}
				/>
			</div>
			<p className='font-semibold text-[#FBF3EA] text-sm'>
				{country.name}
			</p>
		</motion.div>
	);
}

function ProjectCard({ project, index }) {
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
			className='gec-card group relative overflow-hidden cursor-default'>
			{/* Image */}
			<div className='relative h-44 overflow-hidden'>
				<img
					src={project.image}
					alt={project.label}
					className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
				/>
				{/* Gradient overlay */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent' />
				{/* Label on image */}
				<div className='absolute bottom-3 left-3 right-3'>
					<p className='text-white font-bold text-sm leading-tight drop-shadow-md'>
						{project.label}
					</p>
				</div>
			</div>
			{/* Description */}
			<div className='px-4 py-3'>
				<p className='text-[12px] text-[rgba(251,243,234,0.60)] leading-relaxed'>
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
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className='gec-card group relative flex flex-col overflow-hidden'>
			<div
				className='relative px-4 pt-5 pb-4 flex flex-col items-center gap-3'
				style={{
					background:
						'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
				}}>
				<div className='absolute top-2 right-2 bg-[#B86B45] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase'>
					PDF
				</div>
				<img
					src={brand.logo}
					alt={`${brand.name} logo`}
					className='w-24 h-20 object-contain'
				/>
				<div
					className='w-full rounded-xl p-3'
					style={{
						background: 'rgba(255,255,255,0.04)',
						border: `1px solid ${C.glassBorder}`,
					}}>
					<div
						className='flex items-center gap-2 mb-2.5 pb-2'
						style={{ borderBottom: `1px solid ${C.glassBorder}` }}>
						<div className='w-6 h-7 bg-[#B86B45] rounded-sm flex items-center justify-center flex-shrink-0 relative'>
							<span className='text-white text-[7px] font-bold'>
								PDF
							</span>
							<div
								className='absolute -top-0.5 -right-0.5 w-2 h-2 rounded-bl-sm'
								style={{ background: 'rgba(20,13,8,0.9)' }}
							/>
						</div>
						<div className='flex flex-col gap-0.5 overflow-hidden'>
							<div
								className='h-1.5 rounded-full w-16'
								style={{ background: 'rgba(255,255,255,0.16)' }}
							/>
							<div
								className='h-1 rounded-full w-10'
								style={{ background: 'rgba(255,255,255,0.08)' }}
							/>
						</div>
					</div>
					<DocLines />
				</div>
			</div>
			<div className='px-4 py-3 flex flex-col gap-1'>
				<p className='font-bold text-[#FBF3EA] text-sm leading-tight'>
					{brand.name}
				</p>
				<p className='text-[11px] text-[rgba(251,243,234,0.60)] leading-tight'>
					{brand.docTitle}
				</p>
				<div className='flex items-center gap-2 mt-0.5'>
					<span
						className='text-[10px] text-[#B86B45] font-semibold px-2 py-0.5 rounded-full'
						style={{ background: 'rgba(232,147,58,0.14)' }}>
						{brand.docType}
					</span>
					<span className='text-[10px] text-[rgba(251,243,234,0.40)]'>
						{brand.docPages}
					</span>
				</div>
			</div>
			<motion.a
				href={brand.pdf}
				target='_blank'
				rel='noopener noreferrer'
				initial={{ opacity: 0 }}
				animate={{ opacity: hovered ? 1 : 0 }}
				transition={{ duration: 0.2 }}
				className='absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm cursor-pointer'
				style={{ background: 'rgba(10,6,3,0.88)' }}>
				<motion.div
					animate={hovered ? { y: [0, 4, 0] } : { y: 0 }}
					transition={{
						repeat: Infinity,
						duration: 1.2,
						ease: 'easeInOut',
					}}
					className='w-12 h-12 rounded-full bg-[#B86B45] flex items-center justify-center shadow-lg'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-6 h-6 text-white'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3'
						/>
					</svg>
				</motion.div>
				<p className='text-white font-semibold text-sm'>
					Open Document
				</p>
				<p className='text-white/70 text-xs'>{brand.docTitle}</p>
			</motion.a>
		</motion.div>
	);
}

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

				<div className='relative z-[2] max-w-7xl mx-auto px-6 py-28 space-y-32'>
					{/* HERO */}
					<section className='grid lg:grid-cols-2 gap-14 items-center'>
						<motion.div
							variants={staggerContainer}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, amount: 0.4 }}>
							<motion.div variants={staggerItem}>
								<Badge>Global Experience</Badge>
							</motion.div>
							<motion.h1
								variants={staggerItem}
								className='gec-h text-5xl leading-tight'>
								Electric Hamam & Underfloor Heating
								<span className='gec-h-accent block font-light'>
									in Kashmir & Across India
								</span>
							</motion.h1>
							<motion.p
								variants={staggerItem}
								className='mt-6 text-lg text-[rgba(251,243,234,0.60)] max-w-lg'>
								Our electric hamam systems are trusted in Kashmir homes, luxury villas, hotels, mosques, and commercial projects. With over 500,000 installations across Kashmir and India since 2011, our teams deliver underfloor heating expertise built for -15C winters and power cut resilience.
							</motion.p>
							<motion.div
								variants={staggerItem}
								className='flex gap-10 mt-10'>
								<div>
									<p className='text-3xl gec-stat-num text-[#B86B45]'>
										<Counter display='500,000+' />
									</p>
									<p className='text-xs text-[rgba(251,243,234,0.60)]'>
										Installations in Kashmir & India
									</p>
								</div>
								<div>
									<p className='text-3xl gec-stat-num text-[#B86B45]'>
										<Counter display='2,000,000+' />
									</p>
									<p className='text-xs text-[rgba(251,243,234,0.60)]'>
										Installations Worldwide
									</p>
								</div>
							</motion.div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 40, scale: 0.96 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.9, ease: EASE }}
							className='relative h-[420px]'>
							<img
								src='/images/floor1.jpg'
								className='object-cover w-full h-full rounded-3xl'
								alt='Electric heating cable technology'
							/>
						</motion.div>
					</section>

					{/* GLOBAL PROJECTS */}
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
							Our Global Installations
						</motion.h2>

						<motion.div
							className='grid md:grid-cols-4 gap-6'
							variants={flagContainerVariants}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, margin: '-80px' }}>
							{countries.map((c) => (
								<FlagCard key={c.name} country={c} />
							))}
						</motion.div>
					</section>

					{/* INSTALLATION PROCESS */}
					<section>
						<motion.h2
							className='gec-h text-4xl text-center mb-14'
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
								filter: 'blur(0px)',
							}}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE }}>
							Our Installation Process
						</motion.h2>

						{/* Step-progression rail: reinforces that the five cards below
						    are sequential, not unrelated siblings. */}
						<div className='hidden md:block relative mb-10 px-2'>
							<div className='gec-process-rail-track'>
								<motion.div
									className='gec-process-rail'
									initial={{ scaleX: 0 }}
									whileInView={{ scaleX: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 1.2, ease: EASE }}
								/>
							</div>
							<div className='gec-process-dots'>
								{process.map((step, i) => (
									<motion.span
										key={step.title}
										className='gec-process-dot'
										initial={{ opacity: 0, scale: 0 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{
											delay: i * 0.12 + 0.15,
											duration: 0.4,
											ease: EASE,
										}}
									/>
								))}
							</div>
						</div>

						<div className='grid md:grid-cols-5 gap-6'>
							{process.map((step, i) => (
								<motion.div
									key={step.title}
									initial={{
										opacity: 0,
										y: 30,
										filter: 'blur(5px)',
									}}
									whileInView={{
										opacity: 1,
										y: 0,
										filter: 'blur(0px)',
									}}
									viewport={{ once: true }}
									transition={{
										delay: i * 0.12,
										duration: 0.7,
										ease: EASE,
									}}
									whileHover={{ y: -6 }}
									className='gec-card p-6'>
									<span className='gec-process-num'>
										STEP {i + 1}
									</span>
									<h3 className='font-semibold text-[#FBF3EA] mt-3'>
										{step.title}
									</h3>
									<p className='text-xs text-[rgba(251,243,234,0.60)] mt-3 leading-relaxed'>
										{step.desc}
									</p>
								</motion.div>
							))}
						</div>
					</section>

					{/* TECHNOLOGY */}
					<section className='grid lg:grid-cols-2 gap-14 items-center'>
						<motion.div
							initial={{ opacity: 0, y: 40, scale: 0.96 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.9, ease: EASE }}
							className='relative h-[400px]'>
							<img
								src='/images/floor2.webp'
								className='object-cover w-full h-full rounded-3xl'
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
							<p className='text-sm text-[rgba(251,243,234,0.60)] leading-relaxed mb-5'>
								Our heating cables use advanced fluoropolymer insulation
								and multi-layer conductive cores that provide consistent
								radiant heat distribution. These systems are designed to
								operate safely beneath flooring materials while
								maintaining optimal energy efficiency.
							</p>
							<ul className='space-y-2 text-sm text-[rgba(251,243,234,0.60)]'>
								<li>Fluoropolymer heating cable construction</li>
								<li>Variable wattage heating technology</li>
								<li>Waterproof insulation layers</li>
								<li>
									Compliance with international IEC electrical
									standards
								</li>
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
							initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
							whileInView={{
								opacity: 1,
								y: 0,
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
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{projects.map((p, i) => (
								<ProjectCard key={p.label} project={p} index={i} />
							))}
						</div>
					</section>

					{/* WARRANTY */}
					<motion.section
						initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
						whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.8, ease: EASE }}
						className='gec-card p-12 text-center'>
						<h2 className='gec-h text-4xl mb-6'>
							Reliability & Warranty
						</h2>
						<p className='text-sm text-[rgba(251,243,234,0.60)] max-w-2xl mx-auto leading-relaxed'>
							Our heating systems are built to last. Most installations
							are backed by warranties of up to 25 years, with extremely
							low repair rates thanks to advanced cable insulation and
							strict installation standards.
						</p>
						<div className='flex justify-center gap-12 mt-10'>
							<div>
								<p className='text-3xl gec-stat-num text-[#B86B45]'>
									<Counter display='25+' />
								</p>
								<p className='text-xs text-[rgba(251,243,234,0.60)]'>
									Years Warranty
								</p>
							</div>
							<div>
								<p className='text-3xl gec-stat-num text-[#B86B45]'>
									<Counter display='0.01%' />
								</p>
								<p className='text-xs text-[rgba(251,243,234,0.60)]'>
									Repair Rate
								</p>
							</div>
						</div>
					</motion.section>

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
	background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
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

/* badge */
.gec-badge {
	display:inline-flex; align-items:center; gap:9px; margin-bottom:20px;
	padding:8px 22px; border-radius:999px;
	font-family:var(--font-body); font-size:10px; font-weight:600;
	text-transform:uppercase; letter-spacing:0.4em; color:${C.amberLt};
	background: rgba(232,147,58,0.08);
	border:1px solid rgba(232,147,58,0.22);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4);
	backdrop-filter: blur(12px);
}
.gec-badge-dot { width:6px; height:6px; border-radius:50%; background:${C.coral}; box-shadow:0 0 8px rgba(255,126,95,0.9); flex-shrink:0; animation: gec-blink 2s ease-in-out infinite; }

/* headings */
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
	transition: transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s ease;
}
.gec-card::after {
	content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
	opacity:0; transition:opacity .5s ease;
	background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
	-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite:xor; mask-composite:exclude;
}
.gec-card:hover::after { opacity:1; }
.gec-flag-card:hover { transform:translateY(-6px); box-shadow:0 30px 70px rgba(0,0,0,0.5), 0 0 30px -10px rgba(184,107,69,0.5); }

/* process */
.gec-process-rail-track { position:relative; height:2px; background:rgba(255,255,255,0.1); border-radius:999px; margin:0 4px; }
.gec-process-rail { position:absolute; inset:0; border-radius:999px; transform-origin:left center; background:linear-gradient(90deg,${C.amber},${C.coral}); }
.gec-process-dots { position:absolute; inset:0; top:-4px; display:flex; justify-content:space-between; }
.gec-process-dot { width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,${C.amber},${C.coral}); box-shadow:0 0 10px rgba(232,147,58,0.6); }
.gec-process-num { display:inline-flex; font-family:var(--font-body); font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:${C.amberLt}; padding:4px 12px; border-radius:999px; background:rgba(232,147,58,0.12); border:1px solid rgba(232,147,58,0.28); }

/* faq, identical recipe to UnderfloorHeatingIndiaClient's .uhi-faq */
.gec-faq { overflow:hidden; transition:box-shadow .3s ease, border-color .3s ease; }
.gec-faq.is-open { border-color:rgba(232,147,58,0.35); box-shadow:0 24px 60px rgba(232,147,58,0.12), inset 0 1px 0 rgba(255,255,255,0.06); }
.gec-faq-index { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-body); font-size:12px; font-weight:700; background:rgba(232,147,58,0.12); color:${C.amberLt}; transition:background .3s ease, color .3s ease; }
.gec-faq.is-open .gec-faq-index { background:linear-gradient(135deg,${C.amber},${C.coral}); color:#fff; }
.gec-faq-q { font-family:var(--font-body); font-weight:600; color:${C.text}; font-size:15px; line-height:1.4; }
.gec-faq-a { font-family:var(--font-body); color:${C.soft}; font-size:13.5px; line-height:1.7; }
.gec-faq-toggle { flex-shrink:0; width:32px; height:32px; border-radius:50%; border:1px solid rgba(232,147,58,0.25); display:flex; align-items:center; justify-content:center; transition:all .3s ease; }
.gec-faq-toggle.is-open { background:linear-gradient(135deg,${C.amber},${C.coral}); border-color:transparent; transform:rotate(45deg); }

@media (prefers-reduced-motion: reduce) {
	.gec-orb, .gec-h-accent, .gec-badge-dot { animation:none !important; }
}
`;
