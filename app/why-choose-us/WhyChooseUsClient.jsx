'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { BRANDS } from '../lib/brandsData';

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

const S = (p) => ({
	width: p.size,
	height: p.size,
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: p.color,
	strokeWidth: p.sw || 1.5,
	strokeLinecap: 'round',
	strokeLinejoin: 'round',
});

const Icon = {
	Customers: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
			<circle cx='9' cy='7' r='4' />
			<path d='M23 21v-2a4 4 0 0 0-3-3.87' />
			<path d='M16 3.13a4 4 0 0 1 0 7.75' />
		</svg>
	),
	Shield: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Systems: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<rect x='2' y='3' width='20' height='14' rx='2' />
			<path d='M8 21h8M12 17v4' />
			<path d='M7 8h.01M11 8h6' />
			<path d='M7 12h.01M11 12h6' />
		</svg>
	),
	Globe: ({ size = 22, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<circle cx='12' cy='12' r='10' />
			<line x1='2' y1='12' x2='22' y2='12' />
			<path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
		</svg>
	),
	Wrench: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
		</svg>
	),
	Refresh: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<polyline points='23 4 23 10 17 10' />
			<path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
		</svg>
	),
	ClipboardCheck: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' />
			<rect x='9' y='3' width='6' height='4' rx='1' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Ruler: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M3 21h18' />
			<path d='M3 7v1M7 3v4M11 7v1M15 3v4M19 7v1' />
			<path d='M3 3h18v4H3z' />
		</svg>
	),
	MessageCircle: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
		</svg>
	),
	Layout: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<rect x='3' y='3' width='18' height='18' rx='2' />
			<line x1='3' y1='9' x2='21' y2='9' />
			<line x1='9' y1='21' x2='9' y2='9' />
		</svg>
	),
	Package: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<line x1='16.5' y1='9.4' x2='7.5' y2='4.21' />
			<path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
			<polyline points='3.27 6.96 12 12.01 20.73 6.96' />
			<line x1='12' y1='22.08' x2='12' y2='12' />
		</svg>
	),
	Tool: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
		</svg>
	),
	Award: ({ size = 26, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.4 })}>
			<circle cx='12' cy='8' r='6' />
			<path d='M15.477 12.89L17 22l-5-3-5 3 1.523-9.11' />
		</svg>
	),
	Layers: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<polygon points='12 2 2 7 12 12 22 7 12 2' />
			<polyline points='2 17 12 22 22 17' />
			<polyline points='2 12 12 17 22 12' />
		</svg>
	),
	BoxOpen: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<polyline points='21 8 21 21 3 21 3 8' />
			<rect x='1' y='3' width='22' height='5' />
			<line x1='10' y1='12' x2='14' y2='12' />
		</svg>
	),
	HardHat: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<path d='M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z' />
			<path d='M10 10V5a2 2 0 1 1 4 0v5' />
			<path d='M4 15V9a8 8 0 0 1 16 0v6' />
		</svg>
	),
	BadgeCheck: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<path d='M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z' />
			<polyline points='9 12 11 14 15 10' />
		</svg>
	),
	Chat: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
		</svg>
	),
	RotateCw: ({ size = 14, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 1.8 })}>
			<polyline points='23 4 23 10 17 10' />
			<path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
		</svg>
	),
	Trophy: ({ size = 16, color = 'currentColor' }) => (
		<svg {...S({ size, color })}>
			<path d='M6 9H4.5a2.5 2.5 0 0 1 0-5H6' />
			<path d='M18 9h1.5a2.5 2.5 0 0 0 0-5H18' />
			<path d='M4 22h16' />
			<path d='M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' />
			<path d='M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' />
			<path d='M18 2H6v7a6 6 0 0 0 12 0V2z' />
		</svg>
	),
	Star: ({ size = 13, color = '#F5B97A' }) => (
		<svg width={size} height={size} viewBox='0 0 24 24' fill={color} stroke={color} strokeWidth='0'>
			<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
		</svg>
	),
	Quote: ({ size = 36, color = 'currentColor', opacity = 1 }) => (
		<svg width={size} height={size} viewBox='0 0 24 24' fill={color} stroke='none' opacity={opacity}>
			<path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />
		</svg>
	),
	ArrowRight: ({ size = 16, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 2 })}>
			<line x1='5' y1='12' x2='19' y2='12' />
			<polyline points='12 5 19 12 12 19' />
		</svg>
	),
	ChevronLeft: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 2.2 })}>
			<polyline points='15 18 9 12 15 6' />
		</svg>
	),
	ChevronRight: ({ size = 18, color = 'currentColor' }) => (
		<svg {...S({ size, color, sw: 2.2 })}>
			<polyline points='9 18 15 12 9 6' />
		</svg>
	),
};

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE
// ─────────────────────────────────────────────────────────────────────────────

const C = {
	amber: '#E8933A',
	amberLt: '#F5B97A',
	coral: '#FF7E5F',
	text: '#FBF3EA',
	soft: 'rgba(251,243,234,0.60)',
	mute: 'rgba(251,243,234,0.40)',
	line: 'rgba(255,255,255,0.09)',
	glass: 'rgba(255,255,255,0.045)',
	glassBorder: 'rgba(255,255,255,0.10)',
};

const EASE = [0.16, 1, 0.3, 1];
const CARD_GAP = 24;

// ─────────────────────────────────────────────────────────────────────────────
// DATA (content preserved verbatim)
// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
	{
		display: '300K+',
		label: 'Happy Customers',
		sub: 'Across India & 9 countries',
		IconComp: Icon.Customers,
		color: '#F5B97A',
		pct: 92,
		bullets: ['Residential & commercial projects', 'Verified 5 star reviews', '99% satisfaction rate'],
		tag: 'Most Trusted',
	},
	{
		display: '10 - 25+',
		label: 'Year Warranty',
		sub: 'Industry-leading coverage',
		IconComp: Icon.Shield,
		color: '#7FC0E8',
		pct: 100,
		bullets: ['10 to 25 years warranty', 'No hassle claims process', 'Parts & labour fully covered'],
		tag: 'Industry Best',
	},
	{
		display: '2M+',
		label: 'Systems Installed',
		sub: 'Globally since 2011',
		IconComp: Icon.Systems,
		color: '#FF9E7A',
		pct: 78,
		bullets: ['500,000+ installations in India', '0.01% fault rate across all systems', 'Compatible with every floor type'],
		tag: 'Market Leader',
	},
	{
		display: '9',
		label: 'Countries',
		sub: 'Internationally trusted',
		IconComp: Icon.Globe,
		color: '#8FD4A6',
		pct: 56,
		bullets: ['UK · Sweden · UAE · France', 'Finland · Netherlands · Turkey', 'Bhutan · India, and growing'],
		tag: 'Global Reach',
	},
];

