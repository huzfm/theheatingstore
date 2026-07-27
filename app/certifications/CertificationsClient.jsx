'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE / EASE — matches WhyChooseUsClient / HowItWorksClient / GlobalExperienceClient
// ─────────────────────────────────────────────────────────────────────────────

const C = {
	amber: '#E8933A',
	amberLt: '#F5B97A',
	rust: '#B86B45',
	text: '#FBF3EA',
	soft: 'rgba(251,243,234,0.60)',
	mute: 'rgba(251,243,234,0.40)',
	line: 'rgba(255,255,255,0.09)',
	glassBorder: 'rgba(255,255,255,0.10)',
};

const EASE = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLES
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ children }) {
	return (
		<div className='cert-badge'>
			<span className='cert-badge-dot' />
			{children}
		</div>
	);
}

// Blur-to-focus numeral/acronym reveal — identical pattern to the Counter
// component in WhyChooseUsClient / GlobalExperienceClient.
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

// Accent bar — scaleY grow-from-top, same duration/ease as the panel divider
// treatment in HowItWorksClient (adapted from scaleX to a vertical bar).
function AccentBar({ h = 'h-8' }) {
	return (
		<motion.div
			initial={{ scaleY: 0 }}
			whileInView={{ scaleY: 1 }}
			viewport={{ once: true, amount: 0.6 }}
			transition={{ duration: 0.6, ease: EASE }}
			style={{ transformOrigin: 'top' }}
			className={`${h} w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full`}
		/>
	);
}

function SectionHeader({ title, tag }) {
	return (
		<div className='flex items-center gap-3 mb-8'>
			<AccentBar />
			<h2
				style={{
					fontFamily: 'var(--font-heading)',
					fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
					fontWeight: 700,
					color: C.text,
					lineHeight: 1.2,
				}}>
				{title}
			</h2>
			{tag && <span className='cert-chip cert-chip-mono'>{tag}</span>}
		</div>
	);
}

