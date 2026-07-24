'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

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
			{ q: 'Electric hamam vs traditional wood-fired hamam — which is better?', a: 'Electric hammam systems offer cleaner operation, easier control, lower maintenance, and more even heating compared to traditional wood-fired hamams. There is no wood storage, smoke, ash, kerosene, or chimney cleaning required.' },
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

function FaqItem({ faq, index, inView }) {
	const [open, setOpen] = useState(false);
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay: 0.15 + index * 0.06, ease: EASE }}
			style={{ borderBottom: '1px solid rgba(184,107,69,0.12)' }}>
			<button
				onClick={() => setOpen(!open)}
				style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
				<span style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', fontWeight: 600, color: open ? '#8B3A2A' : '#2C1810', lineHeight: 1.3, flex: 1 }}>
					{faq.q}
				</span>
				<span style={{ width: 32, height: 32, borderRadius: '50%', background: open ? '#8B3A2A' : 'rgba(139,58,42,0.08)', border: '1px solid rgba(139,58,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s ease' }}>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke={open ? 'white' : '#8B3A2A'} strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'
						style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
						<polyline points='6 9 12 15 18 9' />
					</svg>
				</span>
			</button>
			{open && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					transition={{ duration: 0.3, ease: EASE }}
					style={{ paddingBottom: 20, overflow: 'hidden' }}>
					<p style={{ fontFamily: "var(--font-body)", fontSize: 'clamp(13px, 1.5vw, 15px)', color: '#6B4A2D', lineHeight: 1.8, margin: 0 }}>
						{faq.a}
					</p>
				</motion.div>
			)}
		</motion.div>
	);
}

export default function FaqSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, amount: 0.05 });
	const [activeSection, setActiveSection] = useState('Basics');
	const currentFaqs = FAQ_SECTIONS.find(s => s.section === activeSection)?.faqs || [];

	return (
		<>
			<style>{`
				.faq-wrap { position: relative; overflow: hidden; }
				.faq-glow { position: absolute; inset: 0; pointer-events: none; }
				.faq-content { max-width: 760px; margin: 0 auto; padding: 88px 40px 56px; position: relative; z-index: 1; }
				.faq-card { background: rgba(255,255,255,0.80); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); border: 1px solid rgba(255,255,255,0.5); border-radius: 24px; box-shadow: 0 12px 48px rgba(60,42,37,0.10); padding: 32px 36px; }
				.faq-tabs { display: flex; flex-direction: row; gap: 8px; overflow-x: auto; padding: 4px 4px 0; scrollbar-width: none; -ms-overflow-style: none; }
				.faq-tabs::-webkit-scrollbar { display: none; }
				@media (max-width: 768px) { .faq-content { padding: 64px 20px 40px; } .faq-card { padding: 24px 20px; } }
			`}</style>

			<div className='faq-wrap' style={{ backgroundImage: 'linear-gradient(180deg,#FFF4E8 0%,#FFFFFF 50%,#FFF4E8 100%)' }}>
				<div className='faq-glow' style={{ background: 'radial-gradient(50% 40% at 50% 0%, rgba(245,185,122,0.28), transparent 70%)' }} />

				<div ref={ref} className='faq-content'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.7, ease: EASE }}
						style={{ textAlign: 'center', marginBottom: 48 }}>
						<div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 24px', fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#4FA3D1', borderRadius: 999, background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 16px rgba(60,42,37,0.08)', marginBottom: 20 }}>
							<span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E88C2A', flexShrink: 0 }} />
							Common Questions
						</div>
						<h2 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.1, color: '#2C1810', margin: 0 }}>
							Frequently Asked Questions
						</h2>
						<div style={{ width: 48, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#C4623A,#E88C2A)', margin: '16px auto 0' }} />
					</motion.div>

					<div className='faq-card'>
						<div className='faq-tabs' style={{ marginBottom: 24, marginTop: 0 }}>
							{FAQ_SECTIONS.map((s) => {
								const isActive = activeSection === s.section;
								return (
									<button
										key={s.section}
										onClick={() => setActiveSection(s.section)}
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											justifyContent: 'center',
											padding: '10px 20px',
											borderRadius: 999,
											border: isActive ? 'none' : '1px solid rgba(139,58,42,0.15)',
											background: isActive ? 'linear-gradient(135deg, #8B3A2A, #B86B45)' : 'rgba(139,58,42,0.06)',
											color: isActive ? 'white' : '#8B3A2A',
											fontFamily: "var(--font-body)",
											fontSize: 13,
											fontWeight: 600,
											cursor: 'pointer',
											whiteSpace: 'nowrap',
											transition: 'all 0.2s ease',
											boxShadow: isActive ? '0 4px 16px rgba(139,58,42,0.25)' : 'none',
										}}
										onMouseEnter={(e) => {
											if (!isActive) {
												e.currentTarget.style.background = 'rgba(139,58,42,0.12)';
												e.currentTarget.style.borderColor = 'rgba(139,58,42,0.3)';
											}
										}}
										onMouseLeave={(e) => {
											if (!isActive) {
												e.currentTarget.style.background = 'rgba(139,58,42,0.06)';
												e.currentTarget.style.borderColor = 'rgba(139,58,42,0.15)';
											}
										}}>
										{s.section}
									</button>
								);
							})}
						</div>

						<AnimatePresence mode='wait'>
							<motion.div
								key={activeSection}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.25, ease: EASE }}>
								{currentFaqs.map((faq, i) => (
									<FaqItem key={faq.q} faq={faq} index={i} inView={inView} />
								))}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</>
	);
}