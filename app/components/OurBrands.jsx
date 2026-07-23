'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { BRANDS } from '../lib/brandsData';

const EASE = [0.16, 1, 0.3, 1];

function Badge({ children }) {
	return (
		<div style={{ position: 'relative', display: 'inline-flex', marginBottom: 24 }}>
			<span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 999, pointerEvents: 'none', background: 'linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))', opacity: 0.7 }} />
			<p style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', padding: '8px 28px', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.45em', color: '#4FA3D1', borderRadius: 999, background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 14px 40px rgba(15,23,42,0.22)', margin: 0 }}>
				<span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B86B45', flexShrink: 0, animation: 'wcu-blink 2s ease-in-out infinite' }} />
				{children}
			</p>
		</div>
	);
}

function SectionHeading({ badge, title, accent, sub, center = false }) {
	return (
		<div style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 580 : 'none', margin: center ? '0 auto' : 0 }}>
			<Badge>{badge}</Badge>
			<h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.01em', color: '#3C2A25', marginBottom: 0 }}>
				{title}
				{accent && <span style={{ display: 'inline', fontWeight: 300, color: '#B86B45' }}> {accent}</span>}
			</h2>
			{sub && <p style={{ marginTop: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 2vw, 17px)', lineHeight: 1.75, color: '#3C2B27', fontWeight: 400, maxWidth: center ? 520 : 540 }}>{sub}</p>}
		</div>
	);
}

function GlassCard({ children, style = {}, hover = true }) {
	return (
		<div className={hover ? 'ob-hover' : ''} style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 24, boxShadow: '0 8px 32px rgba(60,42,37,0.07), 0 2px 8px rgba(60,42,37,0.04)', ...style }}>
			{children}
		</div>
	);
}