const COUNTRIES = [
	{ name: 'United Kingdom', code: 'gb' },
	{ name: 'Sweden', code: 'se' },
	{ name: 'Netherlands', code: 'nl' },
	{ name: 'Finland', code: 'fi' },
	{ name: 'France', code: 'fr' },
	{ name: 'Turkey', code: 'tr' },
	{ name: 'UAE', code: 'ae' },
	{ name: 'Bhutan', code: 'bt' },
	{ name: 'India', code: 'in' },
];

const RELIABILITY = [
	{
		IconComp: Icon.Wrench,
		title: 'Near-Zero Failure Rate',
		desc: '0.01% fault rate across 2 million+ global installations. Engineered for extreme cold climates.',
	},
	{
		IconComp: Icon.Refresh,
		title: '24 Hour Replacement Guarantee',
		desc: 'If a system fails, we replace it within 24 hours anywhere in India.',
	},
	{
		IconComp: Icon.ClipboardCheck,
		title: '10 to 25+ Year Product Warranty',
		desc: 'Every system ships with an industry-leading warranty. Fully transferable. Valid across India.',
	},
	{
		IconComp: Icon.Ruler,
		title: 'Custom Design',
		desc: 'Detailed heating layout plans, cable density maps, and thermostat zone configurations for every project.',
	},
];

const PROCESS = [
	{
		num: '01',
		IconComp: Icon.MessageCircle,
		title: 'Free Consultation',
		desc: 'Our experts assess your space, floor type, and usage to craft the perfect heating solution for your exact project.',
		img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
	},
	{
		num: '02',
		IconComp: Icon.Layout,
		title: 'Price Expert Consultation',
		desc: 'Found the same underfloor heating product cheaper elsewhere? We will aim to match the price wherever possible. Simply send us the competitor’s quote or website link before ordering, and our team will review it promptly.',
		img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
	},
	{
		num: '03',
		IconComp: Icon.Package,
		title: 'Excellent Service Support',
		desc: 'From your first enquiry to post-installation aftercare, our qualified team is available at every stage. Technical questions, system troubleshooting, or warranty claims, we respond fast and resolve faster.',
		img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
	},
	{
		num: '04',
		IconComp: Icon.Tool,
		title: 'Price Match Promise',
		desc: 'Found the same system cheaper elsewhere? We will match any like-for-like price from an authorised supplier. Same product, same warranty, same certified installation, guaranteed at the best price.',
		img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
	},
	{
		num: '05',
		IconComp: Icon.Award,
		title: 'Lifetime Warranty',
		desc: 'We stand by the quality of our underfloor heating systems. That’s why many of our products come with lifetime warranties, giving you long-term peace of mind.',
		img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
	},
];

const CAPABILITY = [
	{ label: 'Electric systems', pct: 95 },
	{ label: 'Water UFH', pct: 88 },
	{ label: 'Smart controls', pct: 92 },
	{ label: 'Commercial grade', pct: 85 },
];

const TESTIMONIALS = [
	{
		initials: 'AA',
		name: 'Asif Ali',
		role: 'Principal Architect, Ali Associates, Srinagar',
		tag: 'Verified Purchase',
		text: 'We have specified The Heating Store across six luxury residential and commercial projects. The installation quality is immaculate, zero callbacks, zero defects. The 0.01% fault rate they advertise is absolutely real. Nothing else comes close.',
	},
	{
		initials: 'KS',
		name: 'Kamran Siddiq',
		role: 'Senior Project Manager, Siddiq Builders, Jammu',
		tag: 'Trade Account',
		text: 'The design consultation was outstanding. Custom heating zones mapped across a 5,000 sq ft penthouse, flawless installation from start to finish. Our clients were absolutely delighted with the result.',
	},
	{
		initials: 'SF',
		name: 'Syed Faizan',
		role: 'Head of Development, Faizan Developments, Kashmir',
		tag: 'Commercial Project',
		text: 'Deployed across a 60-unit luxury residential complex. Every system performed perfectly from day one. The 25-year warranty gives our homebuyers genuine confidence, it is a real differentiator in the market.',
	},
];

const CTA_INCLUDED = [
	{ IconComp: Icon.Layers, text: 'Free Consultation' },
	{ IconComp: Icon.BoxOpen, text: 'Custom Design' },
	{ IconComp: Icon.HardHat, text: 'Expert Installation' },
	{ IconComp: Icon.BadgeCheck, text: '25+ Year Warranty' },
	{ IconComp: Icon.Chat, text: 'Dedicated Support Team' },
	{ IconComp: Icon.RotateCw, text: '24h Replacement' },
];

const MARQUEE = [
	'Kashmir Installation Warranty',
	'25-50 Year Pipe Guarantees',
	'CE & UKCA Certified',
	'IEC 60335 Safety Compliant',
	'ISO 9001:2015 Quality Management',
	'WRAS Approved Components',
	'18th Edition Electrical Compliance',
	'Global Electrical Approvals',
];

const AVATARS = [
	'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face',
	'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
];

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLES
// ─────────────────────────────────────────────────────────────────────────────

function Flag({ code, name }) {
	return (
		<img
			src={`https://flagcdn.com/w40/${code}.png`}
			srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
			width={20}
			height={15}
			alt={name}
			style={{ borderRadius: 2, objectFit: 'cover', flexShrink: 0, minWidth: 20 }}
		/>
	);
}

function Badge({ children }) {
	return (
		<div className='whc-badge'>
			<span className='whc-badge-dot' />
			{children}
		</div>
	);
}

function SectionHeading({ badge, title, accent, sub, center = false, as = 'h2' }) {
	const Tag = as;
	return (
		<div style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 620 : 'none', margin: center ? '0 auto' : 0 }}>
			<Badge>{badge}</Badge>
			<Tag className='whc-h'>
				{title}
				{accent && <span className='whc-h-accent'> {accent}</span>}
			</Tag>
			{sub && (
				<p className='whc-sub' style={{ maxWidth: center ? 560 : 560, margin: center ? '18px auto 0' : '18px 0 0' }}>
					{sub}
				</p>
			)}
		</div>
	);
}

function Counter({ display }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount: 0.5 });
	const [val, setVal] = useState(' ');
	useEffect(() => {
		if (!seen) return;
		const t = setTimeout(() => setVal(display), 160);
		return () => clearTimeout(t);
	}, [seen, display]);
	return (
		<motion.span
			ref={ref}
			initial={{ opacity: 0, filter: 'blur(6px)' }}
			animate={seen ? { opacity: 1, filter: 'blur(0px)' } : {}}
			transition={{ duration: 0.7, ease: EASE }}>
			{val}
		</motion.span>
	);
}

function Reveal({ children, y = 26, x = 0, delay = 0, amount = 0.15, ...rest }) {
	const ref = useRef(null);
	const seen = useInView(ref, { once: true, amount });
	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y, x }}
			animate={seen ? { opacity: 1, y: 0, x: 0 } : {}}
			transition={{ duration: 0.9, ease: EASE, delay }}
			{...rest}>
			{children}
		</motion.div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────

