'use client';

import {
	motion,
	AnimatePresence,
	useReducedMotion,
	useInView,
	useScroll,
	useTransform,
} from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE, identical to WhyChooseUsClient's `C` object so both sections are
// provably the same color system
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA, 5 professional steps, no app content
// ─────────────────────────────────────────────────────────────────────────────

const steps = [
	{
		step: '01',
		tag: 'Site Assessment',
		title: 'Expert Survey &',
		titleAccent: 'Custom Floor Design',
		badge: 'Free of Charge',
		desc: 'Our NICEIC certified engineers survey the property in person, measuring room dimensions, checking floor construction and existing insulation, and calculating thermal load and U-values room by room. The result is a bespoke CAD heating layout with cable density and circuit zoning mapped to your exact floor plan, not a generic template.',
		points: [
			{
				icon: '📐',
				label: 'Bespoke CAD Plan',
				detail: 'Cable spacing mapped room by room from your actual floor plan',
			},
			{
				icon: '🔬',
				label: 'Thermal Load Analysis',
				detail: 'U-value and heat-loss calculations set the wattage per m²',
			},
			{
				icon: '⚡',
				label: 'Circuit Zoning',
				detail: 'Load calculated per circuit so each thermostat zone is balanced',
			},
		],
		stat: { value: 'Free', label: 'Full survey and CAD design, zero obligation' },
		proof: '14,000+ bespoke CAD designs delivered across the UK',
		bgScene: 'survey',
	},
	{
		step: '02',
		tag: 'Subfloor Prep',
		title: 'Precision Cable',
		titleAccent: 'Installation',
		badge: 'NICEIC Certified',
		desc: 'Engineers embed ultra-thin heating cable directly into the screed, or fix self-adhesive mats across the subfloor, laid to the exact CAD spec so there are no cold spots. Every installation is wired and commissioned to BS 7671 Amendment 4 and signed off under NICEIC certification before the floor finish goes down.',
		points: [
			{
				icon: '🔥',
				label: '3–4mm Cable Profile',
				detail: 'Sits invisibly beneath tile, stone, LVT or timber',
			},
			{
				icon: '🧲',
				label: 'Self-Adhesive Mats',
				detail: 'Fast-fix system for renovations over an existing subfloor',
			},
			{
				icon: '🛠️',
				label: 'Screed-Embedded Cable',
				detail: 'Wet system for new-build slabs and full renovations',
			},
		],
		stat: {
			value: '4mm',
			label: 'Total profile, thinner than a pound coin',
		},
		proof: '0.01% fault rate across 2 million+ installations',
		bgScene: 'install',
	},
	{
		step: '03',
		tag: 'Heat Science',
		title: 'Radiant Warmth',
		titleAccent: 'From the Ground Up',
		badge: 'No Cold Spots. Ever.',
		desc: 'Radiators heat air, which rises, cools and recirculates dust as it moves around a room. Underfloor heating radiates warmth directly from the floor surface, so the whole room warms evenly with no draughts, no dust circulation and no hot-and-cold layering. Comfort that reads as air quality, not just temperature.',
		points: [
			{
				icon: '🌡️',
				label: '26°C Floor Surface',
				detail: 'Warmth exactly where the body feels it, not six feet up a wall',
			},
			{
				icon: '💨',
				label: 'Zero Air Movement',
				detail: 'No convection currents to stir dust, pollen or allergens',
			},
			{
				icon: '🔇',
				label: 'Completely Silent',
				detail: 'No pumps, valves, radiator noise or water gurgling',
			},
		],
		stat: { value: '100%', label: 'Floor area heated with total uniformity' },
		proof: 'Zero convection currents to circulate dust, pollen or allergens, room after room',
		bgScene: 'radiant',
	},
	{
		step: '04',
		tag: 'Smart Controls',
		title: 'Intelligent Thermostat',
		titleAccent: '& Energy Management',
		badge: 'Reported 15–30% Zoned Savings',
		desc: "Heatmiser Neo and Salus iT800 systems pair a floor sensor with an air sensor, so the thermostat reacts to both rather than just room temperature. Geofencing brings the heating on as you head home, and open-window detection pauses it automatically when a window opens nearby. The wider industry is moving toward Matter and Thread based cross-brand compatibility; our systems currently run through their own dedicated hub and app, with independent market reporting putting typical zoned-control savings in the 15–30% range depending on the property and how it's used.",
		points: [
			{
				icon: '🎯',
				label: 'Dual Sensor Precision',
				detail: '±0.5°C accuracy, floor and air temperature both monitored',
			},
			{
				icon: '📅',
				label: 'Geofencing & Adaptive Scheduling',
				detail: 'Self-learning 7-day programme, heating adjusts as you leave and return',
			},
			{
				icon: '🛡️',
				label: 'Open-Window & Overheat Protection',
				detail: 'Automatic cutout if a window opens nearby or the floor runs hot',
			},
		],
		stat: { value: '±0.5°', label: 'Temperature control accuracy per zone' },
		proof: 'Heatmiser Neo integrates with Google Home, Amazon Alexa and Apple HomeKit via neoHub',
		bgScene: 'thermostat',
	},
	{
		step: '05',
		tag: 'After Care',
		title: '25 Year Warranty',
		titleAccent: '& Support',
		badge: '25 Years. Zero Callout Fees.',
		desc: 'Every system we install carries a 25 year product warranty backed by a 24-hour replacement guarantee. Our dedicated aftercare team remains on call for the full lifetime of your heating system with zero callout fees, ever.',
		points: [
			{
				icon: '🛡️',
				label: '25 Year Warranty',
				detail: 'Cables, thermostats and all components fully covered',
			},
			{
				icon: '🔄',
				label: '24 Hour Swap Guarantee',
				detail: 'Faulty unit replaced within one working day',
			},
			{
				icon: '📞',
				label: 'Zero Callout Fees',
				detail: 'Technical support with no hidden charges',
			},
		],
		stat: {
			value: '25yr',
			label: 'Warranty covering cables, thermostats and controls',
		},
		proof: '300,000+ customers served. Zero unresolved warranty claims.',
		bgScene: 'warranty',
	},
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG SCENES
// ─────────────────────────────────────────────────────────────────────────────

function SceneSurvey({ active }) {
	return (
		<svg
			viewBox='0 0 360 310'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}>
			<defs>
				<linearGradient id='svPaper' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#FFFBF7' />
					<stop offset='100%' stopColor='#F5EDE0' />
				</linearGradient>
			</defs>
			<rect
				x='28'
				y='18'
				width='226'
				height='278'
				rx='8'
				fill='url(#svPaper)'
				stroke='#E8D4BC'
				strokeWidth='1'
			/>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
				<line
					key={`h${i}`}
					x1='28'
					y1={48 + i * 26}
					x2='254'
					y2={48 + i * 26}
					stroke='#EDD5BC'
					strokeWidth='0.35'
					strokeDasharray='3 3'
				/>
			))}
			{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
				<line
					key={`v${i}`}
					x1={55 + i * 28}
					y1='18'
					x2={55 + i * 28}
					y2='296'
					stroke='#EDD5BC'
					strokeWidth='0.35'
					strokeDasharray='3 3'
				/>
			))}
			{/* Room outline */}
			<rect
				x='52'
				y='52'
				width='176'
				height='136'
				rx='2'
				fill='none'
				stroke='#C17A50'
				strokeWidth='1.5'
			/>
			<line
				x1='52'
				y1='116'
				x2='130'
				y2='116'
				stroke='#C17A50'
				strokeWidth='1'
			/>
			<line
				x1='130'
				y1='52'
				x2='130'
				y2='188'
				stroke='#C17A50'
				strokeWidth='1'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#8A6448'
				x='89'
				y='87'
				textAnchor='middle'>
				BATHROOM
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#8A6448'
				x='89'
				y='155'
				textAnchor='middle'>
				HALLWAY
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#8A6448'
				x='178'
				y='118'
				textAnchor='middle'>
				LIVING ROOM
			</text>
			{/* Cables bathroom */}
			{active &&
				[0, 1, 2, 3].map((row) => (
					<motion.path
						key={row}
						d={`M57 ${63 + row * 10} Q88 ${60 + row * 10} 125 ${63 + row * 10}`}
						stroke='#C17A50'
						strokeWidth='1.2'
						strokeLinecap='round'
						fill='none'
						opacity='0.65'
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 1,
							delay: 0.3 + row * 0.15,
							ease: 'easeOut',
						}}
					/>
				))}
			{/* Cables living room */}
			{active &&
				[0, 1, 2, 3, 4, 5, 6].map((row) => (
					<motion.path
						key={row}
						d={`M134 ${62 + row * 16} Q178 ${59 + row * 16} 223 ${62 + row * 16}`}
						stroke='#B86B45'
						strokeWidth='1.2'
						strokeLinecap='round'
						fill='none'
						opacity='0.55'
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 1.2,
							delay: 0.6 + row * 0.1,
							ease: 'easeOut',
						}}
					/>
				))}
			{/* Dimension arrows */}
			<line
				x1='52'
				y1='200'
				x2='228'
				y2='200'
				stroke='#A88060'
				strokeWidth='0.7'
			/>
			<polygon
				points='52,197 52,203 44,200'
				fill='#A88060'
				opacity='0.7'
			/>
			<polygon
				points='228,197 228,203 236,200'
				fill='#A88060'
				opacity='0.7'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#A88060'
				x='140'
				y='212'
				textAnchor='middle'>
				4,250mm
			</text>
			<line
				x1='242'
				y1='52'
				x2='242'
				y2='188'
				stroke='#A88060'
				strokeWidth='0.7'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#A88060'
				x='254'
				y='124'
				textAnchor='middle'
				transform='rotate(90,254,124)'>
				3,000mm
			</text>
			{/* Title block */}
			<rect
				x='36'
				y='218'
				width='208'
				height='68'
				rx='5'
				fill='#F5EDE0'
				stroke='#E0CCBA'
				strokeWidth='0.7'
			/>
			<text
				fontFamily="var(--font-heading)"
				fontSize='8'
				fontWeight='600'
				fill='#3C2A25'
				x='45'
				y='231'>
				HEATING LAYOUT CAD PLAN
			</text>
			<line
				x1='36'
				y1='235'
				x2='244'
				y2='235'
				stroke='#E0CCBA'
				strokeWidth='0.5'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#6B4A2D'
				x='45'
				y='247'>
				Project: Premium Residential
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#6B4A2D'
				x='45'
				y='258'>
				Cable: ProWarm 150W/m²
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#6B4A2D'
				x='45'
				y='269'>
				Zones: 3 · Total area: 18.2m²
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#B86B45'
				fontWeight='600'
				x='45'
				y='280'>
				Rev A · Certified Approved
			</text>
			{/* Tools */}
			<rect
				x='272'
				y='38'
				width='72'
				height='95'
				rx='7'
				fill='#FFF5EE'
				stroke='#D4B89A'
				strokeWidth='1'
			/>
			<rect
				x='282'
				y='26'
				width='52'
				height='18'
				rx='4'
				fill='#C17A50'
				opacity='0.22'
				stroke='#C17A50'
				strokeWidth='0.8'
			/>
			<rect
				x='295'
				y='22'
				width='26'
				height='10'
				rx='2'
				fill='#C17A50'
				opacity='0.45'
			/>
			{[0, 1, 2, 3, 4].map((i) => (
				<line
					key={i}
					x1='282'
					y1={54 + i * 13}
					x2='336'
					y2={54 + i * 13}
					stroke='#E0CCBA'
					strokeWidth='0.7'
				/>
			))}
			<line
				x1='282'
				y1='54'
				x2='310'
				y2='54'
				stroke='#C17A50'
				strokeWidth='1.3'
				opacity='0.7'
			/>
			<line
				x1='282'
				y1='67'
				x2='322'
				y2='67'
				stroke='#C17A50'
				strokeWidth='1.3'
				opacity='0.5'
			/>
			<line
				x1='282'
				y1='80'
				x2='315'
				y2='80'
				stroke='#C17A50'
				strokeWidth='1.3'
				opacity='0.4'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='6'
				fill='#8A6448'
				x='308'
				y='120'
				textAnchor='middle'>
				SURVEY NOTES
			</text>
			<rect
				x='272'
				y='148'
				width='72'
				height='82'
				rx='7'
				fill='#FFF5EE'
				stroke='#D4B89A'
				strokeWidth='1'
			/>
			<rect
				x='282'
				y='158'
				width='52'
				height='32'
				rx='4'
				fill='#F0E0CC'
			/>
			<text
				fontFamily="var(--font-heading)"
				fontSize='13'
				fontWeight='600'
				fill='#B86B45'
				x='308'
				y='180'
				textAnchor='middle'>
				22.4°
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='6'
				fill='#8A6448'
				x='308'
				y='191'
				textAnchor='middle'>
				FLOOR TEMP
			</text>
			<circle cx='290' cy='216' r='6' fill='#E8D0BC' />
			<circle cx='308' cy='216' r='6' fill='#C17A50' opacity='0.75' />
			<circle cx='326' cy='216' r='6' fill='#E8D0BC' />
			<text
				fontFamily="var(--font-body)"
				fontSize='6'
				fill='#8A6448'
				x='308'
				y='228'
				textAnchor='middle'>
				THERMAL METER
			</text>
			{/* FREE stamp */}
			{active && (
				<motion.g
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 240, delay: 1.5 }}>
					<circle
						cx='316'
						cy='270'
						r='24'
						fill='none'
						stroke='#C17A50'
						strokeWidth='1.5'
						strokeDasharray='4 3'
					/>
					<text
						fontFamily="var(--font-heading)"
						fontSize='10'
						fontWeight='700'
						fill='#C17A50'
						x='316'
						y='267'
						textAnchor='middle'>
						FREE
					</text>
					<text
						fontFamily="var(--font-body)"
						fontSize='6'
						fill='#C17A50'
						x='316'
						y='278'
						textAnchor='middle'>
						SURVEY
					</text>
				</motion.g>
			)}
		</svg>
	);
}

