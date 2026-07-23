'use client';

import { motion } from 'framer-motion';

export default function MarqueeBar() {
	const items = [
		'✓ Kashmir Installation Warranty',
		'✓ 25-50 Year Pipe Guarantees',
		'✓ CE & UKCA Certified',
		'✓ IEC 60335 Safety Compliant',
		'✓ ISO 9001:2015 Quality Management',
		'✓ WRAS Approved Components',
		'✓ 18th Edition Electrical Compliance',
		'✓ Global Electrical Approvals',
	];

	return (
		<div className='relative w-full overflow-hidden bg-gradient-to-r from-[#2563eb] to-[#f97316] py-4'>
			<motion.div
				className='flex whitespace-nowrap'
				style={{ willChange: 'transform' }}
				animate={{
					x: [0, -100 * items.length],
				}}
				transition={{
					x: {
						repeat: Infinity,
						repeatType: 'loop',
						duration: 20,
						ease: 'linear',
					},
				}}>
				{[...items, ...items].map((item, index) => (
					<span
						key={index}
						className='inline-block px-8 text-white font-medium text-sm'>
						{item}
					</span>
				))}
			</motion.div>
		</div>
	);
}
