


// 'use client';

// import Image from 'next/image';
// import { motion, useReducedMotion } from 'framer-motion';
// import LeadPopup from '../components/LeadPopup.jsx';

// const container = {
// 	hidden: {},
// 	show: {
// 		transition: { staggerChildren: 0.16, delayChildren: 0.2 },
// 	},
// };

// const fadeUp = {
// 	hidden: { opacity: 0, y: 22 },
// 	show: {
// 		opacity: 1,
// 		y: 0,
// 		transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
// 	},
// };

// const STATS = [
// 	{ val: '500K+', label: 'Installations', sub: 'Across India', icon: 'house' },
// 	{ val: '2M+', label: 'Worldwide', sub: 'Global installs', icon: 'globe' },
// 	{ val: '99%', label: 'Satisfaction', sub: 'Verified clients', icon: 'shield' },
// 	{ val: '10-25yr', label: 'Warranty', sub: 'Industry leading', icon: 'medal' },
// ];

// function StatIcon({ type }) {
// 	const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
// 	switch (type) {
// 		case 'house':
// 			return (
// 				<svg {...common}>
// 					<path d='M3.5 11.5 12 4l8.5 7.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
// 					<path d='M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
// 				</svg>
// 			);
// 		case 'globe':
// 			return (
// 				<svg {...common}>
// 					<circle cx='12' cy='12' r='8.25' stroke='currentColor' strokeWidth='1.5' />
// 					<path d='M3.75 12h16.5M12 3.75c2.4 2.2 3.6 5 3.6 8.25s-1.2 6.05-3.6 8.25c-2.4-2.2-3.6-5-3.6-8.25S9.6 5.95 12 3.75Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
// 				</svg>
// 			);
// 		case 'shield':
// 			return (
// 				<svg {...common}>
// 					<path d='M12 3.5 19 6v5.2c0 4.4-3 7.9-7 9.3-4-1.4-7-4.9-7-9.3V6l7-2.5Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
// 					<path d='M9 12.3l2 2 4-4.2' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
// 				</svg>
// 			);
// 		case 'medal':
// 			return (
// 				<svg {...common}>
// 					<circle cx='12' cy='14.5' r='5.25' stroke='currentColor' strokeWidth='1.5' />
// 					<path d='M9.5 3.5 8 9.7M14.5 3.5 16 9.7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
// 					<path d='M10.3 14.9 11.6 16l2-2.6' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
// 				</svg>
// 			);
// 		default:
// 			return null;
// 	}
// }

// function ArrowIcon() {
// 	return (
// 		<svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
// 			<path d='M3 8h10M9 4l4 4-4 4' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
// 		</svg>
// 	);
// }

// export default function HeroUnderfloorPremiumOrange() {
// 	const reduce = useReducedMotion();

// 	return (
// 		<section className='relative w-full overflow-hidden hero-section' style={{ minHeight: '100dvh' }}>
// 			{/* IMAGE BACKGROUND */}
// 			<motion.div
// 				className='absolute inset-0'
// 				initial={reduce ? false : { scale: 1.06, opacity: 0 }}
// 				animate={{ scale: 1, opacity: 1 }}
// 				transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}>
// 				<Image
// 					src='/images/elecr.png'
// 					alt='Electric hamam and underfloor heating installation in a Kashmir home by The Heating Store'
// 					fill
// 					className='object-cover'
// 					priority
// 					sizes='100vw'
// 				/>
// 				<div className='absolute inset-0 hero-overlay' />
// 			</motion.div>

// 			{/* HEAT AMBIENCE — subtle glow echoing the coil area in the photo */}
// 			<motion.div
// 				aria-hidden
// 				animate={reduce ? {} : { opacity: [0.2, 0.38, 0.2] }}
// 				transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
// 				className='absolute inset-0 pointer-events-none'
// 				style={{
// 					background: 'radial-gradient(45% 40% at 78% 88%, rgba(224,138,73,0.28), transparent 70%)',
// 				}}
// 			/>

