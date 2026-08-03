'use client';

import { motion } from 'framer-motion';
import Eyebrow from '../ui/Eyebrow';
import { projects } from '../data';
import { EASE } from '../theme';
import '../styles/projects.css';

// Explicit editorial masonry areas, matched to the fixed order of `projects`
// (Residential, Homes, Hotels & Resorts, Mosques[featured], Commercial,
// Renovation) — see projects.css `.ge-portfolio-grid` for the grid-template.
const AREAS = ['res', 'hom', 'hot', 'feat', 'com', 'ren'];

function ProjectTile({ project, index, area }) {
	const num = String(index + 1).padStart(2, '0');
	return (
		<motion.article
			className={`ge-portfolio-tile${project.featured ? ' is-featured' : ''}`}
			style={{ gridArea: area }}
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.25 }}
			transition={{ delay: (index % 3) * 0.08, duration: 0.75, ease: EASE }}>
			<img
				src={project.image}
				alt={project.label}
				className='ge-portfolio-img'
				loading='lazy'
			/>
			<div className='ge-portfolio-overlay' aria-hidden='true' />
			<div className='ge-portfolio-content'>
				<span className='ge-portfolio-num'>{num}</span>
				<h3 className='ge-portfolio-title'>{project.label}</h3>
				<span className='ge-portfolio-line' aria-hidden='true' />
				<p className='ge-portfolio-desc'>{project.desc}</p>
			</div>
		</motion.article>
	);
}

export default function ProjectsPortfolio() {
	return (
		<section className='ge-section ge-portfolio'>
			<div className='ge-container'>
				<div className='ge-portfolio-head'>
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.7, ease: EASE }}>
						<Eyebrow>Portfolio / 06 Building Types</Eyebrow>
					</motion.div>
					<motion.h2
						className='ge-portfolio-heading'
						initial={{ opacity: 0, y: 22 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}>
						Projects We Serve
					</motion.h2>
					<motion.p
						className='ge-portfolio-sub-copy'
						initial={{ opacity: 0, y: 14 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}>
						From intimate homes to grand commercial spaces, we heat them
						all.
					</motion.p>
				</div>

				<div className='ge-portfolio-grid'>
					{projects.map((p, i) => (
						<ProjectTile
							project={p}
							index={i}
							area={AREAS[i]}
							key={p.label}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
