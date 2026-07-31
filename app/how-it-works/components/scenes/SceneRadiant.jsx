'use client';

import { motion } from 'framer-motion';

export default function SceneRadiant({ active }) {
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
					<stop offset='100%' stopColor='#4070A0' stopOpacity='0.02' />
				</linearGradient>
				<radialGradient id='rFloor' cx='50%' cy='100%' r='55%'>
					<stop offset='0%' stopColor='#C17A50' stopOpacity='0.3' />
					<stop offset='100%' stopColor='#C17A50' stopOpacity='0' />
				</radialGradient>
			</defs>
			<rect x='28' y='16' width='268' height='248' rx='10' fill='#FFF8F3' stroke='#E8D4BC' strokeWidth='1.2' />
			<rect x='28' y='16' width='268' height='248' rx='10' fill='url(#rHeat)' />
			<rect x='28' y='16' width='268' height='248' rx='10' fill='url(#rFloor)' />
			<rect x='28' y='248' width='268' height='16' fill='#D4B89A' opacity='0.6' />
			<rect x='28' y='245' width='268' height='5' fill='#C17A50' opacity='0.22' />
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
						transition={{ duration: 3.5, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
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
					<line x1='298' y1={y} x2='308' y2={y} stroke='#C17A50' strokeWidth='0.8' opacity={op} />
					<text fontFamily="var(--font-body)" fontSize='8' fill='#C17A50' x='312' y={y + 3} opacity={op}>
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
						transition={{ duration: 2.8, delay: i * 0.45, repeat: Infinity, ease: 'easeInOut' }}>
						<line x1={x} y1='243' x2={x} y2='210' stroke='#C17A50' strokeWidth='1.4' strokeLinecap='round' />
						<polygon points={`${x - 4},215 ${x + 4},215 ${x},205`} fill='#C17A50' opacity='0.8' />
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
			<text fontFamily="var(--font-body)" fontSize='6.5' fill='#A08070' x='41' y='176' textAnchor='middle' opacity='0.6'>
				OLD
			</text>
			{active && (
				<motion.g animate={{ opacity: [0.25, 0.42, 0.25] }} transition={{ duration: 2, repeat: Infinity }}>
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
				<rect x='148' y='132' width='28' height='60' rx='9' fill='#3C2A25' />
				<rect x='142' y='144' width='14' height='40' rx='6' fill='#3C2A25' />
				<rect x='168' y='144' width='14' height='40' rx='6' fill='#3C2A25' />
			</g>
			{/* Benefit pills */}
			{active &&
				['✓ Silent', '✓ Dust-free', '✓ Even warmth'].map((label, i) => (
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
						<text fontFamily="var(--font-body)" fontSize='7' fill='#B86B45' x='42' y={216 + i * 18}>
							{label}
						</text>
					</motion.g>
				))}
		</svg>
	);
}
