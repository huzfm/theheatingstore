'use client';

import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
	useReducedMotion,
} from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import HeroCTAs from '@/components/ui/HeroCTAs';
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

// ── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
	const ref = useRef(null);
	const reduce = useReducedMotion();
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
	const titleY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
	const cueOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

	return (
		<section
			ref={ref}
			style={{
				position: 'relative',
				minHeight: '100svh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				padding: '160px 6vw 120px',
				overflow: 'hidden',
			}}>
			{/* relevant background image, warm premium interior, masked to fade into the dark page */}
			<div
				aria-hidden
				style={{
  position: 'absolute',
  inset: 0,
  backgroundImage: "url('/images/p.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  filter: 'brightness(1.1) saturate(1.2) contrast(1.1)',
  pointerEvents: 'none',
}}
			/>
			{/* dark tint so the headline stays legible + fades into #0a0a0a */}
			<div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.35) 45%, #0a0a0a 100%)', pointerEvents: 'none' }} />
			{/* Heat glow */}
			<div
				aria-hidden
				style={{
					position: 'absolute',
					top: '-10%',
					left: '50%',
					transform: 'translateX(-50%)',
					width: 'min(1100px, 120vw)',
					height: '90vh',
					background: `radial-gradient(50% 50% at 50% 40%, ${HEAT_DEEP}44, transparent 70%)`,
					filter: 'blur(20px)',
					pointerEvents: 'none',
				}}
			/>

			<motion.div style={{ y: titleY, position: 'relative', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
					<span style={{ width: 7, height: 7, borderRadius: '50%', background: HEAT, boxShadow: `0 0 12px ${HEAT}` }} />
					<Eyebrow color={BONE_MUTE}>The Heating Store, Product Portfolio</Eyebrow>
				</motion.div>

				<h1
					style={{
						fontFamily: 'var(--font-heading)',
						fontSize: 'clamp(3.5rem, 5vw, 5rem)',
						lineHeight: 0.9,
						letterSpacing: '0.01em',
						color: BONE,
						margin: 0,
					}}>
					<motion.span
						style={{ display: 'block' }}
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}>
						Six World-Class
					</motion.span>
					<motion.span
						style={{
							display: 'block',
							background: `linear-gradient(100deg, ${HEAT}, ${HEAT_DEEP})`,
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}>
						Heating Brands.
					</motion.span>
				</h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
					style={{
						fontFamily: 'var(--font-body)',
						fontSize: 'clamp(15px, 2vw, 19px)',
						lineHeight: 1.7,
						color: BONE_MUTE,
						maxWidth: 620,
						marginTop: 32,
					}}>
					One uncompromising standard of installation. Explore the brands we trust to keep India warm, from decades of British engineering to radiant systems built to hold heat at −25°C.
				</motion.p>
			</motion.div>

			<motion.div
				style={{ opacity: cueOpacity, position: 'absolute', bottom: 40, left: '50%', translateX: '-50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
				<Eyebrow>Scroll</Eyebrow>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
					style={{ width: 1, height: 40, background: `linear-gradient(${BONE_FAINT}, transparent)` }}
				/>
			</motion.div>
		</section>
	);
}

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
							{/* Logo plate floating above the card */}
							<div
								style={{
									transform: 'translateZ(60px)',
									width: 'clamp(160px, 22vw, 240px)',
									height: 'clamp(160px, 22vw, 240px)',
									borderRadius: 22,
									background: '#ffffff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									padding: 26,
									boxShadow: '0 20px 60px rgba(169, 165, 165, 0.45)',
								}}>
								<img
									src={brand.img}
									alt={brand.name}
									style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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

			<ClosingCTA />
		</main>
	);
}
