'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
	Star,
	Phone,
	Sparkles,
} from 'lucide-react';
import BrandImage from '../../../components/BrandImage';

const EASE = [0.16, 1, 0.3, 1];

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

/* ─── Section 1 — Cinematic Hero ─────────────────────────── */
function HeroSection({ brand }) {
	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
	const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

	return (
		<section
			ref={heroRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				minHeight: 640,
				overflow: 'hidden',
				background: '#1a0e08',
			}}
		>
			{/* Parallax background */}
			<motion.div
				style={{
					position: 'absolute',
					inset: '-10% 0 -30% 0',
					y: bgY,
					backgroundImage: `url(${brand.heroImage})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					filter: 'blur(2px) saturate(0.85)',
				}}
			/>
			{/* Dark warm overlay */}
			<div
				aria-hidden
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(180deg, rgba(30,15,8,0.85) 0%, rgba(45,22,12,0.7) 50%, rgba(60,30,15,0.4) 100%)',
				}}
			/>
			{/* Subtle grain */}
			<div
				aria-hidden
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'url(/noise.png)',
					opacity: 0.04,
					mixBlendMode: 'overlay',
				}}
			/>

			{/* Breadcrumb */}
			<motion.nav
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: EASE }}
				style={{
					position: 'absolute',
					top: 28,
					left: 32,
					zIndex: 5,
					fontFamily: "'DM Sans', sans-serif",
					fontSize: 12,
					letterSpacing: '0.18em',
					textTransform: 'uppercase',
					color: 'rgba(255,255,255,0.85)',
				}}
			>
				<Link href='/' style={{ color: 'inherit', textDecoration: 'none' }}>
					Home
				</Link>
				<span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
				<Link href='/#brands' style={{ color: 'inherit', textDecoration: 'none' }}>
					Brands
				</Link>
				<span style={{ margin: '0 8px', opacity: 0.5 }}>/</span>
				<span style={{ color: '#E8933A' }}>{brand.name}</span>
			</motion.nav>

			{/* Centered content */}
			<motion.div
				style={{
					position: 'relative',
					zIndex: 4,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					textAlign: 'center',
					padding: '0 24px',
					opacity,
				}}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
					style={{
						width: 180,
						height: 180,
						borderRadius: 28,
						background: 'rgba(255,255,255,0.95)',
						backdropFilter: 'blur(20px)',
						border: '1px solid rgba(255,255,255,0.5)',
						boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.6)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: 24,
						marginBottom: 28,
					}}
				>
					<img
						src={brand.img}
						alt={brand.name}
						style={{ width: '100%', height: '100%', objectFit: 'contain' }}
					/>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
					style={{
						fontFamily: "'Cormorant Garamond', Georgia, serif",
						fontSize: 'clamp(40px, 7vw, 72px)',
						fontWeight: 600,
						color: '#fff',
						lineHeight: 1.05,
						letterSpacing: '-0.01em',
						margin: 0,
						maxWidth: 900,
					}}
				>
					{brand.name}
				</motion.h1>

				

			
			</motion.div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 1 }}
				style={{
					position: 'absolute',
					bottom: 28,
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 4,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 8,
				}}
			>
				<span
					style={{
						fontFamily: "'DM Sans', sans-serif",
						fontSize: 10,
						letterSpacing: '0.3em',
						textTransform: 'uppercase',
						color: 'rgba(255,255,255,0.7)',
					}}
				>
					Scroll
				</span>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
					style={{
						width: 2,
						height: 28,
						borderRadius: 2,
						background:
							'linear-gradient(180deg, rgba(232,147,58,0.9), rgba(232,147,58,0.1))',
					}}
				/>
			</motion.div>
		</section>
	);
}

/* ─── Section 2 — Brand Story (Split Layout) ─────────────── */
function BrandStory({ brand }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.2 });

	return (
		<section
			ref={ref}
			style={{
				position: 'relative',
				padding: '100px 24px',
				background:
					'linear-gradient(180deg, #f5e1cb 0%, #f4e7db 100%)',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'url(/noise.png)',
					opacity: 0.02,
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					maxWidth: 1240,
					margin: '0 auto',
					display: 'grid',
					gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
					gap: 56,
					alignItems: 'start',
				}}
				className='bd-story-grid'
			>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8, ease: EASE }}
				>
					<p
						style={{
							display: 'inline-block',
							margin: 0,
							marginBottom: 16,
							padding: '6px 16px',
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 10,
							fontWeight: 500,
							letterSpacing: '0.3em',
							textTransform: 'uppercase',
							color: '#B86B45',
							background: 'rgba(184,107,69,0.1)',
							borderRadius: 999,
						}}
					>
						Brand Story
					</p>
					<h2
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(32px, 4vw, 52px)',
							fontWeight: 600,
							color: '#3C2A25',
							lineHeight: 1.15,
							letterSpacing: '-0.01em',
							margin: 0,
							marginBottom: 24,
						}}
					>
						About{' '}
						<span style={{ fontWeight: 300, color: '#B86B45' }}>{brand.name}</span>
					</h2>
					{brand.longDesc.split('\n\n').map((para, i) => (
						<p
							key={i}
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: 16,
								lineHeight: 1.85,
								color: '#3C2B27',
								marginTop: i === 0 ? 0 : 18,
							}}
						>
							{para}
						</p>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
					style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
				>
					{/* Stats grid */}
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: 12,
						}}
					>
						{brand.stats.map((s) => (
							<div
								key={s.label}
								style={{
									background: 'rgba(255,255,255,0.68)',
									backdropFilter: 'blur(28px)',
									WebkitBackdropFilter: 'blur(28px)',
									border: '1px solid rgba(255,255,255,0.5)',
									borderRadius: 20,
									padding: '20px 12px',
									textAlign: 'center',
									boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
								}}
							>
								<p
									style={{
										fontFamily: "'Cormorant Garamond', Georgia, serif",
										fontSize: 'clamp(22px, 3vw, 30px)',
										fontWeight: 600,
										color: brand.accentColor,
										margin: 0,
									}}
								>
									{s.val}
								</p>
								<p
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 11,
										color: '#6B4A2D',
										margin: 0,
										marginTop: 4,
										letterSpacing: '0.05em',
									}}
								>
									{s.label}
								</p>
							</div>
						))}
					</div>

					{/* Certifications */}
					<div
						style={{
							background: 'rgba(255,255,255,0.68)',
							backdropFilter: 'blur(28px)',
							WebkitBackdropFilter: 'blur(28px)',
							border: '1px solid rgba(255,255,255,0.5)',
							borderRadius: 20,
							padding: '22px 22px',
							boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
						}}
					>
						<p
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: 10.5,
								fontWeight: 600,
								letterSpacing: '0.2em',
								textTransform: 'uppercase',
								color: '#B86B45',
								margin: 0,
								marginBottom: 14,
							}}
						>
							Certifications
						</p>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
							{brand.certifications.map((c) => (
								<span
									key={c}
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 12,
										fontWeight: 500,
										color: '#3C2A25',
										background: 'rgba(232,147,58,0.12)',
										border: '1px solid rgba(232,147,58,0.3)',
										padding: '6px 12px',
										borderRadius: 999,
									}}
								>
									{c}
								</span>
							))}
						</div>
						<div
							style={{
								marginTop: 18,
								paddingTop: 18,
								borderTop: '1px solid rgba(184,107,69,0.15)',
							}}
						>
							<p
								style={{
									fontFamily: "'DM Sans', sans-serif",
									fontSize: 10.5,
									fontWeight: 600,
									letterSpacing: '0.2em',
									textTransform: 'uppercase',
									color: '#B86B45',
									margin: 0,
									marginBottom: 8,
								}}
							>
								Warranty
							</p>
							<p
								style={{
									fontFamily: "'Cormorant Garamond', Georgia, serif",
									fontSize: 18,
									fontWeight: 600,
									color: '#3C2A25',
									margin: 0,
									lineHeight: 1.3,
								}}
							>
								{brand.warranty}
							</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

/* ─── Section 3 — USP Cards (Why Choose) ────────────────── */
function USPCards({ brand }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.2 });

	return (
		<section
			ref={ref}
			style={{
				padding: '100px 24px',
				background:
					'linear-gradient(180deg, #f4e7db 0%, #fff 100%)',
				position: 'relative',
			}}
		>
			<div
				style={{
					maxWidth: 1240,
					margin: '0 auto',
				}}
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.7, ease: EASE }}
					style={{ textAlign: 'center', marginBottom: 56 }}
				>
					<p
						style={{
							display: 'inline-block',
							margin: 0,
							marginBottom: 16,
							padding: '6px 16px',
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 10,
							fontWeight: 500,
							letterSpacing: '0.3em',
							textTransform: 'uppercase',
							color: '#B86B45',
							background: 'rgba(184,107,69,0.1)',
							borderRadius: 999,
						}}
					>
						Why Choose
					</p>
					<h2
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(32px, 4vw, 52px)',
							fontWeight: 600,
							color: '#3C2A25',
							lineHeight: 1.15,
							letterSpacing: '-0.01em',
							margin: 0,
						}}
					>
						Why Choose{' '}
						<span style={{ fontWeight: 300, color: '#B86B45' }}>{brand.name}?</span>
					</h2>
				</motion.div>

				<div
					className='bd-usp-grid'
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(4, 1fr)',
						gap: 20,
					}}
				>
					{brand.usps.map((u, i) => {
						const Icon = ICON_MAP[u.icon] || Shield;
						return (
							<motion.div
								key={u.title}
								initial={{ opacity: 0, y: 30 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
								style={{
									background: 'rgba(255,255,255,0.68)',
									backdropFilter: 'blur(28px)',
									WebkitBackdropFilter: 'blur(28px)',
									border: '1px solid rgba(255,255,255,0.5)',
									borderRadius: 24,
									padding: '32px 24px',
									boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
									textAlign: 'center',
									transition: 'all 0.3s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-6px)';
									e.currentTarget.style.boxShadow =
										'0 20px 60px rgba(60,42,37,0.12), 0 4px 16px rgba(60,42,37,0.07)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow =
										'0 8px 32px rgba(60,42,37,0.07)';
								}}
							>
								<div
									style={{
										width: 56,
										height: 56,
										borderRadius: 16,
										background: `linear-gradient(135deg, ${brand.accentColor}22, ${brand.accentColor}44)`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										margin: '0 auto 18px',
									}}
								>
									<Icon size={26} color={brand.accentColor} strokeWidth={1.5} />
								</div>
								<h3
									style={{
										fontFamily: "'Cormorant Garamond', Georgia, serif",
										fontSize: 20,
										fontWeight: 600,
										color: '#3C2A25',
										margin: 0,
										marginBottom: 8,
									}}
								>
									{u.title}
								</h3>
								<p
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 13.5,
										color: '#3C2B27',
										lineHeight: 1.6,
										margin: 0,
									}}
								>
									{u.desc}
								</p>
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

	const filters = useMemo(() => {
		const set = new Set(['all']);
		brand.products.forEach((p) => {
			// Derive a coarse filter from wattage
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
		<section
			ref={ref}
			style={{
				padding: '100px 24px',
				background:
					'linear-gradient(180deg, #fff 0%, #f5e1cb 60%, #f4e7db 100%)',
				position: 'relative',
			}}
		>
			<div style={{ maxWidth: 1320, margin: '0 auto' }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.7, ease: EASE }}
					style={{ textAlign: 'center', marginBottom: 24 }}
				>
					<p
						style={{
							display: 'inline-block',
							margin: 0,
							marginBottom: 16,
							padding: '6px 16px',
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 10,
							fontWeight: 500,
							letterSpacing: '0.3em',
							textTransform: 'uppercase',
							color: '#B86B45',
							background: 'rgba(184,107,69,0.1)',
							borderRadius: 999,
						}}
					>
						Products
					</p>
					<h2
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(32px, 4vw, 52px)',
							fontWeight: 600,
							color: '#3C2A25',
							lineHeight: 1.15,
							margin: 0,
						}}
					>
						Products by{' '}
						<span style={{ fontWeight: 300, color: '#B86B45' }}>{brand.name}</span>
					</h2>
					<p
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 15,
							color: '#3C2B27',
							margin: 0,
							marginTop: 16,
						}}
					>
						Installed across Kashmir, Ladakh &amp; across India
					</p>
				</motion.div>

				{/* Filter tabs */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexWrap: 'wrap',
						gap: 8,
						margin: '40px 0 48px',
					}}
				>
					{filters.map((f) => (
						<button
							key={f}
							onClick={() => setActiveFilter(f)}
							style={{
								fontFamily: "'DM Sans', sans-serif",
								fontSize: 12,
								fontWeight: 500,
								letterSpacing: '0.05em',
								padding: '10px 22px',
								borderRadius: 999,
								border:
									activeFilter === f
										? `1px solid ${brand.accentColor}`
										: '1px solid rgba(184,107,69,0.2)',
								background:
									activeFilter === f
										? brand.accentColor
										: 'rgba(255,255,255,0.7)',
								color: activeFilter === f ? '#fff' : '#3C2A25',
								cursor: 'pointer',
								transition: 'all 0.25s ease',
								textTransform: 'capitalize',
							}}
						>
							{filterLabel(f)}
						</button>
					))}
				</div>

				{/* Products grid */}
				<div
					className='bd-products-grid'
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(4, 1fr)',
						gap: 20,
					}}
				>
					{filtered.map((p, i) => (
						<motion.div
							key={p.id}
							initial={{ opacity: 0, y: 24 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.55, ease: EASE, delay: Math.min(i * 0.08, 0.4) }}
							style={{
								background: '#fff',
								border: '1px solid rgba(184,107,69,0.12)',
								borderRadius: 16,
								overflow: 'hidden',
								boxShadow: '0 4px 18px rgba(60,42,37,0.05)',
								transition: 'all 0.3s ease',
								position: 'relative',
								display: 'flex',
								flexDirection: 'column',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-6px)';
								e.currentTarget.style.boxShadow =
									'0 20px 60px rgba(60,42,37,0.16), 0 4px 16px rgba(60,42,37,0.08)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow =
									'0 4px 18px rgba(60,42,37,0.05)';
							}}
						>
							{/* Image */}
							<div style={{ position: 'relative' }}>
								<BrandImage
									src={p.image}
									alt={p.name}
									accentColor={brand.accentColor}
									fallbackText={p.name}
									height={180}
									rounded={0}
									style={{ borderRadius: 0 }}
								/>
								{p.badge && (
									<span
										style={{
											position: 'absolute',
											top: 12,
											right: 12,
											padding: '4px 12px',
											borderRadius: 999,
											background: brand.accentColor,
											color: '#fff',
											fontFamily: "'DM Sans', sans-serif",
											fontSize: 9.5,
											fontWeight: 700,
											letterSpacing: '0.18em',
											textTransform: 'uppercase',
											boxShadow: '0 4px 12px rgba(232,147,58,0.4)',
										}}
									>
										{p.badge}
									</span>
								)}
							</div>

							{/* Body */}
							<div style={{ padding: '20px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
								<h3
									style={{
										fontFamily: "'Cormorant Garamond', Georgia, serif",
										fontSize: 20,
										fontWeight: 600,
										color: '#3C2A25',
										lineHeight: 1.2,
										margin: 0,
										marginBottom: 4,
									}}
								>
									{p.name}
								</h3>
								<p
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 13,
										color: '#6B4A2D',
										margin: 0,
										marginBottom: 14,
										lineHeight: 1.4,
									}}
								>
									{p.subtitle}
								</p>

								{/* Wattage + coverage chips */}
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
									{p.wattage !== '—' && (
										<span
											style={{
												fontFamily: "'DM Sans', sans-serif",
												fontSize: 11,
												fontWeight: 500,
												color: brand.accentColor,
												padding: '4px 10px',
												borderRadius: 999,
												border: `1px solid ${brand.accentColor}55`,
												background: `${brand.accentColor}11`,
											}}
										>
											{p.wattage}
										</span>
									)}
									{p.coverage !== '—' && (
										<span
											style={{
												fontFamily: "'DM Sans', sans-serif",
												fontSize: 11,
												fontWeight: 500,
												color: brand.accentColor,
												padding: '4px 10px',
												borderRadius: 999,
												border: `1px solid ${brand.accentColor}55`,
												background: `${brand.accentColor}11`,
											}}
										>
											{p.coverage}
										</span>
									)}
								</div>

								{/* Price */}
								<p
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 16,
										fontWeight: 700,
										color: brand.accentColor,
										margin: 0,
										marginBottom: 14,
									}}
								>
									{p.priceRange}
								</p>

								{/* Features */}
								<ul
									style={{
										listStyle: 'none',
										padding: 0,
										margin: 0,
										marginBottom: 18,
									}}
								>
									{p.features.map((f) => (
										<li
											key={f}
											style={{
												display: 'flex',
												alignItems: 'flex-start',
												gap: 8,
												fontFamily: "'DM Sans', sans-serif",
												fontSize: 12.5,
												color: '#3C2B27',
												lineHeight: 1.5,
												marginTop: 6,
											}}
										>
											<Check
												size={14}
												strokeWidth={2.5}
												color={brand.accentColor}
												style={{ marginTop: 3, flexShrink: 0 }}
											/>
											<span>{f}</span>
										</li>
									))}
								</ul>

								{/* Buttons */}
								<div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
									<Link
										href='/contact'
										style={{
											flex: 1,
											textAlign: 'center',
											padding: '10px 12px',
											borderRadius: 10,
											background: brand.accentColor,
											color: '#fff',
											fontFamily: "'DM Sans', sans-serif",
											fontSize: 12,
											fontWeight: 600,
											letterSpacing: '0.06em',
											textDecoration: 'none',
											transition: 'all 0.2s ease',
										}}
									>
										Get Quote
									</Link>
									<Link
										href='/contact'
										style={{
											flex: 1,
											textAlign: 'center',
											padding: '10px 12px',
											borderRadius: 10,
											background: 'transparent',
											color: brand.accentColor,
											fontFamily: "'DM Sans', sans-serif",
											fontSize: 12,
											fontWeight: 600,
											letterSpacing: '0.06em',
											textDecoration: 'none',
											border: `1px solid ${brand.accentColor}`,
											transition: 'all 0.2s ease',
										}}
									>
										Learn More
									</Link>
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
		<section
			style={{
				padding: '72px 24px',
				background:
					'linear-gradient(135deg, #B86B45 0%, #E8933A 60%, #FF7E5F 100%)',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div
				aria-hidden
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'url(/noise.png)',
					opacity: 0.05,
					mixBlendMode: 'overlay',
				}}
			/>
			<div
				style={{
					maxWidth: 1240,
					margin: '0 auto',
					display: 'grid',
					gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)',
					gap: 40,
					alignItems: 'center',
				}}
				className='bd-trust-grid'
			>
				<div>
					<h2
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(28px, 3.5vw, 44px)',
							fontWeight: 600,
							color: '#fff',
							lineHeight: 1.15,
							margin: 0,
							marginBottom: 12,
						}}
					>
						Installed by The Heating Store —{' '}
						<span style={{ fontWeight: 300, fontStyle: 'italic' }}>Certified Experts Since 2011</span>
					</h2>
					<p
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 15,
							color: 'rgba(255,255,255,0.9)',
							margin: 0,
						}}
					>
						Every system we sell is installed by factory-trained engineers with
						direct manufacturer support.
					</p>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 16,
						alignItems: 'flex-start',
					}}
					className='bd-trust-cta-wrap'
				>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: 24,
							marginBottom: 8,
						}}
					>
						{items.map((it) => (
							<div
								key={it.label}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									color: '#fff',
									fontFamily: "'DM Sans', sans-serif",
									fontSize: 13,
									fontWeight: 500,
								}}
							>
								<it.icon size={18} strokeWidth={1.6} />
								{it.label}
							</div>
						))}
					</div>
					<Link
						href='/contact'
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 10,
							padding: '14px 28px',
							borderRadius: 999,
							background: '#fff',
							color: '#B86B45',
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 14,
							fontWeight: 600,
							letterSpacing: '0.05em',
							textDecoration: 'none',
							boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
							transition: 'transform 0.25s ease',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
						onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
					>
						<Phone size={16} strokeWidth={2} />
						Book a Free Site Visit
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
		<section
			ref={ref}
			style={{
				padding: '100px 24px',
				background: '#fff',
			}}
		>
			<div style={{ maxWidth: 1240, margin: '0 auto' }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.7, ease: EASE }}
					style={{ textAlign: 'center', marginBottom: 40 }}
				>
					<p
						style={{
							display: 'inline-block',
							margin: 0,
							marginBottom: 16,
							padding: '6px 16px',
							fontFamily: "'DM Sans', sans-serif",
							fontSize: 10,
							fontWeight: 500,
							letterSpacing: '0.3em',
							textTransform: 'uppercase',
							color: '#B86B45',
							background: 'rgba(184,107,69,0.1)',
							borderRadius: 999,
						}}
					>
						Explore
					</p>
					<h2
						style={{
							fontFamily: "'Cormorant Garamond', Georgia, serif",
							fontSize: 'clamp(32px, 4vw, 52px)',
							fontWeight: 600,
							color: '#3C2A25',
							lineHeight: 1.15,
							margin: 0,
						}}
					>
						Explore Other <span style={{ fontWeight: 300, color: '#B86B45' }}>Brands</span>
					</h2>
				</motion.div>

				<div
					className='bd-related-grid'
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gap: 20,
					}}
				>
					{related.map((b, i) => (
						<motion.div
							key={b.slug}
							initial={{ opacity: 0, y: 24 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
						>
							<Link
								href={`/brands/${b.slug}`}
								style={{
									display: 'block',
									background: 'rgba(255,255,255,0.68)',
									backdropFilter: 'blur(28px)',
									border: '1px solid rgba(255,255,255,0.5)',
									borderRadius: 24,
									padding: '32px 24px',
									textAlign: 'center',
									textDecoration: 'none',
									boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
									transition: 'all 0.3s ease',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-6px)';
									e.currentTarget.style.boxShadow =
										'0 20px 60px rgba(60,42,37,0.12), 0 4px 16px rgba(60,42,37,0.07)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow =
										'0 8px 32px rgba(60,42,37,0.07)';
								}}
							>
								<div
									style={{
										width: 100,
										height: 100,
										borderRadius: 20,
										background: '#fff',
										border: '1px solid rgba(245,185,122,0.25)',
										boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										overflow: 'hidden',
										padding: 12,
										margin: '0 auto 18px',
									}}
								>
									<img
										src={b.img}
										alt={b.name}
										style={{ width: '100%', height: '100%', objectFit: 'contain' }}
									/>
								</div>
								<p
									style={{
										fontFamily: "'Cormorant Garamond', Georgia, serif",
										fontSize: 24,
										fontWeight: 600,
										color: '#3C2A25',
										margin: 0,
										marginBottom: 4,
									}}
								>
									{b.name}
								</p>
								<p
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 10.5,
										letterSpacing: '0.25em',
										textTransform: 'uppercase',
										color: b.accentColor,
										margin: 0,
										fontWeight: 600,
									}}
								>
									{b.tag}
								</p>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Section 7 — Sticky Mobile Bottom CTA ───────────────── */
function MobileBottomCTA({ brand }) {
	return (
		<div
			className='bd-mobile-cta'
			style={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 50,
				padding: '12px 16px',
				background: 'rgba(255,255,255,0.95)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				borderTop: '1px solid rgba(184,107,69,0.18)',
				boxShadow: '0 -8px 24px rgba(60,42,37,0.08)',
				display: 'flex',
				gap: 8,
				alignItems: 'center',
			}}
		>
			<Link
				href='/contact'
				style={{
					flex: 1,
					textAlign: 'center',
					padding: '12px 16px',
					borderRadius: 12,
					background: brand.accentColor,
					color: '#fff',
					fontFamily: "'DM Sans', sans-serif",
					fontSize: 13,
					fontWeight: 600,
					letterSpacing: '0.04em',
					textDecoration: 'none',
					boxShadow: '0 6px 16px rgba(232,147,58,0.35)',
				}}
			>
				Get {brand.name} Quote — Free
			</Link>
			<Link
				href='/contact'
				aria-label='Call'
				style={{
					width: 44,
					height: 44,
					borderRadius: 12,
					background: 'rgba(184,107,69,0.12)',
					color: brand.accentColor,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textDecoration: 'none',
				}}
			>
				<Phone size={18} strokeWidth={2} />
			</Link>
		</div>
	);
}

/* ─── Top "← All Brands" back button ─────────────────────── */
function BackButton() {
	return (
		<div
			style={{
				maxWidth: 1320,
				margin: '0 auto',
				padding: '24px 24px 0',
			}}
		>
			<Link
				href='/#brands'
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 8,
					fontFamily: "'DM Sans', sans-serif",
					fontSize: 12,
					fontWeight: 500,
					letterSpacing: '0.12em',
					textTransform: 'uppercase',
					color: '#B86B45',
					textDecoration: 'none',
				}}
			>
				<ArrowLeft size={14} strokeWidth={2} />
				All Brands
			</Link>
		</div>
	);
}

/* ─── Master component ──────────────────────────────────── */
export default function BrandDetailClient({ brand, related }) {
	return (
		<>
			<style>{`
				@media (max-width: 1024px) {
					.bd-story-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
					.bd-usp-grid { grid-template-columns: repeat(2, 1fr) !important; }
					.bd-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
					.bd-related-grid { grid-template-columns: repeat(3, 1fr) !important; }
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

			<main style={{ paddingBottom: 0 }}>
				<HeroSection brand={brand} />
				<BackButton />
				<BrandStory brand={brand} />
				<USPCards brand={brand} />
				<ProductsGrid brand={brand} />
				<TrustStrip />
				<RelatedBrands related={related} />
			</main>
			<MobileBottomCTA brand={brand} />
		</>
	);
}
