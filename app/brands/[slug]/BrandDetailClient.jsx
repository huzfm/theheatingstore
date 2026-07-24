'use client';

import {
	motion,
	useInView,
	useScroll,
	useTransform,
	useMotionValue,
	useSpring,
	useReducedMotion,
} from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
	Shield,
	Zap,
	Award,
	Thermometer,
	Package,
	MessageCircle,
	Globe,
	Droplet,
	Leaf,
	Snowflake,
	Flame,
	Cpu,
	TrendingDown,
	Check,
	ArrowLeft,
	ArrowRight,
	Phone,
} from 'lucide-react';
import BrandImage from '../../../components/BrandImage';

/* ══════════════════════════════════════════════════════════════════════════
   BRAND DETAIL — dark cinematic (matches /product)
   Near-black stage, per-brand accent glow, oversized Bebas Neue display type,
   scroll-linked 3D logo turn + cursor tilt. Global footer hidden on /brands.
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

// Map icon name strings (from data) -> lucide components
const ICON_MAP = {
	shield: Shield,
	zap: Zap,
	award: Award,
	thermometer: Thermometer,
	package: Package,
	'message-circle': MessageCircle,
	globe: Globe,
	droplet: Droplet,
	leaf: Leaf,
	snowflake: Snowflake,
	flame: Flame,
	cpu: Cpu,
	'trending-down': TrendingDown,
};

function Eyebrow({ children, color = BONE_FAINT }) {
	return (
		<span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color }}>
			{children}
		</span>
	);
}

function SectionTitle({ eyebrow, title, accent, brandAccent }) {
	return (
		<div style={{ marginBottom: 8 }}>
			<Eyebrow color={brandAccent || HEAT}>{eyebrow}</Eyebrow>
			<h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, color: BONE, margin: '14px 0 0' }}>
				{title} {accent && <span style={{ color: brandAccent || HEAT }}>{accent}</span>}
			</h2>
		</div>
	);
}

/* ─── Section 1 — Cinematic Hero ─────────────────────────── */
function HeroSection({ brand }) {
	const heroRef = useRef(null);
	const reduce = useReducedMotion();
	const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
	const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -100]);
	const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
	const cardTurn = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -22]);

	// cursor tilt on the logo plate
	const mx = useMotionValue(0);
	const my = useMotionValue(0);
	const tiltX = useSpring(my, { stiffness: 150, damping: 16 });
	const tiltY = useSpring(mx, { stiffness: 150, damping: 16 });
	function move(e) {
		if (reduce) return;
		const r = e.currentTarget.getBoundingClientRect();
		mx.set(((e.clientX - r.left) / r.width - 0.5) * 22);
		my.set(-((e.clientY - r.top) / r.height - 0.5) * 22);
	}
	function leave() {
		mx.set(0);
		my.set(0);
	}

	const accent = brand.accentColor || HEAT;

	return (
		<section
			ref={heroRef}
			style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '140px 6vw 120px', overflow: 'hidden' }}>
			{/* accent glow */}
			<div aria-hidden style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 'min(1000px, 120vw)', height: '80vh', background: `radial-gradient(50% 50% at 50% 40%, ${accent}44, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />

			{/* Breadcrumb */}
			<motion.nav
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: EASE }}
				style={{ position: 'absolute', top: 100, left: 32, zIndex: 5, fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: BONE_MUTE }}>
				<Link href='/' style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
				<span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
				<Link href='/product' style={{ color: 'inherit', textDecoration: 'none' }}>Brands</Link>
				<span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
				<span style={{ color: accent }}>{brand.name}</span>
			</motion.nav>

			<motion.div style={{ opacity, y: contentY, position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{/* 3D logo plate */}
				<div style={{ perspective: 1400, marginBottom: 34 }}>
					<motion.div style={{ rotateY: cardTurn }}>
						<motion.div
							onMouseMove={move}
							onMouseLeave={leave}
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
							style={{
								rotateX: tiltX,
								rotateY: tiltY,
								transformStyle: 'preserve-3d',
								transformPerspective: 900,
								width: 'clamp(150px, 20vw, 200px)',
								height: 'clamp(150px, 20vw, 200px)',
								borderRadius: 28,
								background: '#ffffff',
								boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 60px ${accent}33`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: 26,
								willChange: 'transform',
							}}>
							<img src={brand.img} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'translateZ(40px)' }} />
						</motion.div>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
					style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
					<span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', color: accent, border: `1px solid ${accent}66`, borderRadius: 999, padding: '5px 14px' }}>{brand.tag}</span>
					<Eyebrow>{brand.origin} · est. {brand.established}</Eyebrow>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
					style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.5rem, 11vw, 9rem)', lineHeight: 0.9, color: BONE, margin: 0 }}>
					{brand.name}
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
					style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.6vw, 15px)', fontWeight: 600, letterSpacing: '0.06em', color: accent, marginTop: 22 }}>
					{brand.warranty}
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
					style={{ marginTop: 32 }}>
					<Link href='/contact' className='bd-cta bd-cta--solid'>
						<span>Get a {brand.name} quote</span>
						<span className='bd-cta-arrow'>→</span>
					</Link>
				</motion.div>
			</motion.div>

			<motion.div style={{ opacity, position: 'absolute', bottom: 32, left: '50%', translateX: '-50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
				<Eyebrow>Scroll</Eyebrow>
				<motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} style={{ width: 1, height: 34, background: `linear-gradient(${accent}, transparent)` }} />
			</motion.div>
		</section>
	);
}

