'use client';

import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BRANDS = ['ProWarm', 'Warmup', 'ThermoSphere', 'AmberHeat', 'FastWarm', 'nVent'];
const PRICE_PER_SQFT = 210;
const LABOUR_PER_SQFT = 120;

const MATS = [
	{ sqft: 50, price: 8500, label: '50 sq ft Mat' },
	{ sqft: 70, price: 11500, label: '70 sq ft Mat' },
	{ sqft: 80, price: 13500, label: '80 sq ft Mat' },
];

const THERMOSTATS = {
	free: {
		label: 'Standard Thermostat',
		sublabel: 'Included free',
		price: 0,
		image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
		description: 'A reliable and straightforward thermostat included with every installation. Features a simple dial or basic digital display for manual temperature control. Ideal for single-zone setups where smart connectivity is not required.',
	},
	modular: {
		label: 'Modular Thermostat',
		sublabel: '+ ₹2,500',
		price: 2500,
		image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
		description: 'A programmable modular thermostat with a clean digital interface. Supports weekly scheduling and floor sensor input for accurate temperature management. A popular upgrade for homeowners wanting more control without Wi-Fi dependency.',
	},
	wifi: {
		label: 'Wi-Fi Smart Thermostat',
		sublabel: '+ ₹5,500',
		price: 5500,
		image: 'https://images.unsplash.com/photo-1545259742-f4f55c610ee1?w=600&q=80',
		description: 'A fully connected smart thermostat controllable via smartphone from anywhere. Compatible with Alexa and Google Home. Features energy usage reports, geo-fencing, and adaptive scheduling — ideal for modern smart homes.',
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

const STEPS = [
	{ num: 1, label: 'Brand' },
	{ num: 2, label: 'Area' },
	{ num: 3, label: 'Mats' },
	{ num: 4, label: 'Thermostat' },
];

export default function ProjectCostCalculator() {
	const reduce = useReducedMotion();

	const [brand, setBrand] = useState('ProWarm');
	const [thermostat, setThermostat] = useState('free');
	const [modalThermostat, setModalThermostat] = useState(null);

	const [width, setWidth] = useState('');
	const [length, setLength] = useState('');
	const [coveragePct, setCoveragePct] = useState(80);

	const rawArea = width !== '' && length !== '' ? parseFloat(width || 0) * parseFloat(length || 0) : 0;
	const effectiveArea = rawArea > 0 ? Math.min(500, Math.max(50, Math.round(rawArea))) : 0;
	const heatedArea = effectiveArea > 0 ? Math.round(effectiveArea * (coveragePct / 100)) : 0;

	const [manualMats, setManualMats] = useState({ 50: 0, 70: 0, 80: 0 });

	const generateCombinations = (area) => {
		const matSizes = [80, 70, 50];
		const matPrices = { 80: 13500, 70: 11500, 50: 8500 };
		const results = [];

		for (let a = 0; a <= 5; a++) {
			for (let b = 0; b <= 5; b++) {
				for (let c = 0; c <= 5; c++) {
					const coverage = a * 80 + b * 70 + c * 50;
					if (coverage >= area && (a + b + c) > 0 && (a + b + c) <= 6) {
						const cost = a * 13500 + b * 11500 + c * 8500;
						const mats = [];
						if (a > 0) mats.push({ sqft: 80, count: a });
						if (b > 0) mats.push({ sqft: 70, count: b });
						if (c > 0) mats.push({ sqft: 50, count: c });
						results.push({ mats, coverage, cost, totalCount: a + b + c });
					}
				}
			}
		}

		results.sort((x, y) => x.totalCount - y.totalCount || x.cost - y.cost);

		const seen = new Set();
		const unique = results.filter(r => {
			const key = r.mats.map(m => `${m.count}x${m.sqft}`).join('+');
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});

		return unique.slice(0, 4);
	};

	const generatedCombos = heatedArea > 0 ? generateCombinations(heatedArea) : [];
	const recommendedCombo = generatedCombos[0] ? generatedCombos[0].mats.flatMap(m =>
		Array(m.count).fill(MATS.find(mat => mat.sqft === m.sqft))
	) : [];

	const [selectedComboIndex, setSelectedComboIndex] = useState(null);

	const manualCoverage = manualMats[50] * 50 + manualMats[70] * 70 + manualMats[80] * 80;
	const manualCost = manualMats[50] * 8500 + manualMats[70] * 11500 + manualMats[80] * 13500;
	const manualTotalCount = manualMats[50] + manualMats[70] + manualMats[80];
	const hasCustomMats = manualTotalCount > 0;

	const getSelectedMats = () => {
		if (hasCustomMats) {
			const mats = [];
			if (manualMats[50] > 0) mats.push({ sqft: 50, count: manualMats[50] });
			if (manualMats[70] > 0) mats.push({ sqft: 70, count: manualMats[70] });
			if (manualMats[80] > 0) mats.push({ sqft: 80, count: manualMats[80] });
			return { mats, coverage: manualCoverage, cost: manualCost, isCustom: true };
		}
		if (selectedComboIndex !== null && generatedCombos[selectedComboIndex]) {
			return { ...generatedCombos[selectedComboIndex], isCustom: false };
		}
		if (generatedCombos.length > 0) {
			return { ...generatedCombos[0], isCustom: false };
		}
		return null;
	};

	const selectedMats = getSelectedMats();
	const displayCombo = selectedMats ? selectedMats.mats.flatMap(m =>
		Array(m.count).fill(null).map(() => MATS.find(mat => mat.sqft === m.sqft))
	) : [];

	const handleSelectGeneratedCombo = (index) => {
		setManualMats({ 50: 0, 70: 0, 80: 0 });
		setSelectedComboIndex(index);
	};

	const matCost = displayCombo.reduce((s, m) => s + (m?.price || 0), 0);
	const totalCoverage = displayCombo.reduce((s, m) => s + (m?.sqft || 0), 0);
	const labourCount = effectiveArea > 180 ? 2 : 1;
	const masonCount = effectiveArea > 180 ? 2 : 1;
	const thermo = THERMOSTATS[thermostat].price;
	const total = matCost + thermo;

	const bajriBags = effectiveArea > 0 ? Math.ceil(effectiveArea / 10) : '—';
	const sandBags = effectiveArea > 0 ? Math.ceil(effectiveArea / 10) : '—';
	const cementBags = effectiveArea > 0 ? Math.ceil(bajriBags / 4) : '—';

	const formatCombo = (combo) => {
		if (!combo || combo.length === 0) return '—';
		const counts = {};
		combo.forEach((m) => { counts[m.sqft] = (counts[m.sqft] || 0) + 1; });
		return Object.entries(counts)
			.sort(([a], [b]) => b - a)
			.map(([sqft, cnt]) => `${cnt}× ${sqft} sq ft`)
			.join(' + ');
	};

	const breakdown = [
		{
			label: 'Heating Mats',
			value: formatCombo(displayCombo),
			sub: displayCombo.length > 0 ? `${displayCombo.length} mat${displayCombo.length > 1 ? 's' : ''} selected` : 'No mats selected',
		},
		{
			label: 'Total Coverage',
			value: totalCoverage > 0 ? `${totalCoverage} sq ft` : '—',
			sub: rawArea > 0 ? `Room area: ${Math.round(rawArea)} sq ft` : 'Enter room dimensions',
		},
		{
			label: 'Mat Cost',
			value: matCost > 0 ? `₹ ${matCost.toLocaleString()}` : '—',
			sub: '',
		},
		{
			label: 'Civil Works',
			value: 'civilworks',
			sub: '',
		},
		{
			label: 'Thermostat',
			value: thermo === 0 ? 'Included' : `₹ ${thermo.toLocaleString()}`,
			sub: THERMOSTATS[thermostat].label,
		},
	];

	const handleDimensionChange = (field, val) => {
		if (field === 'width') setWidth(val);
		if (field === 'length') setLength(val);
	};

	const getStepState = (stepNum) => {
		if (stepNum === 1) return 'active';
		if (stepNum === 2) return width && length ? 'active' : 'inactive';
		if (stepNum === 3) return heatedArea > 0 ? 'active' : 'inactive';
		if (stepNum === 4) return 'active';
		return 'inactive';
	};

	return (
		<section className='relative mt-16 sm:mt-40'>
			<div className='absolute inset-x-0 -top-24 h-px bg-gradient-to-r from-transparent via-[#B86B45]/40 to-transparent' />

			<div className='mx-auto max-w-7xl px-5 sm:px-6'>
				{/* HEADER */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 1 }}
					className='max-w-3xl mb-10 sm:mb-16'>
					<motion.div
						variants={fadeUp}
						className='inline-flex items-center rounded-full px-6 py-2.5 sm:px-8 backdrop-blur-xl bg-white/[0.8] border border-white/[0.18] shadow-[0_10px_30px_rgba(0,0,0,0.18)]'>
						<p className='text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.35em] text-[#4FA3D1] whitespace-nowrap'>
							Installation Economics
						</p>
					</motion.div>

					<h2 className='mt-6 font-serif font-semibold text-[#3C2A25] leading-tight' style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
						From Site Work
						<br />
						<span className='text-[#B86B45] font-light'>
							To Final Project Cost
						</span>
					</h2>

					<p className='mt-6 text-base sm:text-lg text-[#3C2B27] max-w-2xl leading-relaxed'>
						Adjust the project parameters below to understand how your
						electric hammam installation is technically and
						commercially structured.
					</p>
				</motion.div>

				{/* MAIN 2-COLUMN LAYOUT */}
				<div className='grid lg:grid-cols-[1fr_320px] gap-8'>
					{/* LEFT COLUMN: Step Content Cards */}
					<div className='space-y-6'>
						{/* CARD 1: Heating System Brand */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0 }}
							className='rounded-2xl bg-white border border-[#F0E4D8] shadow-sm p-6 sm:p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<span className='w-7 h-7 rounded-full bg-[#B86B45]/10 border border-[#B86B45]/20 flex items-center justify-center text-xs font-bold text-[#B86B45]'>
									1
								</span>
								<h3 className='font-serif font-semibold text-lg text-[#3C2A25]'>
									Heating System Brand
								</h3>
							</div>

							<div className='grid grid-cols-3 gap-2 sm:gap-2'>
								{BRANDS.map((b) => (
									<button
										key={b}
										onClick={() => setBrand(b)}
										className={`relative py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
											brand === b
												? 'bg-[#B86B45] text-white shadow-lg shadow-[#B86B45]/25'
												: 'bg-[#FFF8F0] text-[#3C2B27] hover:bg-[#FFE8D0] border border-[#F0E4D8]'
										}`}>
										{b}
										{brand === b && (
											<span className='absolute -top-1 -right-1 w-3 h-3 bg-[#4FA3D1] rounded-full border-2 border-white' />
										)}
									</button>
								))}
							</div>
						</motion.div>

						{/* CARD 2: Room Dimensions & Coverage */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.1 }}
							className='rounded-2xl bg-white border border-[#F0E4D8] shadow-sm p-6 sm:p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<span className='w-7 h-7 rounded-full bg-[#B86B45]/10 border border-[#B86B45]/20 flex items-center justify-center text-xs font-bold text-[#B86B45]'>
									2
								</span>
								<h3 className='font-serif font-semibold text-lg text-[#3C2A25]'>
									Room Dimensions
								</h3>
							</div>

							{/* Live area display */}
							<div className='flex items-baseline gap-1.5 mb-6'>
								<motion.span
									key={effectiveArea}
									initial={{ scale: 0.92, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.3 }}
									className='text-3xl font-serif font-semibold text-[#B86B45]'>
									{effectiveArea || '—'}
								</motion.span>
								<span className='text-xs text-[#3C2B27]/50 font-medium'>
									sq ft
								</span>
								{width && length && (
									<span className='ml-2 text-[10px] text-[#4FA3D1] font-semibold bg-[#4FA3D1]/10 px-2 py-0.5 rounded-full'>
										{width} × {length} ft
									</span>
								)}
							</div>

							{/* W × L inputs */}
							<div className='space-y-4'>
								<div className='grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3'>
									{/* Width input */}
									<div className='space-y-1'>
										<p className='text-[10px] uppercase tracking-widest text-[#3C2B27]/40 font-semibold'>
											Width (ft)
										</p>
										<div className='relative'>
											<input
												type='number'
												min={1}
												max={200}
												value={width}
												onChange={(e) =>
													handleDimensionChange('width', e.target.value)
												}
												placeholder='e.g. 15'
												className='w-full rounded-xl border border-[#F0E4D8] bg-white px-4 py-3 text-sm font-semibold text-[#3C2A25] placeholder-[#3C2B27]/25 focus:outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 transition-all'
											/>
											<span className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#3C2B27]/30 font-medium'>
												ft
											</span>
										</div>
									</div>

									{/* × symbol */}
									<div className='mt-5 flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF1E6] border border-[#F0E4D8]'>
										<span className='text-[#B86B45] font-bold text-sm'>×</span>
									</div>

									{/* Length input */}
									<div className='space-y-1'>
										<p className='text-[10px] uppercase tracking-widest text-[#3C2B27]/40 font-semibold'>
											Length (ft)
										</p>
										<div className='relative'>
											<input
												type='number'
												min={1}
												max={200}
												value={length}
												onChange={(e) =>
													handleDimensionChange('length', e.target.value)
												}
												placeholder='e.g. 20'
												className='w-full rounded-xl border border-[#F0E4D8] bg-white px-4 py-3 text-sm font-semibold text-[#3C2A25] placeholder-[#3C2B27]/25 focus:outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 transition-all'
											/>
											<span className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#3C2B27]/30 font-medium'>
												ft
											</span>
										</div>
									</div>
								</div>

								{/* Confirmation pill */}
								{width && length && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className='flex items-center gap-2 bg-[#B86B45]/8 border border-[#B86B45]/20 rounded-xl px-4 py-2.5'>
										<svg
											className='w-3.5 h-3.5 text-[#B86B45]'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
											strokeWidth={2.5}>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
										<p className='text-[11px] text-[#B86B45] font-semibold'>
											{parseFloat(width)} × {parseFloat(length)} ={' '}
											{Math.round(parseFloat(width) * parseFloat(length))} sq ft calculated
										</p>
									</motion.div>
								)}

								{/* Cap warning */}
								{width && length && parseFloat(width) * parseFloat(length) > 500 && (
									<p className='text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2'>
										Area capped at 500 sq ft. Contact us for larger projects.
									</p>
								)}

								{/* Floor Coverage % */}
								<div className='pt-2 space-y-2'>
									<p className='text-xs font-semibold uppercase tracking-widest text-[#3C2A25]/60'>
										Floor Coverage %
									</p>
									<div className='flex items-center gap-3'>
										<div className='relative w-28'>
											<input
												type='number'
												min={10}
												max={100}
												step={5}
												value={coveragePct}
												onChange={(e) => setCoveragePct(Math.min(100, Math.max(10, parseInt(e.target.value) || 10)))}
												className='w-full rounded-xl border border-[#F0E4D8] bg-white px-4 py-3 pr-8 text-sm font-semibold text-[#3C2A25] focus:outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 transition-all'
											/>
											<span className='absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#3C2B27]/30 font-medium'>
												%
											</span>
										</div>
										<input
											type='range'
											min={10}
											max={100}
											step={5}
											value={coveragePct}
											onChange={(e) => setCoveragePct(parseInt(e.target.value))}
											className='flex-1 h-2 rounded-full appearance-none bg-[#F0E4D8] cursor-pointer'
											style={{
												background: `linear-gradient(to right, #B86B45 ${((coveragePct - 10) / 90) * 100}%, #F0E4D8 ${((coveragePct - 10) / 90) * 100}%)`,
											}}
										/>
									</div>
									<p className='text-[11px] text-[#3C2B27]/50'>
										Recommended <span className='text-[#B86B45] font-semibold'>80%</span> coverage for even heat distribution
									</p>
								</div>
							</div>
						</motion.div>

						{/* CARD 3: Heating Mats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.2 }}
							className='rounded-2xl bg-white border border-[#F0E4D8] shadow-sm p-6 sm:p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<span className='w-7 h-7 rounded-full bg-[#B86B45]/10 border border-[#B86B45]/20 flex items-center justify-center text-xs font-bold text-[#B86B45]'>
									3
								</span>
								<h3 className='font-serif font-semibold text-lg text-[#3C2A25]'>
									Heating Mats Required
								</h3>
							</div>

							{rawArea > 0 ? (
								<div className='space-y-6'>
									{/* Area badge */}
									<span className='inline-flex text-[10px] text-[#4FA3D1] font-semibold bg-[#4FA3D1]/10 px-3 py-1.5 rounded-full'>
										{Math.round(rawArea)} sq ft room · {coveragePct}% = {heatedArea} sq ft heated
									</span>

									{/* Generated combo cards */}
									<div className='space-y-2'>
										{generatedCombos.map((combo, i) => {
											const comboMats = combo.mats.flatMap(m =>
												Array(m.count).fill(null).map(() => MATS.find(mat => mat.sqft === m.sqft))
											);
											const isSelected = !hasCustomMats && selectedComboIndex === i;
											return (
												<button
													key={i}
													onClick={() => handleSelectGeneratedCombo(i)}
													className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 ${
														isSelected
															? 'bg-[#FFF8F0] border-[#B86B45] shadow-sm'
															: 'bg-white border-[#F0E4D8] hover:border-[#D4A88A]'
													}`}>
													<div className='flex items-start justify-between gap-3'>
														<div className='flex-1'>
															<div className='flex items-center gap-2 mb-1'>
																{i === 0 && (
																	<span className='inline-flex items-center rounded-full bg-[#B86B45] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
																		Recommended
																	</span>
																)}
															</div>
															<p className='text-sm font-semibold text-[#3C2A25]'>
																{combo.mats.map(m => `${m.count}× ${m.sqft} sq ft`).join(' + ')}
															</p>
															<p className='text-[11px] text-[#3C2B27]/50 mt-0.5'>
																Total coverage: {combo.coverage} sq ft
															</p>
														</div>
														<div className='text-right'>
															<p className={`text-base font-bold ${i === 0 ? 'text-[#B86B45]' : 'text-[#3C2A25]'}`}>
																₹ {combo.cost.toLocaleString()}
															</p>
														</div>
													</div>
												</button>
											);
										})}
									</div>

									{/* Manual Mat Builder */}
									<div className='pt-2 border-t border-[#F0E4D8]'>
										<p className='text-[10px] font-semibold uppercase tracking-widest text-[#3C2A25]/40 mb-3'>
											Build Your Own Combination
										</p>
										<div className='flex flex-row flex-wrap gap-3'>
											{[{ sqft: 50, label: '50 sq ft Mat', price: 8500 },
											  { sqft: 70, label: '70 sq ft Mat', price: 11500 },
											  { sqft: 80, label: '80 sq ft Mat', price: 13500 }].map(mat => (
												<div key={mat.sqft} className='flex flex-row flex-wrap items-center justify-between gap-3'>
													<button
														onClick={() => {
															if (manualMats[mat.sqft] === 0) {
																setManualMats(prev => ({ ...prev, [mat.sqft]: 1 }));
															}
														}}
														className='rounded-xl border border-[#F0E4D8] bg-[#FFF8F0] px-4 py-3 text-sm font-semibold text-[#3C2B27] hover:border-[#B86B45]/40'>
														{mat.label}
													</button>
													{manualMats[mat.sqft] > 0 && (
														<div className='flex items-center gap-2'>
															<button
																onClick={() => setManualMats(prev => ({ ...prev, [mat.sqft]: Math.max(0, prev[mat.sqft] - 1) }))}
																className='w-8 h-8 rounded-full border border-[#F0E4D8] bg-white text-[#3C2B27] font-bold hover:bg-[#FFF8F0] transition-colors flex items-center justify-center'>
																−
															</button>
															<span className='w-6 text-center font-semibold text-[#3C2B27]'>{manualMats[mat.sqft]}</span>
															<button
																onClick={() => setManualMats(prev => ({ ...prev, [mat.sqft]: Math.min(6, prev[mat.sqft] + 1) }))}
																className='w-8 h-8 rounded-full border border-[#F0E4D8] bg-white text-[#3C2B27] font-bold hover:bg-[#FFF8F0] transition-colors flex items-center justify-center'>
																+
															</button>
														</div>
													)}
												</div>
											))}
										</div>

										{/* Custom combo preview card */}
										{hasCustomMats && (
											<button
												onClick={() => setSelectedComboIndex(null)}
												className='w-full text-left rounded-xl border-2 border-[#4FA3D1] bg-[#4FA3D1]/5 p-4 transition-all duration-200 mt-3'>
												<div className='flex items-start justify-between gap-3'>
													<div className='flex-1'>
														<div className='flex items-center gap-2 mb-1'>
															<span className='inline-flex items-center rounded-full bg-[#4FA3D1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
																Custom
															</span>
														</div>
														<p className='text-sm font-semibold text-[#3C2A25]'>
															{Object.entries(manualMats).filter(([, c]) => c > 0).map(([sqft, count]) => `${count}× ${sqft} sq ft`).join(' + ')}
														</p>
														<p className='text-[11px] text-[#3C2B27]/50 mt-0.5'>
															Total coverage: {manualCoverage} sq ft
														</p>
													</div>
													<div className='text-right'>
														<p className='text-base font-bold text-[#4FA3D1]'>
															₹ {manualCost.toLocaleString()}
														</p>
													</div>
												</div>
											</button>
										)}
									</div>

									{/* Individual mat breakdown */}
									{displayCombo.length > 0 && (
										<div className='bg-white rounded-xl border border-[#F0E4D8] p-4 space-y-2'>
											<p className='text-[10px] font-semibold uppercase tracking-widest text-[#3C2A25]/40 mb-2'>
												Selected Mat Breakdown
											</p>
											{displayCombo.map((mat, i) => (
												<div key={i} className='flex items-center justify-between text-sm'>
													<span className='text-[#3C2A25]'>{mat?.label}</span>
													<span className='font-semibold text-[#3C2A25]'>
														₹ {mat?.price.toLocaleString()}
													</span>
												</div>
											))}
											<div className='flex items-center justify-between text-sm border-t border-[#F0E4D8] pt-2 mt-2'>
												<span className='font-semibold text-[#3C2A25]'>Mat Cost Total</span>
												<span className='font-bold text-[#B86B45]'>
													₹ {matCost.toLocaleString()}
												</span>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className='bg-[#FFF8F0] rounded-xl border border-dashed border-[#F0E4D8] p-6 text-center'>
									<p className='text-sm text-[#3C2B27]/40 italic py-6'>
										Enter room dimensions above to see mat recommendations
									</p>
								</div>
							)}
						</motion.div>

						{/* CARD 4: Thermostat Control */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.3 }}
							className='rounded-2xl bg-white border border-[#F0E4D8] shadow-sm p-6 sm:p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<span className='w-7 h-7 rounded-full bg-[#B86B45]/10 border border-[#B86B45]/20 flex items-center justify-center text-xs font-bold text-[#B86B45]'>
									4
								</span>
								<h3 className='font-serif font-semibold text-lg text-[#3C2A25]'>
									Thermostat Control
								</h3>
							</div>

							<div className='space-y-2'>
								{Object.entries(THERMOSTATS).map(([k, v]) => (
									<div
										key={k}
										onClick={() => setThermostat(k)}
										className={`relative w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
											thermostat === k
												? 'bg-[#FFF8F0] border-[#B86B45] shadow-sm'
												: 'bg-white border-[#F0E4D8] hover:border-[#D4A88A]'
										}`}>
										{thermostat === k && (
											<span className='absolute -top-1 -right-1 w-3 h-3 bg-[#4FA3D1] rounded-full border-2 border-white' />
										)}
										<div className='flex items-center gap-3'>
											<div>
												<p className='text-sm font-semibold text-[#3C2A25]'>
													{v.label}
												</p>
												<p className='text-[11px] text-[#3C2B27]/50 mt-0.5'>
													{v.sublabel}
												</p>
											</div>
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation();
												setModalThermostat(k);
											}}
											className='w-8 h-8 rounded-full bg-[#FFF1E6] hover:bg-[#F0E4D8] flex items-center justify-center transition-colors'>
											<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#B86B45' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
												<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/>
												<circle cx='12' cy='12' r='3'/>
											</svg>
										</button>
									</div>
								))}
							</div>
						</motion.div>
					</div>

					{/* RIGHT COLUMN: Sticky Summary Panel */}
					<div className='hidden lg:block'>
						<div className='sticky top-6 rounded-2xl bg-[#FFF8F2] border border-[#F0E4D8] shadow-lg overflow-hidden'>
							{/* Header */}
							<div className='bg-[#B86B45] px-5 py-4'>
								<p className='text-[9px] uppercase tracking-[0.25em] text-white/60 font-semibold'>
									Summary
								</p>
								<h3 className='font-serif text-base font-semibold text-white'>
									Cost Breakdown
								</h3>
							</div>

							{/* Breakdown rows */}
							<div className='px-5 py-1 space-y-0'>
								{breakdown.map(({ label, value, sub }, i) => (
									<motion.div
										key={label}
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.06, duration: 0.4 }}
										className='flex justify-between items-start py-2.5 border-b border-[#F0E4D8]/60 last:border-0'>
										<div>
											<p className='text-xs font-medium text-[#3C2A25]'>
												{label}
											</p>
											{sub && (
												<p className='text-[10px] text-[#3C2B27]/40 mt-0.5'>
													{sub}
												</p>
											)}
										</div>
										{label === 'Civil Works' ? (
											<div className='flex flex-col items-end gap-0.5'>
												<span className='text-[11px] font-semibold text-[#3C2A25]'>{bajriBags}B · {sandBags}S · {cementBags}C</span>
												<span className='text-[11px] font-semibold text-[#3C2A25]'>{labourCount} Labour · {masonCount} Mason</span>
											</div>
										) : (
											<motion.span
												key={value}
												initial={{ opacity: 0, y: -4 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3 }}
												className='text-xs font-semibold text-[#3C2A25] text-right'>
												{value}
											</motion.span>
										)}
									</motion.div>
								))}
							</div>

							{/* Total card */}
							<div className='mx-4 mb-4 mt-3 rounded-xl bg-gradient-to-br from-[#B86B45] to-[#D4845A] p-4 shadow-lg shadow-[#B86B45]/20'>
								<p className='text-[9px] uppercase tracking-widest text-white/60 mb-1'>
									MAT + THERMOSTAT COST
								</p>
								<motion.p
									key={total}
									initial={{ scale: 0.94, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.35,
										ease: [0.16, 1, 0.3, 1],
									}}
									className='text-2xl font-serif font-semibold text-white'>
									₹ {total.toLocaleString()}
								</motion.p>
							</div>

							{/* CTA button */}
							<div className='mx-4 mb-4'>
								<a
									href='/contact'
									className='w-full rounded-full inline-flex items-center justify-center py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] shadow-[0_12px_40px_rgba(184,107,69,0.35)] transition-all duration-300 hover:scale-[1.02]'>
									Request Detailed Quotation
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Summary */}
				<div className='lg:hidden mt-6 rounded-2xl bg-[#FFF8F2] border border-[#F0E4D8] shadow-lg overflow-hidden'>
					<div className='bg-[#B86B45] px-5 py-4'>
						<p className='text-[9px] uppercase tracking-[0.25em] text-white/60 font-semibold'>
							Summary
						</p>
						<h3 className='font-serif text-base font-semibold text-white'>
							Cost Breakdown
						</h3>
					</div>

					<div className='px-5 py-1 space-y-0'>
						{breakdown.map(({ label, value, sub }, i) => (
							<motion.div
								key={`mobile-${label}`}
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.06, duration: 0.4 }}
								className='flex justify-between items-start py-2.5 border-b border-[#F0E4D8]/60 last:border-0'>
								<div>
									<p className='text-xs font-medium text-[#3C2A25]'>
										{label}
									</p>
									{sub && (
										<p className='text-[10px] text-[#3C2B27]/40 mt-0.5'>
											{sub}
										</p>
									)}
								</div>
								{label === 'Civil Works' ? (
									<div className='flex flex-col items-end gap-0.5'>
										<span className='text-[11px] font-semibold text-[#3C2A25]'>{bajriBags}B · {sandBags}S · {cementBags}C</span>
										<span className='text-[11px] font-semibold text-[#3C2A25]'>{labourCount} Labour · {masonCount} Mason</span>
									</div>
								) : (
									<span className='text-xs font-semibold text-[#3C2A25] text-right'>
										{value}
									</span>
								)}
							</motion.div>
						))}
					</div>

					<div className='mx-4 mb-4 mt-3 rounded-xl bg-gradient-to-br from-[#B86B45] to-[#D4845A] p-4 shadow-lg shadow-[#B86B45]/20'>
						<p className='text-[9px] uppercase tracking-widest text-white/60 mb-1'>
							MAT + THERMOSTAT COST
						</p>
						<p className='text-2xl font-serif font-semibold text-white'>
							₹ {total.toLocaleString()}
						</p>
					</div>

					<div className='mx-4 mb-4'>
						<a
							href='/contact'
							className='w-full rounded-full inline-flex items-center justify-center py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] shadow-[0_12px_40px_rgba(184,107,69,0.35)] transition-all duration-300 hover:scale-[1.02]'>
							Request Detailed Quotation
						</a>
					</div>
				</div>
			</div>

			<style>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type='number'] { -moz-appearance: textfield; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #B86B45; cursor: pointer; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        input[type='range']::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #B86B45; cursor: pointer; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
      `}</style>

			<AnimatePresence>
				{modalThermostat && (
					<>
						<motion.div
							key="overlay"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setModalThermostat(null)}
							className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
						/>
						<motion.div
							key="modal"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
							className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none"
						>
							<div
								className="pointer-events-auto mt-[20vh] w-full max-w-sm mx-4 rounded-3xl bg-white p-6 shadow-2xl"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="flex justify-end mb-3">
									<button
										onClick={() => setModalThermostat(null)}
										className="w-8 h-8 rounded-full bg-[#FFF1E6] hover:bg-[#F0E4D8] flex items-center justify-center text-[#B86B45] font-bold text-sm transition-colors"
									>×</button>
								</div>
								<img
									src={THERMOSTATS[modalThermostat].image}
									alt={THERMOSTATS[modalThermostat].label}
									style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px' }}
								/>
								<h3 className="mt-4 font-serif font-semibold text-xl text-[#3C2A25]">
									{THERMOSTATS[modalThermostat].label}
								</h3>
								<p className="mt-2 text-sm text-[#3C2B27]/60 leading-relaxed">
									{THERMOSTATS[modalThermostat].description}
								</p>
								<div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-[#B86B45]/10 border border-[#B86B45]/20">
									<span className="text-sm font-semibold text-[#B86B45]">
										{THERMOSTATS[modalThermostat].sublabel}
									</span>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</section>
	);
}