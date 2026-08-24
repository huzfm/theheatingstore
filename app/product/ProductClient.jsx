'use client';

import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
	useReducedMotion,
} from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { BRANDS } from '../lib/brandsData';

/* ══════════════════════════════════════════════════════════════════════════
   PRODUCTS, dark cinematic brands showcase
   Near-black stage, heat-orange glow, oversized Bebas Neue display type.
   Each brand is a full panel with a scroll-linked 3D card turn plus an
   interactive cursor-tilt. Self-contained: no shared light-theme sections.
   The global footer is hidden on /product via SiteChrome.
   ══════════════════════════════════════════════════════════════════════════ */

const INK = '#0a0a0a';
const HEAT = '#ff8a3d';
const HEAT_DEEP = '#f2681c';
const BONE = '#f5f1ec';
const BONE_MUTE = '#cfc7bd';
const BONE_FAINT = '#8c857d';
const EASE = [0.16, 1, 0.3, 1];

// ── Small eyebrow label ─────────────────────────────────────────────────────
function Eyebrow({ children, color = BONE_FAINT }) {
	return (
		<span
			style={{
				fontFamily: 'var(--font-body)',
				fontSize: 11,
				fontWeight: 600,
				letterSpacing: '0.32em',
				textTransform: 'uppercase',
				color,
			}}>
			{children}
		</span>
	);
}

/* Hero copy, kept next to the hero that renders it. The headline is split in
   two so the second half can carry the heat gradient, and `headline` is the
   whole sentence, which is what the h1 exposes to assistive tech.

   The three figures are derived from BRANDS rather than typed out, so the
   count and the earliest founding year cannot drift from the panels below. */
const HERO = {
	eyebrow: 'The Heating Store, Product Portfolio',
	headline: 'Six world-class heating brands.',
	headlineLead: 'Six World-Class',
	headlineAccent: 'Heating Brands.',
	sub: 'One uncompromising standard of installation. Explore the brands we trust to keep India warm, from decades of British engineering to radiant systems built to hold heat at −25°C.',
	facts: [
		{ value: String(BRANDS.length), label: 'Brands, one install standard' },
		{
			value: BRANDS.reduce((a, b) => (a.established < b.established ? a : b)).established,
			label: 'Oldest brand, engineering since',
		},
		{ value: 'Lifetime', label: 'Warranty on select systems' },
	],
};

// ── HERO ────────────────────────────────────────────────────────────────────
/**
 * Set to match components/sections/About/AboutHero exactly: one centred column
 * over a darkened full-bleed backdrop, eyebrow chip → headline → hairline rule
 * → standfirst → CTAs → fact strip, with the same word-stagger reveals and the
 * same desktop-only scroll cue.
 *
 * It was previously a left-set column on this page's own inline type scale,
 * whose headline floored at 3.5rem and so overflowed a phone. Everything below
 * is the About treatment (Tailwind + the shared Reveal primitives) rather than
 * this file's inline-style idiom, because matching it by hand in inline styles
 * is exactly how the two drifted apart in the first place.
 */