/* ─── Section 2 — Brand Story ────────────────────────────── */
function BrandStory({ brand }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.2 });
	const accent = brand.accentColor || HEAT;

	return (
		<section ref={ref} style={{ position: 'relative', padding: '14vh 6vw', overflow: 'hidden' }}>
			<div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 56, alignItems: 'start' }} className='bd-story-grid'>
				<motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
					<SectionTitle eyebrow='Brand Story' title='About' accent={brand.name} brandAccent={accent} />
					<div style={{ marginTop: 28 }}>
						{brand.longDesc.split('\n\n').map((para, i) => (
							<p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.85, color: BONE_MUTE, marginTop: i === 0 ? 0 : 18 }}>{para}</p>
						))}
					</div>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
					{/* Stats */}
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
						{brand.stats.map((s) => (
							<div key={s.label} style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 20, padding: '22px 12px', textAlign: 'center' }}>
								<p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3vw, 34px)', color: accent, margin: 0, lineHeight: 1 }}>{s.val}</p>
								<p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: BONE_FAINT, margin: '8px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</p>
							</div>
						))}
					</div>

					{/* Certifications + warranty */}
					<div style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 20, padding: 24 }}>
						<Eyebrow color={accent}>Certifications</Eyebrow>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
							{brand.certifications.map((c) => (
								<span key={c} style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: BONE_MUTE, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', padding: '6px 12px', borderRadius: 999 }}>{c}</span>
							))}
						</div>
						<div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
							<Eyebrow color={accent}>Warranty</Eyebrow>
							<p style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: BONE, margin: '10px 0 0', lineHeight: 1.2 }}>{brand.warranty}</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