function SceneInstall({ active }) {
	return (
		<svg
			viewBox='0 0 360 310'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}>
			<defs>
				<linearGradient id='iscreedG' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#C9A882' stopOpacity='0.55' />
					<stop
						offset='100%'
						stopColor='#A8845E'
						stopOpacity='0.35'
					/>
				</linearGradient>
				<linearGradient id='iinsG' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#DDD0BC' stopOpacity='0.65' />
					<stop
						offset='100%'
						stopColor='#C4B09A'
						stopOpacity='0.45'
					/>
				</linearGradient>
				<linearGradient id='itileG' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#F8F2EA' />
					<stop offset='100%' stopColor='#EDE2D4' />
				</linearGradient>
			</defs>
			{/* Concrete base */}
			<rect
				x='18'
				y='242'
				width='316'
				height='55'
				rx='5'
				fill='url(#iscreedG)'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#8A6448'
				x='28'
				y='274'
				opacity='0.9'>
				Concrete subfloor / screed base
			</text>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
				<line
					key={i}
					x1={20 + i * 32}
					y1='242'
					x2={20 + i * 32}
					y2='297'
					stroke='#A8845E'
					strokeWidth='0.4'
					opacity='0.3'
				/>
			))}
			{/* Insulation */}
			<rect
				x='18'
				y='195'
				width='316'
				height='45'
				rx='4'
				fill='url(#iinsG)'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#7A5A3C'
				x='28'
				y='220'
				opacity='0.9'>
				Thermal insulation board (PIR / EPS)
			</text>
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
				<line
					key={i}
					x1={18 + i * 29}
					y1='195'
					x2={18 + i * 29 - 14}
					y2='240'
					stroke='#B0987A'
					strokeWidth='0.5'
					opacity='0.3'
				/>
			))}
			{/* Adhesive layer */}
			<rect
				x='18'
				y='173'
				width='316'
				height='20'
				rx='2'
				fill='#E8D5BC'
				opacity='0.6'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7.5'
				fill='#7A5A3C'
				x='28'
				y='186'
				opacity='0.8'>
				Adhesive / levelling screed
			</text>
			{/* Cable mat zone */}
			<rect
				x='18'
				y='130'
				width='316'
				height='41'
				rx='3'
				fill='#FFF0E8'
				opacity='0.75'
			/>
			{active &&
				[0, 1, 2].map((row) => (
					<motion.path
						key={row}
						d={`M26 ${142 + row * 11} Q85 ${138 + row * 11} 140 ${142 + row * 11} Q195 ${146 + row * 11} 250 ${142 + row * 11} Q300 ${138 + row * 11} 328 ${142 + row * 11}`}
						stroke='#C17A50'
						strokeWidth='2.8'
						strokeLinecap='round'
						fill='none'
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 1 }}
						transition={{
							duration: 1.6,
							delay: row * 0.3,
							ease: 'easeOut',
						}}
					/>
				))}
			{active &&
				[0, 1, 2].map((row) => (
					<motion.path
						key={`g${row}`}
						d={`M26 ${142 + row * 11} Q85 ${138 + row * 11} 140 ${142 + row * 11} Q195 ${146 + row * 11} 250 ${142 + row * 11} Q300 ${138 + row * 11} 328 ${142 + row * 11}`}
						stroke='#E8A070'
						strokeWidth='6'
						strokeLinecap='round'
						fill='none'
						opacity='0.18'
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 1.6,
							delay: row * 0.3,
							ease: 'easeOut',
						}}
					/>
				))}
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#7A5A3C'
				x='28'
				y='126'
				opacity='0.9'>
				Electric heating cable mat (150W/m²)
			</text>
			{/* Tile */}
			<rect
				x='18'
				y='87'
				width='316'
				height='41'
				rx='3'
				fill='url(#itileG)'
			/>
			{[122, 226, 330].map((x) => (
				<line
					key={x}
					x1={x}
					y1='87'
					x2={x}
					y2='128'
					stroke='#D4C4B0'
					strokeWidth='0.6'
					opacity='0.7'
				/>
			))}
			<line
				x1='18'
				y1='107'
				x2='334'
				y2='107'
				stroke='#D4C4B0'
				strokeWidth='0.5'
				opacity='0.5'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#7A5A3C'
				x='28'
				y='104'
				opacity='0.9'>
				Porcelain tile / stone / LVT finish
			</text>
			{/* Heat arrows */}
			{active &&
				[58, 120, 196, 268, 318].map((x, i) => (
					<motion.g
						key={x}
						animate={{ y: [0, -22, 0], opacity: [0, 0.65, 0] }}
						transition={{
							duration: 2.2,
							delay: 1.2 + i * 0.25,
							repeat: Infinity,
							ease: 'easeInOut',
						}}>
						<line
							x1={x}
							y1='85'
							x2={x}
							y2='58'
							stroke='#C17A50'
							strokeWidth='1.5'
							strokeLinecap='round'
						/>
						<polygon
							points={`${x - 4},62 ${x + 4},62 ${x},52`}
							fill='#C17A50'
							opacity='0.75'
						/>
					</motion.g>
				))}
			{/* Thickness callout */}
			<line
				x1='340'
				y1='130'
				x2='340'
				y2='171'
				stroke='#C17A50'
				strokeWidth='0.9'
				strokeDasharray='3 2'
			/>
			<line
				x1='334'
				y1='130'
				x2='346'
				y2='130'
				stroke='#C17A50'
				strokeWidth='0.9'
			/>
			<line
				x1='334'
				y1='171'
				x2='346'
				y2='171'
				stroke='#C17A50'
				strokeWidth='0.9'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#C17A50'
				x='350'
				y='153'
				textAnchor='start'>
				3–4mm
			</text>
			{/* Total depth */}
			<line
				x1='10'
				y1='87'
				x2='10'
				y2='297'
				stroke='#A88060'
				strokeWidth='0.7'
				strokeDasharray='3 2'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#A88060'
				x='6'
				y='196'
				textAnchor='middle'
				transform='rotate(-90,6,196)'>
				Total build up: approximately 75mm
			</text>
			{/* Certified badge */}
			{active && (
				<motion.g
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.8, duration: 0.5 }}>
					<rect
						x='220'
						y='25'
						width='128'
						height='54'
						rx='9'
						fill='#FFF5EE'
						stroke='#D4B89A'
						strokeWidth='1'
					/>
					<text
						fontFamily="var(--font-body)"
						fontSize='7'
						fontWeight='700'
						fill='#C17A50'
						x='284'
						y='41'
						textAnchor='middle'>
						NICEIC CERTIFIED
					</text>
					<line
						x1='228'
						y1='45'
						x2='340'
						y2='45'
						stroke='#E8D4BC'
						strokeWidth='0.5'
					/>
					<text
						fontFamily="var(--font-body)"
						fontSize='6.5'
						fill='#6B4A2D'
						x='284'
						y='57'
						textAnchor='middle'>
						BS 7671 Amendment 4
					</text>
					<text
						fontFamily="var(--font-body)"
						fontSize='6.5'
						fill='#6B4A2D'
						x='284'
						y='68'
						textAnchor='middle'>
						Inspected & signed off on site
					</text>
				</motion.g>
			)}
		</svg>
	);
}