// 			{/* CONTENT */}
// 			<motion.div
// 				className='relative z-10 w-full flex items-center hero-content-wrap'
// 				style={{ minHeight: '100dvh' }}
// 				variants={container}
// 				initial='hidden'
// 				animate='show'>
// 				<div className='hero-col'>

// 					<motion.span variants={fadeUp} className='hero-badge'>
// 						<span className='hero-badge-dot' />
// 						India's Largest Underfloor Heating Seller Since 2011
// 					</motion.span>

// 					<motion.h1 variants={fadeUp} className='hero-heading'>
// 						<span className='line-white'>Underfloor Heating &amp;</span>
// 						<span className='line-white'>Electric Hamam Systems.</span>
// 						<span className='line-copper'>Installed Across India</span>
// 						<span className='line-copper'>with global experience.</span>
// 					</motion.h1>

// 					<motion.div variants={fadeUp} className='hero-stats-bar'>
// 						{STATS.map((s) => (
// 							<div key={s.label} className='hero-stat-item'>
// 								<span className='hero-stat-icon'>
// 									<StatIcon type={s.icon} />
// 								</span>
// 								<span className='hero-stat-text'>
// 									<p className='hero-stat-val'>{s.val}</p>
// 									<p className='hero-stat-label'>{s.label}</p>
// 									<p className='hero-stat-sub'>{s.sub}</p>
// 								</span>
// 							</div>
// 						))}
// 					</motion.div>

// 					<motion.p variants={fadeUp} className='hero-paragraph'>
// 						From custom designs and consultation to certified installations. The Heating Store delivers advanced electric heating system trusted by homeowners, architects, and builders.
// 					</motion.p>

// 					<motion.div variants={fadeUp} className='hero-cta hero-buttons'>
// 						<a href='/contact' className='cta-primary'>
// 							<span>Talk to an Expert</span>
// 							<ArrowIcon />
// 						</a>
// 						<a href='/SpaceVerification' className='cta-secondary'>
// 							<span>Book Site Visit</span>
// 							<ArrowIcon />
// 						</a>
// 					</motion.div>

// 					<motion.p variants={fadeUp} className='hero-stats-line'>
// 						<svg width='15' height='15' viewBox='0 0 24 24' fill='none' aria-hidden='true' className='hero-stats-line-icon'>
// 							<path d='M12 3.5 19 6v5.2c0 4.4-3 7.9-7 9.3-4-1.4-7-4.9-7-9.3V6l7-2.5Z' stroke='currentColor' strokeWidth='1.6' strokeLinejoin='round' />
// 						</svg>
// 						250M+ Sq Ft Heated &bull; 50 Installation Teams &bull; 10&ndash;25 Year Warranties
// 					</motion.p>

// 					<motion.p variants={fadeUp} className='hero-climate-text'>
// 						Proven performance in extreme climates down to &minus;25&deg;C across Ladakh, Dras, Kargil, and Kashmir
// 					</motion.p>
// 				</div>
// 			</motion.div>

// 			<style>{`
// 				.hero-section {
// 					--ink: #0a0705;
// 					--copper: #c9622f;
// 					--copper-light: #dd8a4f;
// 					--ivory: #f5f1ec;
// 				}

// 				.hero-overlay {
// 					background: linear-gradient(92deg, rgba(9,6,4,0.94) 0%, rgba(9,6,4,0.85) 34%, rgba(9,6,4,0.55) 58%, rgba(9,6,4,0.18) 82%, rgba(9,6,4,0.05) 100%);
// 				}

// 				.hero-content-wrap { padding: 120px 6vw 60px; }
// 				.hero-col {
// 					display: flex;
// 					flex-direction: column;
// 					align-items: flex-start;
// 					width: 100%;
// 					max-width: 700px;
// 				}