function Hero() {
	const reduce = useReducedMotion();

	return (
		<section className='relative isolate overflow-hidden bg-ink-950 text-bone-100'>
			{/* Full-bleed backdrop */}
			<div
				aria-hidden
				className='absolute inset-0 bg-cover bg-center'
				style={{
					backgroundImage: "url('/images/p.png')",
					filter: 'brightness(1.1) saturate(1.2) contrast(1.1)',
				}}
			/>
			{/* Legibility + mood. Symmetric horizontal ramp (darkest at both edges,
			    lifting at the middle) because the copy sits on the centre axis, plus
			    a vertical ramp that lands on solid ink so the section fades into the
			    brand panels below rather than cutting off at a seam. */}
			<div
				aria-hidden
				className='absolute inset-0'
				style={{
					background:
						'linear-gradient(90deg, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.52) 50%, rgba(10,10,10,0.78) 100%), linear-gradient(180deg, rgba(10,10,10,0.22), rgba(10,10,10,0.72))',
				}}
			/>
			{/* Ambient heat wash, slow breathing pulse, stilled under reduced motion */}
			<motion.div
				aria-hidden
				className='pointer-events-none absolute inset-0'
				animate={reduce ? undefined : { opacity: [0.5, 0.8, 0.5] }}
				transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
				style={{
					background:
						'radial-gradient(60vw 45vh at 50% 28%, rgba(255,138,61,0.16), transparent 62%), radial-gradient(70vw 35vh at 50% 100%, rgba(255,138,61,0.08), transparent 65%)',
				}}
			/>
			{/* Vignette */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0'
				style={{
					background:
						'radial-gradient(120% 85% at 50% 40%, transparent 52%, rgba(0,0,0,0.42) 100%)',
				}}
			/>

			{/* svh not vh: on mobile `100vh` is measured with the URL bar hidden, so
			    it overflows by the height of the bar. Each block keeps its own
			    measure and is centred on the axis rather than filling the container,
			    a centred headline running the full width is unreadable. */}
			<div className='relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-32 lg:pt-36'>
				<div className='mx-auto w-full max-w-4xl text-center'>
					<Reveal>
						<span className='inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-4 text-[10px] font-medium uppercase tracking-[0.24em] text-bone-300 backdrop-blur-sm sm:text-[11px] sm:tracking-[0.28em]'>
							<motion.span
								aria-hidden
								className='h-1.5 w-1.5 shrink-0 rounded-full'
								style={{
									background: HEAT,
									boxShadow: '0 0 10px 2px rgba(255,138,61,0.75)',
								}}
								animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
								transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
							/>
							{HERO.eyebrow}
						</span>
					</Reveal>

					{/* Inline font-size, not a text-* utility: globals.css sizes `h1`
					    outside any cascade layer (clamp(2.5rem, 6vw, 5rem)), and
					    unlayered rules beat Tailwind utilities, so a class here is
					    silently ignored. Same reason for lineHeight:'inherit' on the
					    two halves, `span { line-height: 1.75 }` is unlayered too and
					    would otherwise double-space every wrapped headline line. */}
					<h1
						aria-label={HERO.headline}
						className='mx-auto mt-5 max-w-[19ch] font-serif tracking-[0.005em] sm:mt-7'
						style={{ fontSize: 'clamp(1.95rem, 6.6vw, 4.5rem)', lineHeight: 1.03 }}>
						<RevealText
							as='span'
							aria-hidden
							className='block text-bone-100'
							style={{ lineHeight: 'inherit' }}>
							{HERO.headlineLead}
						</RevealText>
						<RevealText
							as='span'
							aria-hidden
							delay={0.18}
							className='block bg-gradient-to-br from-heat-300 via-heat-500 to-heat-500/55 bg-clip-text text-transparent'
							style={{ lineHeight: 'inherit' }}>
							{HERO.headlineAccent}
						</RevealText>
					</h1>

					{/* Short rule on the axis, separates headline from standfirst so the
					    paragraph doesn't read as the next thing down. */}
					<Reveal delay={0.12}>
						<span
							aria-hidden
							className='mx-auto mt-6 block h-px w-16 sm:mt-8 sm:w-20'
							style={{
								background:
									'linear-gradient(90deg, transparent, rgba(255,138,61,0.6), transparent)',
							}}
						/>
					</Reveal>

					<Reveal delay={0.15}>
						<p className='mx-auto mt-6 max-w-2xl text-[13.5px] leading-[1.7] text-bone-300 sm:mt-8 sm:text-lg sm:leading-relaxed'>
							{HERO.sub}
						</p>
					</Reveal>

					<Reveal delay={0.28}>
						<HeroCTAs center className='mt-8 sm:mt-11' />
					</Reveal>

					<Reveal delay={0.4}>
						<dl className='mx-auto mt-10 grid max-w-3xl grid-cols-3 border-t border-white/10 pt-7 sm:mt-14 sm:pt-8'>
							{HERO.facts.map((f, i) => (
								<div
									key={f.label}
									className={`px-2 sm:px-5 ${i > 0 ? 'border-l border-white/10' : ''}`}>
									<dt className='font-serif text-[clamp(1.15rem,4.6vw,1.5rem)] leading-none text-heat-400 sm:text-[clamp(1.6rem,2.6vw,2.1rem)]'>
										{f.value}
									</dt>
									<dd
										className='mx-auto mt-2.5 max-w-[20ch] text-[10.5px] leading-snug text-bone-500 sm:mt-3 sm:text-[13px] sm:leading-relaxed'
										style={{ hyphens: 'auto' }}>
										{f.label}
									</dd>
								</div>
							))}
						</dl>
					</Reveal>
				</div>
			</div>

			{/* Scroll cue. Desktop only: on a phone the fold already lands close
			    under the CTAs. */}
			<div className='pointer-events-none absolute inset-x-0 bottom-7 z-20 hidden justify-center lg:flex'>
				<motion.span
					aria-hidden
					className='flex h-9 w-[22px] items-start justify-center rounded-full border border-white/15 pt-2'
					animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
					transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
					<motion.span
						className='block h-1.5 w-[3px] rounded-full bg-heat-500'
						animate={reduce ? undefined : { y: [0, 9, 0] }}
						transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
					/>
				</motion.span>
			</div>

			{/* Seam glow into the first brand panel */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24'
				style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,1))' }}
			/>
		</section>
	);
}