function SceneRadiant({ active }) {
	return (
		<svg
			viewBox='0 0 360 310'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}>
			<defs>
				<linearGradient id='rHeat' x1='0' y1='1' x2='0' y2='0'>
					<stop offset='0%' stopColor='#D45028' stopOpacity='0.28' />
					<stop offset='40%' stopColor='#E07840' stopOpacity='0.12' />
					<stop offset='80%' stopColor='#6090C0' stopOpacity='0.05' />
					<stop
						offset='100%'
						stopColor='#4070A0'
						stopOpacity='0.02'
					/>
				</linearGradient>
				<radialGradient id='rFloor' cx='50%' cy='100%' r='55%'>
					<stop offset='0%' stopColor='#C17A50' stopOpacity='0.3' />
					<stop offset='100%' stopColor='#C17A50' stopOpacity='0' />
				</radialGradient>
			</defs>
			<rect
				x='28'
				y='16'
				width='268'
				height='248'
				rx='10'
				fill='#FFF8F3'
				stroke='#E8D4BC'
				strokeWidth='1.2'
			/>
			<rect
				x='28'
				y='16'
				width='268'
				height='248'
				rx='10'
				fill='url(#rHeat)'
			/>
			<rect
				x='28'
				y='16'
				width='268'
				height='248'
				rx='10'
				fill='url(#rFloor)'
			/>
			<rect
				x='28'
				y='248'
				width='268'
				height='16'
				fill='#D4B89A'
				opacity='0.6'
			/>
			<rect
				x='28'
				y='245'
				width='268'
				height='5'
				fill='#C17A50'
				opacity='0.22'
			/>
			{/* Heat columns */}
			{active &&
				[62, 104, 156, 208, 254, 290].map((x, i) => (
					<motion.rect
						key={x}
						x={x - 5}
						y={68}
						width='10'
						height='178'
						fill='#C17A50'
						opacity={0}
						animate={{ opacity: [0, 0.07, 0.14, 0.07, 0] }}
						transition={{
							duration: 3.5,
							delay: i * 0.35,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					/>
				))}
			{/* Temp scale */}
			{[
				{ y: 250, t: '26°C', op: 1 },
				{ y: 200, t: '23°C', op: 0.8 },
				{ y: 148, t: '21°C', op: 0.6 },
				{ y: 92, t: '20°C', op: 0.4 },
				{ y: 38, t: '19°C', op: 0.25 },
			].map(({ y, t, op }) => (
				<g key={y}>
					<line
						x1='298'
						y1={y}
						x2='308'
						y2={y}
						stroke='#C17A50'
						strokeWidth='0.8'
						opacity={op}
					/>
					<text
						fontFamily="var(--font-body)"
						fontSize='8'
						fill='#C17A50'
						x='312'
						y={y + 3}
						opacity={op}>
						{t}
					</text>
				</g>
			))}
			<text
				fontFamily="var(--font-body)"
				fontSize='7'
				fill='#A88060'
				x='336'
				y='148'
				textAnchor='middle'
				transform='rotate(90,336,148)'>
				TEMP GRADIENT
			</text>
			{/* UFH arrows */}
			{active &&
				[62, 108, 162, 216, 264].map((x, i) => (
					<motion.g
						key={x}
						animate={{ y: [0, -22, 0], opacity: [0, 0.65, 0] }}
						transition={{
							duration: 2.8,
							delay: i * 0.45,
							repeat: Infinity,
							ease: 'easeInOut',
						}}>
						<line
							x1={x}
							y1='243'
							x2={x}
							y2='210'
							stroke='#C17A50'
							strokeWidth='1.4'
							strokeLinecap='round'
						/>
						<polygon
							points={`${x - 4},215 ${x + 4},215 ${x},205`}
							fill='#C17A50'
							opacity='0.8'
						/>
					</motion.g>
				))}
			{/* Old radiator ghost */}
			<rect
				x='34'
				y='58'
				width='14'
				height='106'
				rx='3'
				fill='#D0C4B8'
				opacity='0.32'
				stroke='#C0B0A0'
				strokeWidth='0.7'
				strokeDasharray='3 2'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='6.5'
				fill='#A08070'
				x='41'
				y='176'
				textAnchor='middle'
				opacity='0.6'>
				OLD
			</text>
			{active && (
				<motion.g
					animate={{ opacity: [0.25, 0.42, 0.25] }}
					transition={{ duration: 2, repeat: Infinity }}>
					<path
						d='M41 58 C41 38,82 36,78 22'
						stroke='#A08070'
						strokeWidth='0.8'
						strokeDasharray='3 2'
						fill='none'
						opacity='0.4'
					/>
				</motion.g>
			)}
			{/* Person */}
			<g opacity='0.13'>
				<circle cx='162' cy='116' r='16' fill='#3C2A25' />
				<rect
					x='148'
					y='132'
					width='28'
					height='60'
					rx='9'
					fill='#3C2A25'
				/>
				<rect
					x='142'
					y='144'
					width='14'
					height='40'
					rx='6'
					fill='#3C2A25'
				/>
				<rect
					x='168'
					y='144'
					width='14'
					height='40'
					rx='6'
					fill='#3C2A25'
				/>
			</g>
			{/* Benefit pills */}
			{active &&
				['✓ Silent', '✓ Dust-free', '✓ Even warmth'].map(
					(label, i) => (
						<motion.g
							key={label}
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.4 + i * 0.2, duration: 0.5 }}>
							<rect
								x='34'
								y={206 + i * 18}
								width={label.length * 5.8 + 18}
								height='14'
								rx='7'
								fill='#C17A50'
								opacity='0.12'
								stroke='#C17A50'
								strokeWidth='0.6'
								strokeOpacity='0.4'
							/>
							<text
								fontFamily="var(--font-body)"
								fontSize='7'
								fill='#B86B45'
								x='42'
								y={216 + i * 18}>
								{label}
							</text>
						</motion.g>
					),
				)}
		</svg>
	);
}

