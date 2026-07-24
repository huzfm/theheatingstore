'use client';

import { motion } from 'framer-motion';

const wrap = {
	initial: { opacity: 0, y: 12 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: 'easeOut' },
};

export default function CertificationsClient() {
	return (
		<section
			className='relative w-full overflow-hidden'
			style={{
				background:
					'linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 35%,#FFE0C2 70%,#F5B97A 100%)',
				fontFamily: "var(--font-body)",
			}}>
			{/* Warm texture overlays */}
			<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(184,107,69,0.08),transparent_70%)]' />
			<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(232,147,58,0.06),transparent_60%)]' />
			<div className='pointer-events-none absolute inset-0 opacity-[0.02] [background-image:repeating-linear-gradient(45deg,#B86B45_0px,#B86B45_1px,transparent_1px,transparent_12px)]' />

			<div className='relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28'>
				{/* Hero Section */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='text-center mb-16'>
					<div className='inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-[#F5B97A]/50 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#B86B45] mb-6 shadow-sm'>
						<span className='h-2 w-2 rounded-full bg-[#E8933A] animate-pulse' />
						Kashmir #1 Seller · Since 2011
					</div>

					<h1
						className='mb-6 tracking-tight'
						style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.1, color: '#3C2A25' }}>
						Electric Hamam Certifications &{' '}
						<span className='text-[#B86B45]'>Installation Standards</span>
					</h1>

					<p className='text-lg text-[#3C2B27]/80 max-w-3xl mx-auto leading-relaxed'>
						We partner with the world's most trusted underfloor heating manufacturers and supply certified electric hamam systems across Kashmir, India, and international markets. Our Kashmir-installed systems combine advanced heating technology with <a href='/product' className='text-[#B86B45] underline underline-offset-2 hover:text-[#E8933A] transition-colors'>internationally recognized safety standards</a> — engineered for -15C winters, power cut resilience, and humidity.
					</p>
				</motion.div>

				{/* Partner Brands */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div
						className='rounded-3xl p-8 transition-all duration-300'
						style={{
							background: 'rgba(255,255,255,0.68)',
							backdropFilter: 'blur(28px)',
							WebkitBackdropFilter: 'blur(28px)',
							border: '1px solid rgba(255,255,255,0.5)',
							boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
						}}>
						<div className='flex items-center gap-3 mb-4'>
							<div className='h-10 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full'></div>
							<h2
								className='text-2xl font-bold text-[#3C2A25]'
								style={{ fontFamily: "var(--font-heading)" }}>
								Kashmir-Installed Premium Brands
							</h2>
						</div>
						<p className='text-[#3C2B27]/80 mb-4'>
							Our Kashmir-installed product range includes premium heating technologies
							from leading brands:{' '}
							<a href='#prowarm-pdf' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>ProWarm</a>,{' '}
							<a href='#warmup-pdf' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>Warmup</a>,{' '}
							<a href='#thermosphere-pdf' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>ThermoSphere</a>, and{' '}
							<a href='#fastwarm-pdf' className='text-[#B86B45] font-semibold underline underline-offset-2 hover:text-[#E8933A] transition-colors'>FastWarm</a> — all backed by our Kashmir-based warranty and support.
						</p>
						<p className='text-[#3C2B27]/80'>
							Together, these systems have powered hundreds of
							thousands of installations worldwide, delivering proven
							reliability across residential, commercial, and luxury
							developments.
						</p>
					</div>
				</motion.div>

				{/* International Certifications */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div className='flex items-center gap-3 mb-8'>
						<div className='h-8 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full'></div>
						<h2
							style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.2 }}>
							International Certifications
						</h2>
						<span
							className='text-[#B86B45] font-mono text-sm px-3 py-1 rounded-full'
							style={{ background: 'rgba(184,107,69,0.12)' }}>
							COMPLIANCE
						</span>
					</div>

					<div className='grid gap-6 md:grid-cols-2'>
						{/* CE Certification */}
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='flex items-start justify-between'>
								<div>
									<div className='text-4xl sm:text-5xl font-black text-[#B86B45] mb-2'>
										CE
									</div>
									<h3
										style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
										CE & UKCA Certification
									</h3>
								</div>
								<div className='text-right'>
									<div className='text-2xl font-bold text-[#E8933A]'>
										&#10003;
									</div>
									<div className='text-xs text-[#6B4A2D]'>
										APPROVED
									</div>
								</div>
							</div>
							<p className='text-[#3C2B27]/80 mb-4'>
								All heating systems comply with international safety and performance standards, with Kashmir testing for heat retention, power cut resilience, and humidity.
							</p>
							<div className='flex gap-2 mt-2'>
								<span
									className='text-xs px-2 py-1 rounded-full font-mono'
									style={{
										background: 'rgba(232,147,58,0.12)',
										color: '#B86B45',
									}}>
									EN 60335
								</span>
								<span
									className='text-xs px-2 py-1 rounded-full font-mono'
									style={{
										background: 'rgba(184,107,69,0.12)',
										color: '#B86B45',
									}}>
									UKCA 2025
								</span>
							</div>
						</motion.div>

						{/* IEC Certification */}
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='flex items-start justify-between'>
								<div>
									<div className='text-4xl sm:text-5xl font-black text-[#B86B45] mb-2'>
										IEC
									</div>
									<h3
										style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
										IEC 60335 Safety
									</h3>
								</div>
								<div className='text-right'>
									<div className='text-2xl font-bold text-[#E8933A]'>
										&#9889;
									</div>
									<div className='text-xs text-[#6B4A2D]'>
										CERTIFIED
									</div>
								</div>
							</div>
							<p className='text-[#3C2B27]/80'>
								Meets international safety standards for electrical appliances, with Kashmir consideration for humidity, altitude, and power fluctuation conditions.
							</p>
						</motion.div>

						{/* ISO 9001 */}
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='flex items-start justify-between'>
								<div>
									<div className='text-4xl sm:text-5xl font-black text-[#B86B45] mb-2'>
										ISO
									</div>
									<h3
										style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
										ISO 9001:2015
									</h3>
								</div>
								<div className='text-right'>
									<div className='text-2xl font-bold text-[#E8933A]'>
										&#10003;
									</div>
									<div className='text-xs text-[#6B4A2D]'>QMS</div>
								</div>
							</div>
							<p className='text-[#3C2B27]/80'>
								Quality management certified manufacturing processes ensuring consistent product testing and reliability — installed across Kashmir since 2011.
							</p>
						</motion.div>

						{/* Global Compliance */}
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='flex items-start justify-between'>
								<div>
									<div className='text-4xl sm:text-5xl font-black text-[#B86B45] mb-2'>
										UL
									</div>
									<h3
										style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
										Global Approvals
									</h3>
								</div>
								<div className='text-right'>
									<div className='text-2xl font-bold text-[#E8933A]'>
										&#127760;
									</div>
									<div className='text-xs text-[#6B4A2D]'>
										WORLDWIDE
									</div>
								</div>
							</div>
							<p className='text-[#3C2B27]/80 mb-3'>
								International certifications for global markets:
							</p>
							<div className='flex flex-wrap gap-2'>
								<span
									className='text-sm px-3 py-1 rounded-full font-medium'
									style={{
										background: 'rgba(60,42,37,0.08)',
										color: '#3C2A25',
									}}>
									UL / cUL
								</span>
								<span
									className='text-sm px-3 py-1 rounded-full font-medium'
									style={{
										background: 'rgba(60,42,37,0.08)',
										color: '#3C2A25',
									}}>
									CSA
								</span>
								<span
									className='text-sm px-3 py-1 rounded-full font-medium'
									style={{
										background: 'rgba(60,42,37,0.08)',
										color: '#3C2A25',
									}}>
									VDE
								</span>
								<span
									className='text-sm px-3 py-1 rounded-full font-medium'
									style={{
										background: 'rgba(60,42,37,0.08)',
										color: '#3C2A25',
									}}>
									SEMKO
								</span>
							</div>
						</motion.div>
					</div>
				</motion.div>

				{/* Water-Based Systems */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div className='flex items-center gap-3 mb-8'>
						<div className='h-8 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full'></div>
						<h2
							style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.2 }}>
							Water-Based Standards
						</h2>
						<span
							className='text-[#B86B45] font-mono text-sm px-3 py-1 rounded-full'
							style={{ background: 'rgba(184,107,69,0.12)' }}>
							HYDRONIC
						</span>
					</div>

					<div className='grid gap-6 md:grid-cols-2'>
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-3xl sm:text-4xl font-black text-[#B86B45] mb-3'>
								WRAS
							</div>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
								WRAS Approved Components
							</h3>
							<p className='text-[#3C2B27]/80'>
								Water-based systems use WRAS-approved pipes and
								fittings, complying with Water Supply Regulations and
								Scottish Byelaws. All manifold assemblies meet strict
								hygienic standards.
							</p>
							<div className='mt-4 text-xs text-[#B86B45] font-mono'>
								REG. NO. 2406012
							</div>
						</motion.div>

						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-3xl sm:text-4xl font-black text-[#B86B45] mb-3'>
								EN ISO
							</div>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
								EN ISO 21003 Multilayer Pipe
							</h3>
							<p className='text-[#3C2B27]/80 mb-3'>
								PERT-AL-PERT multilayer pipes manufactured to EN ISO
								21003-1:
							</p>
							<ul className='space-y-2 text-[#3C2B27]/80'>
								<li className='flex items-center gap-2'>
									<span className='text-[#E8933A]'>&#10003;</span> Aluminium
									oxygen barrier
								</li>
								<li className='flex items-center gap-2'>
									<span className='text-[#E8933A]'>&#10003;</span> Corrosion
									resistance
								</li>
								<li className='flex items-center gap-2'>
									<span className='text-[#E8933A]'>&#10003;</span> 50-year
									durability
								</li>
							</ul>
						</motion.div>
					</div>
				</motion.div>

				{/* Safety & Installation */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div className='flex items-center gap-3 mb-8'>
						<div className='h-8 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full'></div>
						<h2
							style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.2 }}>
							Safety & Installation
						</h2>
					</div>

					<div className='grid gap-6 md:grid-cols-3'>
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-3xl font-black text-[#B86B45] mb-3'>
								TWISTED
							</div>
							<h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3 }}>
								Advanced Cable Technology
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								TwistedTwin&#8482; technology reduces cable stress, improves
								flexibility, and enhances long-term durability with
								dual conductor architecture.
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-3xl font-black text-[#B86B45] mb-3'>
								EARTH
							</div>
							<h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3 }}>
								Continuous Earth Protection
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								Full metallic shielding with continuous earth
								protection braids for enhanced electrical safety and
								system reliability.
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-3xl font-black text-[#B86B45] mb-3'>
								18th ED
							</div>
							<h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3 }}>
								Electrical Compliance
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								Complies with IET Electrical Regulations (BS7671) and
								18th Edition wiring standards for safe installation.
							</p>
						</motion.div>
					</div>
				</motion.div>

				{/* Warranty */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div className='flex items-center gap-3 mb-8'>
						<div className='h-8 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full'></div>
						<h2
							style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.2 }}>
							Warranty & Protection
						</h2>
					</div>

					<div className='grid gap-6 md:grid-cols-2'>
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 text-center transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-4xl sm:text-5xl font-black text-[#B86B45] mb-2'>
								100%
							</div>
							<div className='text-sm text-[#B86B45] font-mono mb-3'>
								COVERAGE
							</div>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.5rem' }}>
								Installation Protection
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								Cables replaced if damaged during installation before
								flooring is completed.
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 text-center transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div className='text-4xl sm:text-5xl font-black text-[#B86B45] mb-2'>
								50
							</div>
							<div className='text-sm text-[#B86B45] font-mono mb-3'>
								YEARS
							</div>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.5rem' }}>
								Pipe Guarantee
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								25-50 year guarantees on multilayer pipework for
								hydronic systems.
							</p>
						</motion.div>
					</div>
				</motion.div>

				{/* Global Track Record */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div
						className='rounded-3xl p-8 transition-all duration-300'
						style={{
							background: 'rgba(255,255,255,0.68)',
							backdropFilter: 'blur(28px)',
							WebkitBackdropFilter: 'blur(28px)',
							border: '1px solid rgba(255,255,255,0.5)',
							boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
						}}>
						<div className='flex items-center gap-3 mb-6'>
							<div className='h-8 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full'></div>
							<h2
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.2 }}>
								Global Track Record
							</h2>
						</div>
						<p className='text-[#3C2B27]/80 mb-6'>
							Installed in hundreds of thousands of properties
							worldwide:
						</p>

						<div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3 mb-6'>
							<div
								className='flex items-center gap-3 p-3 rounded-xl'
								style={{
									background: 'rgba(232,147,58,0.08)',
									border: '1px solid rgba(232,147,58,0.15)',
								}}>
								<span className='h-3 w-3 rounded-full bg-[#E8933A]'></span>
								<span className='text-[#3C2A25] font-medium'>
									250,000+ Residential homes
								</span>
							</div>
							<div
								className='flex items-center gap-3 p-3 rounded-xl'
								style={{
									background: 'rgba(232,147,58,0.08)',
									border: '1px solid rgba(232,147,58,0.15)',
								}}>
								<span className='h-3 w-3 rounded-full bg-[#E8933A]'></span>
								<span className='text-[#3C2A25] font-medium'>
									Luxury apartments
								</span>
							</div>
							<div
								className='flex items-center gap-3 p-3 rounded-xl'
								style={{
									background: 'rgba(232,147,58,0.08)',
									border: '1px solid rgba(232,147,58,0.15)',
								}}>
								<span className='h-3 w-3 rounded-full bg-[#E8933A]'></span>
								<span className='text-[#3C2A25] font-medium'>
									Hotels & resorts
								</span>
							</div>
							<div
								className='flex items-center gap-3 p-3 rounded-xl'
								style={{
									background: 'rgba(232,147,58,0.08)',
									border: '1px solid rgba(232,147,58,0.15)',
								}}>
								<span className='h-3 w-3 rounded-full bg-[#E8933A]'></span>
								<span className='text-[#3C2A25] font-medium'>
									Commercial buildings
								</span>
							</div>
							<div
								className='flex items-center gap-3 p-3 rounded-xl'
								style={{
									background: 'rgba(232,147,58,0.08)',
									border: '1px solid rgba(232,147,58,0.15)',
								}}>
								<span className='h-3 w-3 rounded-full bg-[#E8933A]'></span>
								<span className='text-[#3C2A25] font-medium'>
									Healthcare facilities
								</span>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Project Intelligence */}
				<motion.div
					{...wrap}
					viewport={{ once: true, amount: 0.3 }}
					className='mb-16'>
					<div className='flex items-center gap-3 mb-8'>
						<div className='h-8 w-1 bg-gradient-to-b from-[#E8933A] to-[#B86B45] rounded-full' />
						<h2
							style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.375rem, 3vw, 1.875rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.2 }}>
							Project Intelligence
						</h2>
					</div>
					<div className='grid gap-6 md:grid-cols-3'>
						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
								Installation-First Product Experience
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								Real on-site visuals showcasing workforce, floor preparation,
								wirings layers — focused on execution, not marketing renders.
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
								Intelligent Project Cost Calculator
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								Area-based system calculation with unit quantity, cost breakup,
								labour estimation and thermostat inclusion.
							</p>
						</motion.div>

						<motion.div
							whileHover={{ y: -4 }}
							className='rounded-3xl p-8 transition-all duration-300'
							style={{
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<h3
								style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', fontWeight: 700, color: '#3C2A25', lineHeight: 1.3, marginBottom: '0.75rem' }}>
								End-to-End Project Guidance
							</h3>
							<p className='text-[#3C2B27]/80 text-sm'>
								Clear explanation of workflow, safety standards, energy efficiency
								and long-term reliability — helping clients understand their investment.
							</p>
						</motion.div>
					</div>
				</motion.div>

			{/* Technical Support */}
				<motion.div {...wrap} viewport={{ once: true, amount: 0.3 }}>
					<div
						className='rounded-3xl p-10 text-white shadow-2xl'
						style={{
							background:
								'linear-gradient(135deg, #B86B45 0%, #E8933A 100%)',
						}}>
						<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
							<div>
								<h2
									style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '0' }}>
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
	);
}