// Optical size correction for individual marks. The shared contain box gives
// every logo the same bounding area, but a mark drawn with a lot of its own
// internal padding ends up reading smaller than its neighbours. Nudge those
// back up here rather than resizing the box, so the baseline down the page
// stays put.
// Warmup, ThermoSphere, Amber and nVent are cropped tight to their ink, so
// contain already sizes them right. FastWarm sits on a square canvas with its
// wordmark only ~65% wide and 13% tall, and ProWarm's ink covers half its
// canvas width, so both land far under the others. These factors bring their
// ink back to roughly the same optical width; the extra bounds they gain are
// transparent padding, and the card doesn't clip.
const LOGO_SCALE = {
	fastwarm: 2.2,
	prowarm: 1.8,
};

// ── One brand panel with scroll-linked 3D turn + cursor tilt ─────────────────
function BrandPanel({ brand, index }) {
	const ref = useRef(null);
	const reduce = useReducedMotion();
	const reversed = index % 2 === 1;

	// Scroll-linked: card turns from angled to face-on as the panel passes;
	// the giant wordmark and content drift at different depths (parallax).
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
	const cardTurn = useTransform(
		scrollYProgress,
		[0, 0.5, 1],
		reduce ? [0, 0, 0] : [reversed ? 32 : -32, 0, reversed ? -14 : 14]
	);
	const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [70, -70]);
	const wordX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [reversed ? 80 : -80, reversed ? -80 : 80]);
	const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.5, 0.05]);

	// Cursor tilt (interactive layer, composes on top of the scroll turn).
	const mx = useMotionValue(0);
	const my = useMotionValue(0);
	const tiltX = useSpring(my, { stiffness: 150, damping: 16 });
	const tiltY = useSpring(mx, { stiffness: 150, damping: 16 });

	function handleMove(e) {
		if (reduce) return;
		const r = e.currentTarget.getBoundingClientRect();
		mx.set(((e.clientX - r.left) / r.width - 0.5) * 20);
		my.set(-((e.clientY - r.top) / r.height - 0.5) * 20);
	}
	function handleLeave() {
		mx.set(0);
		my.set(0);
	}

	return (
		<section
			ref={ref}
			style={{
				position: 'relative',
				minHeight: '100svh',
				display: 'flex',
				alignItems: 'center',
				padding: '12vh 6vw',
				overflow: 'hidden',
			}}>
			{/* Per-brand heat glow */}
			<motion.div
				aria-hidden
				style={{
					opacity: glowOpacity,
					position: 'absolute',
					top: '50%',
					[reversed ? 'right' : 'left']: '-5%',
					transform: 'translateY(-50%)',
					width: 'min(760px, 80vw)',
					height: '80vh',
					background: `radial-gradient(50% 50% at 50% 50%, ${brand.accentColor || HEAT_DEEP}55, transparent 70%)`,
					filter: 'blur(30px)',
					pointerEvents: 'none',
				}}
			/>

			{/* Giant ghost wordmark */}
			<motion.span
				aria-hidden
				style={{
					x: wordX,
					position: 'absolute',
					[reversed ? 'left' : 'right']: '-2vw',
					top: '8%',
					fontFamily: 'var(--font-heading)',
					fontSize: 'clamp(6rem, 22vw, 22rem)',
					lineHeight: 0.8,
					color: 'transparent',
					WebkitTextStroke: `1px ${BONE_FAINT}22`,
					whiteSpace: 'nowrap',
					pointerEvents: 'none',
					userSelect: 'none',
				}}>
				{brand.name}
			</motion.span>

			<motion.div
				style={{ y: contentY }}
				className='pb-inner'
				data-reversed={reversed ? 'true' : 'false'}>
				{/* LEFT, 3D logo card */}
				<div style={{ perspective: 1400 }}>
					<motion.div style={{ rotateY: cardTurn }}>
						<motion.div
							onMouseMove={handleMove}
							onMouseLeave={handleLeave}
							initial={{ opacity: 0, scale: 0.92 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.8, ease: EASE }}
							style={{
								rotateX: tiltX,
								rotateY: tiltY,
								transformStyle: 'preserve-3d',
								transformPerspective: 900,
								position: 'relative',
								borderRadius: 28,
								padding: 'clamp(24px, 4vw, 44px)',
								background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
								border: '1px solid rgba(255,255,255,0.1)',
								boxShadow: `0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)`,
								willChange: 'transform',
							}}>
							{/* Logo, floating above the card on the glass itself.
							    This used to be a white square plate holding brand.img,
							    because that artwork is drawn on an opaque background
							    and would have vanished into the dark stage. The marks
							    in /public/productlogo are transparent, so the plate
							    goes and the logo sits directly on the panel.

							    The box is landscape and fixed, with objectFit contain:
							    the six marks range from square (ThermoSphere) to
							    roughly 3:1 (Warmup), and a box that fits each one's
							    own aspect would step around between panels. Contain
							    inside one box means every logo shares an optical size
							    and a baseline down the page. */}
							<div
								style={{
									position: 'relative',
									transform: 'translateZ(60px)',
									width: 'clamp(190px, 26vw, 280px)',
									height: 'clamp(104px, 14vw, 150px)',
									// The box is narrower than the card's content area,
									// so centre it rather than letting it hang left.
									margin: '0 auto',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								{/* Accent bloom behind the mark, so it reads as lit
								    rather than pasted onto the glass. */}
								<span
									aria-hidden
									style={{
										position: 'absolute',
										inset: '-18%',
										background: `radial-gradient(50% 50% at 50% 50%, ${brand.accentColor || HEAT}2e, transparent 70%)`,
										filter: 'blur(14px)',
										pointerEvents: 'none',
									}}
								/>
								<img
									src={brand.logo || brand.img}
									alt={brand.name}
									loading='lazy'
									style={{
										position: 'relative',
										width: '100%',
										height: '100%',
										objectFit: 'contain',
										transform: `scale(${LOGO_SCALE[brand.slug] || 1})`,
										filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55))',
									}}
								/>
							</div>
							<div style={{ transform: 'translateZ(30px)', marginTop: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
								<span
									style={{
										fontFamily: 'var(--font-body)',
										fontSize: 10,
										fontWeight: 700,
										letterSpacing: '0.22em',
										color: brand.accentColor || HEAT,
										border: `1px solid ${(brand.accentColor || HEAT)}66`,
										borderRadius: 999,
										padding: '5px 12px',
									}}>
									{brand.tag}
								</span>
								<span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: BONE_FAINT }}>
									{brand.origin} · est. {brand.established}
								</span>
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* RIGHT, copy */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
						<span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: BONE_FAINT }}>
							{String(index + 1).padStart(2, '0')}
						</span>
						<span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
						<Eyebrow color={brand.accentColor || HEAT}>{brand.warranty?.split('+')[0]?.trim()}</Eyebrow>
					</div>

					<h2
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(3rem, 8vw, 7rem)',
							lineHeight: 0.9,
							color: BONE,
							margin: '0 0 20px',
						}}>
						{brand.name}
					</h2>

					<p
						style={{
							fontFamily: 'var(--font-body)',
							fontSize: 'clamp(14px, 1.5vw, 16px)',
							lineHeight: 1.7,
							color: BONE_MUTE,
							maxWidth: 520,
							margin: '0 0 28px',
						}}>
						{brand.desc}
					</p>

					{/* Stats */}
					<div style={{ display: 'flex', gap: 'clamp(20px, 4vw, 44px)', marginBottom: 26, flexWrap: 'wrap' }}>
						{brand.stats.map((s) => (
							<div key={s.label}>
								<div
									style={{
										fontFamily: 'var(--font-heading)',
										fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
										lineHeight: 1,
										color: brand.accentColor || HEAT,
									}}>
									{s.val}
								</div>
								<div style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: BONE_FAINT, marginTop: 6 }}>
									{s.label}
								</div>
							</div>
						))}
					</div>

					{/* Certifications */}
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 34 }}>
						{brand.certifications.map((c) => (
							<span
								key={c}
								style={{
									fontFamily: 'var(--font-body)',
									fontSize: 11,
									fontWeight: 500,
									letterSpacing: '0.08em',
									color: BONE_MUTE,
									background: 'rgba(255,255,255,0.05)',
									border: '1px solid rgba(255,255,255,0.1)',
									borderRadius: 8,
									padding: '6px 12px',
								}}>
								{c}
							</span>
						))}
					</div>

					<Link href={`/brands/${brand.slug}`} className='pb-cta' aria-label={`Explore ${brand.name}`}>
						<span>Explore {brand.name}</span>
						<span className='pb-cta-arrow'>→</span>
					</Link>
				</motion.div>
			</motion.div>
		</section>
	);
}

