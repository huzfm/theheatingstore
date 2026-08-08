'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const EASE = [0.16, 1, 0.3, 1];

const FAQ_SECTIONS = [
	{
		section: 'Basics',
		faqs: [
			{ q: 'What is an Electric Hamam?', a: 'An electric hamam is a modern radiant underfloor heating system designed to heat both the floor and the entire room evenly. Heating mats or cables are installed beneath the floor surface inside a concrete screed layer, allowing warmth to radiate naturally upward. Unlike traditional wood-fired hamams, electric hammam systems require no wood, no smoke, no fuel storage, and no daily maintenance.' },
			{ q: 'How does electric underfloor heating work?', a: 'Electric underfloor heating uses specially designed heating mats or cables installed beneath the floor surface. The system gently warms the concrete layer, which then radiates heat evenly across the room. This creates comfortable, consistent warmth without the cold spots associated with traditional heating methods.' },
			{ q: 'Can electric hamam heat the whole room?', a: 'Yes. Our electric hamam systems are designed not only to warm the floor, but also to heat the entire room evenly. With proper coverage and insulation, the system works as a complete room heating solution for Kashmir winters.' },
			{ q: 'Is electric hamam suitable for Kashmir winters?', a: 'Yes. Our electric floor heating systems are specifically designed for Kashmir\'s cold climate, including snowfall and sub-zero temperatures. The heated concrete layer stores warmth for long periods, helping maintain comfort even during power cuts.' },
			{ q: 'What temperature can electric hamam reach?', a: 'Standard systems comfortably maintain room temperatures between 15°C and 18°C during winter, while floor temperatures can be adjusted significantly higher if required. Custom commercial systems can also be designed for specialised heating applications.' },
		],
	},
	{
		section: 'Cost & Electricity',
		faqs: [
			{ q: 'How much electricity does electric hamam consume?', a: 'Electric hamam systems typically use 150W to 200W heating systems depending on the room specification. Actual electricity usage depends on insulation, room size, outdoor temperature, and thermostat settings.' },
			{ q: 'Is electric hamam expensive to run?', a: 'No. Most customers find electric hammam systems surprisingly economical compared to traditional heating methods. A standard 10x10 room typically costs around ₹1500–₹1800 per month to operate depending on usage patterns and insulation.' },
			{ q: 'How much does electric hamam installation cost in Kashmir?', a: 'The installed cost of electric underfloor heating in Kashmir generally ranges between ₹180 and ₹350 per sq ft depending on the heating system, insulation specification, floor type, and thermostat selected.' },
			{ q: 'Does underfloor heating save energy compared to traditional heating?', a: 'Yes. Radiant floor heating distributes warmth evenly and retains heat inside the concrete layer, reducing energy wastage. Our adaptive variable wattage systems are also designed to improve energy efficiency further.' },
			{ q: 'Do electric hammam systems work during power cuts?', a: 'Yes. Because the heating system is embedded inside a concrete screed layer, the floor retains warmth for several hours even after electricity is disconnected. Depending on the system and insulation, rooms can remain comfortable for 6–10 hours.' },
		],
	},
	{
		section: 'Comparison',
		faqs: [
			{ q: 'Electric hamam vs traditional wood-fired hamam, which is better?', a: 'Electric hammam systems offer cleaner operation, easier control, lower maintenance, and more even heating compared to traditional wood-fired hamams. There is no wood storage, smoke, ash, kerosene, or chimney cleaning required.' },
			{ q: 'Why are families switching to electric hamam?', a: 'Many families now prefer electric hammam systems because they are cleaner, easier to use, and more comfortable. Heating can be controlled with a thermostat instead of manually burning wood every day.' },
			{ q: 'Does electric hamam produce smoke or dry air?', a: 'No. Electric radiant floor heating produces no smoke, fumes, or dry forced air. Unlike hot-and-cold AC systems, it heats the room gently and evenly without creating uncomfortable airflow.' },
			{ q: 'Is electric hamam healthier than forced-air heating?', a: 'Yes. Radiant floor heating does not circulate dust, allergens, or dry air around the room. Many customers prefer underfloor heating because it creates a more comfortable indoor environment during winter.' },
			{ q: 'Can carpets be used over electric hamam?', a: 'Yes. Traditional Kashmiri carpets can safely be used over electric hamam systems. Carpet remains one of the most commonly used floor finishes in Kashmir homes with underfloor heating.' },
		],
	},
	{
		section: 'Installation',
		faqs: [
			{ q: 'Can electric hamam be installed in existing homes?', a: 'Yes. Electric underfloor heating can be installed in both new construction projects and existing homes during renovation work.' },
			{ q: 'What floor finishes are compatible with electric underfloor heating?', a: 'Electric underfloor heating systems are compatible with carpet, marble, granite, tile, stone, and selected laminate flooring systems.' },
			{ q: 'Can laminate wood flooring be used with underfloor heating?', a: 'Yes. Selected laminate flooring systems can be used with electric underfloor heating. We generally recommend laminate flooring with suitable thermal specifications and thickness compatibility.' },
			{ q: 'How long does electric hamam installation take?', a: 'Most standard room installations are completed within approximately 5–6 hours, excluding floor drying and finishing time.' },
			{ q: 'What is the floor build-up required for electric hamam?', a: 'The system is installed inside a concrete screed structure consisting of insulation, screed, heating mat installation, and a second screed layer before the final floor finish is applied.' },
			{ q: 'Do you install heating mats or loose heating cables?', a: 'We primarily install pre-spaced heating mats for better consistency and efficiency. Loose heating cables are generally used only in smaller or irregular spaces such as bathrooms and washrooms.' },
		],
	},
	{
		section: 'Safety & Reliability',
		faqs: [
			{ q: 'Is electric hamam safe?', a: 'Yes. Our electric underfloor heating systems are designed with multiple safety protections and use certified heating components suitable for residential and commercial applications.' },
			{ q: 'Is underfloor heating safe in bathrooms and wet areas?', a: 'Yes. Electric underfloor heating systems can safely be installed in bathrooms and wet areas when the correct waterproofing and floor specification guidelines are followed.' },
			{ q: 'How long does electric hamam last?', a: 'Electric underfloor heating systems are designed to last for decades with minimal maintenance. Typical system lifespan is around 25 years or more depending on usage conditions.' },
			{ q: 'What warranty do you provide?', a: 'Selected systems include lifetime warranties along with manufacturer guarantees ranging from 10 to 25 years depending on the product selected.' },
			{ q: 'What happens if the heating cable gets damaged?', a: 'If accidental damage occurs during installation by our team, the heating system is replaced. Damage caused later by drilling or external construction work is not covered under warranty.' },
		],
	},
	{
		section: 'Advanced & Kashmir-Specific',
		faqs: [
			{ q: 'What is variable wattage electric hamam?', a: 'Variable wattage technology automatically adjusts heating performance based on operating conditions, helping improve comfort and energy efficiency. Our systems are among the few in India offering this advanced technology.' },
			{ q: 'Which underfloor heating system is best for Kashmir homes?', a: 'Systems designed specifically for Kashmir should focus on heat retention, radiant comfort, and efficient room heating during sub-zero winters. Proper coverage and screed design are equally important for performance.' },
			{ q: 'Can electric underfloor heating work in wooden Kashmiri homes?', a: 'Yes. Electric underfloor heating can be installed in many traditional Kashmiri homes, including selected wooden constructions, depending on the floor structure and insulation design.' },
			{ q: 'Can electric hammam systems be used in hotels and commercial spaces?', a: 'Yes. Electric floor heating systems are widely used in homes, hotels, villas, washrooms, spas, and commercial spaces requiring comfortable radiant heating.' },
			{ q: 'Can electric heating systems be customised for industrial applications?', a: 'Yes. Custom heating systems can be designed for specialised commercial and industrial applications including drying rooms, warehouses, and temperature-controlled processing areas.' },
		],
	},
];

