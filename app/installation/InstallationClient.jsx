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
import Link from 'next/link';
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
const BONE_FAINT = '#8c857d';
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

			{/* ── HERO ── */}
			<section style={{ position: 'relative', padding: '160px 6vw 60px', overflow: 'hidden' }}>
				{/* relevant background image, underfloor heating install, masked to fade into the dark page */}
				<div
					aria-hidden
					style={{
						position: 'absolute',
						inset: 0,
						filter: 'brightness(0.60) saturate(1.2) contrast(1.1)',
						pointerEvents: 'none',
					}}
				>
					<Image
						src="/images/el.png"
						alt=""
						fill
						priority
						sizes="100vw"
						quality={78}
						style={{ objectFit: 'cover', objectPosition: 'center' }}
					/>
				</div>
				{/* lighter dark tint so headline stays legible + fades into #0a0a0a */}
				<div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.42) 0%, rgba(10,10,10,0.3) 45%, #0a0a0a 100%)', pointerEvents: 'none' }} />
				<div aria-hidden style={{ position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)', width: 'min(1000px, 120vw)', height: '70vh', background: `radial-gradient(50% 50% at 50% 40%, ${HEAT_DEEP}40, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
				<div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
					<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
						<span style={{ width: 7, height: 7, borderRadius: '50%', background: HEAT, boxShadow: `0 0 12px ${HEAT}` }} />
						<span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase', color: BONE_MUTE }}>Electric Hamam Installation</span>
					</motion.div>

					<motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.05 }} style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 0.9, color: BONE, margin: 0 }}>
						How We Install
						<br />
						<span style={{ background: `linear-gradient(100deg, ${HEAT}, ${HEAT_DEEP})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Electric Hamam Systems.</span>
					</motion.h1>

					<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.2 }} style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7, color: BONE_MUTE, maxWidth: 640, marginTop: 30 }}>
						Every stage is engineered to the highest installation standard, from subfloor preparation and insulation to cable laying, screed depth, and thermostat commissioning. Our layered method maximises thermal mass, delivering sustained warmth long after the system powers down. Built for reliability, backed by manufacturer warranties, completed by certified technicians on every project.
					</motion.p>
				</div>
			</section>

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
					<div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
						<Link href='/contact' className='inst-cta inst-cta--solid'><span>Book a free site visit</span><span className='inst-cta-arrow'>→</span></Link>
						<Link href='/product' className='inst-cta'><span>Explore brands</span></Link>
					</div>
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
