'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';

const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
};


const brands = [
	{
		name: 'ProWarm',
		desc: "UK's #1 best-selling electric underfloor heating brand with over 300,000 systems sold worldwide. CE certified by SGS to IEC 60335 standards. Every system ships with a Lifetime Warranty and the CableSafe™ Guarantee — if the heating cable is accidentally cut during installation, ProWarm replaces it free of charge.",
	},
	{
		name: 'Warmup',
		desc: "The world's best-selling floor heating brand since 1994, with over 2.5 million systems installed across 72 countries. ISO 9001:2015 certified and accredited by BEAB, UL, CSA, FIMKO and SEMKO. Winner of the Queen's Award for Enterprise 2020. Every system backed by a Limited Lifetime Warranty and the SafetyNet™ Installation Guarantee.",
	},
	{
		name: 'ThermoSphere',
		desc: "Designed and manufactured in Great Britain with over 25 years of heating innovation. Features the exclusive TwistedTwin™ cable technology — a twisted dual-conductor construction that eliminates electromagnetic fields, minimises cable stress, and delivers industry-leading longevity. IP68 rated, fully earthed, and backed by a Lifetime Guarantee on every system.",
	},
	{
		name: 'AmberHeat',
		desc: 'Premium CE certified radiant heating systems engineered for extreme cold climates. AmberHeat systems are specified for Kashmir and high-altitude installations where sustained heat retention during power interruptions is critical. Enhanced thermal mass design delivers 4 to 6 hours of residual warmth after power cut — built for Kashmir winters.',
	},
	{
		name: 'FastWarm',
		desc: 'Complete all-in-one heating kits approved to IEC and CE standards, designed for rapid residential and commercial installation. Every kit is supplied in a single box with full-colour instructions and backed by a 25 to 50-year pipe guarantee. Rapid WhatsApp technical support ensures on-site queries are resolved without installation delays.',
	},
	{
		name: 'nVent',
		desc: "The global leader in electric heat tracing and radiant floor heating, operating across 60+ countries for over 50 years. nVent RAYCHEM pioneered self-regulating heating cable technology and remains the benchmark for industrial-grade residential heating. Systems are IEC certified and backed by a 20-year Total Care Warranty when installed by a Certified PRO installer.",
	},
];
const serviceNetwork = [
	{
		region: 'Jammu & Kashmir',
		places: [
			'Srinagar',
			'Anantnag',
			'Kupwara',
			'Baramulla',
			'Pulwama',
			'Budgam',
			'Sopore'
		],
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
    a: 'Absolutely. Our systems are rated to operate in sub-zero conditions down to -20°C. The layered concrete thermal mass method stores heat for 4–6 hours post power cut — critical for Kashmir\'s load-shedding schedule. Every installation is cold-climate certified.',
  },
  {
    category: 'Performance',
    q: 'How long does the floor take to heat up?',
    a: 'Typically 30–45 minutes from cold start. With our smart thermostats set on a schedule, the floor is warm before you wake up. Thermal retention means it stays warm long after the system switches off.',
  },
  {
    category: 'Installation',
    q: 'Can it be installed in an existing home without major renovation?',
    a: 'Yes. Our ultra-thin heating mats add only 3–4mm to floor height — no screed pour required in most retrofit cases. We handle everything from survey to commissioning. Zero structural disruption.',
  },
  {
    category: 'Installation',
    q: 'Which floor types are compatible?',
    a: 'All of them — marble, granite, ceramic tile, natural stone, and engineered wood. We have installed across every floor type common to Kashmiri residential and commercial construction.',
  },
  {
    category: 'Cost & Running',
    q: 'What does it cost to run monthly?',
    a: 'A typical Kashmir bathroom (50–80 sq ft) costs INR 1000–1500 per month at standard J&K tariff rates. Our smart thermostats cut consumption by 30–40% by learning your usage pattern and Kashmir\'s power schedules automatically.',
  },

  {
    category: 'Warranty & Support',
    q: 'What warranty do I get?',
    a: 'Every system carries a 10 to 25+ year product warranty — the longest in the industry. Parts and labour are fully covered. No excess, no exclusions for normal use. Fully transferable if you sell the property.',
  },
  {
    category: 'Warranty & Support',
    q: 'What happens if something goes wrong?',
    a: 'We guarantee replacement within 24 hours anywhere in India. Our 0.01% fault rate across 2 million+ global installations means this almost never happens — but when it does, we respond the same day.',
  },
  {
    category: 'Warranty & Support',
    q: 'Do you service systems installed years ago?',
    a: 'Yes. We support every system we have ever installed. Our Srinagar team handles ongoing servicing, thermostat upgrades, and zone expansions for existing customers at preferential rates.',
  },
];
function PremiumFaqItem({ q, a, index }) {
	const [open, setOpen] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.08, duration: 0.6 }}
			viewport={{ once: true }}
			className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
				open
					? 'bg-white border-[#B86B45]/30 shadow-lg shadow-[#B86B45]/10'
					: 'bg-white/60 backdrop-blur-sm border-white/70 hover:bg-white/80 hover:border-[#B86B45]/20'
			}`}
		>
			<button
				onClick={() => setOpen(!open)}
				className='flex justify-between w-full text-left items-center gap-4 px-7 py-5'
			>
				<div className='flex items-center gap-4'>
					<span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
						open ? 'bg-[#B86B45] text-white' : 'bg-[#B86B45]/10 text-[#B86B45]'
					}`}>
						{index + 1}
					</span>
					<span className='font-semibold text-[#3C2A25] text-base leading-snug'>{q}</span>
				</div>
				<span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
					open
						? 'bg-[#B86B45] border-[#B86B45] rotate-45'
						: 'bg-white border-[#B86B45]/25 group-hover:border-[#B86B45]/50'
				}`}>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? 'white' : '#B86B45'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
						<path d="M12 5v14M5 12h14"/>
					</svg>
				</span>
			</button>
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className='overflow-hidden'
					>
						<div className='px-7 pb-6 pt-1 flex gap-4'>
							<div className='w-7 flex-shrink-0' />
							<p className='text-[#6B4A2D] text-sm leading-relaxed'>{a}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default function UnderfloorHeatingIndiaClient() {
	const heroRef = useRef(null);
	const heroIn = useInView(heroRef, { once: true });

	return (
		<main className='w-full overflow-hidden bg-gradient-to-b from-white via-[#FFF4E8] to-[#F5B97A]'>
			<div className='max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-32'>
				{/* HERO */}

				<section ref={heroRef}>
					<div className='grid lg:grid-cols-2 gap-14 items-center'>
						<motion.div
							variants={fadeUp}
							initial='hidden'
							animate={heroIn ? 'show' : 'hidden'}>
							<p className='text-xs uppercase tracking-[0.3em] text-[#4FA3D1] mb-6'>
								Kashmir #1 Seller · Since 2011
							</p>

							<h1 className='text-4xl lg:text-6xl font-serif text-[#3C2A25] leading-[1.15] mb-0'>
								Electric Hamam & Underfloor Heating 
								<span className='text-[#B86B45] font-light leading-[1.15]'>
									 in Kashmir & Across India
								</span>
							</h1>

							<p className='mt-6 text-lg text-[#3C2B27] max-w-lg'>
								Electric hamam systems engineered for Kashmir winters silent radiant warmth rising from beneath your floor. No radiators. No cold spots. Built to retain heat for hours during power cuts.
							</p>

							<div className='flex gap-3 mt-8'>
								<Link
									href='/SpaceVerification'
									className='rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] px-8 py-3 text-white font-semibold shadow-lg hover:scale-[1.03] transition-transform duration-200'>
									Verify My Space
								</Link>

								<Link
									href='/contact'
									className='rounded-full border border-[#3C2A25]/20 bg-white/60 backdrop-blur-sm px-8 py-3 font-semibold text-[#3C2A25] hover:bg-white/90 transition-colors duration-200'>
									Talk to Expert
								</Link>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={heroIn ? { opacity: 1, scale: 1 } : {}}
							transition={{ duration: 1 }}
							className='relative h-[480px]'>
							<img
								src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
								alt='Luxury home'
								className='object-cover rounded-3xl w-full h-full'
							/>
						</motion.div>
					</div>
				</section>

				{/* BRANDS */}

				<section>
					<h2 className='text-4xl font-serif text-center mb-12 text-[#3C2A25]'>
						Premium Heating Brands
					</h2>

					<div className='grid md:grid-cols-3 gap-8'>
						{brands.map((brand) => (
							<motion.div
								key={brand.name}
								whileHover={{ y: -6 }}
								className='bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg'>
								<h3 className='text-2xl font-serif text-[#3C2A25]'>
									{brand.name}
								</h3>

								<p className='text-xs mt-1 text-[#6B4A2D]'>
									{brand.origin}
								</p>

								<p className='text-xs text-[#6B4A2D] mt-4'>
									{brand.desc}
								</p>

						
							</motion.div>
						))}
					</div>
				</section>

				{/* SERVICE NETWORK */}

				<section>
					<h2 className='text-4xl font-serif text-center text-[#3C2A25] mb-12'>
						Our Service Network
					</h2>

					<div className='grid lg:grid-cols-2 gap-14 items-center'>
						<div className='relative sm:h-[660px]'>
							<img
								src='https://images.unsplash.com/photo-1733094151451-4222a842cfd1?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
								alt='India service network map'
								className='object-cover w-full h-full rounded-3xl'
							/>
						</div>

						<div className='space-y-6'>
							{serviceNetwork.map((region, i) => (
								<motion.div
									key={region.region}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.1 }}
									className='bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow'>
									<h3 className='font-semibold text-[#3C2A25] mb-3'>
										{region.region}
									</h3>

									<div className='flex flex-wrap gap-2'>
										{region.places.map((place) => (
											<span
												key={place}
												className='text-xs bg-[#F5E6D8] px-3 py-1 rounded-full text-[#6B4A2D]'>
												{place}
											</span>
										))}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* FAQ */}

				<section className='relative'>
					{/* Section header */}
					<div className='text-center mb-16'>
						<span className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#B86B45]/10 border border-[#B86B45]/20 text-[#B86B45] text-[10px] font-semibold tracking-[0.3em] uppercase mb-5'>
							<span className='w-1.5 h-1.5 rounded-full bg-[#B86B45] animate-pulse' />
							Common Questions
						</span>
						<h2 className='font-serif text-4xl lg:text-5xl text-[#3C2A25] leading-tight'>
							Everything You Need
							<span className='block text-[#B86B45] font-light'>To Know</span>
						</h2>
						<p className='mt-4 text-[#6B4A2D] text-base max-w-md mx-auto'>
							Straight answers about electric hamam and underfloor heating for Kashmir homes.
						</p>
					</div>

					{/* FAQ cards */}
					<div className='max-w-3xl mx-auto space-y-3'>
						{faqs.map((f, i) => (
							<PremiumFaqItem key={f.q} q={f.q} a={f.a} index={i} />
						))}
					</div>

					{/* Bottom CTA */}
					<div className='mt-14 text-center'>
						<p className='text-[#6B4A2D] text-sm mb-5'>Still have questions?</p>
						<Link href='/contact' className='inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] px-8 py-3.5 text-white font-semibold text-sm shadow-lg shadow-[#B86B45]/25 hover:scale-[1.03] transition-transform duration-200'>
							Talk to Our Expert
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