// ── THERMOSTATS SECTION ──────────────────────────────────────────────────────
function ThermostatsSection() {
	const [thermostats, setThermostats] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('http://localhost:5050/api/thermostats')
			.then((r) => r.json())
			.then((data) => setThermostats(data.items || []))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, []);

	return (
		<section className='relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:py-36'>
			{/* Background wash */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-0'
				style={{
					background:
						'radial-gradient(70% 50% at 50% 20%, rgba(255,138,61,0.07), transparent 70%)',
				}}
			/>

			<div className='relative mx-auto max-w-6xl'>
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 0.8, ease: EASE }}
					className='mb-12 text-center sm:mb-16 lg:mb-20'>
					<Eyebrow>Thermostats & Controls</Eyebrow>
					<h2
						style={{
							fontFamily: 'var(--font-heading)',
							fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
							lineHeight: 0.95,
							color: BONE,
							margin: '14px 0 16px',
						}}>
						Choose Your<br className='hidden sm:block' />
						<span style={{ color: HEAT }}> Thermostat.</span>
					</h2>
					<p
						className='mx-auto max-w-xl'
						style={{
							fontFamily: 'var(--font-body)',
							fontSize: 'clamp(14px, 1.4vw, 17px)',
							lineHeight: 1.7,
							color: BONE_MUTE,
						}}>
						Every system ships with a free thermostat. Upgrade to a smarter controller for scheduling, app control, and precision.
					</p>
				</motion.div>

				{/* Cards grid — 1 col mobile · 2 col sm · 3 col lg */}
				<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
					{loading
						? [1, 2, 3].map((i) => (
								<div
									key={i}
									className='h-[360px] rounded-2xl border border-white/[0.06] bg-white/[0.04]'
								/>
							))
						: thermostats.map((t, i) => (
							<motion.div
								key={t.sku}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
								className={`thermo-card group relative flex flex-col overflow-hidden rounded-2xl border transition-[box-shadow,border-color] duration-300 ${
									t.isIncluded
										? 'border-[#ff8a3d44] bg-gradient-to-br from-[#ff8a3d22] to-white/[0.04]'
										: 'border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02]'
								} hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(0,0,0,0.55)] hover:border-[#ff8a3d88]`}>{
								/* Image */}
								<div className='relative aspect-square w-full bg-white/[0.03]'>
									<img
									src={t.imageUrl}
									alt={t.name}
									loading='lazy'
									className='absolute inset-0 h-full w-full object-contain p-[12%] drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105'
								/>
								{t.isIncluded && (
									<span className='absolute right-3.5 top-3.5 rounded-full bg-[#ff8a3d] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#0a0a0a]'>
										Free
									</span>
								)}
								</div>

								{/* Content */}
								<div className='flex flex-1 flex-col px-5 py-5 sm:px-6'>
									<h3
										style={{
											fontFamily: 'var(--font-heading)',
											lineHeight: 1.15,
											color: BONE,
										}}
										className='text-lg sm:text-xl'>
										{t.name}
									</h3>
									<p
										className='mt-2 flex-1 text-[13px] leading-relaxed sm:text-sm'
										style={{ color: BONE_FAINT }}>
										{t.description}
									</p>
									<div className='mt-4 border-t border-white/[0.08] pt-3'>
										<span
											style={{
												fontFamily: 'var(--font-heading)',
												lineHeight: 1,
												color: t.isIncluded ? HEAT : BONE,
											}}
											className='text-base sm:text-lg'>
											{t.priceLabel}
										</span>
									</div>
								</div>
							</motion.div>
						))}
				</div>
			</div>
		</section>
	);
}

