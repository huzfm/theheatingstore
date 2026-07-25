'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProjectCostCalculator from './productcalculator';
import ThermostatSection from './ThermostatSection';

const productImages = ['/images/p1.png', '/images/p3.png', '/images/p2.png'];

const stepsInfo = [
	'Our Kashmir team prepares the floor and routes electrical wiring for the electric hamam system.',
	'The Kashmir layered method: insulation board, concrete base, and heating cable mat, engineered for heat retention during power cuts.',
	'System testing, thermostat commissioning, and final handover with your Kashmir installation warranty activated.',
];

const altSteps = [
	'Professional electric hamam installation in a Kashmir home, floor preparation and wiring by The Heating Store team',
	'The layered concrete sandwich method for electric hamam in Kashmir, insulation, concrete, and heating cable installation',
	'Completed electric hamam installation in Srinagar, tested, commissioned, and covered by our Kashmir installation warranty',
];

export default function InstallationWalkthrough() {
	const [current, setCurrent] = useState(0);
	const reduce = useReducedMotion();

	const fadeUp = {
		hidden: { opacity: 0, y: 26 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
		},
	};

	useEffect(() => {
		const t = setInterval(() => {
			setCurrent((p) => (p + 1) % productImages.length);
		}, 3200);
		return () => clearInterval(t);
	}, []);

	return (
		<section
			className='relative isolate overflow-hidden'
			style={{
				backgroundImage: `
          linear-gradient(
            180deg,
            #FFFFFF 0%,
            #f5e1cbff 35%,
            #f4e7dbff 70%,
            #f8c084ff 100%
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

			{/* GRAIN */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage: "url('/noise.png')",
					opacity: 0.02,
				}}
			/>

			
			<ProjectCostCalculator />
			
		</section>
	);
}
