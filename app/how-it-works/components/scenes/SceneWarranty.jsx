'use client';

import { motion } from 'framer-motion';

export default function SceneWarranty({ active }) {
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
			<rect x='28' y='22' width='244' height='270' rx='10' fill='url(#wCert)' stroke='#D4B89A' strokeWidth='1.5' />
			<rect x='28' y='22' width='244' height='54' rx='10' fill='url(#wGold)' opacity='0.88' />
			<rect x='28' y='56' width='244' height='20' fill='url(#wGold)' opacity='0.88' />
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
			<line x1='48' y1='200' x2='252' y2='200' stroke='#D4B89A' strokeWidth='0.6' />
			{[
				{ y: 216, icon: '🔥', text: 'Heating cable & mat, full replacement' },
				{ y: 231, icon: '🌡️', text: 'Thermostat & controls, all parts' },
				{ y: 246, icon: '🔄', text: '24 hour swap, next working day' },
				{ y: 261, icon: '📞', text: 'Zero callout fees, lifetime support' },
			].map(({ y, icon, text }) => (
				<g key={y}>
					<text x='52' y={y} fontSize='9'>
						{icon}
					</text>
					<text fontFamily="var(--font-body)" fontSize='7.5' fill='#4A3020' x='68' y={y}>
						{text}
					</text>
				</g>
			))}
			<line x1='48' y1='276' x2='140' y2='276' stroke='#D4B89A' strokeWidth='0.7' />
			<text fontFamily="var(--font-body)" fontSize='6.5' fill='#A88060' x='94' y='285' textAnchor='middle'>
				Authorised Signature
			</text>
			<line x1='160' y1='276' x2='252' y2='276' stroke='#D4B89A' strokeWidth='0.7' />
			<text fontFamily="var(--font-body)" fontSize='6.5' fill='#A88060' x='206' y='285' textAnchor='middle'>
				Registration Date
			</text>
			{/* Seal */}
			{active && (
				<motion.g
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ type: 'spring', stiffness: 200, delay: 1.2 }}>
					<circle cx='298' cy='100' r='34' fill='#FFF5EE' stroke='#C17A50' strokeWidth='1.5' />
					<circle cx='298' cy='100' r='27' fill='none' stroke='#E8A050' strokeWidth='0.7' strokeDasharray='3 2' />
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
					<text fontFamily="var(--font-body)" fontSize='7' fill='#B86B45' x='298' y='105' textAnchor='middle'>
						GUARANTEE
					</text>
					<text fontFamily="var(--font-body)" fontSize='6.5' fill='#A88060' x='298' y='116' textAnchor='middle'>
						REGISTERED
					</text>
				</motion.g>
			)}
			{/* Stats mini panel */}
			<rect x='282' y='148' width='70' height='130' rx='8' fill='#FFF5EE' stroke='#E8D4BC' strokeWidth='0.8' />
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
					<text fontFamily="var(--font-body)" fontSize='6.5' fill='#8A6448' x='317' y={181 + i * 30} textAnchor='middle'>
						{lab}
					</text>
				</g>
			))}
		</svg>
	);
}