function SceneThermostat({ active }) {
	const [tempF, setTempF] = useState(0);
	useEffect(() => {
		if (!active) return;
		const t = setInterval(() => setTempF((v) => (v + 1) % 80), 80);
		return () => clearInterval(t);
	}, [active]);
	const displayTemp = 21 + Math.round(Math.sin(tempF / 12) * 0.5);

	return (
		<svg
			viewBox='0 0 360 310'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}>
			<defs>
				<linearGradient id='tsBg' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#FFFBF7' />
					<stop offset='100%' stopColor='#F5ECE2' />
				</linearGradient>
			</defs>
			<rect
				x='88'
				y='22'
				width='174'
				height='228'
				rx='24'
				fill='url(#tsBg)'
				stroke='#E0CCBA'
				strokeWidth='1.5'
			/>
			<rect
				x='102'
				y='40'
				width='146'
				height='126'
				rx='12'
				fill='#FAF0E6'
			/>
			{/* Dial track */}
			<circle
				cx='175'
				cy='105'
				r='50'
				stroke='#EDD5BC'
				strokeWidth='7'
				strokeLinecap='round'
				strokeDasharray='220 400'
				strokeDashoffset='-80'
				fill='none'
				transform='rotate(-220 175 105)'
			/>
			{active && (
				<motion.circle
					cx='175'
					cy='105'
					r='50'
					stroke='#C17A50'
					strokeWidth='7'
					strokeLinecap='round'
					strokeDasharray='130 400'
					strokeDashoffset='-80'
					fill='none'
					transform='rotate(-220 175 105)'
					initial={{ strokeDasharray: '0 400' }}
					animate={{ strokeDasharray: '130 400' }}
					transition={{ duration: 1.4, ease: 'easeOut' }}
				/>
			)}
			<circle cx='150' cy='60' r='5' fill='#C17A50' opacity='0.9' />
			<text
				fontFamily="var(--font-heading)"
				fontSize='34'
				fontWeight='300'
				fill='#3C2A25'
				x='175'
				y='113'
				textAnchor='middle'>
				{displayTemp}°C
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#A88060'
				x='175'
				y='128'
				textAnchor='middle'
				letterSpacing='0.15em'>
				FLOOR TEMP
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#A88060'
				x='114'
				y='152'
				textAnchor='middle'>
				5°
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#A88060'
				x='236'
				y='152'
				textAnchor='middle'>
				35°
			</text>
			<rect
				x='110'
				y='162'
				width='130'
				height='22'
				rx='8'
				fill='#F0E4D4'
				opacity='0.9'
			/>
			<motion.circle
				cx='124'
				cy='173'
				r='4'
				fill='#C17A50'
				animate={{ opacity: [1, 0.3, 1] }}
				transition={{ duration: 1.8, repeat: Infinity }}
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#6A4A34'
				x='136'
				y='177'>
				HEATING ACTIVE
			</text>
			<rect
				x='106'
				y='193'
				width='58'
				height='18'
				rx='7'
				fill='#E8D5C0'
				opacity='0.8'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7.5'
				fill='#6A4A34'
				x='135'
				y='206'
				textAnchor='middle'>
				SCHEDULE
			</text>
			<rect
				x='172'
				y='193'
				width='58'
				height='18'
				rx='7'
				fill='#C17A50'
				opacity='0.2'
				stroke='#C17A50'
				strokeWidth='0.7'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='7.5'
				fill='#8A4A2A'
				x='201'
				y='206'
				textAnchor='middle'>
				BOOST
			</text>
			<line
				x1='175'
				y1='250'
				x2='175'
				y2='282'
				stroke='#D4B89A'
				strokeWidth='1.2'
				strokeDasharray='4 3'
			/>
			<rect
				x='153'
				y='282'
				width='44'
				height='14'
				rx='5'
				fill='#EDD9C4'
				opacity='0.8'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='6.5'
				fill='#8A6448'
				x='175'
				y='293'
				textAnchor='middle'>
				FLOOR SENSOR
			</text>
			{/* Labels right */}
			<line
				x1='266'
				y1='78'
				x2='282'
				y2='80'
				stroke='#D4B89A'
				strokeWidth='0.8'
				strokeDasharray='2 2'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#7A5A3C'
				x='286'
				y='75'>
				Dual sensor
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7.5'
				fill='#A88060'
				x='286'
				y='86'>
				air + floor
			</text>
			<line
				x1='266'
				y1='108'
				x2='282'
				y2='110'
				stroke='#D4B89A'
				strokeWidth='0.8'
				strokeDasharray='2 2'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='8'
				fill='#7A5A3C'
				x='286'
				y='105'>
				±0.5°C
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7.5'
				fill='#A88060'
				x='286'
				y='116'>
				accuracy
			</text>
			{/* 7-day schedule */}
			<rect
				x='18'
				y='58'
				width='64'
				height='142'
				rx='8'
				fill='#FFF5EE'
				stroke='#E8D4BC'
				strokeWidth='0.8'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='6.5'
				fontWeight='600'
				fill='#C17A50'
				x='50'
				y='73'
				textAnchor='middle'
				letterSpacing='0.1em'>
				7-DAY
			</text>
			{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
				<g key={i}>
					<rect
						x='24'
						y={82 + i * 17}
						width='10'
						height={[12, 10, 14, 8, 12, 6, 10][i]}
						rx='2'
						fill='#C17A50'
						opacity={i === 2 ? '0.85' : '0.38'}
					/>
					<text
						fontFamily="var(--font-body)"
						fontSize='6.5'
						fill='#8A6448'
						x='40'
						y={89 + i * 17}>
						{d}
					</text>
				</g>
			))}
			<text
				fontFamily="var(--font-body)"
				fontSize='6.5'
				fill='#8A6448'
				x='50'
				y='203'
				textAnchor='middle'>
				SCHEDULE
			</text>
		</svg>
	);
}

