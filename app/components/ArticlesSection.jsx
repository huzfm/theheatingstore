'use client';

import Image from 'next/image';
import {
	motion,
	useReducedMotion,
	useMotionValue,
	useSpring,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const journal = [
	{
		id: '01',
		tag: 'Comparison',
		title: 'Electric Hamam vs Traditional Hamam',
		dek: 'Which heating system is better for Kashmir homes? A complete cost, comfort and safety comparison.',
		img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
		role: 'feature',
	},
	{
		id: '02',
		tag: 'Architecture',
		title: 'Underfloor Heating for Luxury Homes & Hotels',
		dek: 'Why architects in Gulmarg, Pahalgam and Srinagar choose electric hamam for premium properties.',
		img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
		role: 'tall',
	},
	{
		id: '03',
		tag: 'Climate',
		title: 'Best Heating Systems for Kashmir Winters',
		dek: 'How underfloor heating performs in −15°C conditions, heavy snowfall and long power cuts.',
		img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1920&q=80',
		role: 'panorama',
	},
	{
		id: '04',
		tag: 'Systems',
		title: 'Electric vs Hydronic Underfloor Heating',
		dek: 'Cable mats or hot water pipes? Choosing the right system for your home in Srinagar.',
		quote:
			'Warmth should be felt, never seen — the quiet mark of a truly considered interior.',
		img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&q=80',
		role: 'quote',
	},
];

function setLight(e) {
	const r = e.currentTarget.getBoundingClientRect();
	e.currentTarget.style.setProperty(
		'--mx',
		`${((e.clientX - r.left) / r.width) * 100}%`
	);
	e.currentTarget.style.setProperty(
		'--my',
		`${((e.clientY - r.top) / r.height) * 100}%`
	);
}

function RevealImage({
	src,
	alt,
	aspect,
	sizes,
	delay = 0,
	duration = 1.6,
	reduce,
	children,
}) {
	return (
		<div
			className={`group/img relative w-full overflow-hidden ${aspect}`}
			onMouseMove={reduce ? undefined : setLight}
			style={{ '--mx': '50%', '--my': '50%' }}>
			<motion.div
				className='absolute inset-0'
				initial={reduce ? false : { clipPath: 'inset(7% round 2px)', opacity: 0.4 }}
				whileInView={{ clipPath: 'inset(0% round 2px)', opacity: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration, ease: EASE, delay }}>
				<motion.div
					className='absolute inset-0'
					initial={reduce ? false : { scale: 1.14, filter: 'blur(14px)' }}
					whileInView={{ scale: 1, filter: 'blur(0px)' }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: duration + 0.4, ease: EASE, delay }}>
					<Image
						src={src}
						alt={alt}
						fill
						sizes={sizes}
						className='object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/img:scale-[1.05]'
					/>
				</motion.div>
			</motion.div>

			{/* ambient cursor light */}
			<div
				className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/img:opacity-100'
				style={{
					background:
						'radial-gradient(circle at var(--mx) var(--my), rgba(255,214,166,0.30), transparent 60%)',
				}}
			/>
			{children}
		</div>
	);
}

function MagneticLink({ href, children, reduce }) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 });
	const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 });

	function onMove(e) {
		if (reduce) return;
		const r = e.currentTarget.getBoundingClientRect();
		x.set((e.clientX - r.left - r.width / 2) * 0.3);
		y.set((e.clientY - r.top - r.height / 2) * 0.3);
	}
	function onLeave() {
		x.set(0);
		y.set(0);
	}

	return (
		<motion.a
			href={href}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			style={reduce ? undefined : { x: sx, y: sy }}
			className='group inline-flex items-center gap-3 text-[#3C2A25]'>
			<span className='relative font-serif text-lg sm:text-xl tracking-wide'>
				{children}
				<span className='absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#A6633F] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100' />
			</span>
			<ArrowUpRight
				className='h-4 w-4 text-[#A6633F] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
				strokeWidth={1.5}
			/>
		</motion.a>
	);
}