function ProcessCarousel() {
	const ref = useRef(null);
	const carouselRef = useRef(null);
	const seen = useInView(ref, { once: true, amount: 0.05 });
	const [cardWidth, setCardWidth] = useState(380);
	const [activeStep, setActiveStep] = useState(0);

	useEffect(() => {
		const update = () => {
			if (carouselRef.current) {
				const w = carouselRef.current.offsetWidth;
				setCardWidth(w < 500 ? Math.round(w * 0.8) : w < 900 ? 340 : 400);
			}
		};
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const trackShift = `calc(50% - ${activeStep * (cardWidth + CARD_GAP) + cardWidth / 2}px)`;

	return (
		<div ref={ref} className='whc-process'>
			<Reveal amount={0.05}>
				<div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px', padding: '0 24px' }}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<Badge>Our Process</Badge>
					</div>
					<h2 className='whc-h' style={{ textAlign: 'center' }}>
						Why Choose The <span className='whc-h-accent'>Underfloor Heating Store?</span>
					</h2>
					<p className='whc-sub' style={{ margin: '18px auto 0', maxWidth: 560 }}>
						Expert advice, quality products, and service you can trust. Everything you need for the perfect underfloor heating solution.
					</p>
				</div>
			</Reveal>

			<div className='whc-carousel-wrap'>
				<button
					className='whc-arrow'
					style={{ left: 16 }}
					aria-label='Previous step'
					onClick={() => setActiveStep((i) => Math.max(0, i - 1))}
					disabled={activeStep === 0}>
					<Icon.ChevronLeft color={C.text} />
				</button>
				<button
					className='whc-arrow'
					style={{ right: 16 }}
					aria-label='Next step'
					onClick={() => setActiveStep((i) => Math.min(PROCESS.length - 1, i + 1))}
					disabled={activeStep === PROCESS.length - 1}>
					<Icon.ChevronRight color={C.text} />
				</button>

				<div className='whc-track-outer' ref={carouselRef}>
					<motion.div
						className='whc-track'
						initial={{ opacity: 0 }}
						animate={seen ? { opacity: 1 } : {}}
						transition={{ duration: 0.7, ease: EASE }}
						style={{ transform: `translateX(${trackShift})` }}>
						{PROCESS.map((step, i) => {
							const dist = Math.abs(i - activeStep);
							const isActive = dist === 0;
							const opacity = dist === 0 ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.22 : 0;
							const scale = dist === 0 ? 1 : dist === 1 ? 0.9 : 0.82;
							const blur = dist === 0 ? 0 : dist === 1 ? 1.5 : 3;
							return (
								<div
									key={step.num}
									className={`whc-pcard${isActive ? ' is-active' : ''}`}
									onClick={() => !isActive && setActiveStep(i)}
									style={{
										width: cardWidth,
										opacity,
										transform: `scale(${scale})`,
										filter: `blur(${blur}px)`,
										transformOrigin: 'center bottom',
										pointerEvents: dist > 2 ? 'none' : 'auto',
									}}>
									<div className='whc-pcard-img'>
										<img src={step.img} alt={step.title} />
										<div className='whc-pcard-num'>
											<step.IconComp size={16} color={C.amberLt} />
											<span>{step.num}</span>
										</div>
									</div>
									<div className='whc-pcard-body'>
										<h3 className='whc-pcard-title'>{step.title}</h3>
										<p className='whc-pcard-desc'>{step.desc}</p>
										{isActive && (
											<div className='whc-pcard-footer'>
												<span className='whc-pcard-step'>
													{parseInt(step.num, 10)} of {PROCESS.length}
												</span>
												<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
													{PROCESS.map((_, di) => (
														<div
															key={di}
															onClick={(e) => {
																e.stopPropagation();
																setActiveStep(di);
															}}
															style={{
																width: di === activeStep ? 20 : 6,
																height: 6,
																borderRadius: 3,
																background: di === activeStep ? 'linear-gradient(90deg,#E8933A,#FF7E5F)' : 'rgba(255,255,255,0.18)',
																transition: 'all 0.35s ease',
																cursor: 'pointer',
															}}
														/>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</motion.div>
				</div>
			</div>

			<div className='whc-dots'>
				{PROCESS.map((step, i) => (
					<button
						key={i}
						className='whc-dot'
						title={step.title}
						aria-label={step.title}
						onClick={() => setActiveStep(i)}
						style={{
							width: i === activeStep ? 28 : 7,
							background: i === activeStep ? 'linear-gradient(90deg,#E8933A,#FF7E5F)' : 'rgba(255,255,255,0.22)',
						}}
					/>
				))}
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

export default function WhyChooseUsClient() {
	return (
		<>
			<style>{CSS}</style>

			<section className='whc-root'>
				{/* atmospheric field */}
				<div aria-hidden className='whc-aura'>
					<span className='whc-orb whc-orb-1' />
					<span className='whc-orb whc-orb-2' />
					<span className='whc-orb whc-orb-3' />
				</div>
				<div aria-hidden className='whc-vignette' />

				{/* ═══ §1 HERO ═══ */}
				<div className='whc-pad'>
					<div className='whc-hero-grid'>
						<Reveal amount={0.05}>
							<SectionHeading
								as='h1'
								badge='Why Choose Us'
								title='Why Homeowners, Architects'
								accent='& Builders Choose The Heating Store'
								sub="Awarded Jammu & Kashmir's most trusted underfloor heating provider for five consecutive years. 500,000+ successful installations, 99% client satisfaction rate, and an industry-leading lifetime warranty on every system we install."
							/>
							<motion.div
								className='whc-social'
								initial={{ opacity: 0, y: 14 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, delay: 0.25, ease: EASE }}>
								<div className='whc-avatars'>
									{AVATARS.map((src, i) => (
										<div key={i} className='whc-avatar' style={{ marginLeft: i === 0 ? 0 : -10 }}>
											<img src={src} alt='Satisfied customer' />
										</div>
									))}
									<div className='whc-avatar whc-avatar-more'>+</div>
								</div>
								<div>
									<div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
										{[1, 2, 3, 4, 5].map((n) => (
											<Icon.Star key={n} />
										))}
									</div>
									<p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: C.soft }}>
										<strong style={{ color: C.text }}>300,000+ customers</strong> trust us across India &amp; beyond
									</p>
								</div>
							</motion.div>
						</Reveal>

						{/* featured image */}
						<Reveal y={0} delay={0.1} amount={0.05}>
							<div className='whc-feature'>
								<img
									src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85'
									alt='Luxury heated interior'
									className='whc-feature-img'
								/>
								<div className='whc-feature-veil' />
								<div className='whc-feature-award'>
									<Icon.Trophy size={14} color={C.amberLt} />
									<span>Since 2011</span>
								</div>
								<div className='whc-feature-bottom'>
									<h3 className='whc-feature-h'>India #1 Electric Hamam Seller</h3>
									<div className='whc-feature-chips'>
										{['500K+ India Installs', '0.01% Repair Rate', 'Since 2011'].map((s) => (
											<span key={s} className='whc-feature-chip'>
												{s}
											</span>
										))}
									</div>
								</div>
							</div>
						</Reveal>
					</div>

					{/* stat grid */}
					<div className='whc-stat-grid'>
						{STATS.map((s, i) => (
							<Reveal key={s.label} delay={0.08 + i * 0.08} amount={0.1}>
								<div className='whc-stat whc-card' style={{ '--c': s.color }}>
									<span className='whc-stat-accent' />
									<span className='whc-stat-glow' />
									<div className='whc-stat-top'>
										<div className='whc-stat-icon'>
											<s.IconComp size={18} color={s.color} />
										</div>
										<span className='whc-stat-tag'>{s.tag}</span>
									</div>
									<p className='whc-stat-num'>
										<Counter display={s.display} />
									</p>
									<p className='whc-stat-label'>{s.label}</p>
									<p className='whc-stat-sub'>{s.sub}</p>
									<div className='whc-bar'>
										<motion.span
											initial={{ width: 0 }}
											whileInView={{ width: `${s.pct}%` }}
											viewport={{ once: true }}
											transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease: EASE }}
										/>
									</div>
									<div className='whc-stat-bullets'>
										{s.bullets.map((b) => (
											<div key={b} className='whc-bullet'>
												<span className='whc-bullet-dot' />
												<span>{b}</span>
											</div>
										))}
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>

				{/* ═══ §2 RELIABILITY + GLOBAL ═══ */}
				<div className='whc-pad whc-pad-tight'>
					<div className='whc-reli-grid'>
						<Reveal x={-28} y={0} amount={0.1}>
							<div className='whc-card whc-panel'>
								<div className='whc-panel-head'>
									<div>
										<h3 className='whc-panel-title'>Built for Kashmiri Winters.</h3>
										<p className='whc-panel-sub'>
											Every system is engineered for decades of silent, flawless operation. So you never have to think about your floor again.
										</p>
									</div>
									<div className='whc-panel-badge whc-float'>
										<Icon.Shield size={22} color={C.amberLt} />
									</div>
								</div>
								<div className='whc-feat-grid'>
									{RELIABILITY.map((f) => (
										<div key={f.title} className='whc-feat'>
											<div className='whc-feat-icon'>
												<f.IconComp size={16} color={C.amberLt} />
											</div>
											<div>
												<p className='whc-feat-title'>{f.title}</p>
												<p className='whc-feat-desc'>{f.desc}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</Reveal>

						<Reveal x={28} y={0} delay={0.1} amount={0.1}>
							<div className='whc-card whc-panel' style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%' }}>
								<div className='whc-panel-head'>
									<div>
										<h3 className='whc-panel-title'>Trusted Across 9 Countries</h3>
										<p className='whc-panel-sub'>
											From Srinagar to Stockholm, our electric underfloor heating and hamam systems are specified by leading architects and builders worldwide.
										</p>
									</div>
									<div className='whc-panel-badge whc-float' style={{ animationDelay: '.5s' }}>
										<Icon.Globe size={22} color={C.amberLt} />
									</div>
								</div>
								<div className='whc-countries'>
									{COUNTRIES.map((c) => (
										<div key={c.name} className='whc-country'>
											<Flag code={c.code} name={c.name} />
											<span>{c.name}</span>
										</div>
									))}
								</div>
								<div className='whc-global-stats'>
									<div>
										<p className='whc-global-num'>2M+</p>
										<p className='whc-global-cap'>Systems worldwide</p>
										<div className='whc-bar' style={{ width: 110, marginTop: 8 }}>
											<motion.span
												initial={{ width: 0 }}
												whileInView={{ width: '85%' }}
												viewport={{ once: true }}
												transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
											/>
										</div>
									</div>
									<div style={{ textAlign: 'right' }}>
										<p className='whc-global-num' style={{ fontSize: 22 }}>500K+</p>
										<p className='whc-global-cap'>In India alone</p>
										<p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: C.amber, fontWeight: 600, marginTop: 2 }}>Since 2011</p>
									</div>
								</div>
							</div>
						</Reveal>
					</div>
				</div>

				{/* ═══ §3 PROCESS ═══ */}
				<ProcessCarousel />

				{/* ═══ §4 BRANDS ═══ */}
				<div className='whc-pad whc-pad-tight'>
					<div className='whc-brands-grid'>
						<Reveal x={-24} y={0} amount={0.08}>
							<SectionHeading
								badge='Trusted Brands'
								title='World-Class Heating,'
								accent='Backed by Our Warranty'
								sub="We partner exclusively with the world's most trusted underfloor heating and electric hamam brands. Every system backed by our Kashmir installation warranty."
							/>
							<div className='whc-cap'>
								<p className='whc-cap-label'>Our Capability</p>
								{CAPABILITY.map((item, i) => (
									<div key={item.label} style={{ marginBottom: i < CAPABILITY.length - 1 ? 14 : 0 }}>
										<div className='whc-cap-row'>
											<span>{item.label}</span>
											<span style={{ color: C.amber, fontWeight: 600 }}>{item.pct}%</span>
										</div>
										<div className='whc-bar'>
											<motion.span
												initial={{ width: 0 }}
												whileInView={{ width: `${item.pct}%` }}
												viewport={{ once: true }}
												transition={{ duration: 1.3, delay: 0.2 + i * 0.1, ease: EASE }}
											/>
										</div>
									</div>
								))}
							</div>
						</Reveal>

						<Reveal x={24} y={0} delay={0.12} amount={0.08}>
							<div className='whc-card' style={{ overflow: 'hidden' }}>
								<div className='whc-brands-cardhead'>
									<h4>Trusted Brands</h4>
									<p>World-class heating technology, backed by our Kashmir installation warranty.</p>
								</div>
								<div className='whc-brand-grid'>
									{BRANDS.map((b) => (
										<Link key={b.name} href={`/brands/${b.slug}`} className='whc-brand' aria-label={`View ${b.name} products`}>
											<div className='whc-brand-logo'>
												<img src={b.img} alt={b.name} />
											</div>
											<span className='whc-brand-name'>{b.name}</span>
											<span className='whc-brand-desc'>{b.desc}</span>
											<span className='whc-brand-view'>View Products →</span>
										</Link>
									))}
								</div>
								<div className='whc-brands-link'>
									<a href='/contact'>Talk to our experts to find the perfect fit →</a>
								</div>
								<div className='whc-brands-stats'>
									{[
										{ val: '500K+', label: 'India Installations' },
										{ val: '2M+', label: 'Worldwide Systems' },
										{ val: '2011', label: 'Trusted Since' },
									].map((s, i) => (
										<div key={s.label} style={{ borderRight: i < 2 ? `1px solid ${C.line}` : 'none' }}>
											<p>{s.val}</p>
											<span>{s.label}</span>
										</div>
									))}
								</div>
							</div>
						</Reveal>
					</div>
				</div>

				{/* ═══ §5 TESTIMONIALS ═══ */}
				<div className='whc-pad whc-pad-tight'>
					<Reveal amount={0.05} style={{ marginBottom: 48 }}>
						<SectionHeading
							badge='Customer Stories'
							title="Trusted by Jammu & Kashmir's Leading"
							accent='Architects & Builders'
							sub='Real words from the professionals who specify us on every premium project.'
							center
						/>
					</Reveal>
					<div className='whc-testi-grid'>
						{TESTIMONIALS.map((t, i) => (
							<Reveal key={t.name} delay={i * 0.1} amount={0.05}>
								<div className='whc-card whc-testi'>
									<div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
										{[1, 2, 3, 4, 5].map((n) => (
											<Icon.Star key={n} size={12} />
										))}
									</div>
									<Icon.Quote size={30} color={C.amber} opacity={0.28} />
									<p className='whc-testi-text'>{t.text}</p>
									<div className='whc-testi-foot'>
										<div className='whc-testi-avatar'>{t.initials}</div>
										<div style={{ flex: 1, minWidth: 120 }}>
											<p className='whc-testi-name'>{t.name}</p>
											<p className='whc-testi-role'>{t.role}</p>
										</div>
										<span className='whc-testi-tag'>{t.tag}</span>
									</div>
								</div>
							</Reveal>
						))}
					</div>
					<p className='whc-testi-note'>
						Every installation backed by our 25+ year product warranty and CE/ISO-certified systems.{' '}
						<a href='/contact'>Talk to our experts today</a>.
					</p>
				</div>

				{/* ═══ §6 CTA ═══ */}
				<div className='whc-pad whc-pad-tight'>
					<Reveal amount={0.1}>
						<div className='whc-card whc-cta'>
							<span className='whc-cta-bar' />
							<div className='whc-cta-inner'>
								<div>
									<p className='whc-eyebrow'>Start Your Project Today</p>
									<h3 className='whc-cta-title'>
										India's Most Trusted<br />Underfloor Heating Company
									</h3>
									<p className='whc-cta-desc'>
										500,000+ installations across India. Specified by leading architects and builders from Srinagar to Mumbai. Book your free expert consultation.
									</p>
								</div>
								<div className='whc-cta-divider' />
								<div>
									<p className='whc-cta-eyebrow2'>Everything Included</p>
									<div className='whc-cta-chips'>
										{CTA_INCLUDED.map((s) => (
											<span key={s.text} className='whc-cta-chip'>
												<s.IconComp size={13} color={C.amberLt} />
												{s.text}
											</span>
										))}
									</div>
								</div>
								<div className='whc-cta-divider' />
								<div className='whc-cta-btns'>
									<a href='#contact' className='whc-btn-primary'>
										Talk to Expert
									</a>
									<a href='#process' className='whc-btn-ghost'>
										View Process <span style={{ color: C.amber }}>→</span>
									</a>
									<p className='whc-cta-fine'>No obligation · Free consultation · Response within 2 hours</p>
								</div>
							</div>
						</div>
					</Reveal>
				</div>

				{/* ═══ MARQUEE ═══ */}
				<div className='whc-marquee'>
					<div className='whc-marquee-track'>
						{[...MARQUEE, ...MARQUEE].map((item, i) => (
							<span key={i} className='whc-marquee-item'>
								<Icon.BadgeCheck size={13} color={C.amberLt} />
								{item}
							</span>
						))}
					</div>
				</div>
			</section>
		</>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
:root { }

.whc-root {
	position: relative;
	z-index: 1;
	overflow: hidden;
	isolation: isolate;
	color: ${C.text};
	background:
		radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),
		linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%);
}
.whc-root::before {
	content:''; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.04;
	background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.whc-root::after {
	content:''; position:absolute; inset:0; z-index:0; pointer-events:none;
	background-image: repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 88px,rgba(255,255,255,.02) 88px), repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 88px,rgba(255,255,255,.02) 88px);
	-webkit-mask-image: radial-gradient(130% 90% at 50% 0%, #000 35%, transparent 78%);
	mask-image: radial-gradient(130% 90% at 50% 0%, #000 35%, transparent 78%);
}

.whc-aura { position:absolute; inset:-10%; z-index:0; pointer-events:none; filter: blur(14px); }
.whc-orb { position:absolute; border-radius:50%; }
.whc-orb-1 { top:-8%; left:6%; width:46vw; height:46vw; max-width:720px; max-height:720px; background: radial-gradient(circle, rgba(232,147,58,0.28), transparent 62%); animation: whc-drift 24s ease-in-out infinite; }
.whc-orb-2 { top:8%; right:0%; width:40vw; height:40vw; max-width:620px; max-height:620px; background: radial-gradient(circle, rgba(255,126,95,0.18), transparent 62%); animation: whc-drift2 30s ease-in-out infinite; }
.whc-orb-3 { top:44%; left:36%; width:38vw; height:38vw; max-width:560px; max-height:560px; background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: whc-drift 34s ease-in-out infinite reverse; }
.whc-vignette { position:absolute; inset:0; z-index:0; pointer-events:none; background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%); }

@keyframes whc-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
@keyframes whc-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }
@keyframes whc-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes whc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
@keyframes whc-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
@keyframes whc-sheen { 0%{transform:translateX(-120%) skewX(-18deg)} 100%{transform:translateX(240%) skewX(-18deg)} }
@keyframes whc-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

/* layout */
.whc-pad { position:relative; z-index:2; max-width:1320px; margin:0 auto; padding:96px 40px 40px; }
.whc-pad-tight { padding-top:40px; padding-bottom:40px; }

/* badge */
.whc-badge {
	display:inline-flex; align-items:center; gap:9px; margin-bottom:20px;
	padding:8px 22px; border-radius:999px;
	font-family:var(--font-body); font-size:10px; font-weight:600;
	text-transform:uppercase; letter-spacing:0.4em; color:${C.amberLt};
	background: rgba(232,147,58,0.08);
	border:1px solid rgba(232,147,58,0.22);
	box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4);
	backdrop-filter: blur(12px);
}
.whc-badge-dot { width:6px; height:6px; border-radius:50%; background:${C.coral}; box-shadow:0 0 8px rgba(255,126,95,0.9); flex-shrink:0; animation: whc-blink 2s ease-in-out infinite; }

/* headings */
.whc-h {
	font-family:var(--font-heading);
	font-size:clamp(30px,4.4vw,58px); font-weight:600; line-height:1.06;
	letter-spacing:-0.01em; color:${C.text}; margin:0;
	text-shadow:0 2px 40px rgba(0,0,0,0.4);
}
.whc-h-accent {
	font-weight:300;
	background:linear-gradient(100deg,#E8933A,#F5B97A 30%,#FF7E5F 55%,#F5B97A 80%,#E8933A);
	background-size:200% auto; -webkit-background-clip:text; background-clip:text;
	-webkit-text-fill-color:transparent; color:transparent;
	animation: whc-shimmer 6s linear infinite;
}
.whc-sub { font-family:var(--font-body); font-size:clamp(14px,1.4vw,17px); line-height:1.75; color:${C.soft}; font-weight:400; }

/* glass card base */
.whc-card {
	position:relative;
	background:
		linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
		rgba(20,13,8,0.5);
	backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
	border:1px solid ${C.glassBorder};
	border-radius:24px;
	box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
}
.whc-card::after {
	content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
	opacity:0; transition:opacity .5s ease;
	background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
	-webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite:xor; mask-composite:exclude;
}

/* hero */
.whc-hero-grid { display:grid; grid-template-columns:1.05fr 0.95fr; gap:52px; align-items:center; margin-bottom:56px; }
.whc-social { display:flex; align-items:center; gap:18px; margin-top:34px; }
.whc-avatars { display:flex; flex-shrink:0; }
.whc-avatar { width:38px; height:38px; border-radius:50%; border:2.5px solid rgba(255,248,240,0.9); overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.4); }
.whc-avatar img { width:100%; height:100%; object-fit:cover; }
.whc-avatar-more { margin-left:-10px; background:linear-gradient(135deg,#F5B97A,#E8933A); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#2a1a0e; }

.whc-feature { position:relative; border-radius:28px; overflow:hidden; height:clamp(320px,42vw,540px); box-shadow:0 50px 130px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06); }
.whc-feature-img { width:100%; height:100%; object-fit:cover; transition:transform 7s ease; }
.whc-feature:hover .whc-feature-img { transform:scale(1.06); }
.whc-feature-veil { position:absolute; inset:0; background:linear-gradient(165deg, transparent 25%, rgba(10,6,3,0.92) 100%); }
.whc-feature-award { position:absolute; top:22px; left:22px; display:inline-flex; align-items:center; gap:8px; padding:7px 16px; border-radius:999px; background:rgba(232,147,58,0.16); border:1px solid rgba(245,185,122,0.4); backdrop-filter:blur(12px); }
.whc-feature-award span { font-family:var(--font-body); font-size:10px; font-weight:600; letter-spacing:0.28em; text-transform:uppercase; color:${C.amberLt}; }
.whc-feature-bottom { position:absolute; left:0; right:0; bottom:0; padding:0 28px 28px; }
.whc-feature-h { font-family:var(--font-heading); font-size:clamp(20px,2.6vw,28px); font-weight:600; color:#fff; line-height:1.15; margin:0 0 14px; }
.whc-feature-chips { display:flex; gap:8px; flex-wrap:wrap; }
.whc-feature-chip { font-family:var(--font-body); font-size:10px; font-weight:500; letter-spacing:0.05em; padding:5px 12px; border-radius:999px; color:rgba(255,255,255,0.85); background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.16); backdrop-filter:blur(8px); }

/* stat grid */
.whc-stat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
.whc-stat { overflow:hidden; padding:24px 22px 22px; display:flex; flex-direction:column; transition:transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .5s ease; }
.whc-stat:hover { transform:translateY(-8px); box-shadow:0 40px 90px rgba(0,0,0,0.5), 0 0 40px -8px var(--c); }
.whc-stat:hover::after { opacity:1; }
.whc-stat-accent { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,transparent,var(--c),transparent); }
.whc-stat-glow { position:absolute; z-index:-1; top:-50px; right:-50px; width:150px; height:150px; border-radius:50%; background:radial-gradient(circle, color-mix(in srgb, var(--c) 26%, transparent), transparent 68%); pointer-events:none; }
.whc-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.whc-stat-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb, var(--c) 14%, transparent); border:1px solid color-mix(in srgb, var(--c) 34%, transparent); }
.whc-stat-tag { font-family:var(--font-body); font-size:9px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--c); padding:4px 10px; border-radius:999px; background:color-mix(in srgb, var(--c) 14%, transparent); border:1px solid color-mix(in srgb, var(--c) 30%, transparent); }
.whc-stat-num { font-family:var(--font-heading); font-size:clamp(30px,4vw,44px); font-weight:600; line-height:1; letter-spacing:-0.03em; margin-bottom:6px; background:linear-gradient(135deg, var(--c), color-mix(in srgb, var(--c) 65%, #fff)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:var(--c); }
.whc-stat-label { font-family:var(--font-body); font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:${C.text}; }
.whc-stat-sub { font-family:var(--font-body); font-size:11px; color:${C.soft}; margin-top:2px; line-height:1.4; margin-bottom:16px; }
.whc-bar { height:3px; border-radius:2px; background:rgba(255,255,255,0.1); overflow:hidden; }
.whc-bar span { display:block; height:100%; border-radius:2px; background:linear-gradient(90deg,#E8933A,#FF7E5F); }
.whc-stat .whc-bar span { background:linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 55%, transparent)); }
.whc-stat-bullets { display:flex; flex-direction:column; gap:8px; margin-top:16px; padding-top:14px; border-top:1px solid ${C.line}; }
.whc-bullet { display:flex; align-items:center; gap:8px; }
.whc-bullet-dot { width:5px; height:5px; border-radius:50%; background:var(--c); flex-shrink:0; }
.whc-bullet span { font-family:var(--font-body); font-size:11.5px; color:${C.soft}; line-height:1.3; }

/* reliability + global */
.whc-reli-grid { display:grid; grid-template-columns:1.2fr 1fr; gap:22px; }
.whc-panel { padding:clamp(24px,3.5vw,38px); }
.whc-panel-head { display:flex; justify-content:space-between; align-items:flex-start; gap:14px; margin-bottom:26px; }
.whc-panel-title { font-family:var(--font-heading); font-size:clamp(20px,3vw,26px); font-weight:600; color:${C.text}; line-height:1.15; margin:0; }
.whc-panel-sub { font-family:var(--font-body); font-size:14px; color:${C.soft}; margin-top:10px; line-height:1.7; }
.whc-panel-badge { width:48px; height:48px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:rgba(232,147,58,0.12); border:1px solid rgba(232,147,58,0.24); }
.whc-float { animation: whc-float 4s ease-in-out infinite; }
.whc-feat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:18px; }
.whc-feat { display:flex; gap:12px; align-items:flex-start; }
.whc-feat-icon { width:38px; height:38px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:rgba(245,185,122,0.12); border:1px solid rgba(245,185,122,0.24); }
.whc-feat-title { font-family:var(--font-body); font-size:12.5px; font-weight:600; color:${C.text}; line-height:1.3; }
.whc-feat-desc { font-family:var(--font-body); font-size:11px; color:${C.soft}; margin-top:4px; line-height:1.5; }
.whc-countries { display:flex; flex-wrap:wrap; gap:8px; }
.whc-country { display:inline-flex; align-items:center; gap:7px; padding:6px 13px; border-radius:999px; background:rgba(255,255,255,0.05); border:1px solid ${C.glassBorder}; transition:transform .28s cubic-bezier(0.16,1,0.3,1), background .28s, border-color .28s; }
.whc-country:hover { transform:translateY(-3px) scale(1.04); background:rgba(232,147,58,0.14); border-color:rgba(232,147,58,0.4); }
.whc-country span { font-family:var(--font-body); font-size:11.5px; font-weight:500; color:${C.text}; }
.whc-global-stats { margin-top:auto; padding:18px 22px; border-radius:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; background:linear-gradient(135deg, rgba(232,147,58,0.16), rgba(255,126,95,0.08)); border:1px solid rgba(232,147,58,0.24); }
.whc-global-num { font-family:var(--font-heading); font-size:26px; font-weight:600; color:${C.amberLt}; line-height:1; }
.whc-global-cap { font-family:var(--font-body); font-size:11px; color:${C.soft}; margin-top:3px; }

/* process */
.whc-process { position:relative; z-index:2; padding:64px 0 60px; }
.whc-carousel-wrap { position:relative; overflow:hidden; }
.whc-arrow { position:absolute; top:50%; transform:translateY(-60%); z-index:20; width:48px; height:48px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.16); background:rgba(255,255,255,0.07); backdrop-filter:blur(14px); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .2s, opacity .2s, transform .2s; }
.whc-arrow:not(:disabled):hover { background:rgba(232,147,58,0.22); transform:translateY(-60%) scale(1.08); }
.whc-arrow:disabled { opacity:0.18; cursor:not-allowed; }
.whc-track-outer { overflow:visible; width:100%; }
.whc-track { display:flex; gap:${CARD_GAP}px; padding:24px 0 40px; will-change:transform; transition:transform .65s cubic-bezier(0.16,1,0.3,1); }
.whc-pcard { flex-shrink:0; border-radius:22px; overflow:hidden; display:flex; flex-direction:column; cursor:pointer; background:linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(20,13,8,0.6); border:1px solid ${C.glassBorder}; box-shadow:0 8px 24px rgba(0,0,0,0.3); transition:opacity .5s ease, transform .5s ease, filter .5s ease, box-shadow .5s ease; }
.whc-pcard.is-active { cursor:default; box-shadow:0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,147,58,0.3), 0 0 60px -20px rgba(232,147,58,0.6); }
.whc-pcard-img { position:relative; width:100%; height:clamp(180px,26vw,250px); overflow:hidden; flex-shrink:0; }
.whc-pcard-img img { width:100%; height:100%; object-fit:cover; }
.whc-pcard-img::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, transparent 40%, rgba(20,13,8,0.85)); }
.whc-pcard-num { position:absolute; top:16px; left:16px; z-index:2; display:inline-flex; align-items:center; gap:8px; padding:6px 13px; border-radius:999px; background:rgba(10,6,3,0.55); border:1px solid rgba(245,185,122,0.35); backdrop-filter:blur(10px); }
.whc-pcard-num span { font-family:var(--font-body); font-size:11px; font-weight:700; letter-spacing:0.15em; color:${C.amberLt}; }
.whc-pcard-body { padding:22px 24px 24px; flex:1; display:flex; flex-direction:column; gap:14px; }
.whc-pcard-title { font-family:var(--font-heading); font-size:clamp(18px,2vw,22px); font-weight:600; color:${C.amberLt}; margin:0; line-height:1.2; }
.whc-pcard-desc { font-family:var(--font-body); font-size:clamp(13px,1.1vw,14px); color:${C.soft}; line-height:1.75; margin:0; flex:1; }
.whc-pcard-footer { display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid ${C.line}; margin-top:auto; }
.whc-pcard-step { font-family:var(--font-body); font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:${C.amberLt}; }
.whc-dots { display:flex; justify-content:center; align-items:center; gap:8px; position:relative; z-index:2; }
.whc-dot { height:7px; border-radius:4px; border:none; padding:0; cursor:pointer; transition:all .35s ease; }

/* brands */
.whc-brands-grid { display:grid; grid-template-columns:380px 1fr; gap:28px; align-items:start; }
.whc-cap { margin-top:32px; padding:22px 24px; border-radius:18px; background:rgba(255,255,255,0.04); border:1px solid ${C.glassBorder}; }
.whc-cap-label { font-family:var(--font-body); font-size:10.5px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${C.amberLt}; margin-bottom:18px; }
.whc-cap-row { display:flex; justify-content:space-between; margin-bottom:7px; font-family:var(--font-body); font-size:12.5px; font-weight:500; color:${C.text}; }
.whc-brands-cardhead { padding:22px 28px 18px; border-bottom:1px solid ${C.line}; }
.whc-brands-cardhead h4 { font-family:var(--font-heading); font-size:19px; font-weight:600; color:${C.text}; margin:0; }
.whc-brands-cardhead p { font-family:var(--font-body); font-size:13px; color:${C.soft}; margin-top:4px; }
.whc-brand-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:${C.line}; }
.whc-brand { display:flex; flex-direction:column; align-items:center; gap:10px; text-align:center; padding:24px 18px; position:relative; overflow:hidden; background:rgba(20,13,8,0.4); border:1px solid transparent; transition:all .3s ease; text-decoration:none; color:inherit; }
.whc-brand:hover { background:rgba(232,147,58,0.08); border-color:rgba(232,147,58,0.4); box-shadow:inset 0 0 0 1px rgba(232,147,58,0.25); }
.whc-brand-logo { width:80px; height:80px; border-radius:16px; background:#fff; border:1px solid rgba(245,185,122,0.25); box-shadow:0 4px 16px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; overflow:hidden; padding:8px; }
.whc-brand-logo img { width:100%; height:100%; object-fit:contain; }
.whc-brand-name { font-family:var(--font-body); font-size:18px; font-weight:700; color:${C.text}; }
.whc-brand-desc { font-family:var(--font-body); font-size:11px; color:${C.soft}; line-height:1.45; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.whc-brand-view { opacity:0; transform:translateY(8px); transition:all .3s ease; font-family:var(--font-body); font-size:10.5px; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:${C.amber}; margin-top:2px; }
.whc-brand:hover .whc-brand-view { opacity:1; transform:translateY(0); }
.whc-brands-link { padding:13px 28px; text-align:center; border-bottom:1px solid ${C.line}; }
.whc-brands-link a { font-family:var(--font-body); font-size:12px; font-weight:500; color:${C.amberLt}; text-decoration:none; }
.whc-brands-stats { display:grid; grid-template-columns:repeat(3,1fr); }
.whc-brands-stats > div { padding:18px 0; text-align:center; }
.whc-brands-stats p { font-family:var(--font-heading); font-size:clamp(16px,3vw,22px); font-weight:600; color:${C.text}; margin:0; }
.whc-brands-stats span { font-family:var(--font-body); font-size:11px; color:${C.soft}; margin-top:3px; display:block; }

/* testimonials */
.whc-testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; }
.whc-testi { padding:clamp(24px,3vw,32px) clamp(20px,2.5vw,30px); display:flex; flex-direction:column; transition:transform .45s cubic-bezier(0.16,1,0.3,1), box-shadow .45s ease; }
.whc-testi:hover { transform:translateY(-8px); box-shadow:0 44px 100px rgba(0,0,0,0.5); }
.whc-testi:hover::after { opacity:1; }
.whc-testi-text { font-family:var(--font-body); font-size:14px; color:${C.text}; line-height:1.75; font-style:italic; margin-top:8px; flex:1; opacity:0.9; }
.whc-testi-foot { display:flex; align-items:center; gap:14px; margin-top:26px; padding-top:20px; border-top:1px solid ${C.line}; flex-wrap:wrap; }
.whc-testi-avatar { width:46px; height:46px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#F5B97A,#E8933A); display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; color:#2a1a0e; font-family:var(--font-body); }
.whc-testi-name { font-family:var(--font-body); font-size:13.5px; font-weight:600; color:${C.text}; }
.whc-testi-role { font-family:var(--font-body); font-size:11.5px; color:${C.soft}; margin-top:2px; }
.whc-testi-tag { font-family:var(--font-body); font-size:9px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:${C.amberLt}; background:rgba(232,147,58,0.12); border:1px solid rgba(232,147,58,0.3); border-radius:999px; padding:5px 11px; white-space:nowrap; }
.whc-testi-note { margin-top:28px; text-align:center; font-family:var(--font-body); font-size:14px; color:${C.soft}; }
.whc-testi-note a { color:${C.amberLt}; font-weight:600; text-decoration:underline; text-underline-offset:2px; }

/* cta */
.whc-cta { overflow:hidden; }
.whc-cta-bar { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#F5B97A,#FF7E5F 30%,#FFB88C 55%,#FF7E5F 75%,#F5B97A); background-size:200% auto; animation: whc-shimmer 5s linear infinite; }
.whc-cta-inner { padding:48px 52px; display:grid; grid-template-columns:1fr 1px 1fr 1px auto; gap:44px; align-items:center; }
.whc-cta-divider { width:1px; height:80px; background:${C.line}; align-self:center; }
.whc-eyebrow { font-family:var(--font-body); font-size:10px; font-weight:600; letter-spacing:0.35em; text-transform:uppercase; color:${C.amberLt}; margin-bottom:14px; }
.whc-cta-title { font-family:var(--font-heading); font-size:clamp(24px,4vw,34px); font-weight:600; color:${C.text}; line-height:1.12; margin:0; }
.whc-cta-desc { font-family:var(--font-body); font-size:clamp(14px,1.4vw,16px); color:${C.soft}; margin-top:14px; line-height:1.75; }
.whc-cta-eyebrow2 { font-family:var(--font-body); font-size:10px; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:${C.amberLt}; margin-bottom:14px; }
.whc-cta-chips { display:flex; flex-wrap:wrap; gap:8px; }
.whc-cta-chip { display:inline-flex; align-items:center; gap:7px; font-family:var(--font-body); font-size:12px; font-weight:500; color:${C.text}; background:rgba(255,255,255,0.05); border:1px solid ${C.glassBorder}; border-radius:999px; padding:7px 14px; }
.whc-cta-btns { display:flex; flex-direction:column; gap:12px; align-items:center; }
.whc-btn-primary { position:relative; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; width:100%; border-radius:999px; padding:14px 32px; font-family:var(--font-body); font-size:13px; font-weight:600; color:#fff; background:linear-gradient(to right,#FF7E5F,#FFB88C); box-shadow:0 22px 60px rgba(255,126,95,0.4); text-decoration:none; white-space:nowrap; border:none; transition:transform .35s cubic-bezier(0.16,1,0.3,1), box-shadow .35s ease; }
.whc-btn-primary::before { content:''; position:absolute; top:0; bottom:0; left:0; width:40%; background:linear-gradient(100deg,transparent,rgba(255,255,255,0.55),transparent); transform:translateX(-150%) skewX(-18deg); }
.whc-btn-primary:hover { transform:translateY(-3px) scale(1.04); box-shadow:0 28px 80px rgba(255,126,95,0.5); }
.whc-btn-primary:hover::before { animation: whc-sheen .9s cubic-bezier(0.22,1,0.36,1); }
.whc-btn-ghost { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; border-radius:999px; border:1px solid rgba(245,185,122,0.35); background:rgba(255,255,255,0.04); padding:10px 24px; font-family:var(--font-body); font-size:13px; font-weight:500; color:${C.text}; text-decoration:none; white-space:nowrap; transition:background .2s, border-color .2s; }
.whc-btn-ghost:hover { background:rgba(232,147,58,0.12); border-color:rgba(232,147,58,0.5); }
.whc-cta-fine { font-family:var(--font-body); font-size:10.5px; color:${C.mute}; text-align:center; line-height:1.55; }

/* marquee */
.whc-marquee { position:relative; z-index:2; overflow:hidden; margin-top:24px; padding:16px 0; border-top:1px solid ${C.line}; border-bottom:1px solid ${C.line}; background:linear-gradient(90deg, rgba(232,147,58,0.08), rgba(255,126,95,0.05)); }
.whc-marquee-track { display:flex; white-space:nowrap; width:max-content; animation: whc-marquee 32s linear infinite; }
.whc-marquee-item { display:inline-flex; align-items:center; gap:9px; padding:0 30px; font-family:var(--font-body); font-size:12.5px; font-weight:500; color:${C.text}; }

/* responsive */
@media (max-width:1024px) {
	.whc-hero-grid { grid-template-columns:1fr; gap:36px; }
	.whc-stat-grid { grid-template-columns:1fr 1fr; }
	.whc-reli-grid { grid-template-columns:1fr; }
	.whc-brands-grid { grid-template-columns:1fr; }
	.whc-cta-inner { grid-template-columns:1fr; gap:28px; padding:36px; }
	.whc-cta-divider { display:none; }
}
@media (max-width:768px) {
	.whc-pad { padding:72px 20px 32px; }
	.whc-pad-tight { padding-top:32px; padding-bottom:32px; }
	.whc-testi-grid { grid-template-columns:1fr; }
	.whc-brand-grid { grid-template-columns:repeat(2,1fr); }
	.whc-arrow { width:40px; height:40px; }
	.whc-cta-inner { padding:32px 24px; }
}
@media (max-width:460px) {
	.whc-stat-grid { grid-template-columns:1fr; }
	.whc-brand-grid { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion: reduce) {
	.whc-orb, .whc-float, .whc-h-accent, .whc-cta-bar, .whc-badge-dot, .whc-marquee-track { animation:none !important; }
	.whc-btn-primary::before { display:none !important; }
}
`;
