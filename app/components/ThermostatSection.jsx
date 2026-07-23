'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.18, delayChildren: 0.2 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 26 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
	},
};

const features = [
	{
		icon: (
			<svg
				width='28'
				height='28'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<path d='M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z' />
			</svg>
		),
		title: 'Precision Temperature',
		desc: 'Digital thermostat with ±0.5°C accuracy, maintaining perfect warmth levels throughout your hammam session.',
	},
	{
		icon: (
			<svg
				width='28'
				height='28'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
				<path d='M7 11V7a5 5 0 0 1 10 0v4' />
			</svg>
		),
		title: 'Child Safety Lock',
		desc: 'Built-in safety lock prevents accidental temperature changes, ideal for family homes and spa environments.',
	},
	{
		icon: (
			<svg
				width='28'
				height='28'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<circle cx='12' cy='12' r='10' />
				<polyline points='12 6 12 12 16 14' />
			</svg>
		),
		title: '7-Day Programmable',
		desc: 'Set your weekly heating schedule in advance. Wake up to a warm hammam, every single day.',
	},
	{
		icon: (
			<svg
				width='28'
				height='28'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
			</svg>
		),
		title: 'Adaptive Smart Mode',
		desc: 'Learns your usage patterns and pre-heats your hammam automatically before your scheduled session.',
	},
	{
		icon: (
			<svg
				width='28'
				height='28'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
			</svg>
		),
		title: 'IP54 Water Resistant',
		desc: 'Splash-proof design rated for wetroom installation — engineered for electric hammam environments.',
	},
	{
		icon: (
			<svg
				width='28'
				height='28'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.8'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
			</svg>
		),
		title: 'Energy Consumption Stats',
		desc: 'Real-time kWh monitoring lets you track energy usage and optimize heating efficiency.',
	},
];

const tempModes = [
	{ label: 'Hammam', temp: 85, icon: '🔥' },
	{ label: 'Hammam', temp: 45, icon: '♨️' },
	{ label: 'Warm', temp: 30, icon: '☁️' },
	{ label: 'Eco', temp: 18, icon: '❄️' },
];

