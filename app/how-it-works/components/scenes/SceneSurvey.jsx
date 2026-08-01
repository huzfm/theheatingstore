'use client';

import { motion } from 'framer-motion';

export default function SceneSurvey({ active }) {
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
			<line x1='52' y1='116' x2='130' y2='116' stroke='#C17A50' strokeWidth='1' />
			<line x1='130' y1='52' x2='130' y2='188' stroke='#C17A50' strokeWidth='1' />
			<text fontFamily="var(--font-body)" fontSize='7' fill='#8A6448' x='89' y='87' textAnchor='middle'>
				BATHROOM
			</text>
			<text fontFamily="var(--font-body)" fontSize='7' fill='#8A6448' x='89' y='155' textAnchor='middle'>
				HALLWAY
			</text>
			<text fontFamily="var(--font-body)" fontSize='7' fill='#8A6448' x='178' y='118' textAnchor='middle'>
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
						transition={{ duration: 1, delay: 0.3 + row * 0.15, ease: 'easeOut' }}
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
						transition={{ duration: 1.2, delay: 0.6 + row * 0.1, ease: 'easeOut' }}
					/>
				))}
			{/* Dimension arrows */}
			<line x1='52' y1='200' x2='228' y2='200' stroke='#A88060' strokeWidth='0.7' />
			<polygon points='52,197 52,203 44,200' fill='#A88060' opacity='0.7' />
			<polygon points='228,197 228,203 236,200' fill='#A88060' opacity='0.7' />
			<text fontFamily="var(--font-body)" fontSize='7' fill='#A88060' x='140' y='212' textAnchor='middle'>
				4,250mm
			</text>
			<line x1='242' y1='52' x2='242' y2='188' stroke='#A88060' strokeWidth='0.7' />
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
			<rect x='36' y='218' width='208' height='68' rx='5' fill='#F5EDE0' stroke='#E0CCBA' strokeWidth='0.7' />
			<text fontFamily="var(--font-heading)" fontSize='8' fontWeight='600' fill='#3C2A25' x='45' y='231'>
				HEATING LAYOUT CAD PLAN
			</text>
			<line x1='36' y1='235' x2='244' y2='235' stroke='#E0CCBA' strokeWidth='0.5' />
			<text fontFamily="var(--font-body)" fontSize='7' fill='#6B4A2D' x='45' y='247'>
				Project: Premium Residential
			</text>
			<text fontFamily="var(--font-body)" fontSize='7' fill='#6B4A2D' x='45' y='258'>
				Cable: ProWarm 150W/m²
			</text>
			<text fontFamily="var(--font-body)" fontSize='7' fill='#6B4A2D' x='45' y='269'>
				Zones: 3 · Total area: 18.2m²
			</text>
			<text fontFamily="var(--font-body)" fontSize='7' fill='#B86B45' fontWeight='600' x='45' y='280'>
				Rev A · Certified Approved
			</text>
			{/* Tools */}
			<rect x='272' y='38' width='72' height='95' rx='7' fill='#FFF5EE' stroke='#D4B89A' strokeWidth='1' />
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
			<rect x='295' y='22' width='26' height='10' rx='2' fill='#C17A50' opacity='0.45' />
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
			<line x1='282' y1='54' x2='310' y2='54' stroke='#C17A50' strokeWidth='1.3' opacity='0.7' />
			<line x1='282' y1='67' x2='322' y2='67' stroke='#C17A50' strokeWidth='1.3' opacity='0.5' />
			<line x1='282' y1='80' x2='315' y2='80' stroke='#C17A50' strokeWidth='1.3' opacity='0.4' />
			<text fontFamily="var(--font-body)" fontSize='6' fill='#8A6448' x='308' y='120' textAnchor='middle'>
				SURVEY NOTES
			</text>
			<rect x='272' y='148' width='72' height='82' rx='7' fill='#FFF5EE' stroke='#D4B89A' strokeWidth='1' />
			<rect x='282' y='158' width='52' height='32' rx='4' fill='#F0E0CC' />
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
			<text fontFamily="var(--font-body)" fontSize='6' fill='#8A6448' x='308' y='191' textAnchor='middle'>
				FLOOR TEMP
			</text>
			<circle cx='290' cy='216' r='6' fill='#E8D0BC' />
			<circle cx='308' cy='216' r='6' fill='#C17A50' opacity='0.75' />
			<circle cx='326' cy='216' r='6' fill='#E8D0BC' />
			<text fontFamily="var(--font-body)" fontSize='6' fill='#8A6448' x='308' y='228' textAnchor='middle'>
				THERMAL METER
			</text>
			{/* FREE stamp */}
			{active && (
				<motion.g
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 240, delay: 1.5 }}>
					<circle cx='316' cy='270' r='24' fill='none' stroke='#C17A50' strokeWidth='1.5' strokeDasharray='4 3' />
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
					<text fontFamily="var(--font-body)" fontSize='6' fill='#C17A50' x='316' y='278' textAnchor='middle'>
						SURVEY
					</text>
				</motion.g>
			)}
		</svg>
	);
}
