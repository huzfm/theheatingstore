'use client';

import {
	motion,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
	useReducedMotion,
} from 'framer-motion';
import Image from 'next/image';
import HeroCTAs from '@/components/ui/HeroCTAs';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { useRef } from 'react';

/* ══════════════════════════════════════════════════════════════════════════
   INSTALLATION, dark cinematic
   Near-black stage, heat-orange scroll-fill timeline, oversized Bebas Neue,
   cursor-tilt 3D step images. Global footer hidden on /installation.
   ══════════════════════════════════════════════════════════════════════════ */

const INK = '#0a0a0a';
const HEAT = '#ff8a3d';
const HEAT_DEEP = '#f2681c';
const BONE = '#f5f1ec';
const BONE_MUTE = '#cfc7bd';
const EASE = [0.16, 1, 0.3, 1];
const CARD_BG = 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))';
const CARD_BORDER = '1px solid rgba(255,255,255,0.1)';

const steps = [
	{
		title: 'Install Insulation',
		image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
		desc: 'Clean the subfloor thoroughly. Our expert will install high-density insulation boards across the entire surface, directing all generated heat upward into the living space, leading to quicker heat-up times and significant cost savings.',
		points: [
			'High-density boards eliminate downward heat loss',
			'Perimeter edge strip fitted for screed expansion',
		],
	},
	{
		title: 'Concrete Screed',
		image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
		desc: 'Once the insulation is in place, our expert will proceed to lay a concrete screed layer approximately 20–25mm thick. This layer ensures even distribution of heat from the underfloor heating system across the entire floor area.',
		points: [
			'Subfloor levelled and prepared to correct depth',
			'Screed compound tamped for full surface contact',
		],
	},
	{
		title: 'Install the System',
		image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
		desc: 'Our expert will install the underfloor heating system, tailored precisely to the room size and number of zones. Various quality checks are conducted throughout the installation process to ensure optimal performance and safety.',
		points: [
			'Cable fixed at precise spacing for uniform heat distribution',
			'Full resistance and continuity test completed before covering',
		],
	},
	{
		title: 'Final Layer',
		image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
		desc: 'Our expert will first install thermostat probes for precise temperature control. Following this, a final smooth layer of concrete, typically 25–30mm thick, is poured to provide an even surface for the final flooring and ensure heat is evenly spread across the floor.',
		points: [
			'Thermostat probes installed for precise temperature control',
			'Final concrete layer poured to 25–30mm depth',
		],
	},
	{
		title: 'Register Guarantee',
		image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
		desc: 'Finally, our expert will register the system, activating a 10-year worry-free guarantee. After this period, the system continues to be covered by a lifetime warranty, providing you with enduring support and complete peace of mind.',
		points: [
			'Full electrical safety validation and sensor placement verified',
			'Manufacturer warranty registered and handover certificate issued',
		],
	},
];

/* Hero copy, kept next to the hero that renders it. The headline is split in
   two so the second half can carry the heat gradient, and `headline` is the
   whole sentence, which is what the h1 exposes to assistive tech.

   The three figures are all restatements of what this page goes on to show:
   the stage count comes from `steps`, the retention window from the climate
   note below, the guarantee from the final stage. */
const HERO = {
	eyebrow: 'Electric Hamam Installation',
	headline: 'How we install electric hamam systems.',
	headlineLead: 'How We Install',
	headlineAccent: 'Electric Hamam Systems.',
	sub: 'Every stage is engineered to the highest installation standard, from subfloor preparation and insulation to cable laying, screed depth, and thermostat commissioning. Our layered method maximises thermal mass, delivering sustained warmth long after the system powers down.',
	facts: [
		{ value: String(steps.length), label: 'Stages on every install' },
		{ value: '6–8 hr', label: 'Warmth held through load-shedding' },
		{ value: '10 yr', label: 'Guarantee on registration' },
	],
};