function pad(n) {
	return String(n).padStart(2, '0');
}

/* Splits an answer into words wrapped in spans for an upward reveal, staggered on open. */
function RevealText({ text, active }) {
	const words = useMemo(() => text.split(' '), [text]);
	return (
		<p
			style={{
				fontFamily: 'var(--font-body)',
				fontSize: 'clamp(14px, 1.4vw, 16px)',
				lineHeight: 1.85,
				color: '#6B5642',
				margin: 0,
				fontWeight: 400,
			}}>
			{words.map((word, i) => (
				<span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
					<motion.span
						style={{ display: 'inline-block', willChange: 'transform' }}
						initial={{ y: '110%', filter: 'blur(6px)' }}
						animate={active ? { y: '0%', filter: 'blur(0px)' } : { y: '110%', filter: 'blur(6px)' }}
						transition={{
							duration: 0.65,
							ease: EASE,
							delay: active ? 0.1 + i * 0.012 : 0,
						}}>
						{word}
						{i < words.length - 1 ? ' ' : ''}
					</motion.span>
				</span>
			))}
		</p>
	);
}

function FaqCard({ faq, index, isOpen, onToggle, interactive = true }) {
	const cardRef = useRef(null);

	const mx = useMotionValue(0.5);
	const my = useMotionValue(0.5);
	const springMx = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.4 });
	const springMy = useSpring(my, { stiffness: 150, damping: 20, mass: 0.4 });

	const rotateX = useTransform(springMy, [0, 1], [4, -4]);
	const rotateY = useTransform(springMx, [0, 1], [-4, 4]);
	const spotlightX = useTransform(springMx, [0, 1], ['10%', '90%']);
	const spotlightY = useTransform(springMy, [0, 1], ['10%', '90%']);

	function handleMouseMove(e) {
		const rect = cardRef.current?.getBoundingClientRect();
		if (!rect) return;
		mx.set((e.clientX - rect.left) / rect.width);
		my.set((e.clientY - rect.top) / rect.height);
	}

	function handleMouseLeave() {
		mx.set(0.5);
		my.set(0.5);
	}

	return (
		<motion.div
			ref={cardRef}
			onMouseMove={interactive ? handleMouseMove : undefined}
			onMouseLeave={interactive ? handleMouseLeave : undefined}
			style={
				interactive
					? {
							position: 'relative',
							borderRadius: 30,
							perspective: 1400,
							rotateX: isOpen ? 0 : rotateX,
							rotateY: isOpen ? 0 : rotateY,
							transformStyle: 'preserve-3d',
							willChange: 'transform',
					  }
					: { position: 'relative', borderRadius: 30 }
			}
			whileHover={interactive ? { scale: isOpen ? 1 : 1.008 } : undefined}
			transition={{ duration: 0.5, ease: EASE }}
			className="faq-card-shell">
			{/* spotlight */}
			<motion.div
				aria-hidden
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 30,
					pointerEvents: 'none',
					opacity: isOpen ? 1 : 0,
					background: useTransform(
						[spotlightX, spotlightY],
						([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgba(232,140,42,0.16), transparent 60%)`
					),
					transition: 'opacity 0.4s ease',
					zIndex: 0,
				}}
			/>

			<motion.div
				layout
				transition={{ layout: { duration: 0.7, ease: EASE } }}
				className={`faq-card ${isOpen ? 'faq-card--open' : ''}`}
				style={{ position: 'relative', zIndex: 1 }}>
				<button onClick={onToggle} className="faq-card-trigger" aria-expanded={isOpen}>
					<span className="faq-card-index">{pad(index + 1)}</span>

					<motion.span
						layout="position"
						transition={{ duration: 0.6, ease: EASE }}
						className="faq-card-question"
						style={{ color: isOpen ? '#8B3A2A' : '#2C1810' }}>
						{faq.q}
					</motion.span>

					<motion.span
						animate={{ rotate: isOpen ? 135 : 0, backgroundColor: isOpen ? '#8B3A2A' : 'rgba(139,58,42,0.06)' }}
						transition={{ duration: 0.55, ease: EASE }}
						className="faq-card-icon">
						<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#FFF7EF' : '#8B3A2A'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</motion.span>
				</button>

				<AnimatePresence initial={false}>
					{isOpen && (
						<motion.div
							key="content"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{
								height: { duration: 0.65, ease: EASE },
								opacity: { duration: 0.4, ease: EASE },
							}}
							style={{ overflow: 'hidden' }}>
							<div className="faq-card-answer">
								<motion.div
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									exit={{ scaleX: 0 }}
									transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
									className="faq-card-divider"
								/>
								<RevealText text={faq.a} active={isOpen} />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}

function FloatingBlobs({ animate = true }) {
	// On mobile the blobs are rendered static: continuously animating three
	// large blur(90px) layers forces a full re-rasterisation every frame,
	// which is the main cause of the jitter on phones. Static blobs keep the
	// warm ambient wash at zero per-frame cost.
	if (!animate) {
		return (
			<div className="faq-blobs" aria-hidden>
				<div className="faq-blob faq-blob--1" />
				<div className="faq-blob faq-blob--2" />
				<div className="faq-blob faq-blob--3" />
			</div>
		);
	}

	return (
		<div className="faq-blobs" aria-hidden>
			<motion.div
				className="faq-blob faq-blob--1"
				animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
				transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
			/>
			<motion.div
				className="faq-blob faq-blob--2"
				animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
				transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
			/>
			<motion.div
				className="faq-blob faq-blob--3"
				animate={{ x: [0, 30, -40, 0], y: [0, -20, 30, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
			/>
		</div>
	);
}

export default function FaqSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.08 });
	const [activeSection, setActiveSection] = useState('Basics');
	const [openIndex, setOpenIndex] = useState(null);

	// Phones (and any coarse-pointer device) get the low-cost render: no
	// continuous blob animation, no per-card 3D tilt, no live backdrop-blur 
	// all of which jitter on mobile GPUs. Desktop keeps the full treatment.
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia('(max-width: 640px), (hover: none)');
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	}, []);

	const currentFaqs = FAQ_SECTIONS.find((s) => s.section === activeSection)?.faqs || [];

	function handleSectionChange(section) {
		setActiveSection(section);
		setOpenIndex(null);
	}

	function handleToggle(i) {
		setOpenIndex((prev) => (prev === i ? null : i));
	}

	return (
		<section className="faq-wrap" ref={ref}>
			<style>{`
				.faq-wrap {
					position: relative;
					overflow: hidden;
					background: linear-gradient(180deg, #FFF7EF 0%, #F8F4EE 45%, #F6F0E8 100%);
					padding: 140px 0 160px;
				}

				.faq-noise {
					position: absolute;
					inset: -10%;
					pointer-events: none;
					opacity: 0.05;
					mix-blend-mode: multiply;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
					z-index: 1;
				}

				.faq-vignette {
					position: absolute;
					inset: 0;
					pointer-events: none;
					background: radial-gradient(120% 90% at 50% 0%, transparent 55%, rgba(44,24,16,0.05) 100%);
					z-index: 1;
				}

				.faq-blobs { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
				.faq-blob {
					position: absolute;
					border-radius: 50%;
					filter: blur(90px);
					will-change: transform;
				}
				.faq-blob--1 { width: 480px; height: 480px; top: -120px; left: -100px; background: radial-gradient(circle, rgba(232,140,42,0.22), transparent 70%); }
				.faq-blob--2 { width: 560px; height: 560px; bottom: -180px; right: -140px; background: radial-gradient(circle, rgba(196,98,58,0.16), transparent 70%); }
				.faq-blob--3 { width: 380px; height: 380px; top: 40%; left: 55%; background: radial-gradient(circle, rgba(255,224,178,0.35), transparent 70%); }

				.faq-inner {
					position: relative;
					z-index: 2;
					max-width: 1500px;
					margin: 0 auto;
					padding: 0 48px;
					display: grid;
					grid-template-columns: minmax(260px, 380px) 1fr;
					gap: 80px;
				}

				.faq-left { position: sticky; top: 120px; align-self: start; }

				.faq-eyebrow {
					display: inline-flex;
					align-items: center;
					gap: 10px;
					font-family: var(--font-body);
					font-size: 11px;
					font-weight: 600;
					text-transform: uppercase;
					letter-spacing: 0.35em;
					color: #B86B45;
					margin-bottom: 28px;
				}
				.faq-eyebrow-num { color: #C4623A; font-variant-numeric: tabular-nums; }

				.faq-heading {
					font-family: var(--font-heading);
					font-size: clamp(40px, 5vw, 72px);
					line-height: 0.98;
					font-weight: 400;
					letter-spacing: 0.005em;
					color: #2C1810;
					margin: 0 0 24px;
				}

				.faq-subtitle {
					font-family: var(--font-body);
					font-size: clamp(14px, 1.3vw, 16px);
					line-height: 1.8;
					color: #7A6650;
					max-width: 340px;
					margin: 0 0 28px;
					font-weight: 400;
				}

				.faq-tabs {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					gap: 8px;
				}
				.faq-tab {
					display: flex;
					align-items: center;
					gap: 10px;
					cursor: pointer;
					padding: 10px 18px;
					text-align: left;
					font-family: var(--font-body);
					font-size: 14px;
					font-weight: 500;
					color: #9C8266;
					border-radius: 999px;
					background: rgba(139,58,42,0.05);
					border: 1px solid rgba(139,58,42,0.12);
					transition: color 0.35s ease, background 0.35s ease, border-color 0.35s ease;
				}
				.faq-tab:hover { color: #8B3A2A; background: rgba(139,58,42,0.09); }
				.faq-tab--active,
				.faq-tab--active:hover {
					color: #FFF7EF;
					font-weight: 600;
					background: #8B3A2A;
					border-color: #8B3A2A;
				}
				.faq-tab-dot {
					width: 5px;
					height: 5px;
					border-radius: 50%;
					background: currentColor;
					opacity: 0.35;
					flex-shrink: 0;
					transition: opacity 0.4s ease, transform 0.4s ease;
				}
				.faq-tab--active .faq-tab-dot { opacity: 1; transform: scale(1.2); }

				.faq-right { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

				.faq-card-shell { transform-style: preserve-3d; }

				.faq-card {
					border-radius: 30px;
					background: rgba(255,255,255,0.55);
					backdrop-filter: blur(26px);
					-webkit-backdrop-filter: blur(26px);
					border: 1px solid rgba(255,255,255,0.6);
					box-shadow: 0 8px 30px rgba(60,42,37,0.06), 0 1px 0 rgba(255,255,255,0.8) inset;
					transition: box-shadow 0.6s ease, border-color 0.6s ease, background 0.6s ease;
				}

				.faq-card--open {
					background: rgba(255,255,255,0.78);
					border-color: rgba(232,140,42,0.35);
					box-shadow: 0 30px 70px rgba(139,58,42,0.14), 0 0 0 1px rgba(232,140,42,0.12), 0 1px 0 rgba(255,255,255,0.9) inset;
				}

				.faq-card-trigger {
					width: 100%;
					display: flex;
					align-items: center;
					gap: 24px;
					background: none;
					border: none;
					cursor: pointer;
					text-align: left;
					padding: 30px 34px;
				}

				.faq-card-index {
					font-family: var(--font-body);
					font-size: 12px;
					font-weight: 600;
					letter-spacing: 0.1em;
					color: #C4623A;
					opacity: 0.55;
					flex-shrink: 0;
					font-variant-numeric: tabular-nums;
				}

				.faq-card-question {
					flex: 1;
					font-family: var(--font-heading);
					font-size: clamp(16px, 1.7vw, 21px);
					font-weight: 400;
					letter-spacing: 0.01em;
					line-height: 1.35;
				}

				.faq-card-icon {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-shrink: 0;
					border: 1px solid rgba(139,58,42,0.15);
				}

				.faq-card-answer { padding: 0 34px 34px 78px; }

				.faq-card-divider {
					height: 1px;
					width: 100%;
					transform-origin: left;
					background: linear-gradient(90deg, rgba(196,98,58,0.4), transparent);
					margin-bottom: 20px;
				}

				@media (max-width: 1080px) {
					.faq-inner { grid-template-columns: 1fr; gap: 56px; padding: 0 28px; }
					.faq-left { position: static; }
					.faq-subtitle { max-width: 520px; }
					.faq-tabs { flex-direction: row; flex-wrap: wrap; gap: 8px; }
				}

				@media (max-width: 640px) {
					.faq-wrap { padding: 96px 0 110px; }
					.faq-card-trigger { padding: 22px 20px; gap: 14px; }
					.faq-card-answer { padding: 0 20px 26px 20px; }
					.faq-card-index { display: none; }
					.faq-subtitle { margin-bottom: 20px; }
					.faq-tab { padding: 9px 16px; gap: 8px; font-size: 13px; }
				}

				/* Coarse-pointer / small-screen devices: kill the effects that jitter
				   on mobile GPUs. Live backdrop-blur recomputed against moving/blurred
				   layers is the worst offender, so cards fall back to a solid warm
				   surface; the 3D compositing layer is flattened and the static blobs
				   drop their will-change hint. */
				@media (max-width: 640px), (hover: none) {
					.faq-card {
						backdrop-filter: none;
						-webkit-backdrop-filter: none;
						background: #FFFCF7;
					}
					.faq-card--open { background: #FFFDFA; }
					.faq-card-shell { transform-style: flat; will-change: auto; }
					.faq-blob { will-change: auto; }
				}
			`}</style>

			<FloatingBlobs animate={!isMobile} />
			<div className="faq-noise" />
			<div className="faq-vignette" />

			<div className="faq-inner">
				<div className="faq-left">

					<motion.h2
						initial={{ opacity: 0, y: 24 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
						className="faq-heading">
						Questions,
						<br />
						answered.
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.8, ease: EASE, delay: 0.22 }}
						className="faq-subtitle">
						Everything you need to know about electric hamam and radiant underfloor
						heating from cost and installation to safety and performance in
						Kashmir winters.
					</motion.p>

					<motion.div
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : {}}
						transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
						className="faq-tabs">
						{FAQ_SECTIONS.map((s) => (
							<button
								key={s.section}
								onClick={() => handleSectionChange(s.section)}
								className={`faq-tab ${activeSection === s.section ? 'faq-tab--active' : ''}`}>
								<span className="faq-tab-dot" />
								{s.section}
							</button>
						))}
					</motion.div>
				</div>

				<div className="faq-right">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeSection}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.35, ease: EASE }}
							style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
							{currentFaqs.map((faq, i) => (
								<motion.div
									key={faq.q}
									initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
									animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
									transition={{ duration: 0.75, ease: EASE, delay: 0.15 + i * 0.08 }}>
									<FaqCard
										faq={faq}
										index={i}
										isOpen={openIndex === i}
										onToggle={() => handleToggle(i)}
										interactive={!isMobile}
									/>
								</motion.div>
							))}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</section>
	);
}