// Scroll-triggered stagger grid: each child offset ~0.08s, y-travel + scale-in.
const gridContainer = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};
const gridCard = {
	hidden: { opacity: 0, y: 28, scale: 0.96 },
	show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function CertificationsClient() {
	return (
		<>
			<style>{CSS}</style>

			<section
				className='cert-noise cert-grid-bg relative w-full overflow-hidden'
				style={{
					background:
						'radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%)',
					fontFamily: 'var(--font-body)',
				}}>
				{/* Three-orb drift + vignette, same language as the rest of the site */}
				<div aria-hidden className='cert-aura'>
					<span className='cert-orb cert-orb-1' />
					<span className='cert-orb cert-orb-2' />
					<span className='cert-orb cert-orb-3' />
				</div>
				<div aria-hidden className='cert-vignette' />

				<div className='relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28' style={{ zIndex: 2 }}>
					{/* Hero Section — badge blur-in, heading staggered blur-in, then paragraph */}
					<div className='text-center mb-16'>
						<motion.div
							initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.6, ease: EASE }}
							className='flex justify-center'>
							<Badge>
								<span className='h-2 w-2 rounded-full bg-[#E8933A] cert-blink' />
								Kashmir #1 Seller · Since 2011
							</Badge>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
							className='mb-6 tracking-tight'
							style={{
								fontFamily: 'var(--font-heading)',
								fontSize: 'clamp(1.75rem, 4vw, 3rem)',
								fontWeight: 700,
								lineHeight: 1.1,
								color: C.text,
							}}>
							Electric Hamam Certifications &{' '}
							<span className='cert-h-accent'>Installation Standards</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
							className='text-lg max-w-3xl mx-auto leading-relaxed'
							style={{ color: C.soft }}>
							We partner with the world's most trusted underfloor heating manufacturers and supply certified electric hamam systems across Kashmir, India, and international markets. Our Kashmir-installed systems combine advanced heating technology with{' '}
							<a href='/product' className='cert-link'>internationally recognized safety standards</a>, engineered for -15C winters, power cut resilience, and humidity.
						</motion.p>
					</div>

					{/* Partner Brands */}
					<motion.div
						initial={{ opacity: 0, y: 24, scale: 0.98 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7, ease: EASE }}
						className='mb-16'>
						<div className='cert-card cert-card-hover rounded-3xl p-8'>
							<div className='flex items-center gap-3 mb-4'>
								<AccentBar h='h-10' />
								<h2
									className='text-2xl font-bold'
									style={{ fontFamily: 'var(--font-heading)', color: C.text }}>
									Kashmir-Installed Premium Brands
								</h2>
							</div>
							<p className='mb-4' style={{ color: C.soft }}>
								Our Kashmir-installed product range includes premium heating technologies
								from leading brands:{' '}
								<a href='#prowarm-pdf' className='cert-link cert-link-strong'>ProWarm</a>,{' '}
								<a href='#warmup-pdf' className='cert-link cert-link-strong'>Warmup</a>,{' '}
								<a href='#thermosphere-pdf' className='cert-link cert-link-strong'>ThermoSphere</a>, and{' '}
								<a href='#fastwarm-pdf' className='cert-link cert-link-strong'>FastWarm</a>, all backed by our Kashmir-based warranty and support.
							</p>
							<p style={{ color: C.soft }}>
								Together, these systems have powered hundreds of
								thousands of installations worldwide, delivering proven
								reliability across residential, commercial, and luxury
								developments.
							</p>
						</div>
					</motion.div>

					{/* International Certifications */}
					<div className='mb-16'>
						<SectionHeader title='International Certifications' tag='COMPLIANCE' />

						<motion.div
							variants={gridContainer}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, amount: 0.2 }}
							className='grid gap-6 md:grid-cols-2'>
							{/* CE Certification */}
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='flex items-start justify-between'>
									<div>
										<div className='text-4xl sm:text-5xl font-black mb-2' style={{ color: C.rust }}>
											<Counter display='CE' />
										</div>
										<h3
											style={{
												fontFamily: 'var(--font-heading)',
												fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
												fontWeight: 700,
												color: C.text,
												lineHeight: 1.3,
												marginBottom: '0.75rem',
											}}>
											CE & UKCA Certification
										</h3>
									</div>
									<div className='text-right'>
										<div className='text-2xl font-bold' style={{ color: C.amber }}>
											&#10003;
										</div>
										<div className='text-xs' style={{ color: C.mute }}>
											APPROVED
										</div>
									</div>
								</div>
								<p className='mb-4' style={{ color: C.soft }}>
									All heating systems comply with international safety and performance standards, with Kashmir testing for heat retention, power cut resilience, and humidity.
								</p>
								<div className='flex gap-2 mt-2'>
									<span className='cert-chip cert-chip-mono'>EN 60335</span>
									<span className='cert-chip cert-chip-mono'>UKCA 2025</span>
								</div>
							</motion.div>

							{/* IEC Certification */}
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='flex items-start justify-between'>
									<div>
										<div className='text-4xl sm:text-5xl font-black mb-2' style={{ color: C.rust }}>
											<Counter display='IEC' />
										</div>
										<h3
											style={{
												fontFamily: 'var(--font-heading)',
												fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
												fontWeight: 700,
												color: C.text,
												lineHeight: 1.3,
												marginBottom: '0.75rem',
											}}>
											IEC 60335 Safety
										</h3>
									</div>
									<div className='text-right'>
										<div className='text-2xl font-bold' style={{ color: C.amber }}>
											&#9889;
										</div>
										<div className='text-xs' style={{ color: C.mute }}>
											CERTIFIED
										</div>
									</div>
								</div>
								<p style={{ color: C.soft }}>
									Meets international safety standards for electrical appliances, with Kashmir consideration for humidity, altitude, and power fluctuation conditions.
								</p>
							</motion.div>

							{/* ISO 9001 */}
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='flex items-start justify-between'>
									<div>
										<div className='text-4xl sm:text-5xl font-black mb-2' style={{ color: C.rust }}>
											<Counter display='ISO' />
										</div>
										<h3
											style={{
												fontFamily: 'var(--font-heading)',
												fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
												fontWeight: 700,
												color: C.text,
												lineHeight: 1.3,
												marginBottom: '0.75rem',
											}}>
											ISO 9001:2015
										</h3>
									</div>
									<div className='text-right'>
										<div className='text-2xl font-bold' style={{ color: C.amber }}>
											&#10003;
										</div>
										<div className='text-xs' style={{ color: C.mute }}>QMS</div>
									</div>
								</div>
								<p style={{ color: C.soft }}>
									Quality management certified manufacturing processes ensuring consistent product testing and reliability, installed across Kashmir since 2011.
								</p>
							</motion.div>

							{/* Global Compliance */}
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='flex items-start justify-between'>
									<div>
										<div className='text-4xl sm:text-5xl font-black mb-2' style={{ color: C.rust }}>
											<Counter display='UL' />
										</div>
										<h3
											style={{
												fontFamily: 'var(--font-heading)',
												fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
												fontWeight: 700,
												color: C.text,
												lineHeight: 1.3,
												marginBottom: '0.75rem',
											}}>
											Global Approvals
										</h3>
									</div>
									<div className='text-right'>
										<div className='text-2xl font-bold' style={{ color: C.amber }}>
											&#127760;
										</div>
										<div className='text-xs' style={{ color: C.mute }}>
											WORLDWIDE
										</div>
									</div>
								</div>
								<p className='mb-3' style={{ color: C.soft }}>
									International certifications for global markets:
								</p>
								<div className='flex flex-wrap gap-2'>
									<span className='cert-chip'>UL / cUL</span>
									<span className='cert-chip'>CSA</span>
									<span className='cert-chip'>VDE</span>
									<span className='cert-chip'>SEMKO</span>
								</div>
							</motion.div>
						</motion.div>
					</div>

					{/* Water-Based Systems */}
					<div className='mb-16'>
						<SectionHeader title='Water-Based Standards' tag='HYDRONIC' />

						<motion.div
							variants={gridContainer}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, amount: 0.2 }}
							className='grid gap-6 md:grid-cols-2'>
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='text-3xl sm:text-4xl font-black mb-3' style={{ color: C.rust }}>
									<Counter display='WRAS' />
								</div>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.75rem',
									}}>
									WRAS Approved Components
								</h3>
								<p style={{ color: C.soft }}>
									Water-based systems use WRAS-approved pipes and
									fittings, complying with Water Supply Regulations and
									Scottish Byelaws. All manifold assemblies meet strict
									hygienic standards.
								</p>
								<div className='mt-4 text-xs font-mono' style={{ color: C.amberLt }}>
									REG. NO. 2406012
								</div>
							</motion.div>

							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='text-3xl sm:text-4xl font-black mb-3' style={{ color: C.rust }}>
									<Counter display='EN ISO' />
								</div>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.75rem',
									}}>
									EN ISO 21003 Multilayer Pipe
								</h3>
								<p className='mb-3' style={{ color: C.soft }}>
									PERT-AL-PERT multilayer pipes manufactured to EN ISO
									21003-1:
								</p>
								<ul className='space-y-2' style={{ color: C.soft }}>
									<li className='flex items-center gap-2'>
										<span style={{ color: C.amber }}>&#10003;</span> Aluminium
										oxygen barrier
									</li>
									<li className='flex items-center gap-2'>
										<span style={{ color: C.amber }}>&#10003;</span> Corrosion
										resistance
									</li>
									<li className='flex items-center gap-2'>
										<span style={{ color: C.amber }}>&#10003;</span> 50-year
										durability
									</li>
								</ul>
							</motion.div>
						</motion.div>
					</div>

					{/* Safety & Installation */}
					<div className='mb-16'>
						<SectionHeader title='Safety & Installation' />

						<motion.div
							variants={gridContainer}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, amount: 0.2 }}
							className='grid gap-6 md:grid-cols-3'>
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='text-3xl font-black mb-3' style={{ color: C.rust }}>
									<Counter display='TWISTED' />
								</div>
								<h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
									Advanced Cable Technology
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									TwistedTwin&#8482; technology reduces cable stress, improves
									flexibility, and enhances long-term durability with
									dual conductor architecture.
								</p>
							</motion.div>

							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='text-3xl font-black mb-3' style={{ color: C.rust }}>
									<Counter display='EARTH' />
								</div>
								<h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
									Continuous Earth Protection
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									Full metallic shielding with continuous earth
									protection braids for enhanced electrical safety and
									system reliability.
								</p>
							</motion.div>

							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<div className='text-3xl font-black mb-3' style={{ color: C.rust }}>
									<Counter display='18th ED' />
								</div>
								<h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
									Electrical Compliance
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									Complies with IET Electrical Regulations (BS7671) and
									18th Edition wiring standards for safe installation.
								</p>
							</motion.div>
						</motion.div>
					</div>

					{/* Warranty */}
					<div className='mb-16'>
						<SectionHeader title='Warranty & Protection' />

						<motion.div
							variants={gridContainer}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, amount: 0.2 }}
							className='grid gap-6 md:grid-cols-2'>
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8 text-center'>
								<div className='text-4xl sm:text-5xl font-black mb-2' style={{ color: C.rust }}>
									<Counter display='100%' />
								</div>
								<div className='text-sm font-mono mb-3' style={{ color: C.amberLt }}>
									COVERAGE
								</div>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.5rem',
									}}>
									Installation Protection
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									Cables replaced if damaged during installation before
									flooring is completed.
								</p>
							</motion.div>

							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8 text-center'>
								<div className='text-4xl sm:text-5xl font-black mb-2' style={{ color: C.rust }}>
									<Counter display='50' />
								</div>
								<div className='text-sm font-mono mb-3' style={{ color: C.amberLt }}>
									YEARS
								</div>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.5rem',
									}}>
									Pipe Guarantee
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									25-50 year guarantees on multilayer pipework for
									hydronic systems.
								</p>
							</motion.div>
						</motion.div>
					</div>

					{/* Global Track Record */}
					<motion.div
						initial={{ opacity: 0, y: 24, scale: 0.98 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7, ease: EASE }}
						className='mb-16'>
						<div className='cert-card cert-card-hover rounded-3xl p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<AccentBar />
								<h2
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.2,
									}}>
									Global Track Record
								</h2>
							</div>
							<p className='mb-6' style={{ color: C.soft }}>
								Installed in hundreds of thousands of properties
								worldwide:
							</p>

							<motion.div
								initial='hidden'
								whileInView='show'
								viewport={{ once: true, amount: 0.3 }}
								variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
								className='grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6'>
								{[
									'250,000+ Residential homes',
									'Luxury apartments',
									'Hotels & resorts',
									'Commercial buildings',
									'Healthcare facilities',
								].map((label) => (
									<motion.div
										key={label}
										variants={{
											hidden: { opacity: 0, y: 14, scale: 0.96 },
											show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
										}}
										className='cert-track-chip flex items-center gap-3 p-3 rounded-xl'>
										<span className='h-3 w-3 rounded-full' style={{ background: C.amber }} />
										<span className='font-medium' style={{ color: C.text }}>
											{label}
										</span>
									</motion.div>
								))}
							</motion.div>
						</div>
					</motion.div>

					{/* Project Intelligence */}
					<div className='mb-16'>
						<SectionHeader title='Project Intelligence' />
						<motion.div
							variants={gridContainer}
							initial='hidden'
							whileInView='show'
							viewport={{ once: true, amount: 0.2 }}
							className='grid gap-6 md:grid-cols-3'>
							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.75rem',
									}}>
									Installation-First Product Experience
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									Real on-site visuals showcasing workforce, floor preparation,
									wirings layers, focused on execution, not marketing renders.
								</p>
							</motion.div>

							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.75rem',
									}}>
									Intelligent Project Cost Calculator
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									Area-based system calculation with unit quantity, cost breakup,
									labour estimation and thermostat inclusion.
								</p>
							</motion.div>

							<motion.div
								variants={gridCard}
								whileHover={{ y: -4 }}
								className='cert-card cert-card-hover rounded-3xl p-8'>
								<h3
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
										fontWeight: 700,
										color: C.text,
										lineHeight: 1.3,
										marginBottom: '0.75rem',
									}}>
									End-to-End Project Guidance
								</h3>
								<p className='text-sm' style={{ color: C.soft }}>
									Clear explanation of workflow, safety standards, energy efficiency
									and long-term reliability, helping clients understand their investment.
								</p>
							</motion.div>
						</motion.div>
					</div>

					{/* Technical Support */}
					<motion.div
						initial={{ opacity: 0, y: 24, scale: 0.98 }}
						whileInView={{ opacity: 1, y: 0, scale: 1 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<div
							className='rounded-3xl p-10 text-white'
							style={{
								background: 'linear-gradient(135deg, #B86B45 0%, #E8933A 100%)',
								boxShadow: '0 24px 70px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
								border: '1px solid rgba(255,255,255,0.12)',
							}}>
							<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
								<div>
									<h2
										style={{
											fontFamily: 'var(--font-heading)',
											fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
											fontWeight: 700,
											color: 'white',
											lineHeight: 1.2,
											marginBottom: '1rem',
											letterSpacing: '0',
										}}>
										Technical Support & Kashmir Expertise
									</h2>
									<p className='text-white/90 max-w-2xl'>
										Our Kashmir-based technical team provides ongoing support to ensure every installation meets the highest standards.
									</p>
								</div>
								<div
									className='rounded-2xl px-6 py-3 text-center'
									style={{
										background: 'rgba(255,255,255,0.2)',
										backdropFilter: 'blur(16px)',
									}}>
									<div className='text-2xl font-bold'>24/7</div>
									<div className='text-xs uppercase tracking-wider'>
										Technical Helpline
									</div>
								</div>
							</div>

							<div className='grid gap-3 md:grid-cols-2 mt-8'>
								<div
									className='flex items-center gap-3 rounded-xl p-3'
									style={{ background: 'rgba(255,255,255,0.1)' }}>
									<span className='h-2 w-2 rounded-full bg-white'></span>
									<span className='text-white/95'>
										Expert product consultation
									</span>
								</div>
								<div
									className='flex items-center gap-3 rounded-xl p-3'
									style={{ background: 'rgba(255,255,255,0.1)' }}>
									<span className='h-2 w-2 rounded-full bg-white'></span>
									<span className='text-white/95'>
										Installation guidance & CAD support
									</span>
								</div>
								<div
									className='flex items-center gap-3 rounded-xl p-3'
									style={{ background: 'rgba(255,255,255,0.1)' }}>
									<span className='h-2 w-2 rounded-full bg-white'></span>
									<span className='text-white/95'>
										Lifetime technical support
									</span>
								</div>
								<div
									className='flex items-center gap-3 rounded-xl p-3'
									style={{ background: 'rgba(255,255,255,0.1)' }}>
									<span className='h-2 w-2 rounded-full bg-white'></span>
									<span className='text-white/95'>
										System selection & design assistance
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS — orb drift, noise texture, vignette, glass card, chips, shimmer accent.
// Same values/timings as WhyChooseUsClient / HowItWorksClient / LocalExperienceClient.
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
@keyframes cert-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes cert-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
@keyframes cert-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
@keyframes cert-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }

.cert-noise::before {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.045;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.cert-grid-bg::after {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
  background-image:
    repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 80px,rgba(255,255,255,.02) 80px),
    repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 80px,rgba(255,255,255,.02) 80px);
}
.cert-vignette {
  position:absolute; inset:0; z-index:0; pointer-events:none;
  background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%);
}
.cert-aura { position:absolute; inset:-10%; z-index:0; pointer-events:none; filter: blur(14px); }
.cert-orb { position:absolute; border-radius:50%; }
.cert-orb-1 { top:-14%; left:2%; width:34vw; height:34vw; max-width:480px; max-height:480px; background: radial-gradient(circle, rgba(232,147,58,0.28), transparent 62%); animation: cert-drift 26s ease-in-out infinite; }
.cert-orb-2 { top:6%; right:-4%; width:30vw; height:30vw; max-width:420px; max-height:420px; background: radial-gradient(circle, rgba(255,126,95,0.18), transparent 62%); animation: cert-drift2 31s ease-in-out infinite; }
.cert-orb-3 { bottom:-10%; left:38%; width:26vw; height:26vw; max-width:360px; max-height:360px; background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: cert-drift 33s ease-in-out infinite reverse; }