/* ─── Section 3 — USP Cards ──────────────────────────────── */
function USPCards({ brand }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.2 });
	const accent = brand.accentColor || HEAT;

	return (
		<section ref={ref} style={{ padding: '14vh 6vw', position: 'relative' }}>
			<div style={{ maxWidth: 1240, margin: '0 auto' }}>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 56 }}>
					<Eyebrow color={accent}>Why Choose</Eyebrow>
					<h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, color: BONE, margin: '14px 0 0' }}>
						Why <span style={{ color: accent }}>{brand.name}?</span>
					</h2>
				</motion.div>

				<div className='bd-usp-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
					{brand.usps.map((u, i) => {
						const Icon = ICON_MAP[u.icon] || Shield;
						return (
							<motion.div
								key={u.title}
								initial={{ opacity: 0, y: 30 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
								className='bd-lift'
								style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 24, padding: '34px 24px', textAlign: 'center' }}>
								<div style={{ width: 58, height: 58, borderRadius: 16, background: `linear-gradient(135deg, ${accent}22, ${accent}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
									<Icon size={26} color={accent} strokeWidth={1.5} />
								</div>
								<h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: BONE, margin: '0 0 8px', lineHeight: 1 }}>{u.title}</h3>
								<p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: BONE_MUTE, lineHeight: 1.6, margin: 0 }}>{u.desc}</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

/* ─── Section 4 — Products Grid ──────────────────────────── */
function ProductsGrid({ brand }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.1 });
	const [activeFilter, setActiveFilter] = useState('all');
	const accent = brand.accentColor || HEAT;

	const filters = useMemo(() => {
		const set = new Set(['all']);
		brand.products.forEach((p) => {
			if (p.wattage.includes('100W')) set.add('low');
			else if (p.wattage.includes('150W') || p.wattage.includes('200W')) set.add('mid');
			else if (p.wattage.match(/[4-9]\d{2}W/) || p.wattage.match(/[1-9]\d{3}W/)) set.add('high');
		});
		return Array.from(set);
	}, [brand]);

	const filtered = useMemo(() => {
		if (activeFilter === 'all') return brand.products;
		if (activeFilter === 'low') return brand.products.filter((p) => p.wattage.includes('100W'));
		if (activeFilter === 'mid') return brand.products.filter((p) => p.wattage.includes('150W') || p.wattage.includes('200W'));
		if (activeFilter === 'high') return brand.products.filter((p) => /[4-9]\d{2}W|[1-9]\d{3}W/.test(p.wattage));
		return brand.products;
	}, [brand.products, activeFilter]);

	const filterLabel = (f) => {
		if (f === 'all') return 'All';
		if (f === 'low') return '≤150W';
		if (f === 'mid') return '150–200W';
		if (f === 'high') return '400W+';
		return f;
	};

	return (
		<section ref={ref} style={{ padding: '14vh 6vw', position: 'relative' }}>
			<div style={{ maxWidth: 1320, margin: '0 auto' }}>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 24 }}>
					<Eyebrow color={accent}>Products</Eyebrow>
					<h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, color: BONE, margin: '14px 0 16px' }}>
						Products by <span style={{ color: accent }}>{brand.name}</span>
					</h2>
					<p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: BONE_MUTE, margin: 0 }}>Installed across Kashmir, Ladakh &amp; across India</p>
				</motion.div>

				{/* Filter tabs */}
				<div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, margin: '40px 0 48px' }}>
					{filters.map((f) => {
						const on = activeFilter === f;
						return (
							<button
								key={f}
								onClick={() => setActiveFilter(f)}
								style={{
									fontFamily: 'var(--font-body)',
									fontSize: 12,
									fontWeight: 600,
									letterSpacing: '0.08em',
									textTransform: 'uppercase',
									padding: '10px 22px',
									borderRadius: 999,
									border: on ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.18)',
									background: on ? accent : 'rgba(255,255,255,0.04)',
									color: on ? INK : BONE_MUTE,
									cursor: 'pointer',
									transition: 'all 0.25s ease',
								}}>
								{filterLabel(f)}
							</button>
						);
					})}
				</div>

				{/* Products grid */}
				<div className='bd-products-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
					{filtered.map((p, i) => (
						<motion.div
							key={p.id}
							initial={{ opacity: 0, y: 24 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.55, ease: EASE, delay: Math.min(i * 0.08, 0.4) }}
							className='bd-lift'
							style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
							{/* Image */}
							<div style={{ position: 'relative', background: 'rgba(0,0,0,0.25)' }}>
								<BrandImage src={p.image} alt={p.name} accentColor={accent} fallbackText={p.name} height={180} rounded={0} style={{ borderRadius: 0 }} />
								{p.badge && (
									<span style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 999, background: accent, color: INK, fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', boxShadow: `0 4px 12px ${accent}66` }}>{p.badge}</span>
								)}
							</div>

							{/* Body */}
							<div style={{ padding: '20px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
								<h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 21, color: BONE, lineHeight: 1.05, margin: '0 0 6px' }}>{p.name}</h3>
								<p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: BONE_FAINT, margin: '0 0 14px', lineHeight: 1.4 }}>{p.subtitle}</p>

								<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
									{p.wattage !== '—' && (
										<span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: accent, padding: '4px 10px', borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}14` }}>{p.wattage}</span>
									)}
									{p.coverage !== '—' && (
										<span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: accent, padding: '4px 10px', borderRadius: 999, border: `1px solid ${accent}55`, background: `${accent}14` }}>{p.coverage}</span>
									)}
								</div>

								<p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: accent, margin: '0 0 14px' }}>{p.priceRange}</p>

								<ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px' }}>
									{p.features.map((f) => (
										<li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-body)', fontSize: 12.5, color: BONE_MUTE, lineHeight: 1.5, marginTop: 6 }}>
											<Check size={14} strokeWidth={2.5} color={accent} style={{ marginTop: 3, flexShrink: 0 }} />
											<span>{f}</span>
										</li>
									))}
								</ul>

								<div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
									<Link href='/contact' style={{ flex: 1, textAlign: 'center', padding: '11px 12px', borderRadius: 10, background: accent, color: INK, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none' }}>Get Quote</Link>
									<Link href='/contact' style={{ flex: 1, textAlign: 'center', padding: '11px 12px', borderRadius: 10, background: 'transparent', color: BONE_MUTE, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>Learn More</Link>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Section 5 — Trust Strip ────────────────────────────── */
function TrustStrip() {
	const items = [
		{ icon: Shield, label: 'Certified Installation' },
		{ icon: Snowflake, label: 'Kashmir Specialists' },
		{ icon: MessageCircle, label: 'WhatsApp Support' },
	];
	return (
		<section style={{ position: 'relative', padding: '12vh 6vw', overflow: 'hidden' }}>
			<div aria-hidden style={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 100% at 50% 50%, ${HEAT_DEEP}33, transparent 70%)`, pointerEvents: 'none' }} />
			<div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 40, alignItems: 'center' }} className='bd-trust-grid'>
				<div>
					<h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 0.95, color: BONE, margin: '0 0 14px' }}>
						Installed by The Heating Store — <span style={{ color: HEAT }}>Certified Experts Since 2011</span>
					</h2>
					<p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: BONE_MUTE, margin: 0, lineHeight: 1.7 }}>Every system we sell is installed by factory-trained engineers with direct manufacturer support.</p>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }} className='bd-trust-cta-wrap'>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 22 }}>
						{items.map((it) => (
							<div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: BONE, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500 }}>
								<it.icon size={18} strokeWidth={1.6} color={HEAT} />
								{it.label}
							</div>
						))}
					</div>
					<Link href='/contact' className='bd-cta bd-cta--solid'>
						<Phone size={16} strokeWidth={2} />
						<span>Book a free site visit</span>
						<ArrowRight size={16} strokeWidth={2} />
					</Link>
				</div>
			</div>
		</section>
	);
}

/* ─── Section 6 — Related Brands ─────────────────────────── */
function RelatedBrands({ related }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.2 });

	return (
		<section ref={ref} style={{ padding: '14vh 6vw 18vh' }}>
			<div style={{ maxWidth: 1240, margin: '0 auto' }}>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE }} style={{ textAlign: 'center', marginBottom: 48 }}>
					<Eyebrow color={HEAT}>Explore</Eyebrow>
					<h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.92, color: BONE, margin: '14px 0 0' }}>
						Explore Other <span style={{ color: HEAT }}>Brands</span>
					</h2>
				</motion.div>

				<div className='bd-related-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
					{related.map((b, i) => (
						<motion.div key={b.slug} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}>
							<Link href={`/brands/${b.slug}`} className='bd-lift' style={{ display: 'block', background: CARD_BG, border: CARD_BORDER, borderRadius: 24, padding: '34px 24px', textAlign: 'center', textDecoration: 'none' }}>
								<div style={{ width: 100, height: 100, borderRadius: 20, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 12, margin: '0 auto 18px' }}>
									<img src={b.img} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
								</div>
								<p style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: BONE, margin: '0 0 6px', lineHeight: 1 }}>{b.name}</p>
								<p style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, letterSpacing: '0.25em', textTransform: 'uppercase', color: b.accentColor || HEAT, margin: 0, fontWeight: 700 }}>{b.tag}</p>
							</Link>
						</motion.div>
					))}
				</div>

				<div style={{ textAlign: 'center', marginTop: 48 }}>
					<Link href='/product' className='bd-cta'>
						<ArrowLeft size={15} strokeWidth={2} />
						<span>All brands</span>
					</Link>
				</div>
			</div>
		</section>
	);
}

/* ─── Sticky Mobile Bottom CTA ───────────────────────────── */
function MobileBottomCTA({ brand }) {
	const accent = brand.accentColor || HEAT;
	return (
		<div className='bd-mobile-cta' style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '12px 16px', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', gap: 8, alignItems: 'center' }}>
			<Link href='/contact' style={{ flex: 1, textAlign: 'center', padding: '12px 16px', borderRadius: 12, background: accent, color: INK, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none' }}>Get {brand.name} Quote — Free</Link>
			<Link href='/contact' aria-label='Call' style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.08)', color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
				<Phone size={18} strokeWidth={2} />
			</Link>
		</div>
	);
}

/* ─── Master component ──────────────────────────────────── */
export default function BrandDetailClient({ brand, related }) {
	return (
		<main style={{ background: INK, color: BONE, position: 'relative', overflow: 'hidden' }}>
			<style>{`
				.bd-cta {
					display: inline-flex; align-items: center; gap: 10px;
					font-family: var(--font-body); font-size: 13px; font-weight: 600;
					letter-spacing: 0.14em; text-transform: uppercase;
					color: ${BONE}; text-decoration: none;
					padding: 15px 26px; border-radius: 999px;
					border: 1px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.04);
					transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
				}
				.bd-cta:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.45); transform: translateY(-2px); }
				.bd-cta--solid { color: ${INK}; background: ${HEAT}; border-color: ${HEAT}; }
				.bd-cta--solid:hover { background: #ffa25c; border-color: #ffa25c; }
				.bd-cta-arrow { transition: transform 0.3s ease; }
				.bd-cta:hover .bd-cta-arrow { transform: translateX(4px); }

				.bd-lift { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
				.bd-lift:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.24); box-shadow: 0 30px 70px rgba(0,0,0,0.5); }

				/* film grain */
				.bd-grain { position: fixed; inset: 0; background-image: url('/noise.png'); opacity: 0.03; mix-blend-mode: overlay; pointer-events: none; z-index: 2; }

				@media (max-width: 1024px) {
					.bd-story-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
					.bd-usp-grid { grid-template-columns: repeat(2, 1fr) !important; }
					.bd-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
					.bd-trust-grid { grid-template-columns: 1fr !important; gap: 28px !important; text-align: center; }
					.bd-trust-cta-wrap { align-items: center !important; }
				}
				@media (max-width: 640px) {
					.bd-usp-grid { grid-template-columns: 1fr !important; }
					.bd-products-grid { grid-template-columns: 1fr !important; }
					.bd-related-grid { grid-template-columns: 1fr !important; }
					.bd-mobile-cta { display: flex !important; }
				}
				@media (min-width: 641px) {
					.bd-mobile-cta { display: none !important; }
				}
			`}</style>

			<div aria-hidden className='bd-grain' />

			<HeroSection brand={brand} />
			<BrandStory brand={brand} />
			<USPCards brand={brand} />
			<ProductsGrid brand={brand} />
			<TrustStrip />
			<RelatedBrands related={related} />
			<MobileBottomCTA brand={brand} />
		</main>
	);
}
