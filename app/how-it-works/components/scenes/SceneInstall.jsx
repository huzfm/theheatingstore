'use client';

import { motion } from 'framer-motion';

export default function SceneInstall({ active }) {
	return (
		<svg
			viewBox='0 0 360 310'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={{ width: '100%', height: '100%' }}>
			<defs>
				<linearGradient id='iscreedG' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#C9A882' stopOpacity='0.55' />
					<stop offset='100%' stopColor='#A8845E' stopOpacity='0.35' />
				</linearGradient>
				<linearGradient id='iinsG' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#DDD0BC' stopOpacity='0.65' />
					<stop offset='100%' stopColor='#C4B09A' stopOpacity='0.45' />
				</linearGradient>
				<linearGradient id='itileG' x1='0' y1='0' x2='0' y2='1'>
					<stop offset='0%' stopColor='#F8F2EA' />
					<stop offset='100%' stopColor='#EDE2D4' />
				</linearGradient>
			</defs>
			{/* Concrete base */}
			<rect x='18' y='242' width='316' height='55' rx='5' fill='url(#iscreedG)' />
			<text fontFamily="var(--font-body)" fontSize='8' fill='#8A6448' x='28' y='274' opacity='0.9'>
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
			<rect x='18' y='195' width='316' height='45' rx='4' fill='url(#iinsG)' />
			<text fontFamily="var(--font-body)" fontSize='8' fill='#7A5A3C' x='28' y='220' opacity='0.9'>
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
			<rect x='18' y='173' width='316' height='20' rx='2' fill='#E8D5BC' opacity='0.6' />
			<text fontFamily="var(--font-body)" fontSize='7.5' fill='#7A5A3C' x='28' y='186' opacity='0.8'>
				Adhesive / levelling screed
			</text>
			{/* Cable mat zone */}
			<rect x='18' y='130' width='316' height='41' rx='3' fill='#FFF0E8' opacity='0.75' />
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
						transition={{ duration: 1.6, delay: row * 0.3, ease: 'easeOut' }}
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
						transition={{ duration: 1.6, delay: row * 0.3, ease: 'easeOut' }}
					/>
				))}
			<text fontFamily="var(--font-body)" fontSize='8' fill='#7A5A3C' x='28' y='126' opacity='0.9'>
				Electric heating cable mat (150W/m²)
			</text>
			{/* Tile */}
			<rect x='18' y='87' width='316' height='41' rx='3' fill='url(#itileG)' />
			{[122, 226, 330].map((x) => (
				<line key={x} x1={x} y1='87' x2={x} y2='128' stroke='#D4C4B0' strokeWidth='0.6' opacity='0.7' />
			))}
			<line x1='18' y1='107' x2='334' y2='107' stroke='#D4C4B0' strokeWidth='0.5' opacity='0.5' />
			<text fontFamily="var(--font-body)" fontSize='8' fill='#7A5A3C' x='28' y='104' opacity='0.9'>
				Porcelain tile / stone / LVT finish
			</text>
			{/* Heat arrows */}
			{active &&
				[58, 120, 196, 268, 318].map((x, i) => (
					<motion.g
						key={x}
						animate={{ y: [0, -22, 0], opacity: [0, 0.65, 0] }}
						transition={{ duration: 2.2, delay: 1.2 + i * 0.25, repeat: Infinity, ease: 'easeInOut' }}>
						<line x1={x} y1='85' x2={x} y2='58' stroke='#C17A50' strokeWidth='1.5' strokeLinecap='round' />
						<polygon points={`${x - 4},62 ${x + 4},62 ${x},52`} fill='#C17A50' opacity='0.75' />
					</motion.g>
				))}
			{/* Thickness callout */}
			<line x1='340' y1='130' x2='340' y2='171' stroke='#C17A50' strokeWidth='0.9' strokeDasharray='3 2' />
			<line x1='334' y1='130' x2='346' y2='130' stroke='#C17A50' strokeWidth='0.9' />
			<line x1='334' y1='171' x2='346' y2='171' stroke='#C17A50' strokeWidth='0.9' />
			<text fontFamily="var(--font-body)" fontSize='8' fill='#C17A50' x='350' y='153' textAnchor='start'>
				3–4mm
			</text>
			{/* Total depth */}
			<line x1='10' y1='87' x2='10' y2='297' stroke='#A88060' strokeWidth='0.7' strokeDasharray='3 2' />
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
				<motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.5 }}>
					<rect x='220' y='25' width='128' height='54' rx='9' fill='#FFF5EE' stroke='#D4B89A' strokeWidth='1' />
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
					<line x1='228' y1='45' x2='340' y2='45' stroke='#E8D4BC' strokeWidth='0.5' />
					<text fontFamily="var(--font-body)" fontSize='6.5' fill='#6B4A2D' x='284' y='57' textAnchor='middle'>
						BS 7671 Amendment 4
					</text>
					<text fontFamily="var(--font-body)" fontSize='6.5' fill='#6B4A2D' x='284' y='68' textAnchor='middle'>
						Inspected & signed off on site
					</text>
				</motion.g>
			)}
		</svg>
	);
}