.cert-badge {
  display:inline-flex; align-items:center; gap:9px;
  padding:8px 22px; border-radius:999px;
  font-family:var(--font-body); font-size:11px; font-weight:600;
  text-transform:uppercase; letter-spacing:0.35em; color:#F5B97A;
  background: rgba(232,147,58,0.08);
  border:1px solid rgba(232,147,58,0.22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4);
  backdrop-filter: blur(12px);
}
.cert-badge-dot { animation: cert-blink 2s ease-in-out infinite; }

.cert-h-accent {
  font-weight:700;
  background:linear-gradient(100deg,#E8933A,#F5B97A 30%,#FF7E5F 55%,#F5B97A 80%,#E8933A);
  background-size:200% auto; -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; color:transparent;
  animation: cert-shimmer 6s linear infinite;
}

.cert-link { color:#F5B97A; text-underline-offset:2px; text-decoration:underline; transition:color .2s ease; }
.cert-link:hover { color:#E8933A; }
.cert-link-strong { font-weight:600; }

/* Shared dark-glass card recipe — single definition for every card instance */
.cert-card {
  position:relative;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
    rgba(20,13,8,0.5);
  backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
  border:1px solid rgba(255,255,255,0.10);
  box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
  transition: transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s ease;
}
.cert-card-hover::after {
  content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
  opacity:0; transition:opacity .5s ease;
  background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
.cert-card-hover:hover::after { opacity:1; }
.cert-card-hover:hover { box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 40px -12px rgba(232,147,58,0.4); }

/* Dark-glass chip / pill */
.cert-chip {
  display:inline-flex; align-items:center; padding:6px 14px; border-radius:999px;
  font-family:var(--font-body); font-size:12px; font-weight:500; color:#F5B97A;
  background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.10);
}
.cert-chip-mono { font-family:monospace; font-size:12px; }

.cert-track-chip {
  background: rgba(232,147,58,0.08);
  border: 1px solid rgba(232,147,58,0.15);
}

@media (prefers-reduced-motion: reduce) {
  .cert-orb-1, .cert-orb-2, .cert-orb-3, .cert-h-accent, .cert-badge-dot { animation:none !important; }
}
`;