export default function ArticlesSection() {
	const reduce = useReducedMotion();
	const [feature, tall, panorama, quote] = journal;

	return (
		<section
			className='relative isolate overflow-hidden bg-[#FAF6F0]'
			style={{
				backgroundImage: `
					radial-gradient(120% 60% at 50% -10%, rgba(230,213,184,0.55), transparent 60%),
					linear-gradient(180deg, #FDFBF7 0%, #F7F1E7 45%, #EFE5D4 100%)
				`,
			}}>
			{/* breathing light */}
			<motion.div
				aria-hidden
				animate={reduce ? {} : { opacity: [0.2, 0.35, 0.2] }}
				transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
				className='pointer-events-none absolute inset-x-0 top-0 h-[70vh]'
				style={{
					background:
						'radial-gradient(50% 40% at 50% 0%, rgba(192,133,82,0.16), transparent 70%)',
				}}
			/>

			{/* drifting ambient blobs */}
			<motion.div
				aria-hidden
				animate={reduce ? {} : { x: [0, 40, -10, 0], y: [0, -25, 15, 0] }}
				transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
				className='pointer-events-none absolute -left-40 top-40 h-[28rem] w-[28rem] rounded-full opacity-[0.12] blur-3xl'
				style={{ background: 'radial-gradient(circle, #C08552, transparent 70%)' }}
			/>
			<motion.div
				aria-hidden
				animate={reduce ? {} : { x: [0, -30, 20, 0], y: [0, 20, -15, 0] }}
				transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
				className='pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full opacity-[0.10] blur-3xl'
				style={{ background: 'radial-gradient(circle, #D9C7A8, transparent 70%)' }}
			/>

			{/* grain */}
			<div
				className='pointer-events-none absolute inset-0 mix-blend-overlay'
				style={{ backgroundImage: "url('/noise.png')", opacity: 0.03 }}
			/>

			{/* vignette */}
			<div
				className='pointer-events-none absolute inset-0'
				style={{
					background:
						'radial-gradient(120% 100% at 50% 50%, transparent 60%, rgba(43,38,34,0.05) 100%)',
				}}
			/>

			<div className='relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40'>
				{/* HEADER */}
				<div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-6'>
					<div className='max-w-2xl'>
						<motion.p
							initial={reduce ? false : { opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: EASE }}
							className='text-[11px] font-medium uppercase tracking-[0.35em] text-[#A6633F]'>
							The Journal
						</motion.p>

						<h2 className='mt-5 font-serif font-medium leading-[1.05] text-[#2B2622] text-[clamp(2rem,5vw,3.75rem)]'>
							<span className='block overflow-hidden'>
								<motion.span
									className='block'
									initial={reduce ? false : { y: '100%' }}
									whileInView={{ y: '0%' }}
									viewport={{ once: true }}
									transition={{ duration: 1, ease: EASE, delay: 0.1 }}>
									Writing on warmth,
								</motion.span>
							</span>
							<span className='block overflow-hidden'>
								<motion.span
									className='block'
									initial={reduce ? false : { y: '100%' }}
									whileInView={{ y: '0%' }}
									viewport={{ once: true }}
									transition={{ duration: 1, ease: EASE, delay: 0.25 }}>
									and the architecture of comfort.
								</motion.span>
							</span>
						</h2>

						<motion.p
							initial={reduce ? false : { opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.45 }}
							className='mt-6 max-w-md text-sm sm:text-base leading-relaxed text-[#5A4F47]'>
							Four studies on how invisible heating shapes the way a home
							feels — from Kashmir&rsquo;s coldest winters to its quietest
							luxury interiors.
						</motion.p>
					</div>

					<motion.p
						initial={reduce ? false : { opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 1, ease: EASE, delay: 0.5 }}
						className='shrink-0 text-[11px] font-medium uppercase tracking-[0.3em] text-[#8A7A6D] lg:text-right'>
						Vol. I — On Warmth &amp; Architecture
					</motion.p>
				</div>

				<motion.div
					initial={reduce ? false : { scaleX: 0 }}
					whileInView={{ scaleX: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
					className='mt-12 h-px w-full origin-left bg-[#2B2622]/[0.08]'
				/>

				{/* EDITORIAL GRID */}
				<div className='mt-16 grid grid-cols-1 gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28'>
					{/* FEATURE */}
					<a href='/blog' className='group block lg:col-span-7'>
						<RevealImage
							src={feature.img}
							alt={feature.title}
							aspect='aspect-[4/5]'
							sizes='(min-width:1024px) 55vw, 100vw'
							delay={0}
							duration={1.8}
							reduce={reduce}
						/>
						<motion.div
							initial={reduce ? false : { opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
							className='mt-7 max-w-lg'>
							<p className='text-[11px] font-medium uppercase tracking-[0.3em] text-[#A6633F]'>
								{feature.id} — {feature.tag}
							</p>
							<h3 className='mt-3 font-serif font-medium leading-snug text-[#2B2622] text-2xl sm:text-3xl lg:text-4xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2px]'>
								{feature.title}
							</h3>
							<p className='mt-3 text-sm sm:text-base leading-relaxed text-[#5A4F47] transition-opacity duration-500 group-hover:opacity-80'>
								{feature.dek}
							</p>
							<span className='relative mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.25em] text-[#2B2622]'>
								Read the Story
								<span className='absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#A6633F] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100' />
							</span>
						</motion.div>
					</a>

					{/* TALL SECONDARY */}
					<a href='/blog' className='group block lg:col-span-5'>
						<RevealImage
							src={tall.img}
							alt={tall.title}
							aspect='aspect-[3/4]'
							sizes='(min-width:1024px) 38vw, 100vw'
							delay={0.15}
							duration={1.6}
							reduce={reduce}
						/>
						<motion.div
							initial={reduce ? false : { opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
							className='mt-7'>
							<p className='text-[11px] font-medium uppercase tracking-[0.3em] text-[#A6633F]'>
								{tall.id} — {tall.tag}
							</p>
							<h3 className='mt-3 font-serif font-medium leading-snug text-[#2B2622] text-2xl sm:text-3xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2px]'>
								{tall.title}
							</h3>
							<p className='mt-3 text-sm leading-relaxed text-[#5A4F47] transition-opacity duration-500 group-hover:opacity-80'>
								{tall.dek}
							</p>
							<span className='relative mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.25em] text-[#2B2622]'>
								Read the Story
								<span className='absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#A6633F] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100' />
							</span>
						</motion.div>
					</a>

					{/* PANORAMA */}
					<a href='/blog' className='group block lg:col-span-12'>
						<RevealImage
							src={panorama.img}
							alt={panorama.title}
							aspect='aspect-[16/10] lg:aspect-[3/1]'
							sizes='100vw'
							delay={0}
							duration={2}
							reduce={reduce}>
							<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2B2622]/70 via-[#2B2622]/10 to-transparent' />
							<motion.div
								initial={reduce ? false : { opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
								className='absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12'>
								<p className='text-[11px] font-medium uppercase tracking-[0.3em] text-[#E6D5B8]'>
									{panorama.id} — {panorama.tag}
								</p>
								<h3 className='mt-3 max-w-2xl font-serif font-medium leading-snug text-white text-2xl sm:text-3xl lg:text-4xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[2px]'>
									{panorama.title}
								</h3>
								<span className='relative mt-4 inline-block text-[11px] font-medium uppercase tracking-[0.25em] text-white'>
									Read the Story
									<span className='absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100' />
								</span>
							</motion.div>
						</RevealImage>
					</a>

					{/* QUOTE PAIR */}
					<div className='lg:col-span-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12'>
						<a href='/blog' className='group block lg:col-span-5'>
							<RevealImage
								src={quote.img}
								alt={quote.title}
								aspect='aspect-[4/5]'
								sizes='(min-width:1024px) 38vw, 100vw'
								delay={0.1}
								duration={1.6}
								reduce={reduce}
							/>
						</a>
						<motion.div
							initial={reduce ? false : { opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
							className='lg:col-span-7'>
							<p className='text-[11px] font-medium uppercase tracking-[0.3em] text-[#A6633F]'>
								{quote.id} — {quote.tag}
							</p>
							<p className='mt-4 font-serif italic leading-snug text-[#2B2622] text-xl sm:text-2xl lg:text-3xl'>
								&ldquo;{quote.quote}&rdquo;
							</p>
							<p className='mt-5 text-sm leading-relaxed text-[#5A4F47]'>
								{quote.dek}
							</p>
							<a
								href='/blog'
								className='group/link relative mt-5 inline-block text-[11px] font-medium uppercase tracking-[0.25em] text-[#2B2622]'>
								{quote.title}
								<span className='absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-[#A6633F] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-x-100' />
							</a>
						</motion.div>
					</div>
				</div>

				{/* CTA */}
				<motion.div
					initial={reduce ? false : { opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
					className='mt-24 flex justify-center'>
					<MagneticLink href='/blog' reduce={reduce}>
						Browse the Full Journal
					</MagneticLink>
				</motion.div>
			</div>
		</section>
	);
}