function SceneWarranty({ active }) {
	return (
		<svg
			viewBox='0 0 360 310'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}>
			<defs>
				<linearGradient id='wCert' x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0%' stopColor='#FFFBF6' />
					<stop offset='100%' stopColor='#F5ECE0' />
				</linearGradient>
				<linearGradient id='wGold' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#E8A050' />
					<stop offset='100%' stopColor='#C17A30' />
				</linearGradient>
			</defs>
			<rect
				x='28'
				y='22'
				width='244'
				height='270'
				rx='10'
				fill='url(#wCert)'
				stroke='#D4B89A'
				strokeWidth='1.5'
			/>
			<rect
				x='28'
				y='22'
				width='244'
				height='54'
				rx='10'
				fill='url(#wGold)'
				opacity='0.88'
			/>
			<rect
				x='28'
				y='56'
				width='244'
				height='20'
				fill='url(#wGold)'
				opacity='0.88'
			/>
			<text
				fontFamily="var(--font-heading)"
				fontSize='10'
				fontWeight='700'
				fill='white'
				x='150'
				y='42'
				textAnchor='middle'
				letterSpacing='0.12em'>
				CERTIFICATE OF WARRANTY
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='7.5'
				fill='rgba(255,255,255,0.85)'
				x='150'
				y='62'
				textAnchor='middle'
				letterSpacing='0.1em'>
				THE HEATING STORE · EST. 2011
			</text>
			<rect
				x='38'
				y='84'
				width='224'
				height='198'
				rx='6'
				fill='none'
				stroke='#D4B89A'
				strokeWidth='0.7'
				strokeDasharray='4 3'
			/>
			{/* Shield */}
			<g transform='translate(150,122)'>
				<path
					d='M0,-30 L24,-15 L24,8 Q24,26 0,34 Q-24,26 -24,8 L-24,-15 Z'
					fill='#C17A50'
					opacity='0.14'
					stroke='#C17A50'
					strokeWidth='1.2'
				/>
				{active && (
					<motion.text
						fontFamily="var(--font-heading)"
						fontSize='22'
						fill='#C17A50'
						x='0'
						y='8'
						textAnchor='middle'
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.8, type: 'spring' }}>
						✓
					</motion.text>
				)}
			</g>
			<text
				fontFamily="var(--font-heading)"
				fontSize='40'
				fontWeight='600'
				fill='#B86B45'
				x='150'
				y='178'
				textAnchor='middle'
				letterSpacing='-0.02em'>
				25 Years
			</text>
			<text
				fontFamily="var(--font-body)"
				fontSize='9'
				fill='#6B4A2D'
				x='150'
				y='193'
				textAnchor='middle'
				letterSpacing='0.18em'>
				PRODUCT WARRANTY
			</text>
			<line
				x1='48'
				y1='200'
				x2='252'
				y2='200'
				stroke='#D4B89A'
				strokeWidth='0.6'
			/>
			{[
				{
					y: 216,
					icon: '🔥',
					text: 'Heating cable & mat, full replacement',
				},
				{
					y: 231,
					icon: '🌡️',
					text: 'Thermostat & controls, all parts',
				},
				{
					y: 246,
					icon: '🔄',
					text: '24 hour swap, next working day',
				},
				{
					y: 261,
					icon: '📞',
					text: 'Zero callout fees, lifetime support',
				},
			].map(({ y, icon, text }) => (
				<g key={y}>
					<text x='52' y={y} fontSize='9'>
						{icon}
					</text>
					<text
						fontFamily="var(--font-body)"
						fontSize='7.5'
						fill='#4A3020'
						x='68'
						y={y}>
						{text}
					</text>
				</g>
			))}
			<line
				x1='48'
				y1='276'
				x2='140'
				y2='276'
				stroke='#D4B89A'
				strokeWidth='0.7'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='6.5'
				fill='#A88060'
				x='94'
				y='285'
				textAnchor='middle'>
				Authorised Signature
			</text>
			<line
				x1='160'
				y1='276'
				x2='252'
				y2='276'
				stroke='#D4B89A'
				strokeWidth='0.7'
			/>
			<text
				fontFamily="var(--font-body)"
				fontSize='6.5'
				fill='#A88060'
				x='206'
				y='285'
				textAnchor='middle'>
				Registration Date
			</text>
			{/* Seal */}
			{active && (
				<motion.g
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 200, delay: 1.2 }}>
					<circle
						cx='298'
						cy='100'
						r='34'
						fill='#FFF5EE'
						stroke='#C17A50'
						strokeWidth='1.5'
					/>
					<circle
						cx='298'
						cy='100'
						r='27'
						fill='none'
						stroke='#E8A050'
						strokeWidth='0.7'
						strokeDasharray='3 2'
					/>
					<text
						fontFamily="var(--font-heading)"
						fontSize='9'
						fontWeight='700'
						fill='#C17A50'
						x='298'
						y='94'
						textAnchor='middle'>
						OFFICIAL
					</text>
					<text
						fontFamily="var(--font-body)"
						fontSize='7'
						fill='#B86B45'
						x='298'
						y='105'
						textAnchor='middle'>
						GUARANTEE
					</text>
					<text
						fontFamily="var(--font-body)"
						fontSize='6.5'
						fill='#A88060'
						x='298'
						y='116'
						textAnchor='middle'>
						REGISTERED
					</text>
				</motion.g>
			)}
			{/* Stats mini panel */}
			<rect
				x='282'
				y='148'
				width='70'
				height='130'
				rx='8'
				fill='#FFF5EE'
				stroke='#E8D4BC'
				strokeWidth='0.8'
			/>
			{[
				{ val: '300K+', lab: 'Customers' },
				{ val: '2M+', lab: 'Systems' },
				{ val: '0%', lab: 'Disputes' },
				{ val: '2011', lab: 'Est.' },
			].map(({ val, lab }, i) => (
				<g key={lab}>
					<text
						fontFamily="var(--font-heading)"
						fontSize='13'
						fontWeight='600'
						fill='#B86B45'
						x='317'
						y={170 + i * 30}
						textAnchor='middle'>
						{val}
					</text>
					<text
						fontFamily="var(--font-body)"
						fontSize='6.5'
						fill='#8A6448'
						x='317'
						y={181 + i * 30}
						textAnchor='middle'>
						{lab}
					</text>
				</g>
			))}
		</svg>
	);
}

const scenes = {
	survey: SceneSurvey,
	install: SceneInstall,
	radiant: SceneRadiant,
	thermostat: SceneThermostat,
	warranty: SceneWarranty,
};