// 				/* ── badge ── */
// 				.hero-badge {
// 					display: inline-flex;
// 					align-items: center;
// 					gap: 9px;
// 					border: 1px solid rgba(221,138,79,0.45);
// 					background: rgba(221,138,79,0.05);
// 					border-radius: 999px;
// 					padding: 7px 18px 7px 15px;
// 					font-size: 0.72rem;
// 					letter-spacing: 0.13em;
// 					color: rgba(245,241,236,0.9);
// 					text-transform: uppercase;
// 					margin-bottom: 26px;
// 				}
// 				.hero-badge-dot {
// 					width: 6px;
// 					height: 6px;
// 					border-radius: 50%;
// 					background: var(--copper-light);
// 					flex-shrink: 0;
// 					box-shadow: 0 0 0 0 rgba(221,138,79,0.55);
// 					animation: badgePulse 2.4s ease-in-out infinite;
// 				}
// 				@keyframes badgePulse {
// 					0% { box-shadow: 0 0 0 0 rgba(221,138,79,0.55); }
// 					70% { box-shadow: 0 0 0 6px rgba(221,138,79,0); }
// 					100% { box-shadow: 0 0 0 0 rgba(221,138,79,0); }
// 				}

// 				/* ── heading ── */
// 				.hero-heading {
// 					font-family: 'Cormorant Garamond', Georgia, serif;
// 					font-weight: 700;
// 					font-size: clamp(1.5rem, 3.2vw, 2.65rem);
// 					line-height: 1.08;
// 					margin: 0 0 28px;
// 				}
// 				.hero-heading span { display: block; }
// 				.line-white { color: var(--ivory); }
// 				.line-copper { color: var(--copper-light); }

// 				/* ── stats bar ── */
// 				.hero-stats-bar {
// 					display: flex;
// 					align-items: stretch;
// 					gap: 0;
// 					width: 100%;
// 					border: 1px solid rgba(245,241,236,0.16);
// 					background: rgba(10,7,5,0.4);
// 					backdrop-filter: blur(10px);
// 					-webkit-backdrop-filter: blur(10px);
// 					border-radius: 14px;
// 					padding: 18px 22px;
// 					margin-bottom: 30px;
// 				}
// 				.hero-stat-item {
// 					display: flex;
// 					align-items: center;
// 					gap: 10px;
// 					flex: 1;
// 					padding: 0 10px;
// 				}
// 				.hero-stat-item + .hero-stat-item { border-left: 1px solid rgba(245,241,236,0.12); }
// 				.hero-stat-icon { color: var(--copper-light); flex-shrink: 0; display: flex; }
// 				.hero-stat-text { display: flex; flex-direction: column; gap: 1px; }
// 				.hero-stat-val {
// 					font-family: 'Cormorant Garamond', Georgia, serif;
// 					font-size: 1.4rem;
// 					font-weight: 700;
// 					color: var(--ivory);
// 					line-height: 1;
// 					margin: 0;
// 				}
// 				.hero-stat-label {
// 					font-size: 0.66rem;
// 					font-weight: 700;
// 					color: var(--copper-light);
// 					letter-spacing: 0.05em;
// 					text-transform: uppercase;
// 					margin: 3px 0 0;
// 				}
// 				.hero-stat-sub {
// 					font-size: 0.66rem;
// 					color: rgba(245,241,236,0.45);
// 					margin: 1px 0 0;
// 				}

// 				/* ── paragraph ── */
// 				.hero-paragraph {
// 					font-size: 1rem;
// 					color: rgba(245,241,236,0.72);
// 					max-width: 540px;
// 					line-height: 1.7;
// 					margin: 0 0 30px;
// 				}

