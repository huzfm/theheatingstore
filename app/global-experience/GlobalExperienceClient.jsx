'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Flag from 'react-world-flags';

const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
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
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 14,
		},
	},
};

const projectCardVariants = {
	hidden: { opacity: 0, y: 50, scale: 0.95 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: 'spring', stiffness: 100, damping: 14 },
	},
};

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
		desc: 'Gentle radiant warmth across Kashmiri mosque prayer halls and sacred spaces — designed for winter prayers and power cut resilience.',
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

function FaqItem({ q, a }) {
	const [open, setOpen] = useState(false);
	return (
		<div className='border-b border-[#B86B45]/20 py-4'>
			<button
				onClick={() => setOpen(!open)}
				className='flex justify-between w-full text-left font-semibold text-[#3C2A25]'>
				{q}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>
			{open && (
				<p className='mt-3 text-sm text-[#6B4A2D] leading-relaxed'>
					{a}
				</p>
			)}
		</div>
	);
}

function FlagCard({ country }) {
	return (
		<motion.div
			variants={flagCardVariants}
			className='bg-white/70 backdrop-blur-lg rounded-2xl p-5 text-center shadow-md flex flex-col items-center gap-3'>
			<div className='relative'>
				<div className='absolute inset-0 rounded-full bg-[#B86B45]/10 blur-md scale-150' />
				<Flag
					code={country.code}
					style={{
						width: '68px',
						height: '44px',
						borderRadius: '6px',
						boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
						position: 'relative',
					}}
				/>
			</div>
			<p className='font-semibold text-[#3C2A25] text-sm'>
				{country.name}
			</p>
		</motion.div>
	);
}

function ProjectCard({ project, index }) {
	return (
		<motion.div
			variants={projectCardVariants}
			initial='hidden'
			whileInView='show'
			viewport={{ once: true, margin: '-60px' }}
			transition={{ delay: index * 0.08 }}
			whileHover={{
				y: -6,
				transition: { type: 'spring', stiffness: 300 },
			}}
			className='group relative rounded-2xl overflow-hidden shadow-md bg-white border border-[#f0e0d0] cursor-default'>
			{/* Image */}
			<div className='relative h-44 overflow-hidden'>
				<img
					src={project.image}
					alt={project.label}
					className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
				/>
				{/* Gradient overlay */}
				<div className='absolute inset-0 bg-gradient-to-t from-[#3C2A25]/60 via-transparent to-transparent' />
				{/* Label on image */}
				<div className='absolute bottom-3 left-3 right-3'>
					<p className='text-white font-bold text-sm leading-tight drop-shadow-md'>
						{project.label}
					</p>
				</div>
			</div>
			{/* Description */}
			<div className='px-4 py-3'>
				<p className='text-[12px] text-[#7a5a42] leading-relaxed'>
					{project.desc}
				</p>
			</div>
		</motion.div>
	);
}

function DocLines() {
	return (
		<div className='space-y-1.5 w-full px-1'>
			<div className='h-1.5 bg-[#e8d5c4] rounded-full w-full' />
			<div className='h-1.5 bg-[#e8d5c4] rounded-full w-4/5' />
		</div>
	);
}