// Extremely subtle per-step atmosphere behind the scene card. Radiant is
// deliberately left transparent, it already carries its own internal
// warm-to-cool gradient (rHeat/rFloor) and a second tint would double up.
const sceneTint = {
	survey:
		'radial-gradient(120% 100% at 30% 15%, rgba(193,122,80,0.10), transparent 65%)',
	install:
		'radial-gradient(120% 100% at 70% 25%, rgba(232,147,58,0.12), transparent 65%)',
	radiant: 'transparent',
	thermostat:
		'radial-gradient(120% 100% at 50% 15%, rgba(127,192,232,0.08), transparent 65%)',
	warranty:
		'radial-gradient(120% 100% at 65% 70%, rgba(232,160,80,0.10), transparent 65%)',
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ active, duration, onComplete }) {
	return (
		<div
			style={{
				height: 2,
				background: 'rgba(255,255,255,0.14)',
				borderRadius: 999,
				overflow: 'visible',
				width: '100%',
			}}>
			{active && (
				<motion.div
					style={{
						height: '100%',
						borderRadius: 999,
						background: `linear-gradient(90deg,${C.amber},${C.coral})`,
					}}
					initial={{
						width: '0%',
						boxShadow: '0 0 0px rgba(255,126,95,0)',
					}}
					animate={{
						width: '100%',
						boxShadow: [
							'0 0 0px rgba(255,126,95,0)',
							'0 0 0px rgba(255,126,95,0)',
							'0 0 12px rgba(255,126,95,0.9)',
						],
					}}
					transition={{
						width: { duration: duration / 1000, ease: 'linear' },
						boxShadow: {
							duration: duration / 1000,
							times: [0, 0.85, 1],
							ease: 'easeOut',
						},
					}}
					onAnimationComplete={onComplete}
				/>
			)}
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const INTERVAL = 5500;
const EASE = [0.16, 1, 0.3, 1];

// Right-panel reveal choreography: increasing delay + settle distance per
// element via nested staggerChildren, blur-to-focus where it reads text.
const panelVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } },
	exit: {
		opacity: 0,
		x: -16,
		filter: 'blur(2px)',
		transition: { duration: 0.4, ease: EASE },
	},
};
const panelBadgeRowVariant = {
	hidden: { opacity: 0, y: 10, filter: 'blur(3px)' },
	visible: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.5, ease: EASE },
	},
};
const panelTitleVariant = {
	hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
	visible: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.6, ease: EASE },
	},
};
const panelDividerVariant = {
	hidden: { scaleX: 0 },
	visible: { scaleX: 1, transition: { duration: 0.6, ease: EASE } },
};
const panelDescVariant = {
	hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
	visible: {
		opacity: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: { duration: 0.65, ease: EASE },
	},
};
const panelFeaturesVariant = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.09 } },
};
const panelFeatureRowVariant = {
	hidden: { opacity: 0, x: 16 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};
const panelFeatureIconVariant = {
	hidden: { rotate: -8, scale: 0.9 },
	visible: { rotate: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
const panelCtaVariant = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Bottom step-overview cards: staggered scroll reveal, alternating travel
// distance by column so the row doesn't land flat all at once.
const botsContainerVariant = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
};
const botsCardVariant = (i) => ({
	hidden: { opacity: 0, y: i % 2 === 0 ? 32 : 48, scale: 0.96 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.7, ease: EASE },
	},
});

export default function HowItWorksClient() {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const [progressKey, setProgressKey] = useState(0);
	const reduce = useReducedMotion();
	const sectionRef = useRef(null);
	const inView = useInView(sectionRef, {
		once: false,
		margin: '-80px',
	});
	const botsRef = useRef(null);
	const botsInView = useInView(botsRef, { once: true, amount: 0.1 });
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ['start end', 'end start'],
	});
	const orbY1 = useTransform(scrollYProgress, [0, 1], [-70, 70]);
	const orbY2 = useTransform(scrollYProgress, [0, 1], [-40, 100]);
	const orbY3 = useTransform(scrollYProgress, [0, 1], [-90, 50]);

	const tabRefs = useRef([]);
	const cardRefs = useRef([]);

	const goTo = useCallback((i) => {
		setIndex(i);
		setProgressKey((k) => k + 1);
	}, []);
	const next = useCallback(
		() => goTo((index + 1) % steps.length),
		[index, goTo],
	);
	const prev = useCallback(
		() => goTo((index - 1 + steps.length) % steps.length),
		[index, goTo],
	);

	// Arrow-key stepping for the step tabs and bottom overview cards, Home/End
	// jump to the first/last step. Mirrors the standard WAI-ARIA tab pattern.
	const handleStepKeyDown = useCallback(
		(e, i, refs) => {
			let dest = null;
			if (e.key === 'ArrowRight') dest = (i + 1) % steps.length;
			else if (e.key === 'ArrowLeft')
				dest = (i - 1 + steps.length) % steps.length;
			else if (e.key === 'Home') dest = 0;
			else if (e.key === 'End') dest = steps.length - 1;
			if (dest === null) return;
			e.preventDefault();
			goTo(dest);
			refs.current[dest]?.focus();
		},
		[goTo],
	);

	// Swipe-to-navigate on the scene card, same drag threshold technique used
	// by the WhyChooseUs process carousel elsewhere in this codebase.
	const handleSceneDragEnd = useCallback(
		(_e, info) => {
			const { offset, velocity } = info;
			if (offset.x < -60 || velocity.x < -500) next();
			else if (offset.x > 60 || velocity.x > 500) prev();
			setPaused(false);
		},
		[next, prev],
	);

	const current = steps[index];
	const SceneComponent = scenes[current.bgScene];

	return (
		<>
			<style>{`
        @keyframes hiw-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes hiw-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes hiw-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes hiw-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
        @keyframes hiw-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }

        .hiw-noise::before {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.045;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .hiw-grid-bg::after {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:
            repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 80px,rgba(255,255,255,.02) 80px),
            repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 80px,rgba(255,255,255,.02) 80px);
        }
        .hiw-vignette {
          position:absolute; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%);
        }
        .hiw-aura { position:absolute; inset:-10%; z-index:0; pointer-events:none; filter: blur(14px); }
        .hiw-orb { position:absolute; border-radius:50%; }
        .hiw-orb-1 { top:-14%; left:2%; width:34vw; height:34vw; max-width:480px; max-height:480px; background: radial-gradient(circle, rgba(232,147,58,0.28), transparent 62%); animation: hiw-drift 26s ease-in-out infinite; }
        .hiw-orb-2 { top:6%; right:-4%; width:30vw; height:30vw; max-width:420px; max-height:420px; background: radial-gradient(circle, rgba(255,126,95,0.18), transparent 62%); animation: hiw-drift2 31s ease-in-out infinite; }
        .hiw-orb-3 { bottom:-10%; left:38%; width:26vw; height:26vw; max-width:360px; max-height:360px; background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: hiw-drift 33s ease-in-out infinite reverse; }

        .hiw-h-accent {
          font-weight:300;
          background:linear-gradient(100deg,#E8933A,#F5B97A 30%,#FF7E5F 55%,#F5B97A 80%,#E8933A);
          background-size:200% auto; -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; color:transparent;
          animation: hiw-shimmer 6s linear infinite;
        }

        .hiw-glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(20,13,8,0.5);
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .hiw-glass-hover { position:relative; }
        .hiw-glass-hover::after {
          content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
          opacity:0; transition:opacity .5s ease;
          background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
          -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude;
        }
        .hiw-glass-hover:hover::after { opacity:1; }

        .hiw-tab  { transition: all .25s ease; cursor:pointer; }
        .hiw-tab:hover  { background: rgba(232,147,58,0.16) !important; transform: translateY(-1px); }

        .hiw-nav-btn { transition: background .2s ease, border-color .2s ease; cursor:pointer; }
        .hiw-nav-btn:hover { background: rgba(232,147,58,0.22) !important; border-color: rgba(232,147,58,0.5) !important; }

        .hiw-feat-row { transition: background .2s ease, border-color .2s ease; }
        .hiw-feat-row:hover { background: rgba(232,147,58,0.08) !important; border-color: rgba(232,147,58,0.35) !important; }

        .hiw-cta-p { transition: transform .28s ease, box-shadow .28s ease; cursor:pointer; }
        .hiw-cta-p:hover { transform: scale(1.05); box-shadow: 0 28px 80px rgba(255,126,95,0.5) !important; }
        .hiw-cta-s { transition: background .2s ease; cursor:pointer; }
        .hiw-cta-s:hover { background: rgba(232,147,58,0.14) !important; }

        .hiw-bc { transition: transform .3s ease, box-shadow .3s ease, border-color .25s ease; cursor:pointer; }
        .hiw-bc:hover { transform: translateY(-5px); }

        /* Layout */
        .hiw-main  { display:grid; grid-template-columns:1fr 1.1fr; gap:52px; align-items:start; }
        .hiw-bots  { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
        .hiw-tabs  { display:flex; flex-wrap:wrap; gap:8px; }
        .hiw-sh    { height:360px; }

        @media(max-width:1100px){
          .hiw-main { grid-template-columns:1fr; gap:32px; }
          .hiw-bots { grid-template-columns:repeat(3,1fr); }
          .hiw-sh   { height:380px; }
        }
        @media(max-width:768px){
          .hiw-bots  { grid-template-columns:repeat(2,1fr); }
          .hiw-sh    { height:310px; }
          .hiw-outer { padding:56px 20px 64px !important; }
        }
        @media(max-width:480px){
          .hiw-bots { grid-template-columns:1fr 1fr; }
          .hiw-sh { height:240px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hiw-orb-1, .hiw-orb-2, .hiw-orb-3, .hiw-float, .hiw-h-accent, .hiw-badge-dot { animation:none !important; }
        }

        .hiw-sr-only {
          position:absolute; width:1px; height:1px; padding:0; margin:-1px;
          overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
        }
      `}</style>

			<section
				ref={sectionRef}
				className='hiw-noise hiw-grid-bg'
				style={{
					position: 'relative',
					overflow: 'hidden',
					background:
						'radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%)',
					fontFamily: "var(--font-body)",
					color: C.text,
				}}>
				{/* Announces the auto-advancing step for screen reader users,
				   since the carousel otherwise changes with no visual cue for them */}
				<div aria-live='polite' className='hiw-sr-only'>
					{`Step ${index + 1} of ${steps.length}: ${current.tag} — ${current.title} ${current.titleAccent}`}
				</div>

				{/* Three-orb drift system, same language as WhyChooseUs */}
				<div aria-hidden className='hiw-aura'>
					<motion.div style={{ y: reduce ? 0 : orbY1 }}>
						<span className='hiw-orb hiw-orb-1' />
					</motion.div>
					<motion.div style={{ y: reduce ? 0 : orbY2 }}>
						<span className='hiw-orb hiw-orb-2' />
					</motion.div>
					<motion.div style={{ y: reduce ? 0 : orbY3 }}>
						<span className='hiw-orb hiw-orb-3' />
					</motion.div>
				</div>
				<div aria-hidden className='hiw-vignette' />

				{/* ──────────────────── INNER ──────────────────── */}
				<div
					className='hiw-outer'
					style={{
						position: 'relative',
						zIndex: 2,
						maxWidth: 1320,
						margin: '0 auto',
						padding: '56px 20px 64px',
					}}>
					{/* ── HEADER, layered scroll entrance matching WhyChooseUs depth language ── */}
					<div style={{ marginBottom: 52 }}>
						{/* Glass badge pill, exact whc-badge recipe */}
						<motion.div
							initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.8, ease: EASE }}
							style={{
								position: 'relative',
								display: 'inline-flex',
								marginBottom: 24,
							}}>
							<p
								style={{
									position: 'relative',
									display: 'inline-flex',
									alignItems: 'center',
									gap: 9,
									whiteSpace: 'nowrap',
									padding: '8px 22px',
									fontFamily: "var(--font-body)",
									fontSize: 10,
									fontWeight: 600,
									textTransform: 'uppercase',
									letterSpacing: '0.4em',
									color: C.amberLt,
									borderRadius: 999,
									background: 'rgba(232,147,58,0.08)',
									backdropFilter: 'blur(12px)',
									WebkitBackdropFilter: 'blur(12px)',
									border: '1px solid rgba(232,147,58,0.22)',
									boxShadow:
										'inset 0 1px 0 rgba(255,255,255,0.06),0 8px 30px rgba(0,0,0,0.4)',
									margin: 0,
									marginTop:25
								}}>
								<span
									className='hiw-badge-dot'
									style={{
										width: 6,
										height: 6,
										borderRadius: '50%',
										background: C.coral,
										boxShadow: '0 0 8px rgba(255,126,95,0.9)',
										flexShrink: 0,
										animation: 'hiw-blink 2s ease-in-out infinite',
									}}
								/>
								How It Works
							</p>
						</motion.div>

						{/* H2, Playfair semibold, ivory on dark, shimmering accent line */}
						<motion.h2
							initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
							style={{
								fontFamily: "var(--font-heading)",
								fontSize: 'clamp(30px,4.4vw,58px)',
								fontWeight: 600,
								lineHeight: 1.06,
								letterSpacing: '-0.01em',
								color: C.text,
								margin: 0,
							}}>
							From Site Survey to Perfect Warmth
							<span
								className='hiw-h-accent'
								style={{ display: 'block' }}>
								A System Engineered for Efficiency
							</span>
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
							whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
							style={{
								marginTop: 20,
								fontFamily: "var(--font-body)",
								fontSize: 'clamp(14px,2vw,17px)',
								lineHeight: 1.8,
								color: C.soft,
								fontWeight: 400,
								maxWidth: 580,
							}}>
							Every Heating Store installation follows the same
							five step process: a bespoke CAD floor survey,
							NICEIC certified cable laying to BS 7671, smart
							thermostat commissioning, and a 25 year warranty
							at the end of it. No shortcuts. No guesswork.
						</motion.p>
					</div>

					{/* ── STEP TABS ── */}
					<motion.div
						className='hiw-tabs'
						role='tablist'
						aria-label='How it works steps'
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, ease: EASE }}
						style={{ marginBottom: 40 }}>
						{steps.map((s, i) => (
							<button
								key={s.step}
								ref={(el) => (tabRefs.current[i] = el)}
								className='hiw-tab'
								role='tab'
								aria-selected={index === i}
								tabIndex={index === i ? 0 : -1}
								onClick={() => goTo(i)}
								onKeyDown={(e) => handleStepKeyDown(e, i, tabRefs)}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 8,
									padding: '8px 18px',
									borderRadius: 999,
									fontFamily: "var(--font-body)",
									fontSize: 12,
									fontWeight: 500,
									letterSpacing: '0.04em',
									background:
										index === i
											? `linear-gradient(135deg,${C.amber},${C.coral})`
											: 'rgba(232,147,58,0.08)',
									border:
										index === i
											? '1px solid transparent'
											: '1px solid rgba(232,147,58,0.22)',
									color: index === i ? 'white' : C.amberLt,
									boxShadow:
										index === i
											? '0 8px 24px rgba(232,147,58,0.35)'
											: 'none',
								}}>
								<span style={{ opacity: 0.6, fontWeight: 300 }}>
									{s.step}
								</span>
								<span>{s.tag}</span>
							</button>
						))}
					</motion.div>

					{/* ── MAIN GRID ── */}
					<div className='hiw-main'>
						{/* LEFT: scene card */}
						<div style={{ position: 'relative' }}>
							<div style={{ perspective: 1200 }}>
								<motion.div
									className='hiw-sh hiw-glass hiw-glass-hover'
									initial={{
										opacity: 0,
										y: 60,
										rotateX: 8,
										scale: 0.94,
									}}
									whileInView={{
										opacity: 1,
										y: 0,
										rotateX: 0,
										scale: 1,
									}}
									viewport={{ once: true, amount: 0.2 }}
									transition={{ duration: 1, ease: EASE }}
									style={{
										position: 'relative',
										borderRadius: 28,
										overflow: 'hidden',
										transformStyle: 'preserve-3d',
										touchAction: 'pan-y',
									}}
									drag='x'
									dragElastic={0.08}
									dragConstraints={{ left: 0, right: 0 }}
									onDragStart={() => setPaused(true)}
									onDragEnd={handleSceneDragEnd}
									onMouseEnter={() => setPaused(true)}
									onMouseLeave={() => setPaused(false)}>
									{/* Ambient per-step tint, sits behind everything else in the card */}
									<AnimatePresence>
										<motion.div
											key={current.bgScene}
											aria-hidden
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
											style={{
												position: 'absolute',
												inset: 0,
												zIndex: 0,
												pointerEvents: 'none',
												background: sceneTint[current.bgScene],
											}}
										/>
									</AnimatePresence>
									{/* Watermark */}
									<div
										style={{
											position: 'absolute',
											top: 18,
											left: 26,
											fontFamily: "var(--font-heading)",
											fontSize: 'clamp(60px, 10vw, 118px)',
											lineHeight: 1,
											color: 'rgba(245,185,122,0.08)',
											letterSpacing: '-0.04em',
											fontWeight: 600,
											pointerEvents: 'none',
											userSelect: 'none',
										}}>
										{current.step}
									</div>

									{/* Live badge */}
									<motion.div
										key={current.badge}
										initial={{ opacity: 0, y: -8 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
										style={{
											position: 'absolute',
											top: 18,
											right: 18,
											zIndex: 3,
										}}>
										<div
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: 6,
												padding: '6px 14px',
												borderRadius: 999,
												background: 'rgba(10,6,3,0.55)',
												backdropFilter: 'blur(14px)',
												border: '1px solid rgba(245,185,122,0.35)',
												boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
											}}>
											<span
												style={{
													width: 5,
													height: 5,
													borderRadius: '50%',
													background: C.coral,
													animation: 'hiw-blink 2s infinite',
												}}
											/>
											<span
												style={{
													fontFamily: "var(--font-body)",
													fontSize: 9,
													fontWeight: 600,
													letterSpacing: '0.2em',
													textTransform: 'uppercase',
													color: C.amberLt,
												}}>
												{current.badge}
											</span>
										</div>
									</motion.div>

									{/* Scene */}
									<div
										style={{
											position: 'absolute',
											inset: 0,
											padding: '14px 10px 82px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										<AnimatePresence mode='wait'>
											<motion.div
												key={current.bgScene}
												style={{ width: '100%', height: '100%' }}
												initial={{
													opacity: 0,
													scale: 1.04,
													filter: 'blur(4px)',
												}}
												animate={{
													opacity: 1,
													scale: 1,
													filter: 'blur(0px)',
												}}
												exit={{
													opacity: 0,
													scale: 0.97,
													filter: 'blur(4px)',
												}}
												transition={{
													duration: 0.6,
													ease: EASE,
												}}>
												<SceneComponent active={inView} />
											</motion.div>
										</AnimatePresence>
									</div>

									{/* Bottom bar */}
									<div
										style={{
											position: 'absolute',
											bottom: 0,
											left: 0,
											right: 0,
											padding: '0 22px 18px',
										}}>
										<div
											style={{
												display: 'grid',
												gridTemplateColumns: `repeat(${steps.length},1fr)`,
												gap: 6,
												marginBottom: 14,
											}}>
											{steps.map((_, i) => (
												<ProgressBar
													key={`${i}-${progressKey}`}
													active={i === index && !paused && inView}
													duration={INTERVAL}
													onComplete={i === index ? next : undefined}
												/>
											))}
										</div>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}>
											<div style={{ display: 'flex', gap: 8 }}>
												{[
													{ fn: prev, icon: '←' },
													{ fn: next, icon: '→' },
												].map(({ fn, icon }) => (
													<button
														key={icon}
														className='hiw-nav-btn'
														onClick={fn}
														style={{
															width: 32,
															height: 32,
															borderRadius: '50%',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															fontSize: 14,
															background: 'rgba(255,255,255,0.07)',
															border: '1px solid rgba(255,255,255,0.16)',
															color: C.amberLt,
														}}>
														{icon}
													</button>
												))}
											</div>
											<span
												style={{
													fontFamily: "var(--font-body)",
													fontSize: 11,
													color: C.soft,
													letterSpacing: '0.1em',
												}}>
												{String(index + 1).padStart(2, '0')} /{' '}
												{String(steps.length).padStart(2, '0')}
											</span>
										</div>
									</div>
								</motion.div>
							</div>

							{/* Floating stat, hiw-glass recipe same as WhyChooseUs cards */}
							<AnimatePresence mode='wait'>
								<motion.div
									key={current.stat.value}
									className='hiw-glass'
									initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
									animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
									exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
									transition={{ duration: 0.55, ease: EASE }}
									style={{
										marginTop: 14,
										display: 'flex',
										alignItems: 'center',
										gap: 18,
										padding: '18px 22px',
										borderRadius: 20,
									}}>
									<p
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: 34,
											fontWeight: 600,
											color: C.amberLt,
											lineHeight: 1,
											letterSpacing: '-0.02em',
											flexShrink: 0,
										}}>
										{current.stat.value}
									</p>
									<div
										style={{
											width: 1,
											height: 44,
											background: 'rgba(245,185,122,0.25)',
											flexShrink: 0,
										}}
									/>
									<div>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 10,
												fontWeight: 600,
												letterSpacing: '0.2em',
												textTransform: 'uppercase',
												color: C.amberLt,
												marginBottom: 4,
											}}>
											Key Metric
										</p>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 13,
												color: C.text,
												lineHeight: 1.4,
											}}>
											{current.stat.label}
										</p>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 11,
												color: C.soft,
												marginTop: 3,
											}}>
											✓ {current.proof}
										</p>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>

						{/* RIGHT: text panel */}
						<div>
							<AnimatePresence mode='wait'>
								<motion.div
									key={current.step}
									variants={panelVariants}
									initial='hidden'
									animate='visible'
									exit='exit'>
									{/* Step row */}
									<motion.div
										variants={panelBadgeRowVariant}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: 12,
											marginBottom: 20,
										}}>
										<div
											style={{
												width: 38,
												height: 38,
												borderRadius: '50%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontFamily: "var(--font-heading)",
												fontSize: 15,
												fontWeight: 600,
												color: C.amberLt,
												background: 'rgba(232,147,58,0.14)',
												border: '1.5px solid rgba(232,147,58,0.3)',
												flexShrink: 0,
											}}>
											{current.step}
										</div>
										<p
											style={{
												fontFamily: "var(--font-body)",
												fontSize: 10,
												fontWeight: 600,
												letterSpacing: '0.35em',
												textTransform: 'uppercase',
												color: C.amberLt,
											}}>
											{current.tag}
										</p>
									</motion.div>

									{/* Title, Playfair semibold + light italic accent, same as WhyChooseUs h3 */}
									<motion.h3
										variants={panelTitleVariant}
										style={{
											fontFamily: "var(--font-heading)",
											fontSize: 'clamp(26px,3.5vw,42px)',
											fontWeight: 600,
											lineHeight: 1.12,
											color: C.text,
											margin: 0,
											marginBottom: 8,
										}}>
										{current.title}
										<span
											style={{
												display: 'block',
												fontWeight: 300,
												color: C.amberLt,
												fontStyle: 'italic',
											}}>
											{current.titleAccent}
										</span>
									</motion.h3>

									{/* Amber divider, grow-from-left */}
									<motion.div
										variants={panelDividerVariant}
										style={{
											height: 2,
											borderRadius: 999,
											background: `linear-gradient(90deg,${C.amber},transparent)`,
											marginBottom: 24,
											width: 56,
											originX: 0,
										}}
									/>

									{/* Description */}
									<motion.p
										variants={panelDescVariant}
										style={{
											fontFamily: "var(--font-body)",
											fontSize: 'clamp(13.5px,1.8vw,16px)',
											lineHeight: 1.8,
											color: C.soft,
											fontWeight: 400,
											marginBottom: 28,
										}}>
										{current.desc}
									</motion.p>

									{/* Feature cards, hiw-glass surface, staggered with icon rotate-in */}
									<motion.div
										variants={panelFeaturesVariant}
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 12,
											marginBottom: 38,
										}}>
										{current.points.map((pt, i) => (
											<motion.div
												key={pt.label}
												variants={panelFeatureRowVariant}
												className='hiw-feat-row hiw-glass'
												style={{
													display: 'flex',
													alignItems: 'flex-start',
													gap: 14,
													padding: '14px 18px',
													borderRadius: 16,
												}}>
												<motion.div
													variants={panelFeatureIconVariant}
													style={{
														width: 38,
														height: 38,
														borderRadius: 12,
														flexShrink: 0,
														background: 'rgba(245,185,122,0.2)',
														border:
															'1px solid rgba(245,185,122,0.32)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														fontSize: 17,
														animation:
															i === 0
																? 'hiw-float 4s ease-in-out infinite'
																: undefined,
													}}>
													{pt.icon}
												</motion.div>
												<div>
													<p
														style={{
															fontFamily: "var(--font-body)",
															fontSize: 13.5,
															fontWeight: 600,
															color: C.text,
															marginBottom: 3,
														}}>
														{pt.label}
													</p>
													<p
														style={{
															fontFamily: "var(--font-body)",
															fontSize: 12.5,
															color: C.soft,
															lineHeight: 1.55,
														}}>
														{pt.detail}
													</p>
												</div>
											</motion.div>
										))}
									</motion.div>

									{/* CTA buttons, exact style as WhyChooseUs §6 */}
									<motion.div
										variants={panelCtaVariant}
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											gap: 12,
										}}>
										<a
											href='#contact'
											className='hiw-cta-p'
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: 8,
												borderRadius: 999,
												padding: '13px 30px',
												fontFamily: "var(--font-body)",
												fontSize: 13,
												fontWeight: 600,
												color: 'white',
												background:
													'linear-gradient(to right,#FF7E5F,#FFB88C)',
												boxShadow:
													'0 22px 70px rgba(255,126,95,0.4)',
												textDecoration: 'none',
												border: 'none',
											}}>
											Talk to Expert
											<svg
												width='14'
												height='14'
												viewBox='0 0 14 14'
												fill='none'>
												<path
													d='M3 7h8M8 4l3 3-3 3'
													stroke='white'
													strokeWidth='1.4'
													strokeLinecap='round'
													strokeLinejoin='round'
												/>
											</svg>
										</a>
										<a
											href='#systems'
											className='hiw-cta-s'
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: 8,
												borderRadius: 999,
												padding: '11px 26px',
												fontFamily: "var(--font-body)",
												fontSize: 13,
												fontWeight: 500,
												color: C.text,
												background: 'rgba(255,255,255,0.05)',
												border: '1px solid rgba(245,185,122,0.35)',
												textDecoration: 'none',
											}}>
											View All Systems{' '}
											<span style={{ color: C.amberLt }}>→</span>
										</a>
									</motion.div>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* ── BOTTOM STEP OVERVIEW, scroll-triggered stagger via useInView ── */}
					<motion.div
						ref={botsRef}
						className='hiw-bots'
						variants={botsContainerVariant}
						initial='hidden'
						animate={botsInView ? 'visible' : 'hidden'}
						style={{ marginTop: 56 }}>
						{steps.map((s, i) => (
							<motion.button
								key={s.step}
								ref={(el) => (cardRefs.current[i] = el)}
								variants={botsCardVariant(i)}
								className='hiw-bc hiw-glass hiw-glass-hover'
								aria-current={index === i ? 'step' : undefined}
								onClick={() => goTo(i)}
								onKeyDown={(e) => handleStepKeyDown(e, i, cardRefs)}
								whileHover={{ y: -4, transition: { duration: 0.2 } }}
								style={{
									position: 'relative',
									textAlign: 'left',
									padding: '20px 18px',
									borderRadius: 20,
									border: `1px solid ${index === i ? 'rgba(232,147,58,0.4)' : 'rgba(255,255,255,0.10)'}`,
									cursor: 'pointer',
								}}>
								{/* Active top bar */}
								{index === i && (
									<motion.div
										layoutId='hiw-active-bar'
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											height: 2,
											borderRadius: '20px 20px 0 0',
											background: `linear-gradient(90deg,${C.amber},${C.coral})`,
										}}
									/>
								)}
								{/* Step badge, pulses on becoming active */}
								<motion.div
									animate={{
										scale: index === i ? [1, 1.08, 1] : 1,
									}}
									transition={{ duration: 0.5, ease: EASE }}
									style={{
										width: 38,
										height: 38,
										borderRadius: 12,
										background:
											index === i
												? `linear-gradient(135deg,${C.amber},${C.coral})`
												: 'rgba(245,185,122,0.2)',
										border: `1.5px solid ${index === i ? 'transparent' : 'rgba(245,185,122,0.4)'}`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: "var(--font-heading)",
										fontSize: 14,
										fontWeight: 700,
										color: index === i ? 'white' : C.amberLt,
										marginBottom: 12,
									}}>
									{s.step}
								</motion.div>
								<p
									style={{
										fontFamily: "var(--font-body)",
										fontSize: 9,
										fontWeight: 600,
										letterSpacing: '0.2em',
										textTransform: 'uppercase',
										color: C.amberLt,
										marginBottom: 5,
									}}>
									{s.tag}
								</p>
								<p
									style={{
										fontFamily: "var(--font-heading)",
										fontSize: 13,
										fontWeight: 600,
										color: C.text,
										lineHeight: 1.25,
										margin: 0,
									}}>
									{s.title}
								</p>
								<p
									style={{
										fontFamily: "var(--font-heading)",
										fontSize: 12.5,
										fontWeight: 300,
										color: C.amberLt,
										fontStyle: 'italic',
										lineHeight: 1.25,
										margin: 0,
									}}>
									{s.titleAccent}
								</p>
							</motion.button>
						))}
					</motion.div>
				</div>
			</section>
		</>
	);
}