// 				/* ── buttons ── */
// 				.hero-cta { display: flex; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
// 				.cta-primary, .cta-secondary {
// 					position: relative;
// 					display: inline-flex;
// 					align-items: center;
// 					gap: 8px;
// 					border-radius: 8px;
// 					padding: 14px 26px;
// 					font-size: 0.95rem;
// 					font-weight: 600;
// 					text-decoration: none;
// 					overflow: hidden;
// 					transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
// 				}
// 				.cta-primary {
// 					background: var(--copper);
// 					color: var(--ivory);
// 					box-shadow: 0 8px 22px -8px rgba(201,98,47,0.6);
// 				}
// 				.cta-primary::before {
// 					content: '';
// 					position: absolute;
// 					top: 0; left: -60%;
// 					width: 40%; height: 100%;
// 					background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
// 					transform: skewX(-20deg);
// 					transition: left 0.7s ease;
// 				}
// 				.cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -8px rgba(201,98,47,0.75); }
// 				.cta-primary:hover::before { left: 130%; }
// 				.cta-secondary {
// 					border: 1px solid rgba(245,241,236,0.4);
// 					color: var(--ivory);
// 					background: rgba(245,241,236,0.02);
// 				}
// 				.cta-secondary:hover {
// 					border-color: rgba(221,138,79,0.7);
// 					background: rgba(221,138,79,0.08);
// 					transform: translateY(-2px);
// 				}

// 				/* ── footer lines ── */
// 				.hero-stats-line {
// 					display: flex;
// 					align-items: center;
// 					gap: 8px;
// 					font-weight: 700;
// 					font-size: 0.875rem;
// 					color: rgba(245,241,236,0.92);
// 					letter-spacing: 0.01em;
// 					margin: 0;
// 				}
// 				.hero-stats-line-icon { color: var(--copper-light); flex-shrink: 0; }
// 				.hero-climate-text {
// 					font-size: 0.78rem;
// 					color: rgba(245,241,236,0.55);
// 					margin: 8px 0 0;
// 					line-height: 1.5;
// 				}

// 				/* ── mobile ── */
// 				@media (max-width: 768px) {
// 					.hero-section { min-height: 100svh !important; padding: 80px 20px 80px 20px !important; }
// 					.hero-content-wrap { padding: 88px 20px 48px !important; }
// 					.hero-col { align-items: center !important; text-align: center; max-width: 100% !important; }

// 					/* reorder: badge, heading, paragraph, buttons, trust line, climate text, THEN the stats bar last */
// 					.hero-badge { order: 1; font-size: 0.62rem !important; padding: 6px 14px !important; white-space: normal !important; text-align: center !important; }
// 					.hero-heading { order: 2; font-size: clamp(1.9rem, 7.5vw, 2.7rem) !important; margin-bottom: 20px !important; }
// 					.hero-paragraph { order: 3; font-size: 0.875rem !important; line-height: 1.6 !important; max-width: 100% !important; margin-bottom: 22px !important; }
// 					.hero-buttons { order: 4; flex-direction: column !important; gap: 12px !important; width: 100% !important; margin-bottom: 20px !important; }
// 					.hero-buttons a { width: 100% !important; justify-content: center !important; padding: 14px 20px !important; font-size: 0.9rem !important; }
// 					.hero-stats-line { order: 5; justify-content: center; font-size: 0.78rem !important; text-align: center; }
// 					.hero-climate-text { order: 6; font-size: 0.72rem !important; }
// 					.hero-stats-bar {
// 						order: 7;
// 						flex-wrap: wrap;
// 						padding: 16px !important;
// 						gap: 14px 0;
// 						margin-top: 24px;
// 						margin-bottom: 0 !important;
// 					}
// 					.hero-stat-item {
// 						flex: 0 0 50%;
// 						justify-content: center;
// 						padding: 8px 6px !important;
// 						border-left: none !important;
// 					}
// 					.hero-stat-text { align-items: flex-start; }