/**
 * Set to match components/sections/About/AboutHero exactly: one centred column
 * over a darkened full-bleed backdrop, eyebrow chip → headline → hairline rule
 * → standfirst → CTAs → fact strip, with the same word-stagger reveals and the
 * same desktop-only scroll cue.
 *
 * It was previously a left-set column on this file's own inline type scale,
 * short of full height and with no CTAs. Everything below is the About
 * treatment (Tailwind + the shared Reveal primitives) rather than this file's
 * inline-style idiom, because matching it by hand in inline styles is exactly
 * how the two drifted apart in the first place. Same change on /product.
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
					backgroundImage: "url('/images/el.png')",
					filter: 'brightness(0.9) saturate(1.2) contrast(1.1)',
				}}
			/>
			{/* Legibility + mood. Symmetric horizontal ramp (darkest at both edges,
			    lifting at the middle) because the copy sits on the centre axis, plus
			    a vertical ramp that lands on ink so the section fades into the
			    timeline below rather than cutting off at a seam. */}
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

			{/* Seam glow into the timeline */}
			<div
				aria-hidden
				className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24'
				style={{ background: 'linear-gradient(180deg, transparent, rgba(10,10,10,1))' }}
			/>
		</section>
	);
}

// Step image with cursor-follow 3D tilt.
function TiltImage({ src, alt }) {
	const reduce = useReducedMotion();
	const mx = useMotionValue(0);
	const my = useMotionValue(0);
	const rotX = useSpring(my, { stiffness: 150, damping: 16 });
	const rotY = useSpring(mx, { stiffness: 150, damping: 16 });

	function move(e) {
		if (reduce) return;
		const r = e.currentTarget.getBoundingClientRect();
		mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
		my.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
	}
	function leave() {
		mx.set(0);
		my.set(0);
	}

	return (
		<div style={{ perspective: 1000 }}>
			<motion.div
				onMouseMove={move}
				onMouseLeave={leave}
				style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', willChange: 'transform' }}>
				<Image src={src} alt={alt} width={600} height={260} unoptimized style={{ height: 260, width: '100%', objectFit: 'cover', display: 'block' }} />
				<span aria-hidden style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.35))`, pointerEvents: 'none' }} />
			</motion.div>
		</div>
	);
}

export default function InstallationContent() {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.4'] });
	const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

	return (
		<main style={{ background: INK, color: BONE, position: 'relative', overflow: 'hidden' }}>
			{/* film grain */}
			<div aria-hidden style={{ position: 'fixed', inset: 0, backgroundImage: "url('/noise.png')", opacity: 0.03, mixBlendMode: 'overlay', pointerEvents: 'none', zIndex: 2 }} />

			<Hero />

			{/* ── TIMELINE ── */}
			<section ref={ref} style={{ position: 'relative', padding: '6vh 6vw 4vh' }}>
				<div style={{ position: 'relative', maxWidth: 940, margin: '0 auto' }}>
					{/* track */}
					<div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.12)' }} />
					{/* heat fill */}
					<motion.div style={{ height: lineHeight, position: 'absolute', left: 22, top: 0, width: 1, background: `linear-gradient(${HEAT}, ${HEAT_DEEP})`, boxShadow: `0 0 12px ${HEAT}88` }} />

					<div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 9vw, 112px)' }}>
						{steps.map((step, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 32 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-120px' }}
								transition={{ duration: 0.7, ease: EASE }}
								style={{ position: 'relative', display: 'flex', gap: 'clamp(20px, 4vw, 40px)', alignItems: 'flex-start' }}>
								{/* dot */}
								<div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
									<div style={{ display: 'flex', height: 46, width: 46, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: INK, border: `2px solid ${HEAT}`, boxShadow: `0 0 20px ${HEAT}55` }}>
										<span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, color: HEAT }}>{String(index + 1).padStart(2, '0')}</span>
									</div>
								</div>

								{/* card */}
								<div className='inst-card' style={{ flex: 1, borderRadius: 24, background: CARD_BG, border: CARD_BORDER, padding: 'clamp(20px, 3vw, 36px)' }}>
									<div className='inst-card-grid' style={{ display: 'grid', gap: 32, gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center' }}>
										<div>
											<h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', lineHeight: 0.95, color: BONE, margin: 0 }}>{step.title}</h3>
											<p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: BONE_MUTE, margin: '16px 0 0' }}>{step.desc}</p>
											<div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
												{step.points.map((p) => (
													<div key={p} style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-body)', fontSize: 14, color: BONE_MUTE, lineHeight: 1.5 }}>
														<span style={{ marginTop: 7, height: 7, width: 7, borderRadius: '50%', background: HEAT, flexShrink: 0, boxShadow: `0 0 8px ${HEAT}` }} />
														<span>{p}</span>
													</div>
												))}
											</div>
										</div>

										{/* image, desktop only */}
										<div className='inst-card-img'>
											<TiltImage src={step.image} alt={step.title} />
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── CLIMATE NOTE ── */}
			<section style={{ padding: '4vh 6vw' }}>
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, ease: EASE }}
					style={{ position: 'relative', maxWidth: 900, margin: '0 auto', borderRadius: 20, background: CARD_BG, border: `1px solid ${HEAT}33`, padding: 'clamp(28px, 4vw, 40px)' }}>
					<div style={{ position: 'absolute', top: -14, left: 28 }}>
						<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: HEAT, color: INK, padding: '6px 16px', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Kashmir Climate Note</span>
					</div>
					<p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)', color: BONE_MUTE, lineHeight: 1.75, margin: '10px 0 0' }}>
						Using insulation ensures heat retention for <span style={{ color: HEAT, fontWeight: 600 }}>6–8 hours</span> even during electricity cut-offs (load shedding), optimised for the Kashmir climate.
					</p>
				</motion.div>
			</section>

			{/* ── CLOSING CTA ── */}
			<section style={{ position: 'relative', padding: '14vh 6vw 18vh', textAlign: 'center', overflow: 'hidden' }}>
				<div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 60% at 50% 60%, ${HEAT_DEEP}33, transparent 70%)`, pointerEvents: 'none' }} />
				<motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: EASE }} style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
					<span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: HEAT }}>Ready to begin?</span>
					<h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.75rem, 8vw, 6rem)', lineHeight: 0.92, color: BONE, margin: '20px 0 24px' }}>
						Book your free
						<br />
						<span style={{ color: HEAT }}>site visit today.</span>
					</h2>
					<p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7, color: BONE_MUTE, maxWidth: 540, margin: '0 auto 40px' }}>
						Our certified engineers survey your space, recommend the right system, and handle every stage above, backed by our Kashmir installation warranty.
					</p>
					<HeroCTAs center />
				</motion.div>
			</section>

			<style>{`
				.inst-card { transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease; }
				.inst-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.2); box-shadow: 0 30px 70px rgba(0,0,0,0.45); }

				.inst-cta {
					display: inline-flex; align-items: center; gap: 10px;
					font-family: var(--font-body); font-size: 13px; font-weight: 600;
					letter-spacing: 0.14em; text-transform: uppercase;
					color: ${BONE}; text-decoration: none;
					padding: 15px 26px; border-radius: 999px;
					border: 1px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.04);
					transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
				}
				.inst-cta:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.45); transform: translateY(-2px); }
				.inst-cta--solid { color: ${INK}; background: ${HEAT}; border-color: ${HEAT}; }
				.inst-cta--solid:hover { background: #ffa25c; border-color: #ffa25c; }
				.inst-cta-arrow { transition: transform 0.3s ease; }
				.inst-cta:hover .inst-cta-arrow { transform: translateX(4px); }

				@media (max-width: 900px) {
					.inst-card-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
					.inst-card-img { display: none; }
				}
			`}</style>
		</main>
	);
}
