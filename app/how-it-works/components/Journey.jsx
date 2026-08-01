'use client';

import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import { C, EASE } from '@/components/sections/WhyChooseUs/theme';
import { PROCESS } from '../data';
import JourneyRail from './JourneyRail';
import JourneyStage from './JourneyStage';
import SceneSurvey from './scenes/SceneSurvey';
import SceneInstall from './scenes/SceneInstall';
import SceneThermostat from './scenes/SceneThermostat';
import SceneWarranty from './scenes/SceneWarranty';

const SCENES = { survey: SceneSurvey, install: SceneInstall, thermostat: SceneThermostat, warranty: SceneWarranty };

export default function Journey() {
	const [active, setActive] = useState(0);
	const containerRef = useRef(null);
	const reduce = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start start', 'end end'],
	});

	const handleActivate = useCallback((i) => setActive(i), []);
	const current = PROCESS[active];

	return (
		<section
			id='journey'
			ref={containerRef}
			className='hiw-noise'
			style={{
				position: 'relative',
				background: '#0f0906',
				fontFamily: 'var(--font-body)',
				color: C.text,
				padding: '64px 20px 0',
			}}>
			<div style={{ maxWidth: 1320, margin: '0 auto' }}>
				<motion.div
					initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}
					whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{ maxWidth: 620, marginBottom: 56 }}>
					<h2 className='brand-h' style={{ fontSize: 'clamp(28px,3.8vw,46px)' }}>
						Here is exactly
						<span className='brand-h-accent' style={{ display: 'block' }}>
							what happens.
						</span>
					</h2>
					<p className='brand-sub' style={{ marginTop: 18, fontSize: 15 }}>
						Scroll through the process, or jump to a stage using the
						numbers on the left.
					</p>
				</motion.div>

				{/* Mobile progress bar, replaces the sticky rail below 960px */}
				<div className='hiw-journey-mobile-bar'>
					<div className='hiw-bar-track'>
						<motion.div
							className='hiw-bar-fill'
							animate={{ width: `${((active + 1) / PROCESS.length) * 100}%` }}
							transition={{ duration: 0.5, ease: EASE }}
						/>
					</div>
					<span style={{ fontSize: 11, color: C.soft, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
						{String(active + 1).padStart(2, '0')} / {String(PROCESS.length).padStart(2, '0')} · {current.tag}
					</span>
				</div>

				<div className='hiw-journey-grid'>
					<div className='hiw-journey-rail-col'>
						<JourneyRail
							stages={PROCESS}
							activeIndex={active}
							progress={reduce ? 1 : scrollYProgress}
							SceneComponent={SCENES[current.scene]}
							sceneKey={current.scene}
						/>
					</div>
					<div className='hiw-journey-stages-col'>
						{PROCESS.map((stage, i) => (
							<JourneyStage
								key={stage.num}
								stage={stage}
								index={i}
								isActive={active === i}
								onActivate={handleActivate}
								SceneComponent={SCENES[stage.scene]}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
