'use client';

import { motion } from 'framer-motion';
import OurBrands from '../components/OurBrands';
import InstallationWalkthrough from '../components/InstallationWalkthrough';

const USE_CASES = [
	{
		title: 'Luxury Villas',
		desc: 'Premium underfloor heating for modern Kashmiri villas and luxury homes across Srinagar, Gulmarg and Pahalgam',
		img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
		alt: 'Luxury Kashmiri villa with underfloor heating',
	},
	{
		title: 'Hotels & Resorts',
		desc: 'Trusted by leading hotels and resorts in Gulmarg and Pahalgam for superior guest room comfort',
		img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
		alt: 'Luxury Kashmiri hotel with underfloor heating',
	},
	{
		title: 'Residential Houses',
		desc: 'Everyday warmth for family homes across Kashmir built to handle the harshest winters',
		img: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80',
		alt: 'Kashmiri family home with electric hamam heating',
	},
	{
		title: 'Mosques',
		desc: 'Comfortable radiant warmth for worshippers across mosque floors during cold Kashmir winters',
		img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&q=80',
		alt: 'Mosque with underfloor heating installed in Kashmir',
	},
	{
		title: 'Hospitals & Clinics',
		desc: 'Hygienic, allergen free radiant heating for medical facilities, patient rooms and waiting areas',
		img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
		alt: 'Hospital with electric underfloor heating system',
	},
	{
		title: 'Schools & Colleges',
		desc: 'Energy efficient underfloor heating for classrooms and educational institutions across Jammu and Kashmir',
		img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
		alt: 'School with underfloor heating in Kashmir',
	},
	{
		title: 'Commercial Offices',
		desc: 'Silent, invisible heating for offices, showrooms and commercial spaces across the region',
		img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
		alt: 'Modern office with electric underfloor heating',
	},
];

function WhereItsUsed() {
	return (
		<section
			style={{
				backgroundImage: 'linear-gradient(180deg,#f4e7dbff 0%,#f8c084ff 100%)',
			}}>
			<div style={{ maxWidth: 1320, margin: '0 auto', padding: '48px 20px 40px' }} className='wk-outer'>
				{/* Heading */}
				<motion.div
					initial={{ opacity: 0, y: 26 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 1 }}>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							whiteSpace: 'nowrap',
							padding: '8px 24px',
							fontFamily: "var(--font-body)",
							fontSize: 10,
							fontWeight: 500,
							textTransform: 'uppercase',
							letterSpacing: '0.45em',
							color: '#4FA3D1',
							borderRadius: 999,
							background: 'rgba(255,255,255,0.22)',
							backdropFilter: 'blur(16px)',
							WebkitBackdropFilter: 'blur(16px)',
							border: '1px solid rgba(255,255,255,0.3)',
							boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 14px 40px rgba(15,23,42,0.18)',
							marginBottom: 24,
						}}>
						<span
							style={{
								width: 6,
								height: 6,
								borderRadius: '50%',
								background: '#B86B45',
							}}
						/>
						Kashmir Installations
					</div>
					<h2
						style={{
							fontFamily: "var(--font-heading)",
							fontSize: 'clamp(28px, 4vw, 48px)',
							fontWeight: 600,
							lineHeight: 1.1,
							color: '#3C2A25',
							margin: '0 0 12px',
						}}>
						Where It&apos;s Used in Kashmir
					</h2>
					<p
						style={{
							fontFamily: "var(--font-body)",
							fontSize: 'clamp(14px, 2vw, 17px)',
							lineHeight: 1.75,
							color: '#3C2B27',
							maxWidth: 520,
						}}>
						From luxury Srinagar villas and five star resorts in Gulmarg to religious places, schools and family homes across Kupwara, our electric underfloor heating systems bring lasting warmth to every space in Kashmir.
					</p>
				</motion.div>

				{/* Cards Grid */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(4, 1fr)',
						gap: 20,
						marginTop: 48,
					}}
					className='wk-grid'>
					{USE_CASES.map((item, i) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 26 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: i * 0.1 }}
							style={{
								borderRadius: 20,
								overflow: 'hidden',
								background: 'rgba(255,255,255,0.68)',
								backdropFilter: 'blur(28px)',
								WebkitBackdropFilter: 'blur(28px)',
								border: '1px solid rgba(255,255,255,0.5)',
								boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
							}}>
							<div style={{ height: 'clamp(140px, 20vw, 180px)', overflow: 'hidden' }}>
								<img
									src={item.img}
									alt={item.alt}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							</div>
							<div style={{ padding: 'clamp(14px, 3vw, 20px) clamp(14px, 3vw, 20px) clamp(16px, 3vw, 24px)' }}>
								<h3
									style={{
										fontFamily: "var(--font-heading)",
										fontSize: 'clamp(1rem, 2vw, 1.125rem)',
										fontWeight: 600,
										color: '#3C2A25',
										margin: '0 0 8px',
									}}>
									{item.title}
								</h3>
								<p
									style={{
										fontFamily: "var(--font-body)",
										fontSize: 'clamp(0.75rem, 1.5vw, 0.8125rem)',
										color: '#3C2B27',
										lineHeight: 1.6,
										margin: 0,
									}}>
									{item.desc}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>

			<style>{`
				@media (max-width: 768px) {
					.wk-outer { padding: 48px 20px 40px !important; }
				}
				@media (max-width: 1024px) {
					.wk-grid { grid-template-columns: repeat(2, 1fr) !important; }
				}
				@media (max-width: 640px) {
					.wk-grid { grid-template-columns: 1fr !important; }
				}
			`}</style>
		</section>
	);
}

export default function PremiumProductShowcase() {
	return (
		<>
			<OurBrands />
			<WhereItsUsed />
			<InstallationWalkthrough />
		</>
	);
}
