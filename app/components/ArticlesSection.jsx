'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const container = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.14 },
	},
};

const item = {
	hidden: { opacity: 0, y: 26 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
	},
};

const articles = [
	{
		title: 'Electric Hamam vs Traditional Hamam',
		subtitle:
			'Which heating system is better for Kashmir homes? A complete cost, comfort and safety comparison',
		img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
	},
	{
		title: 'Best Heating Systems for Kashmir Winters',
		subtitle:
			'How underfloor heating performs in -15C conditions with heavy snowfall and power cuts',
		img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
	},
	{
		title: 'Electric vs Hydronic Underfloor Heating',
		subtitle:
			'Cable mats or hot water pipes? Choosing the right system for your home in Srinagar',
		img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
	},
	{
		title: 'Underfloor Heating for Luxury Homes & Hotels',
		subtitle:
			'Why architects in Gulmarg, Pahalgam and Srinagar choose electric hamam for premium properties',
		img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
	},
];

export default function ArticlesSection() {
	const reduce = useReducedMotion();

	return (
		<section
			className='relative isolate overflow-hidden'
			style={{
				backgroundImage: `
					linear-gradient(
						180deg,
						#FFFFFF 0%,
						#FFF4E8 35%,
						#FFE0C2 70%,
						#F5B97A 100%
					)
				`,
			}}>
			{/* WARM HEAT GLOW */}
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

			{/* GRAIN TEXTURE */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					backgroundImage: "url('/noise.png')",
					opacity: 0.02,
				}}
			/>

			<div className='relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-32'>
				{/* HEADER */}
				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='max-w-3xl'>
					{/* Badge */}
					<motion.div
						variants={item}
						className='inline-flex items-center rounded-full px-4 py-2.5 sm:px-8 backdrop-blur-xl bg-white/[0.08] border border-white/[0.18] shadow-[0_10px_30px_rgba(0,0,0,0.18)]'>
						<p className='text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#4FA3D1] whitespace-nowrap'>
							Insights & Comparisons
						</p>
					</motion.div>

					{/* Heading */}
					<motion.h2
						variants={item}
						className='mt-6 font-serif font-semibold leading-tight text-[#3C2A25]'
						style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
						Expert Articles
					</motion.h2>

					{/* Accent line */}
					<motion.p
						variants={item}
						className='mt-3 text-base sm:text-lg font-light italic text-[#B86B45]'>
						Read. Compare. Decide.
					</motion.p>

					{/* Sub text */}
					<motion.p
						variants={item}
						className='mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[#3C2B27]'>
						Research-backed insights to help you make informed decisions about
						heating systems for your space.
					</motion.p>
				</motion.div>

				{/* ARTICLES GRID */}
				<motion.div
					variants={container}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='mt-16 grid gap-6 lg:grid-cols-2'>
					{articles.map((article, i) => (
						<motion.a
							key={article.title}
							href='/blog'
							variants={item}
							whileHover={reduce ? {} : { y: -4 }}
							className='group relative flex gap-5 rounded-[20px] bg-white/75 backdrop-blur-sm border border-black/[0.07] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:border-[#B86B45]/25'>
							{/* Image */}
							<div className='flex-shrink-0 w-28 h-28 rounded-[14px] overflow-hidden relative'>
								<Image
									src={article.img}
									alt={article.title}
									fill
									className='object-cover transition-transform duration-500 group-hover:scale-105'
									sizes="112px"
								/>
							</div>

							{/* Content */}
							<div className='flex flex-col justify-center min-w-0'>
								<h3 className='text-base font-serif font-semibold leading-snug text-[#3C2A25] group-hover:text-[#B86B45] transition-colors duration-300'>
									{article.title}
								</h3>
								<p className='mt-1.5 text-xs leading-relaxed text-[#4A342E] line-clamp-2'>
									{article.subtitle}
								</p>
								<span className='mt-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#B86B45] group-hover:tracking-[0.15em] transition-all duration-300'>
									Read Full Article →
								</span>
							</div>
						</motion.a>
					))}
				</motion.div>

				{/* VIEW ALL CTA */}
				<motion.div
					variants={item}
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					className='mt-12 flex justify-center'>
					<a
						href='/blog'
						className='inline-flex items-center justify-center gap-2 rounded-full border border-[#FFD6A6] bg-white/70 px-10 py-3.5 text-sm font-medium text-[#3C2B27] backdrop-blur-sm transition hover:bg-[#FFE8CF] hover:border-[#B86B45]/40'>
						View All Articles →
					</a>
				</motion.div>
			</div>
		</section>
	);
}