function BrandCard({ brand }) {
	const [hovered, setHovered] = useState(false);
	return (
		<motion.div
			variants={fadeUp}
			initial='hidden'
			whileInView='show'
			viewport={{ once: true }}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className='group relative flex flex-col rounded-2xl overflow-hidden shadow-md bg-white border border-[#f0e0d0] transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
			<div className='relative bg-gradient-to-b from-[#fff8f3] to-[#fdecd9] px-4 pt-5 pb-4 flex flex-col items-center gap-3'>
				<div className='absolute top-2 right-2 bg-[#B86B45] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase'>
					PDF
				</div>
				<img
					src={brand.logo}
					alt={`${brand.name} logo`}
					className='w-24 h-20 object-contain'
				/>
				<div className='w-full bg-white rounded-xl border border-[#ead9c8] p-3 shadow-inner'>
					<div className='flex items-center gap-2 mb-2.5 pb-2 border-b border-[#f0e0d0]'>
						<div className='w-6 h-7 bg-[#B86B45] rounded-sm flex items-center justify-center flex-shrink-0 relative'>
							<span className='text-white text-[7px] font-bold'>
								PDF
							</span>
							<div className='absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#fdecd9] rounded-bl-sm' />
						</div>
						<div className='flex flex-col gap-0.5 overflow-hidden'>
							<div className='h-1.5 bg-[#3C2A25]/30 rounded-full w-16' />
							<div className='h-1 bg-[#3C2A25]/15 rounded-full w-10' />
						</div>
					</div>
					<DocLines />
				</div>
			</div>
			<div className='px-4 py-3 flex flex-col gap-1 bg-white'>
				<p className='font-bold text-[#3C2A25] text-sm leading-tight'>
					{brand.name}
				</p>
				<p className='text-[11px] text-[#7a5a42] leading-tight'>
					{brand.docTitle}
				</p>
				<div className='flex items-center gap-2 mt-0.5'>
					<span className='text-[10px] bg-[#fdecd9] text-[#B86B45] font-semibold px-2 py-0.5 rounded-full'>
						{brand.docType}
					</span>
					<span className='text-[10px] text-[#b0917a]'>
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
				className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#3C2A25]/80 backdrop-blur-sm rounded-2xl cursor-pointer'>
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
		<main className='w-full bg-gradient-to-b from-white via-[#FFF4E8] to-[#F5B97A] overflow-hidden'>
			<div className='max-w-7xl mx-auto px-6 py-28 space-y-32'>
				{/* HERO */}
				<section className='grid lg:grid-cols-2 gap-14 items-center'>
					<div>
						<p className='text-xs uppercase tracking-[0.3em] text-[#4FA3D1] mb-6'>
							Global Experience
						</p>
						<h1 className='text-5xl font-serif text-[#3C2A25] leading-tight'>
							Electric Hamam & Underfloor Heating
							<span className='block text-[#B86B45] font-light'>
								in Kashmir & Across India
							</span>
						</h1>
						<p className='mt-6 text-lg text-[#3C2B27] max-w-lg'>
							Our electric hamam systems are trusted in Kashmir homes, luxury villas, hotels, mosques, and commercial projects. With over 500,000 installations across Kashmir and India since 2011, our teams deliver underfloor heating expertise built for -15C winters and power cut resilience.
						</p>
						<div className='flex gap-10 mt-10'>
							<div>
								<p className='text-3xl font-serif text-[#B86B45]'>
									500,000+
								</p>
								<p className='text-xs text-[#6B4A2D]'>
									Installations in Kashmir & India
								</p>
							</div>
							<div>
								<p className='text-3xl font-serif text-[#B86B45]'>
									2,000,000+
								</p>
								<p className='text-xs text-[#6B4A2D]'>
									Installations Worldwide
								</p>
							</div>
						</div>
					</div>
					<div className='relative h-[420px]'>
						<img
							src='/images/floor1.jpg'
							className='object-cover w-full h-full rounded-3xl'
							alt='Electric heating cable technology'
						/>
					</div>
				</section>

				{/* GLOBAL PROJECTS */}
				<section>
					<motion.h2
						className='text-4xl font-serif text-center text-[#3C2A25] mb-12'
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
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
					<h2 className='text-4xl font-serif text-center text-[#3C2A25] mb-14'>
						Our Installation Process
					</h2>
					<div className='grid md:grid-cols-5 gap-6'>
						{process.map((step, i) => (
							<motion.div
								key={step.title}
								variants={fadeUp}
								initial='hidden'
								whileInView='show'
								viewport={{ once: true }}
								transition={{ delay: i * 0.1 }}
								className='bg-white/70 rounded-3xl p-6 shadow hover:-translate-y-1'>
								<p className='text-xs text-[#4FA3D1] mb-2'>
									STEP {i + 1}
								</p>
								<h3 className='font-semibold text-[#3C2A25]'>
									{step.title}
								</h3>
								<p className='text-xs text-[#6B4A2D] mt-3 leading-relaxed'>
									{step.desc}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* TECHNOLOGY */}
				<section className='grid lg:grid-cols-2 gap-14 items-center'>
					<div className='relative h-[400px]'>
						<img
							src='/images/floor2.webp'
							className='object-cover w-full h-full rounded-3xl'
							alt='Heating cable technology'
						/>
					</div>
					<div>
						<h2 className='text-4xl font-serif text-[#3C2A25] mb-6'>
							Technology Behind Our Kashmir Systems
						</h2>
						<p className='text-sm text-[#3C2B27] leading-relaxed mb-5'>
							Our heating cables use advanced fluoropolymer insulation
							and multi-layer conductive cores that provide consistent
							radiant heat distribution. These systems are designed to
							operate safely beneath flooring materials while
							maintaining optimal energy efficiency.
						</p>
						<ul className='space-y-2 text-sm text-[#6B4A2D]'>
							<li>Fluoropolymer heating cable construction</li>
							<li>Variable wattage heating technology</li>
							<li>Waterproof insulation layers</li>
							<li>
								Compliance with international IEC electrical
								standards
							</li>
						</ul>
					</div>
				</section>

				{/* BRANDS */}
				<section>
					<motion.h2
						className='text-4xl font-serif text-center text-[#3C2A25] mb-4'
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						Brands We Work With
					</motion.h2>
					<motion.p
						className='text-center text-sm text-[#7a5a42] mb-12'
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}>
						Hover over any brand card to access the official
						installation documentation.
					</motion.p>
					<div className='grid md:grid-cols-3 lg:grid-cols-6 gap-5'>
						{brands.map((b) => (
							<BrandCard key={b.name} brand={b} />
						))}
					</div>
				</section>

				{/* PROJECTS WE SERVE */}
				<section>
					<motion.h2
						className='text-4xl font-serif text-center text-[#3C2A25] mb-4'
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}>
						Projects We Serve
					</motion.h2>
					<motion.p
						className='text-center text-sm text-[#7a5a42] mb-12'
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}>
						From intimate homes to grand commercial spaces — we heat
						them all.
					</motion.p>
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{projects.map((p, i) => (
							<ProjectCard key={p.label} project={p} index={i} />
						))}
					</div>
				</section>

				{/* WARRANTY */}
				<section className='bg-white/70 rounded-3xl p-12 shadow text-center'>
					<h2 className='text-4xl font-serif text-[#3C2A25] mb-6'>
						Reliability & Warranty
					</h2>
					<p className='text-sm text-[#3C2B27] max-w-2xl mx-auto leading-relaxed'>
						Our heating systems are built to last. Most installations
						are backed by warranties of up to 25 years, with extremely
						low repair rates thanks to advanced cable insulation and
						strict installation standards.
					</p>
					<div className='flex justify-center gap-12 mt-10'>
						<div>
							<p className='text-3xl font-serif text-[#B86B45]'>
								25+
							</p>
							<p className='text-xs text-[#6B4A2D]'>Years Warranty</p>
						</div>
						<div>
							<p className='text-3xl font-serif text-[#B86B45]'>
								0.01%
							</p>
							<p className='text-xs text-[#6B4A2D]'>Repair Rate</p>
						</div>
					</div>
				</section>

				{/* FAQ */}
				<section>
					<h2 className='text-4xl font-serif text-center text-[#3C2A25] mb-12'>
						Frequently Asked Questions
					</h2>
					<div className='max-w-3xl mx-auto bg-white/70 rounded-3xl p-8 shadow'>
						{faqs.map((f) => (
							<FaqItem key={f.q} {...f} />
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
