'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SceneThermostat({ active }) {
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
			<rect x='88' y='22' width='174' height='228' rx='24' fill='url(#tsBg)' stroke='#E0CCBA' strokeWidth='1.5' />
			<rect x='102' y='40' width='146' height='126' rx='12' fill='#FAF0E6' />
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
			<text fontFamily="var(--font-body)" fontSize='8' fill='#A88060' x='114' y='152' textAnchor='middle'>
				5°
			</text>
			<text fontFamily="var(--font-body)" fontSize='8' fill='#A88060' x='236' y='152' textAnchor='middle'>
				35°
			</text>
			<rect x='110' y='162' width='130' height='22' rx='8' fill='#F0E4D4' opacity='0.9' />
			<motion.circle
				cx='124'
				cy='173'
				r='4'
				fill='#C17A50'
				animate={{ opacity: [1, 0.3, 1] }}
				transition={{ duration: 1.8, repeat: Infinity }}
			/>
			<text fontFamily="var(--font-body)" fontSize='8' fill='#6A4A34' x='136' y='177'>
				HEATING ACTIVE
			</text>
			<rect x='106' y='193' width='58' height='18' rx='7' fill='#E8D5C0' opacity='0.8' />
			<text fontFamily="var(--font-body)" fontSize='7.5' fill='#6A4A34' x='135' y='206' textAnchor='middle'>
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
			<text fontFamily="var(--font-body)" fontSize='7.5' fill='#8A4A2A' x='201' y='206' textAnchor='middle'>
				BOOST
			</text>
			<line x1='175' y1='250' x2='175' y2='282' stroke='#D4B89A' strokeWidth='1.2' strokeDasharray='4 3' />
			<rect x='153' y='282' width='44' height='14' rx='5' fill='#EDD9C4' opacity='0.8' />
			<text fontFamily="var(--font-body)" fontSize='6.5' fill='#8A6448' x='175' y='293' textAnchor='middle'>
				FLOOR SENSOR
			</text>
			{/* Labels right */}
			<line x1='266' y1='78' x2='282' y2='80' stroke='#D4B89A' strokeWidth='0.8' strokeDasharray='2 2' />
			<text fontFamily="var(--font-body)" fontSize='8' fill='#7A5A3C' x='286' y='75'>
				Dual sensor
			</text>
			<text fontFamily="var(--font-body)" fontSize='7.5' fill='#A88060' x='286' y='86'>
				air + floor
			</text>
			<line x1='266' y1='108' x2='282' y2='110' stroke='#D4B89A' strokeWidth='0.8' strokeDasharray='2 2' />
			<text fontFamily="var(--font-body)" fontSize='8' fill='#7A5A3C' x='286' y='105'>
				±0.5°C
			</text>
			<text fontFamily="var(--font-body)" fontSize='7.5' fill='#A88060' x='286' y='116'>
				accuracy
			</text>
			{/* 7-day schedule */}
			<rect x='18' y='58' width='64' height='142' rx='8' fill='#FFF5EE' stroke='#E8D4BC' strokeWidth='0.8' />
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
					<text fontFamily="var(--font-body)" fontSize='6.5' fill='#8A6448' x='40' y={89 + i * 17}>
						{d}
					</text>
				</g>
			))}
			<text fontFamily="var(--font-body)" fontSize='6.5' fill='#8A6448' x='50' y='203' textAnchor='middle'>
				SCHEDULE
			</text>
		</svg>
	);
}