// ── Closing CTA ──────────────────────────────────────────────────────────────
function ClosingCTA() {
	return (
		<section style={{ position: 'relative', padding: '18vh 6vw', textAlign: 'center', overflow: 'hidden' }}>
			<div
				aria-hidden
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(60% 60% at 50% 60%, ${HEAT_DEEP}33, transparent 70%)`,
					pointerEvents: 'none',
				}}
			/>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.8, ease: EASE }}
				style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}>
				<Eyebrow color={HEAT}>Not sure which fits?</Eyebrow>
				<h2
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(2.75rem, 8vw, 6rem)',
						lineHeight: 0.92,
						color: BONE,
						margin: '20px 0 24px',
					}}>
					Let our engineers
					<br />
					<span style={{ color: HEAT }}>specify it for you.</span>
				</h2>
				<p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7, color: BONE_MUTE, maxWidth: 560, margin: '0 auto 40px' }}>
					Every system is backed by our Kashmir installation warranty and fitted by factory-trained technicians. Tell us your space, we&apos;ll design the right system.
				</p>
				<HeroCTAs center />
			</motion.div>
		</section>
	);
}

export default function ProductClient() {
	return (
		<main style={{ background: INK, color: BONE, position: 'relative' }}>
			<style>{`
				.pb-inner {
					position: relative;
					z-index: 1;
					width: 100%;
					max-width: 1200px;
					margin: 0 auto;
					display: grid;
					grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
					gap: clamp(32px, 6vw, 88px);
					align-items: center;
				}
				.pb-inner[data-reversed='true'] { direction: rtl; }
				.pb-inner[data-reversed='true'] > * { direction: ltr; }

				.pb-cta {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					font-family: var(--font-body);
					font-size: 13px;
					font-weight: 600;
					letter-spacing: 0.14em;
					text-transform: uppercase;
					color: ${BONE};
					text-decoration: none;
					padding: 15px 26px;
					border-radius: 999px;
					border: 1px solid rgba(255,255,255,0.22);
					background: rgba(255,255,255,0.04);
					transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
				}
				.pb-cta:hover {
					background: rgba(255,255,255,0.1);
					border-color: rgba(255,255,255,0.45);
					transform: translateY(-2px);
				}
				.pb-cta--solid {
					color: ${INK};
					background: ${HEAT};
					border-color: ${HEAT};
				}
				.pb-cta--solid:hover {
					background: #ffa25c;
					border-color: #ffa25c;
				}
				.pb-cta-arrow { transition: transform 0.3s ease; }
				.pb-cta:hover .pb-cta-arrow { transform: translateX(4px); }

				@media (max-width: 900px) {
					.pb-inner { grid-template-columns: 1fr; gap: 40px; }
					.pb-inner[data-reversed='true'] { direction: ltr; }
				}

				.thermo-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
				.thermo-card:hover { box-shadow: 0 32px 100px rgba(0,0,0,0.55), 0 0 30px rgba(255,138,61,0.08); }
			`}</style>

			{/* subtle film grain over the whole page */}
			<div
				aria-hidden
				style={{
					position: 'fixed',
					inset: 0,
					backgroundImage: "url('/noise.png')",
					opacity: 0.03,
					mixBlendMode: 'overlay',
					pointerEvents: 'none',
					zIndex: 2,
				}}
			/>

			<Hero />

			{BRANDS.map((brand, i) => (
				<BrandPanel key={brand.slug} brand={brand} index={i} />
			))}

			<ThermostatsSection />

			<ClosingCTA />
		</main>
	);
}