// 					/* background: vertical gradient so text stays readable up top while the
// 					   glowing coil detail near the bottom of the photo stays visible */
// 					.hero-overlay {
// 						background: linear-gradient(180deg, rgba(9,6,4,0.93) 0%, rgba(9,6,4,0.82) 30%, rgba(9,6,4,0.58) 62%, rgba(9,6,4,0.34) 100%) !important;
// 					}
// 					.hero-section img { object-position: center 68% !important; }
// 				}

// 				@media (max-width: 480px) {
// 					.hero-section { padding: 70px 16px 80px 16px !important; }
// 					.hero-heading { font-size: clamp(1.55rem, 8vw, 2.2rem) !important; }
// 					.hero-stat-val { font-size: 1.15rem !important; }
// 					.hero-stat-item { flex: 0 0 100%; justify-content: flex-start; }
// 				}
// 			`}</style>

// 			<LeadPopup />
// 		</section>
// 	);
// }

'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import LeadPopup from '../components/LeadPopup.jsx';

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.16, delayChildren: 0.2 },
	},
};

const fadeUp = {
	hidden: { opacity: 0, y: 22 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
	},
};

const STATS = [
	{ val: '500K+', label: 'Installations', sub: 'Across India', icon: 'house' },
	{ val: '2M+', label: 'Worldwide', sub: 'Global installs', icon: 'globe' },
	{ val: '99%', label: 'Satisfaction', sub: 'Verified clients', icon: 'shield' },
	{ val: '10-25yr', label: 'Warranty', sub: 'Industry leading', icon: 'medal' },
];

function StatIcon({ type }) {
	const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true };
	switch (type) {
		case 'house':
			return (
				<svg {...common}>
					<path d='M3.5 11.5 12 4l8.5 7.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
					<path d='M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			);
		case 'globe':
			return (
				<svg {...common}>
					<circle cx='12' cy='12' r='8.25' stroke='currentColor' strokeWidth='1.5' />
					<path d='M3.75 12h16.5M12 3.75c2.4 2.2 3.6 5 3.6 8.25s-1.2 6.05-3.6 8.25c-2.4-2.2-3.6-5-3.6-8.25S9.6 5.95 12 3.75Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
				</svg>
			);
		case 'shield':
			return (
				<svg {...common}>
					<path d='M12 3.5 19 6v5.2c0 4.4-3 7.9-7 9.3-4-1.4-7-4.9-7-9.3V6l7-2.5Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
					<path d='M9 12.3l2 2 4-4.2' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			);
		case 'medal':
			return (
				<svg {...common}>
					<circle cx='12' cy='14.5' r='5.25' stroke='currentColor' strokeWidth='1.5' />
					<path d='M9.5 3.5 8 9.7M14.5 3.5 16 9.7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
					<path d='M10.3 14.9 11.6 16l2-2.6' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			);
		default:
			return null;
	}
}

function ArrowIcon() {
	return (
		<svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
			<path d='M3 8h10M9 4l4 4-4 4' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	);
}