export default function ThermostatSection() {
	const reduce = useReducedMotion();
	const [selectedMode, setSelectedMode] = useState(1);
	const [currentTemp, setCurrentTemp] = useState(42);
	const [targetTemp] = useState(45);
	const [isHeating, setIsHeating] = useState(true);

	const handleModeSelect = (index) => {
		setSelectedMode(index);
		setCurrentTemp(tempModes[index].temp - 5);
		setIsHeating(true);
		setTimeout(() => setCurrentTemp(tempModes[index].temp), 1500);
	};

	return (
		<section
			className='relative isolate overflow-hidden'
			style={{
				backgroundImage: `
          linear-gradient(
            180deg,
            #FFFFFF 0%,
            #FFF4E8 35%,
            #FFE0C2 70%,
            #F5B97A 100%
          )
        `,
			}}>
			{/* SOFT HEAT GLOW */}
			<motion.div
				aria-hidden
				animate={reduce ? {} : { opacity: [0.25, 0.4, 0.25] }}
				transition={{
					duration: 10,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
				className='absolute inset-0 pointer-events-none'
				style={{
					background:
						'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)',
				}}
			/>

			{/* SUBTLE PREMIUM GRAIN */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage: "url('/noise.png')",
					opacity: 0.02,
				}}
			/>

			<div className='relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-32'>
				{/* HEADER */}
				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='text-center mb-12 sm:mb-20'>
					{/* Glass pill badge */}
					<motion.div
						variants={fadeUp}
						className='relative inline-flex'>
						<span
							aria-hidden
							className='pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))] opacity-70'
						/>
						<p className='relative inline-flex items-center whitespace-nowrap px-4 py-2 sm:px-7 sm:py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] sm:tracking-[0.45em] text-[#4FA3D1] rounded-full bg-[rgba(255,255,255,0.22)] backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_40px_rgba(15,23,42,0.22)]'>
							Smart Heating Controls
						</p>
					</motion.div>

					<motion.h2
						variants={fadeUp}
						className='mt-6 font-serif font-semibold leading-tight text-[#3C2A25]'
						style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
						Intelligent Thermostat Control
						<br />
						<span className='text-[#B86B45] font-light'>
							Precision Warmth At Your Fingertips
						</span>
					</motion.h2>

					<motion.p
						variants={fadeUp}
						className='mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-[#3C2B27]'>
						Every electric hammam installation comes with a premium
						digital thermostat — designed for intuitive control,
						energy efficiency, and reliable performance in wetroom
						conditions.
					</motion.p>
				</motion.div>

				{/* THERMOSTAT DEVICE + FEATURES GRID */}
				<div className='grid lg:grid-cols-[0.9fr_1.1fr] gap-10 sm:gap-16 items-center'>
					{/* LEFT — THERMOSTAT DEVICE */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 1, ease: 'easeOut' }}
						className='relative'>
						{/* Device Outer Shell */}
						<div className='relative rounded-[36px] sm:rounded-[36px] bg-[rgba(255,255,255,0.6)] backdrop-blur-2xl border border-white/50 shadow-[0_50px_140px_rgba(184,107,69,0.25),0_20px_60px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] p-6 sm:p-10'>
							{/* Screen Bezel */}
							<div className='rounded-[24px] bg-[#1a1208] p-6 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_4px_20px_rgba(0,0,0,0.3)]'>
								{/* Top status bar */}
								<div className='flex items-center justify-between mb-6'>
									<div className='flex items-center gap-2'>
										<div
											className={`w-2.5 h-2.5 rounded-full ${isHeating ? 'bg-[#FF7E5F] animate-pulse' : 'bg-[#4ADE80]'}`}
										/>
										<span className='text-[10px] uppercase tracking-widest text-white/40 font-medium'>
											{isHeating ? 'Heating' : 'Stable'}
										</span>
									</div>
									<div className='flex items-center gap-3'>
										<span className='text-[10px] uppercase tracking-widest text-white/40 font-medium'>
											{new Date().toLocaleDateString('en-US', {
												weekday: 'short',
												month: 'short',
												day: 'numeric',
											})}
										</span>
										<div className='flex gap-1'>
											{[1, 2, 3].map((w) => (
												<div
													key={w}
													className='w-1 h-2 rounded-full bg-white/20'
												/>
											))}
										</div>
									</div>
								</div>

								{/* Temperature Display */}
								<div className='text-center mb-6'>
									<div className='relative inline-block'>
										<motion.div
											animate={
												isHeating ? { scale: [1, 1.03, 1] } : {}
											}
											transition={{ duration: 2, repeat: Infinity }}
											className='absolute -inset-8 rounded-full bg-[#FF7E5F]/10 blur-xl'
										/>
										<div className='relative'>
											<motion.div
												key={currentTemp}
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.4 }}
												className='text-7xl font-light tracking-tight text-white'>
												{Math.round(currentTemp)}
											</motion.div>
											<div className='text-xl text-white/30 font-light mt-1'>
												°C
											</div>
										</div>
									</div>

									{/* Target indicator */}
									<div className='mt-4 flex items-center justify-center gap-2'>
										<span className='text-xs text-white/30'>
											Target:
										</span>
										<span className='text-sm font-medium text-[#FFB88C]'>
											{targetTemp}°C
										</span>
										<div className='w-20 h-1.5 bg-white/10 rounded-full overflow-hidden'>
											<motion.div
												className='h-full rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C]'
												animate={{
													width: `${Math.min(100, (currentTemp / targetTemp) * 100)}%`,
												}}
												transition={{ duration: 1.5 }}
											/>
										</div>
									</div>
								</div>

								{/* Mode Selector */}
								<div className='grid grid-cols-4 gap-2 mb-5'>
									{tempModes.map((mode, i) => (
										<button
											key={mode.label}
											onClick={() => handleModeSelect(i)}
											className={`
												rounded-xl py-3 text-center text-xs font-medium transition-all duration-300
												${
													selectedMode === i
														? 'bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] text-white shadow-[0_6px_20px_rgba(255,126,95,0.45)]'
														: 'bg-white/8 text-white/40 hover:bg-white/12 hover:text-white/60'
												}
											`}>
											<span className='text-base'>{mode.icon}</span>
											<div className='mt-1'>{mode.label}</div>
											<div className='text-[10px] opacity-60'>
												{mode.temp}°
											</div>
										</button>
									))}
								</div>

								{/* Bottom stats row */}
								<div className='flex items-center justify-between pt-4 border-t border-white/8'>
									<div className='flex items-center gap-2'>
										<span className='text-white/25 text-xs'>
											⚡ Today
										</span>
										<span className='text-sm font-medium text-[#FFB88C]'>
											4.2 kWh
										</span>
									</div>
									<div className='flex items-center gap-2'>
										<span className='text-white/25 text-xs'>
											WiFi
										</span>
										<div className='w-1.5 h-1.5 rounded-full bg-[#4ADE80]' />
									</div>
									<button
										onClick={() => setIsHeating(!isHeating)}
										className={`
											rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300
											${
												isHeating
													? 'bg-[#FF7E5F]/20 text-[#FF7E5F] border border-[#FF7E5F]/30'
													: 'bg-white/8 text-white/40 border border-white/10'
											}
										`}>
										{isHeating ? 'ON' : 'OFF'}
									</button>
								</div>
							</div>

							{/* Device brand label */}
							<div className='mt-6 text-center'>
								<p className='text-xs uppercase tracking-[0.3em] text-[#3C2A25]/40 font-medium'>
									EH Series • Digital Thermostat
								</p>
								<p className='text-[10px] text-[#3C2A25]/25 mt-1 tracking-wide'>
									Installation-Grade Heating Control
								</p>
							</div>
						</div>

						{/* Floating trust badge */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.6 }}
							className='absolute -bottom-6 left-4 sm:left-4 rounded-2xl bg-white px-6 py-4 shadow-xl border border-white/80'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7E5F] to-[#FFB88C] flex items-center justify-center text-white text-sm font-bold shadow-md'>
									✓
								</div>
								<div>
									<p className='font-semibold text-[#3C2A25] text-sm'>
										Included Free
									</p>
									<p className='text-xs text-[#6B4A2D]'>
										With Every Installation
									</p>
								</div>
							</div>
						</motion.div>

						{/* Second floating badge */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.8 }}
							className='absolute -top-4 right-4 sm:right-4 rounded-2xl bg-white px-5 py-3 shadow-xl border border-white/80'>
							<div className='text-center'>
								<p className='text-2xl font-bold text-[#B86B45]'>
									IP54
								</p>
								<p className='text-[10px] uppercase tracking-widest text-[#6B4A2D]'>
									Water Resistant
								</p>
							</div>
						</motion.div>
					</motion.div>

					{/* RIGHT — FEATURES */}
					<motion.div
						variants={container}
						initial='hidden'
						whileInView='show'
						viewport={{ once: true }}>
						<motion.h3
							variants={fadeUp}
							className='font-serif font-semibold text-[#3C2A25] mb-2'
							style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
							Everything You Need in One Device
						</motion.h3>
						<motion.p
							variants={fadeUp}
							className='text-[#3C2B27] mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed'>
							Professional-grade features designed for electric hammam
							environments, not generic home heating.
						</motion.p>

						<div className='grid gap-5'>
							{features.map((feature, i) => (
								<motion.div
									key={feature.title}
									variants={fadeUp}
									className='group flex items-start gap-5 rounded-2xl bg-[rgba(255,255,255,0.55)] backdrop-blur-md border border-white/50 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:bg-[rgba(255,255,255,0.75)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-all duration-300'>
									{/* Icon */}
									<div className='flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7E5F]/15 to-[#FFB88C]/15 flex items-center justify-center text-[#B86B45] group-hover:scale-110 transition-transform duration-300'>
										{feature.icon}
									</div>

									{/* Text */}
									<div>
										<h4 className='font-semibold text-[#3C2A25] text-base leading-tight'>
											{feature.title}
										</h4>
										<p className='mt-1.5 text-sm text-[#4A342E] leading-relaxed'>
											{feature.desc}
										</p>
									</div>
								</motion.div>
							))}
						</div>

						{/* CTA */}
						<motion.div
							variants={fadeUp}
							className='mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5'>
							<a
								href='/contact'
								className='w-full sm:w-auto text-center relative inline-flex items-center justify-center rounded-full px-8 py-4 sm:px-10 sm:py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] shadow-[0_22px_70px_rgba(184,107,69,0.45)] transition-all duration-300 hover:scale-[1.05]'>
								Get Thermostat Included
							</a>

							<a
								href='/how-it-works'
								className='inline-flex items-center gap-3 rounded-full border border-[#FFD6A6] bg-white/70 px-10 py-3.5 text-sm font-medium text-[#3C2B27] transition hover:bg-[#FFE8CF]'>
								See Full System
								<span className='text-[#B86B45]'>→</span>
							</a>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