export default function OurBrands() {
	const brandsRef = useRef(null);
	const brandsIn = useInView(brandsRef, { once: true, amount: 0.05 });

	return (
		<>
			<style>{`
				.ob-brands-grid { display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start; }
				.ob-brand-portfolio-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(184,107,69,0.08); }
				.ob-brands-pad { max-width: 1320px; margin: 0 auto; padding: 96px 40px 56px; }
				@media (max-width: 640px) {
					.ob-brand-portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; }
				}
				.ob-brands-wrap { position: relative; overflow: hidden; }
				.ob-brands-glow { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
				.ob-brands-content { position: relative; z-index: 1; }
				.ob-grain { position: absolute; inset: 0; background-image: url('/noise.png'); opacity: 0.025; pointer-events: none; }
				@keyframes wcu-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
				.ob-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
				.ob-hover:hover { transform: translateY(-3px); box-shadow: 0 20px 60px rgba(60,42,37,0.12), 0 4px 16px rgba(60,42,37,0.07); }
				@media (max-width: 1024px) {
					.ob-brands-grid { grid-template-columns: 1fr; }
				}
				@media (max-width: 768px) {
					.ob-brands-pad { padding: 80px 20px 40px; }
				}

				/* ── Brand card hover (orange glow + View Products fade-in) ── */
				.ob-brand-card-link {
					display: flex; flex-direction: column; align-items: center; gap: 10px;
					text-align: center;
					background: rgba(255,255,255,0.72);
					padding: 24px 18px;
					position: relative;
					overflow: hidden;
					border: 1px solid transparent;
					transition: all 0.3s ease;
					text-decoration: none;
					color: inherit;
				}
				.ob-brand-card-link:hover {
					background: rgba(255,255,255,0.95);
					border-color: rgba(232, 147, 58, 0.55);
					box-shadow: 0 0 0 1px rgba(232, 147, 58, 0.35), 0 8px 32px rgba(232, 147, 58, 0.18);
				}
				.ob-view-products {
					opacity: 0;
					transform: translateY(8px);
					transition: all 0.3s ease;
					font-family: 'DM Sans', sans-serif;
					font-size: 10.5px;
					font-weight: 600;
					letter-spacing: 0.18em;
					text-transform: uppercase;
					color: #E8933A;
					margin-top: 2px;
				}
				.ob-brand-card-link:hover .ob-view-products {
					opacity: 1;
					transform: translateY(0);
				}
			`}</style>

			<div className='ob-brands-wrap' style={{ backgroundImage: 'linear-gradient(180deg,#FFFFFF 0%,#f5e1cbff 35%,#f4e7dbff 70%,#f8c084ff 100%)' }}>
				{/* Heat glow overlay */}
				<div className='ob-brands-glow' style={{ background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)' }} />
				{/* Grain texture */}
				<div className='ob-grain' />

				<div ref={brandsRef} className='ob-brands-pad ob-brands-content'>
					<div className='ob-brands-grid'>
						{/* LEFT — Heading + Capability */}
						<motion.div
							initial={{ opacity: 0, x: -24 }}
							animate={brandsIn ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.8, ease: EASE }}>
							<SectionHeading
								badge='Trusted Brands'
								title='World-Class Heating,'
								accent='Backed by Our Warranty'
								sub="We partner exclusively with the world's most trusted underfloor heating and electric hamam brands. Every system backed by our Kashmir installation warranty."
							/>
							<div style={{ marginTop: 32, padding: '22px 24px', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: 18 }}>
								<p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B86B45', marginBottom: 18 }}>
									Our Capability
								</p>
								{[
									{ label: 'Electric systems', pct: 95 },
									{ label: 'Water UFH', pct: 88 },
									{ label: 'Smart controls', pct: 92 },
									{ label: 'Commercial grade', pct: 85 },
								].map((item, i) => (
									<div key={item.label} style={{ marginBottom: i < 3 ? 14 : 0 }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
											<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500, color: '#3C2A25' }}>{item.label}</span>
											<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: '#B86B45' }}>{item.pct}%</span>
										</div>
										<div style={{ height: 5, borderRadius: 3, background: 'rgba(184,107,69,0.14)', overflow: 'hidden' }}>
											<motion.div
												initial={{ width: 0 }}
												animate={brandsIn ? { width: `${item.pct}%` } : {}}
												transition={{ duration: 1.3, delay: 0.3 + i * 0.1, ease: EASE }}
												style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#E8933A,#FF7E5F)' }}
											/>
										</div>
									</div>
								))}
							</div>
						</motion.div>

						{/* RIGHT — Brand Portfolio */}
						<motion.div
							initial={{ opacity: 0, x: 24 }}
							animate={brandsIn ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.8, delay: 0.15, ease: EASE }}>
							<GlassCard hover={false} style={{ overflow: 'hidden' }}>
								<div style={{ padding: '22px 28px 18px', borderBottom: '1px solid rgba(184,107,69,0.1)' }}>
									<h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 600, color: '#5d4943ff' }}>Trusted Brands</h4>
									<p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3C2B27', marginTop: 4 }}>World-class heating technology, backed by our Kashmir installation warranty.</p>
								</div>
								<div className='ob-brand-portfolio-grid'>
									{BRANDS.map((b, i) => (
										<motion.div
											key={b.name}
											initial={{ opacity: 0 }}
											animate={brandsIn ? { opacity: 1 } : {}}
											transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}>
											<Link
												href={`/brands/${b.slug}`}
												className='ob-brand-card-link'
												aria-label={`View ${b.name} products`}
											>
												<div style={{ width: 80, height: 80, borderRadius: 16, background: 'white', border: '1px solid rgba(245,185,122,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 8 }}>
													<img src={b.img} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
												</div>
												<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#3C2A25' }}>{b.name}</span>
												<span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B4A2D', lineHeight: 1.45 }}>{b.desc}</span>
												<span className='ob-view-products'>View Products →</span>
											</Link>
										</motion.div>
									))}
								</div>
								<div style={{ padding: '13px 28px', textAlign: 'center', borderBottom: '1px solid rgba(184,107,69,0.1)' }}>
									<a href='/contact' style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#B86B45', textDecoration: 'none' }}>Talk to our experts to find the perfect fit →</a>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
									{[
										{ val: '500K+', label: 'India Installations' },
										{ val: '2M+', label: 'Worldwide Systems' },
										{ val: '2011', label: 'Trusted Since' },
									].map((s, i) => (
										<div key={s.label} style={{ padding: '18px 0', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(184,107,69,0.1)' : 'none' }}>
											<p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px,3vw,22px)', fontWeight: 600, color: '#3C2A25' }}>{s.val}</p>
											<p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6B4A2D', marginTop: 3 }}>{s.label}</p>
										</div>
									))}
								</div>
							</GlassCard>
						</motion.div>
					</div>
				</div>
			</div>
		</>
	);
}