export default function HeroUnderfloorPremiumOrange() {
	const reduce = useReducedMotion();

	return (
		<section className='relative w-full overflow-hidden hero-section' style={{ minHeight: '100dvh' }}>
			{/* IMAGE BACKGROUND */}
			<motion.div
				className='absolute inset-0'
				initial={reduce ? false : { scale: 1.06, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}>
				<Image
					src='/images/elecr.png'
					alt='Electric hamam and underfloor heating installation in a Kashmir home by The Heating Store'
					fill
					className='object-cover'
					priority
					sizes='100vw'
				/>
				<div className='absolute inset-0 hero-overlay' />
			</motion.div>

			{/* HEAT AMBIENCE — subtle glow echoing the coil area in the photo */}
			<motion.div
				aria-hidden
				animate={reduce ? {} : { opacity: [0.2, 0.38, 0.2] }}
				transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
				className='absolute inset-0 pointer-events-none'
				style={{
					background: 'radial-gradient(45% 40% at 78% 88%, rgba(224,138,73,0.28), transparent 70%)',
				}}
			/>

			{/* CONTENT */}
			<motion.div
				className='relative z-10 w-full flex items-center hero-content-wrap'
				style={{ minHeight: '100dvh' }}
				variants={container}
				initial='hidden'
				animate='show'>
				<div className='hero-col'>

					<motion.span variants={fadeUp} className='hero-badge'>
						<span className='hero-badge-dot' />
						India's Largest Underfloor Heating Seller Since 2011
					</motion.span>

					<motion.h1 variants={fadeUp} className='hero-heading'>
						<span className='line-white'>Underfloor Heating &amp;</span>
						<span className='line-white'>Electric Hamam Systems.</span>
						<span className='line-copper'>Installed Across India</span>
						<span className='line-copper'>with global experience.</span>
					</motion.h1>

					<motion.div variants={fadeUp} className='hero-stats-bar'>
						{STATS.map((s) => (
							<div key={s.label} className='hero-stat-item'>
								<span className='hero-stat-icon'>
									<StatIcon type={s.icon} />
								</span>
								<span className='hero-stat-text'>
									<p className='hero-stat-val'>{s.val}</p>
									<p className='hero-stat-label'>{s.label}</p>
									<p className='hero-stat-sub'>{s.sub}</p>
								</span>
							</div>
						))}
					</motion.div>

					<motion.p variants={fadeUp} className='hero-paragraph'>
						From custom designs and consultation to certified installations. The Heating Store delivers advanced electric heating system trusted by homeowners, architects, and builders.
					</motion.p>

					<motion.div variants={fadeUp} className='hero-cta hero-buttons'>
						<a href='/contact' className='cta-primary'>
							<span>Talk to an Expert</span>
							<ArrowIcon />
						</a>
						<a href='/SpaceVerification' className='cta-secondary'>
							<span>Book Site Visit</span>
							<ArrowIcon />
						</a>
					</motion.div>

					<motion.p variants={fadeUp} className='hero-stats-line'>
						<svg width='15' height='15' viewBox='0 0 24 24' fill='none' aria-hidden='true' className='hero-stats-line-icon'>
							<path d='M12 3.5 19 6v5.2c0 4.4-3 7.9-7 9.3-4-1.4-7-4.9-7-9.3V6l7-2.5Z' stroke='currentColor' strokeWidth='1.6' strokeLinejoin='round' />
						</svg>
						250M+ Sq Ft Heated &bull; 50 Installation Teams &bull; 10&ndash;25 Year Warranties
					</motion.p>

					<motion.p variants={fadeUp} className='hero-climate-text'>
						Proven performance in extreme climates down to &minus;25&deg;C across Ladakh, Dras, Kargil, and Kashmir
					</motion.p>
				</div>
			</motion.div>

			<style>{`
				.hero-section {
					--ink: #0a0705;
					--copper: #c9622f;
					--copper-light: #dd8a4f;
					--ivory: #f5f1ec;
				}

				/*
				  PREMIUM OVERLAY — warm charcoal/copper tint instead of flat black.
				  Left side (where the text sits) stays legible, but overall opacity
				  is lower and the color itself is warmed toward the brand's copper
				  tone rather than pure rgb(9,6,4) black. This keeps the photo visible
				  and stops the hero from reading as a flat black panel.
				*/
				.hero-overlay {
					background: linear-gradient(
						92deg,
						rgba(28,17,10,0.86) 0%,
						rgba(28,17,10,0.72) 34%,
						rgba(28,17,10,0.42) 58%,
						rgba(28,17,10,0.14) 82%,
						rgba(28,17,10,0.04) 100%
					);
				}

				.hero-content-wrap { padding: 120px 6vw 60px; }
				.hero-col {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					width: 100%;
					max-width: 700px;
				}

				/* ── badge ── */
				.hero-badge {
					display: inline-flex;
					align-items: center;
					gap: 9px;
					border: 1px solid rgba(221,138,79,0.45);
					background: rgba(221,138,79,0.05);
					border-radius: 999px;
					padding: 7px 18px 7px 15px;
					font-size: 0.72rem;
					letter-spacing: 0.13em;
					color: rgba(245,241,236,0.9);
					text-transform: uppercase;
					margin-bottom: 26px;
				}
				.hero-badge-dot {
					width: 6px;
					height: 6px;
					border-radius: 50%;
					background: var(--copper-light);
					flex-shrink: 0;
					box-shadow: 0 0 0 0 rgba(221,138,79,0.55);
					animation: badgePulse 2.4s ease-in-out infinite;
				}
				@keyframes badgePulse {
					0% { box-shadow: 0 0 0 0 rgba(221,138,79,0.55); }
					70% { box-shadow: 0 0 0 6px rgba(221,138,79,0); }
					100% { box-shadow: 0 0 0 0 rgba(221,138,79,0); }
				}

				/* ── heading ── */
				.hero-heading {
					font-family: 'Cormorant Garamond', Georgia, serif;
					font-weight: 700;
					font-size: clamp(1.5rem, 3.2vw, 2.65rem);
					line-height: 1.08;
					margin: 0 0 28px;
				}
				.hero-heading span { display: block; }
				.line-white { color: var(--ivory); }
				.line-copper { color: var(--copper-light); }

				/* ── stats bar ── */
				.hero-stats-bar {
					display: flex;
					align-items: stretch;
					gap: 0;
					width: 100%;
					border: 1px solid rgba(245,241,236,0.16);
					background: rgba(28,17,10,0.32);
					backdrop-filter: blur(10px);
					-webkit-backdrop-filter: blur(10px);
					border-radius: 14px;
					padding: 18px 22px;
					margin-bottom: 30px;
				}
				.hero-stat-item {
					display: flex;
					align-items: center;
					gap: 10px;
					flex: 1;
					padding: 0 10px;
				}
				.hero-stat-item + .hero-stat-item { border-left: 1px solid rgba(245,241,236,0.12); }
				.hero-stat-icon { color: var(--copper-light); flex-shrink: 0; display: flex; }
				.hero-stat-text { display: flex; flex-direction: column; gap: 1px; }
				.hero-stat-val {
					font-family: 'Cormorant Garamond', Georgia, serif;
					font-size: 1.4rem;
					font-weight: 700;
					color: var(--ivory);
					line-height: 1;
					margin: 0;
				}
				.hero-stat-label {
					font-size: 0.66rem;
					font-weight: 700;
					color: var(--copper-light);
					letter-spacing: 0.05em;
					text-transform: uppercase;
					margin: 3px 0 0;
				}
				.hero-stat-sub {
					font-size: 0.66rem;
					color: rgba(245,241,236,0.45);
					margin: 1px 0 0;
				}

				/* ── paragraph ── */
				.hero-paragraph {
					font-size: 1rem;
					color: rgba(245,241,236,0.72);
					max-width: 540px;
					line-height: 1.7;
					margin: 0 0 30px;
				}

				/* ── buttons ── */
				.hero-cta { display: flex; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
				.cta-primary, .cta-secondary {
					position: relative;
					display: inline-flex;
					align-items: center;
					gap: 8px;
					border-radius: 8px;
					padding: 14px 26px;
					font-size: 0.95rem;
					font-weight: 600;
					text-decoration: none;
					overflow: hidden;
					transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
				}
				.cta-primary {
					background: var(--copper);
					color: var(--ivory);
					box-shadow: 0 8px 22px -8px rgba(201,98,47,0.6);
				}
				.cta-primary::before {
					content: '';
					position: absolute;
					top: 0; left: -60%;
					width: 40%; height: 100%;
					background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
					transform: skewX(-20deg);
					transition: left 0.7s ease;
				}
				.cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -8px rgba(201,98,47,0.75); }
				.cta-primary:hover::before { left: 130%; }
				.cta-secondary {
					border: 1px solid rgba(245,241,236,0.4);
					color: var(--ivory);
					background: rgba(245,241,236,0.02);
				}
				.cta-secondary:hover {
					border-color: rgba(221,138,79,0.7);
					background: rgba(221,138,79,0.08);
					transform: translateY(-2px);
				}

				/* ── footer lines ── */
				.hero-stats-line {
					display: flex;
					align-items: center;
					gap: 8px;
					font-weight: 700;
					font-size: 0.875rem;
					color: rgba(245,241,236,0.92);
					letter-spacing: 0.01em;
					margin: 0;
				}
				.hero-stats-line-icon { color: var(--copper-light); flex-shrink: 0; }
				.hero-climate-text {
					font-size: 0.78rem;
					color: rgba(245,241,236,0.55);
					margin: 8px 0 0;
					line-height: 1.5;
				}

				/* ── mobile ── */
				@media (max-width: 768px) {
					.hero-section { min-height: 100svh !important; padding: 80px 20px 80px 20px !important; }
					.hero-content-wrap { padding: 88px 20px 48px !important; }
					.hero-col { align-items: center !important; text-align: center; max-width: 100% !important; }

					/* reorder: badge, heading, paragraph, buttons, trust line, climate text, THEN the stats bar last */
					.hero-badge { order: 1; font-size: 0.62rem !important; padding: 6px 14px !important; white-space: normal !important; text-align: center !important; }
					.hero-heading { order: 2; font-size: clamp(1.9rem, 7.5vw, 2.7rem) !important; margin-bottom: 20px !important; }
					.hero-paragraph { order: 3; font-size: 0.875rem !important; line-height: 1.6 !important; max-width: 100% !important; margin-bottom: 22px !important; }
					.hero-buttons { order: 4; flex-direction: column !important; gap: 12px !important; width: 100% !important; margin-bottom: 20px !important; }
					.hero-buttons a { width: 100% !important; justify-content: center !important; padding: 14px 20px !important; font-size: 0.9rem !important; }
					.hero-stats-line { order: 5; justify-content: center; font-size: 0.78rem !important; text-align: center; }
					.hero-climate-text { order: 6; font-size: 0.72rem !important; }
					.hero-stats-bar {
						order: 7;
						flex-wrap: wrap;
						padding: 16px !important;
						gap: 14px 0;
						margin-top: 24px;
						margin-bottom: 0 !important;
					}
					.hero-stat-item {
						flex: 0 0 50%;
						justify-content: center;
						padding: 8px 6px !important;
						border-left: none !important;
					}
					.hero-stat-text { align-items: flex-start; }

					/*
					  Mobile overlay: this is the one responsible for the "too black up top"
					  look, since on small screens the gradient runs top-to-bottom and the
					  top stop used to sit at 0.93 opacity of near-pure black. Now it's a
					  softer, warmer top (0.55) that fades in gently, stays a bit stronger
					  in the middle where the heading/text sits, and eases off toward the
					  bottom so the coil glow in the photo stays visible.
					*/
					.hero-overlay {
						background: linear-gradient(
							180deg,
							rgba(28,17,10,0.58) 0%,
							rgba(28,17,10,0.68) 30%,
							rgba(28,17,10,0.5) 62%,
							rgba(28,17,10,0.28) 100%
						) !important;
					}
					.hero-section img { object-position: center 68% !important; }
				}

				@media (max-width: 480px) {
					.hero-section { padding: 70px 16px 80px 16px !important; }
					.hero-heading { font-size: clamp(1.55rem, 8vw, 2.2rem) !important; }
					.hero-stat-val { font-size: 1.15rem !important; }
					.hero-stat-item { flex: 0 0 100%; justify-content: flex-start; }
				}
			`}</style>

			<LeadPopup />
		</section>
	);
}
