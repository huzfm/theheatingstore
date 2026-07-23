

// 'use client';

// import { motion, useInView, useScroll, useTransform } from 'framer-motion';
// import { useRef, useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import {
//   ShieldCheck, Clock, Award, Zap, ArrowRight, Star, Quote,
//   Phone, Mail, MapPin, MessageCircle, ChevronDown, CheckCircle2, Sparkles,
//   Flame, Snowflake, Layers,
// } from 'lucide-react';
// import OurProcess from '../components/OurProcess';
// import WhyChooseUFH from '../components/WhyChooseUFH';
// import FaqSection from '../components/FaqSection';
// import InstallationContent from '../installation/InstallationClient';
// import WhyElectricHamam from '../components/WhyElectricHamam';
// import Testimonials from '../components/Testimonials';
// import TrustVideos from '../components/TrustVideos';

// const EASE = [0.16, 1, 0.3, 1];

// // Labels renamed to match what each component actually is,
// // instead of forcing them under generic "Products / Reviews" labels.
// const NAV_LINKS = [
//   { label: 'Why Electric Hamam', href: '#why-hamam' },   // WhyElectricHamam
//   // OurProcess
//   { label: 'Installation', href: '#installation' },       // InstallationContent
//   { label: 'Why Choose Us', href: '#why-choose' },        // WhyChooseUFH
//   { label: 'FAQ', href: '#faq' },                          // FaqSection
// ];

// // Rotating hero imagery — real installs and warm interiors, crossfading
// // every 2s so the hero itself shows the product rather than describing it.
// // const HERO_IMAGES = [
// //   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop',
// //   'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80&auto=format&fit=crop',
// //   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80&auto=format&fit=crop',
// //   'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&auto=format&fit=crop',
// //   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop',
// //   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop',
// // ];
// const HERO_IMAGES = [
//   // Modern minimalist living room with warm wood flooring
//   '/landing/land2.png',
//   // Cozy bedroom with warm tones, soft natural light on floor
//   '/landing/land3.png',
//   // Close-up of bare feet/socks on warm wooden floor (very on-theme for "warm floors")
//   '/landing/land4.png',
//   // Modern bathroom with tile flooring (common underfloor heating use-case)
//   '/landing/land5.png',
//   // Warm-toned living space, fireplace/cozy ambiance
//   '/landing/land6.png',
//   // Renovation/flooring installation in progress (installer laying tiles/mats)
//   '/landing/land1.png',
// ];
// const CONTACT = {
//   address: 'Srinagar · Anantnag · Baramulla, Kashmir',
//   phone1: '+91 9070907035',
//   phone2: '+91 9070907035',
//   email: 'info@theheatingstore.in',
//   whatsapp: '919070907035',
// };

// const STATS = [
//   { value: 500, suffix: '+', label: 'Floors warmed' },
//   { value: 10, suffix: '+', label: 'Years installing' },
//   { value: 5, suffix: 'yr', label: 'Warranty' },
//   { value: 98, suffix: '%', label: 'Would recommend' },
// ];

// function useRevealRef(amount = 0.2) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, amount });
//   return [ref, inView];
// }

// function useCountUp(target, inView, duration = 1600) {
//   const [value, setValue] = useState(0);
//   useEffect(() => {
//     if (!inView) return;
//     let raf;
//     const start = performance.now();
//     const tick = (now) => {
//       const progress = Math.min((now - start) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setValue(Math.round(eased * target));
//       if (progress < 1) raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf);
//   }, [inView, target, duration]);
//   return value;
// }

// function StatCounter({ stat, inView }) {
//   const value = useCountUp(stat.value, inView);
//   return (
//     <div className="stat-block">
//       <p className="stat-number">{value}{stat.suffix}</p>
//       <p className="stat-label">{stat.label}</p>
//     </div>
//   );
// }

// /* ── Hero image carousel ──────────────────────────────────────────── */
// function HeroCarousel() {
//   const [active, setActive] = useState(0);
//   useEffect(() => {
//     const id = setInterval(() => {
//       setActive((i) => (i + 1) % HERO_IMAGES.length);
//     }, 2000);
//     return () => clearInterval(id);
//   }, []);
//   return (
//     <div className="hero-carousel">
//       {HERO_IMAGES.map((src, i) => (
//         <div key={src} className="hero-slide" style={{ opacity: i === active ? 1 : 0 }}>
//           <Image src={src} alt="Underfloor heating installation" fill priority={i === 0} sizes="100vw" style={{ objectFit: 'cover' }} />
//         </div>
//       ))}
//       <div className="hero-slide-dots">
//         {HERO_IMAGES.map((src, i) => (
//           <span key={src} className={`hero-slide-dot ${i === active ? 'is-active' : ''}`} />
//         ))}
//       </div>
//     </div>
//   );
// }

// /* ── Hero enquiry card ────────────────────────────────────────────── */
// function HeroEnquiryForm() {
//   const [form, setForm] = useState({ name: '', address: '', phone: '' });
//   const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const text = `Hi, I'd like a free site visit.\nName: ${form.name}\nAddress: ${form.address}\nPhone: ${form.phone}`;
//     window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
//   };
//   return (
//     <motion.form
//       className="hero-form"
//       onSubmit={handleSubmit}
//       initial={{ opacity: 0, y: 24 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
//     >
//       <h3 className="hero-form-title">Book a Free Site Visit</h3>
//       <input required name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="hero-form-input" />
//       <input required name="address" value={form.address} onChange={handleChange} placeholder="Enter your address" className="hero-form-input" />
//       <input required name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" className="hero-form-input" />
//       <button type="submit" className="hero-form-submit">Send Enquiry</button>
//     </motion.form>
//   );
// }

// export default function LandingClient() {
//   const heroWrapRef = useRef(null);
//   const [heroRef, heroIn] = useRevealRef(0.1);
//   const [statsRef, statsIn] = useRevealRef(0.3);
//   const [scrolled, setScrolled] = useState(false);

//   const { scrollYProgress } = useScroll({ target: heroWrapRef, offset: ['start start', 'end start'] });
//   const heroTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   // Smooth-scroll nav links to their matching section, offset by the
//   // *actual* current header height (topbar shown/hidden, nav scrolled
//   // or not) so the target section never lands hidden behind the header.
//   const handleNavClick = (e, href) => {
//     e.preventDefault();
//     const target = document.querySelector(href);
//     if (!target) return;
//     const headerEl = document.querySelector('.lp-header');
//     const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 90;
//     const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
//     window.scrollTo({ top, behavior: 'smooth' });
//   };

//   const jsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'HomeAndConstructionBusiness',
//     name: 'TheHeatingStore',
//     description: 'Underfloor heating installation specialists serving Kashmir.',
//     areaServed: { '@type': 'City', name: 'Srinagar' },
//     telephone: '+91-9070907035',
//     priceRange: '\u20b9\u20b9',
//     aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '50' },
//   };

//   return (
//     <>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..500&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

//         * { box-sizing: border-box; }
//         html { scroll-behavior: smooth; }
//         .lp {
//           --ink: #14110D;
//           --walnut: #241A12;
//           --walnut-2: #3A2418;
//           --parchment: #F3EDE0;
//           --parchment-2: #EDE3D0;
//           --copper: #C17817;
//           --ember: #E8622C;
//           --frost: #6E9C97;
//           --cream: #FDFBF7;
//           --line: rgba(58,36,24,0.14);
//           font-family: 'Instrument Sans', sans-serif;
//           background: var(--parchment);
//           overflow-x: clip;
//         }
//         .lp h1, .lp h2, .lp h3 { font-family: 'Fraunces', serif; }
//         .lp .mono { font-family: 'IBM Plex Mono', monospace; }
//         @media (prefers-reduced-motion: reduce) {
//           .lp * { animation: none !important; transition: none !important; }
//           html { scroll-behavior: auto; }
//         }

//         /* ── TOP UTILITY BAR + NAV ── */
//         .lp-header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
//         .lp-topbar {
//           display: flex; align-items: center; justify-content: space-between; gap: 16px;
//           padding: 9px 48px; background: linear-gradient(90deg,var(--copper),var(--ember));
//           color: var(--cream); font-size: 12.5px; font-weight: 600; overflow: hidden;
//           transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease;
//         }
//         .lp-topbar.hidden { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; }
//         .lp-topbar-left, .lp-topbar-right { display: flex; align-items: center; gap: 22px; }
//         .lp-topbar-linkitem {
//           display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
//           color: var(--cream); text-decoration: none; transition: opacity 0.2s ease;
//         }
//         .lp-topbar-linkitem:hover { opacity: 0.8; text-decoration: underline; }
//         .lp-nav {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 18px 48px; transition: all 0.35s ease; color: var(--cream); background: rgba(20,17,13,0.0);
//         }
//         .lp-nav.scrolled {
//           padding: 13px 48px; background: rgba(20,17,13,0.88); backdrop-filter: blur(16px) saturate(140%);
//           box-shadow: 0 4px 28px rgba(0,0,0,0.25);
//         }
//         .lp-nav-logo { display: flex; align-items: center; gap: 9px; font-family: 'Fraunces', serif; font-style: italic; font-weight: 500; font-size: 21px; letter-spacing: 0.01em; }
//         .lp-nav-logo-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--copper); box-shadow: 0 0 10px var(--ember); }
//         .lp-nav-links { display: flex; gap: 30px; align-items: center; }
//         .lp-nav-link { font-size: 13px; font-weight: 500; text-decoration: none; color: var(--cream); opacity: 0.82; transition: opacity 0.2s; background: none; border: none; cursor: pointer; font-family: 'Instrument Sans', sans-serif; padding: 0; white-space: nowrap; }
//         .lp-nav-link:hover { opacity: 1; }
//         .lp-nav-cta {
//           font-size: 13px; font-weight: 600; color: var(--ink); background: linear-gradient(90deg,#F0A445,var(--copper));
//           padding: 10px 20px; border-radius: 100px; text-decoration: none; white-space: nowrap;
//         }

//         /* ── HERO ── */
//         .lp-hero-wrap { position: relative; min-height: 100vh; overflow: hidden; background: var(--ink); }
//         .hero-carousel { position: absolute; inset: 0; z-index: 0; }
//         .hero-slide { position: absolute; inset: 0; transition: opacity 1.1s ease; }
//         .hero-slide-dots { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; gap: 7px; z-index: 3; }
//         .hero-slide-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(253,251,247,0.35); transition: background 0.3s ease, width 0.3s ease; }
//         .hero-slide-dot.is-active { background: #F0A445; width: 18px; border-radius: 4px; }
//         .lp-hero-gradient {
//           position: absolute; inset: 0; z-index: 1;
//           background: linear-gradient(180deg, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0.62) 45%, rgba(20,17,13,0.88) 100%);
//         }
//         .lp-hero-content {
//           position: relative; z-index: 2; max-width: 1160px; margin: 0 auto; width: 100%;
//           padding: 190px 40px 90px;
//           display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: start;
//         }
//         .lp-hero-badge {
//           display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 100px;
//           background: rgba(193,120,23,0.16); border: 1px solid rgba(193,120,23,0.4);
//           color: #F0A445; font-size: 11.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
//           margin-bottom: 24px; font-family: 'IBM Plex Mono', monospace;
//         }
//         .lp-hero-title { font-size: clamp(34px, 4.2vw, 56px); font-weight: 600; color: var(--cream); line-height: 1.1; margin: 0 0 20px; }
//         .lp-hero-title em { font-style: italic; font-weight: 400; color: #F0A445; }
//         .lp-hero-sub { font-size: 15.5px; color: rgba(253,251,247,0.72); max-width: 460px; margin: 0 0 34px; line-height: 1.7; }
//         .lp-cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
//         .lp-cta-primary {
//           display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 14.5px; color: var(--ink);
//           background: linear-gradient(90deg,#F0A445,var(--copper)); padding: 15px 28px; border-radius: 100px;
//           text-decoration: none; box-shadow: 0 12px 30px rgba(193,120,23,0.3); transition: transform 0.25s ease;
//         }
//         .lp-cta-primary:hover { transform: translateY(-3px); }
//         .lp-cta-secondary {
//           display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 14.5px; color: var(--cream);
//           background: rgba(253,251,247,0.08); border: 1.5px solid rgba(253,251,247,0.26); padding: 15px 26px;
//           border-radius: 100px; text-decoration: none; transition: background 0.25s ease;
//         }
//         .lp-cta-secondary:hover { background: rgba(253,251,247,0.14); }

//         /* ── HERO ENQUIRY FORM ── */
//         .hero-form {
//           background: var(--cream); border-radius: 20px; padding: 30px 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.35);
//           display: flex; flex-direction: column; gap: 13px;
//         }
//         .hero-form-title { font-size: 19px; font-weight: 600; color: var(--ink); margin: 0 0 6px; }
//         .hero-form-input {
//           width: 100%; padding: 13px 15px; border-radius: 10px; border: 1.5px solid var(--line);
//           font-family: 'Instrument Sans', sans-serif; font-size: 13.5px; color: var(--ink); background: var(--parchment);
//           outline: none; transition: border-color 0.2s ease;
//         }
//         .hero-form-input::placeholder { color: rgba(36,26,18,0.42); }
//         .hero-form-input:focus { border-color: var(--copper); }
//         .hero-form-submit {
//           margin-top: 4px; width: 100%; padding: 14px; border: none; border-radius: 10px; cursor: pointer;
//           font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 14px; color: var(--cream);
//           background: linear-gradient(90deg,var(--walnut-2),var(--ink)); transition: transform 0.2s ease;
//         }
//         .hero-form-submit:hover { transform: translateY(-2px); }

//         /* ── STATS STRIP ── */
//         .lp-stats-strip {
//           position: relative; z-index: 5; margin: 0 24px; max-width: 1160px; margin-left: auto; margin-right: auto;
//           background: var(--cream); border-radius: 20px; box-shadow: 0 24px 60px rgba(20,17,13,0.14);
//           display: grid; grid-template-columns: repeat(4,1fr); padding: 32px 20px; transform: translateY(-46px);
//         }
//         .stat-block { text-align: center; border-right: 1px solid var(--line); padding: 0 12px; }
//         .stat-block:last-child { border-right: none; }
//         .stat-number { font-family: 'Fraunces', serif; font-size: clamp(26px,3.2vw,38px); font-weight: 600; color: var(--copper); margin: 0 0 4px; }
//         .stat-label { font-size: 12px; font-weight: 500; color: var(--walnut); opacity: 0.65; margin: 0; font-family: 'IBM Plex Mono', monospace; }

//         /* ── ANCHOR SECTION WRAPPERS ── */
//         .lp-anchor { scroll-margin-top: 110px; }

//         /* ── FINAL CTA ── */
//         .lp-final-cta-wrap { margin: 130px 24px 0; max-width: 1160px; margin-left: auto; margin-right: auto; }
//         .lp-final-cta {
//           position: relative; overflow: hidden; border-radius: 28px; padding: 72px 40px; text-align: center;
//           background: linear-gradient(160deg,var(--ink),var(--walnut-2));
//         }
//         .lp-final-cta::before {
//           content: ''; position: absolute; width: 460px; height: 460px; border-radius: 50%;
//           background: radial-gradient(circle, rgba(232,98,44,0.22), transparent 70%); top: -180px; right: -140px;
//         }
//         .lp-final-cta-title { font-size: clamp(28px,3.8vw,42px); font-weight: 600; color: var(--cream); margin: 0 0 14px; position: relative; z-index: 1; }
//         .lp-final-cta-sub { font-size: 14.5px; color: rgba(253,251,247,0.66); margin: 0 0 32px; position: relative; z-index: 1; }
//         .lp-final-cta .lp-cta-row { position: relative; z-index: 1; justify-content: center; }

//         /* ── FLOATING WHATSAPP ── */
//         .lp-float-whatsapp {
//           position: fixed; bottom: 15px; right: 18px; z-index: 90; width: 56px; height: 56px; border-radius: 50%;
//           background: #25D366; display: flex; align-items: center; justify-content: center; color: #fff;
//           box-shadow: 0 10px 26px rgba(37,211,102,0.4); text-decoration: none;
//         }

//         /* ── RESPONSIVE ── */
//         @media (max-width: 1024px) {
//           .lp-hero-content { grid-template-columns: 1fr; padding-top: 210px; }
//         }
//         @media (max-width: 768px) {
//           .lp-nav-links { display: none; }
//           .lp-topbar { padding: 8px 20px; flex-wrap: wrap; gap: 8px; }
//           .lp-topbar-left, .lp-topbar-right { gap: 12px; }
//           .lp-nav, .lp-nav.scrolled { padding: 14px 20px; }
//           .lp-hero-content { padding: 150px 20px 60px; }
//           .lp-stats-strip { grid-template-columns: repeat(2,1fr); margin: 0 16px; gap: 18px 0; transform: translateY(-30px); }
//           .stat-block:nth-child(2) { border-right: none; }
//           .stat-block { border-bottom: 1px solid var(--line); padding-bottom: 14px; }
//           .lp-final-cta { padding: 52px 22px; }
//           .lp-anchor { scroll-margin-top: 80px; }
//         }
//       `}</style>

//       <div className="lp">

//         {/* ── HEADER: topbar + nav ── */}
//         <div className="lp-header">
//           <div className={`lp-topbar ${scrolled ? 'hidden' : ''}`}>
//             <div className="lp-topbar-left">
//               <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`} target="_blank" rel="noopener noreferrer" className="lp-topbar-linkitem">
//                 <MapPin size={13} /> {CONTACT.address}
//               </a>
//             </div>
//             <div className="lp-topbar-right">
//               <a href={`tel:${CONTACT.phone1.replace(/\s+/g, '')}`} className="lp-topbar-linkitem">
//                 <Phone size={13} /> {CONTACT.phone1}
//               </a>
//               <a href={`mailto:${CONTACT.email}`} className="lp-topbar-linkitem">
//                 <Mail size={13} /> {CONTACT.email}
//               </a>
//             </div>
//           </div>
//           <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
//             <div className="lp-nav-logo"><span className="lp-nav-logo-dot" />The Heating Store</div>
//             <div className="lp-nav-links">
//               {NAV_LINKS.map((l) => (
//                 <a key={l.label} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="lp-nav-link">
//                   {l.label}
//                 </a>
//               ))}
//               {/* <Link href="/contact" className="lp-nav-cta">Free Quote</Link> */}
//             </div>
//           </nav>
//         </div>

//         {/* ── HERO ── */}
//         <div className="lp-hero-wrap" ref={heroWrapRef}>
//           <HeroCarousel />
//           <div className="lp-hero-gradient" />
//           <motion.div className="lp-hero-content" ref={heroRef} style={{ opacity: heroTextOpacity }}>
//             <div>
//               <motion.span
//                 className="lp-hero-badge"
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={heroIn ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.6, ease: EASE }}
//               >
//                 <Sparkles size={12} /> Kashmir&rsquo;s Underfloor Heating Specialists
//               </motion.span>
//               <motion.h1
//                 className="lp-hero-title"
//                 initial={{ opacity: 0, y: 22 }}
//                 animate={heroIn ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
//               >
//                 The hamam, <em>reinvented</em>
//               </motion.h1>
//               <motion.p
//                 className="lp-hero-sub"
//                 initial={{ opacity: 0, y: 18 }}
//                 animate={heroIn ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
//               >
//                 Kashmir has warmed its floors for generations. We just moved it under the tile — free site visit, professional install, 5-year warranty.
//               </motion.p>
//               <motion.div
//                 className="lp-cta-row"
//                 initial={{ opacity: 0, y: 18 }}
//                 animate={heroIn ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
//               >
//                 <Link href="/contact" className="lp-cta-primary">Contact us <ArrowRight size={16} /></Link>
                
//               </motion.div>
//             </div>
//             <HeroEnquiryForm />
//           </motion.div>
//         </div>

//         {/* ── STATS STRIP ── */}
//         <div className="lp-stats-strip" ref={statsRef}>
//           {STATS.map((stat) => <StatCounter key={stat.label} stat={stat} inView={statsIn} />)}
//         </div>

//         {/* Each wrapper below carries the id the navbar scrolls to,
//             matched to the component actually rendered inside it. */}
//         <div id="why-hamam" className="lp-anchor">
//           <WhyElectricHamam />
//         </div>

//           <div id="test" className="lp-anchor">
//           <Testimonials />
//         </div>

//          <TrustVideos/>

//         <div id="process" className="lp-anchor">
//           <OurProcess />
//         </div>

//         <div id="installation" className="lp-anchor">
//           <InstallationContent />
//         </div>

      
//         <div id="faq" className="lp-anchor">
//           <FaqSection />
//         </div>

//         <div id="why-choose" className="lp-anchor">
//           <WhyChooseUFH />
//         </div>

//         {/* ── FINAL CTA ── */}
//         <div className="lp-final-cta-wrap">
//           <div className="lp-final-cta">
//             <h2 className="lp-final-cta-title">Ready for warm floors this winter?</h2>
//             <p className="lp-final-cta-sub">Book a free site visit — no obligation, no pressure.</p>
//             <div className="lp-cta-row">
//               <Link href="/contact" className="lp-cta-primary">Get a Free Quote <ArrowRight size={16} /></Link>
//               <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="lp-cta-secondary">
//                 <Phone size={16} /> Call Us Now
//               </a>
//             </div>
//           </div>
//         </div>

//         <div style={{ height: 100 }} />
//       </div>

//       {/* ── FLOATING WHATSAPP ── */}
//         <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="lp-float-whatsapp" aria-label="Chat on WhatsApp">
//         <svg viewBox="0 0 24 24" fill="#fff" width="26" height="26">
//           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.75.75 0 00.918.919l5.628-1.479A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 01-4.953-1.355l-.355-.211-3.676.964.981-3.589-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
//         </svg>
//       </a>
//     </>
//   );
// }

'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck, Clock, Award, Zap, ArrowRight, Star, Quote,
  Phone, Mail, MapPin, MessageCircle, ChevronDown, CheckCircle2, Sparkles,
  Flame, Snowflake, Layers,
} from 'lucide-react';
import OurProcess from '../components/OurProcess';
import WhyChooseUFH from '../components/WhyChooseUFH';
import FaqSection from '../components/FaqSection';
import InstallationContent from '../installation/InstallationClient';
import WhyElectricHamam from '../components/WhyElectricHamam';
import Testimonials from '../components/Testimonials';
import TrustVideos from '../components/TrustVideos';

const EASE = [0.16, 1, 0.3, 1];

// Labels renamed to match what each component actually is,
// instead of forcing them under generic "Products / Reviews" labels.
const NAV_LINKS = [
  { label: 'Why Electric Hamam', href: '#why-hamam' },   // WhyElectricHamam
  // OurProcess
  { label: 'Installation', href: '#installation' },       // InstallationContent
  { label: 'Why Choose Us', href: '#why-choose' },        // WhyChooseUFH
  { label: 'FAQ', href: '#faq' },                          // FaqSection
];

const HERO_IMAGES = [
  '/landing/land2.png',
  '/landing/land3.png',
  '/landing/land4.png',
  '/landing/land5.png',
  '/landing/land6.png',
  '/landing/land1.png',
];
const CONTACT = {
  address: 'Srinagar · Anantnag · Baramulla, Kashmir',
  phone1: '+91 9070907035',
  phone2: '+91 9070907035',
  email: 'info@theheatingstore.in',
  whatsapp: '919070907035',
};

const STATS = [
  { value: 500, suffix: '+', label: 'Floors warmed' },
  { value: 10, suffix: '+', label: 'Years installing' },
  { value: 5, suffix: 'yr', label: 'Warranty' },
  { value: 98, suffix: '%', label: 'Would recommend' },
];

function useRevealRef(amount = 0.2) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount });
  return [ref, inView];
}

function useCountUp(target, inView, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return value;
}

function StatCounter({ stat, inView }) {
  const value = useCountUp(stat.value, inView);
  return (
    <div className="stat-block">
      <p className="stat-number">{value}{stat.suffix}</p>
      <p className="stat-label">{stat.label}</p>
    </div>
  );
}

/* ── Hero image carousel ──────────────────────────────────────────── */
function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hero-carousel">
      {HERO_IMAGES.map((src, i) => (
        <div key={src} className="hero-slide" style={{ opacity: i === active ? 1 : 0 }}>
          <Image src={src} alt="Underfloor heating installation" fill priority={i === 0} sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
      ))}
      <div className="hero-slide-dots">
        {HERO_IMAGES.map((src, i) => (
          <span key={src} className={`hero-slide-dot ${i === active ? 'is-active' : ''}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Backend base URL — swap to your production URL when deploying ── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

/* Reads ad-tracking params from the current page URL (works for Meta/Google
   ads that append utm_source, utm_campaign, fbclid, gclid to the link).
   These get folded into the lead's message so the team can see the source
   in the admin panel, since the /api/leads endpoint's own `source` field
   only accepts 'Contact Form' / 'Popup'. */
function getAdTrackingSummary() {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmCampaign = params.get('utm_campaign');
  const utmMedium = params.get('utm_medium');
  const fbclid = params.get('fbclid');
  const gclid = params.get('gclid');

  const parts = [];
  if (utmSource) parts.push(`utm_source=${utmSource}`);
  if (utmMedium) parts.push(`utm_medium=${utmMedium}`);
  if (utmCampaign) parts.push(`utm_campaign=${utmCampaign}`);
  if (fbclid) parts.push('via=Meta Ads (fbclid present)');
  if (gclid) parts.push('via=Google Ads (gclid present)');

  return parts.length ? `[${parts.join(', ')}]` : '[Direct / Organic]';
}

/* ── Hero enquiry card ────────────────────────────────────────────── */
function HeroEnquiryForm() {
  const [form, setForm] = useState({ name: '', address: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const adTag = getAdTrackingSummary();
    const messageForBackend = `Landing page enquiry ${adTag}\nAddress: ${form.address}`;

    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: messageForBackend,
        }),
      });
      if (!res.ok) throw new Error('Lead save failed');
      setStatus('sent');
    } catch (err) {
      console.error('Lead submit error:', err);
      setStatus('error');
    }

    // WhatsApp still opens as before, regardless of backend result,
    // so the customer's message always reaches you even if the API is down.
    const text = `Hi, I'd like a free site visit.\nName: ${form.name}\nAddress: ${form.address}\nPhone: ${form.phone}`;
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <motion.form
      className="hero-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
    >
      <h3 className="hero-form-title">Book a Free Site Visit</h3>
      <input required name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="hero-form-input" />
      <input required name="address" value={form.address} onChange={handleChange} placeholder="Enter your address" className="hero-form-input" />
      <input required name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" className="hero-form-input" />
      <button type="submit" className="hero-form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Enquiry'}
      </button>
      {status === 'error' && (
        <p style={{ color: '#E8622C', fontSize: 12.5, margin: '2px 0 0' }}>
          Lead save had an issue, but your WhatsApp message still went through.
        </p>
      )}
    </motion.form>
  );
}

export default function LandingClient() {
  const heroWrapRef = useRef(null);
  const [heroRef, heroIn] = useRevealRef(0.1);
  const [statsRef, statsIn] = useRevealRef(0.3);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll({ target: heroWrapRef, offset: ['start start', 'end start'] });
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const headerEl = document.querySelector('.lp-header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 90;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'TheHeatingStore',
    description: 'Underfloor heating installation specialists serving Kashmir.',
    areaServed: { '@type': 'City', name: 'Srinagar' },
    telephone: '+91-9070907035',
    priceRange: '\u20b9\u20b9',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '50' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..500&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .lp {
          --ink: #14110D;
          --walnut: #241A12;
          --walnut-2: #3A2418;
          --parchment: #F3EDE0;
          --parchment-2: #EDE3D0;
          --copper: #C17817;
          --ember: #E8622C;
          --frost: #6E9C97;
          --cream: #FDFBF7;
          --line: rgba(58,36,24,0.14);
          font-family: 'Instrument Sans', sans-serif;
          background: var(--parchment);
          overflow-x: clip;
        }
        .lp h1, .lp h2, .lp h3 { font-family: 'Fraunces', serif; }
        .lp .mono { font-family: 'IBM Plex Mono', monospace; }
        @media (prefers-reduced-motion: reduce) {
          .lp * { animation: none !important; transition: none !important; }
          html { scroll-behavior: auto; }
        }

        .lp-header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; }
        .lp-topbar {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 9px 48px; background: linear-gradient(90deg,var(--copper),var(--ember));
          color: var(--cream); font-size: 12.5px; font-weight: 600; overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease;
        }
        .lp-topbar.hidden { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; }
        .lp-topbar-left, .lp-topbar-right { display: flex; align-items: center; gap: 22px; }
        .lp-topbar-linkitem {
          display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
          color: var(--cream); text-decoration: none; transition: opacity 0.2s ease;
        }
        .lp-topbar-linkitem:hover { opacity: 0.8; text-decoration: underline; }
        .lp-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px; transition: all 0.35s ease; color: var(--cream); background: rgba(20,17,13,0.0);
        }
        .lp-nav.scrolled {
          padding: 13px 48px; background: rgba(20,17,13,0.88); backdrop-filter: blur(16px) saturate(140%);
          box-shadow: 0 4px 28px rgba(0,0,0,0.25);
        }
        .lp-nav-logo { display: flex; align-items: center; gap: 9px; font-family: 'Fraunces', serif; font-style: italic; font-weight: 500; font-size: 21px; letter-spacing: 0.01em; }
        .lp-nav-logo-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--copper); box-shadow: 0 0 10px var(--ember); }
        .lp-nav-links { display: flex; gap: 30px; align-items: center; }
        .lp-nav-link { font-size: 13px; font-weight: 500; text-decoration: none; color: var(--cream); opacity: 0.82; transition: opacity 0.2s; background: none; border: none; cursor: pointer; font-family: 'Instrument Sans', sans-serif; padding: 0; white-space: nowrap; }
        .lp-nav-link:hover { opacity: 1; }
        .lp-nav-cta {
          font-size: 13px; font-weight: 600; color: var(--ink); background: linear-gradient(90deg,#F0A445,var(--copper));
          padding: 10px 20px; border-radius: 100px; text-decoration: none; white-space: nowrap;
        }

        .lp-hero-wrap { position: relative; min-height: 100vh; overflow: hidden; background: var(--ink); }
        .hero-carousel { position: absolute; inset: 0; z-index: 0; }
        .hero-slide { position: absolute; inset: 0; transition: opacity 1.1s ease; }
        .hero-slide-dots { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; gap: 7px; z-index: 3; }
        .hero-slide-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(253,251,247,0.35); transition: background 0.3s ease, width 0.3s ease; }
        .hero-slide-dot.is-active { background: #F0A445; width: 18px; border-radius: 4px; }
        .lp-hero-gradient {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(180deg, rgba(20,17,13,0.55) 0%, rgba(20,17,13,0.62) 45%, rgba(20,17,13,0.88) 100%);
        }
        .lp-hero-content {
          position: relative; z-index: 2; max-width: 1160px; margin: 0 auto; width: 100%;
          padding: 190px 40px 90px;
          display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: start;
        }
        .lp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 100px;
          background: rgba(193,120,23,0.16); border: 1px solid rgba(193,120,23,0.4);
          color: #F0A445; font-size: 11.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 24px; font-family: 'IBM Plex Mono', monospace;
        }
        .lp-hero-title { font-size: clamp(34px, 4.2vw, 56px); font-weight: 600; color: var(--cream); line-height: 1.1; margin: 0 0 20px; }
        .lp-hero-title em { font-style: italic; font-weight: 400; color: #F0A445; }
        .lp-hero-sub { font-size: 15.5px; color: rgba(253,251,247,0.72); max-width: 460px; margin: 0 0 34px; line-height: 1.7; }
        .lp-cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .lp-cta-primary {
          display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 14.5px; color: var(--ink);
          background: linear-gradient(90deg,#F0A445,var(--copper)); padding: 15px 28px; border-radius: 100px;
          text-decoration: none; box-shadow: 0 12px 30px rgba(193,120,23,0.3); transition: transform 0.25s ease;
        }
        .lp-cta-primary:hover { transform: translateY(-3px); }
        .lp-cta-secondary {
          display: inline-flex; align-items: center; gap: 9px; font-weight: 600; font-size: 14.5px; color: var(--cream);
          background: rgba(253,251,247,0.08); border: 1.5px solid rgba(253,251,247,0.26); padding: 15px 26px;
          border-radius: 100px; text-decoration: none; transition: background 0.25s ease;
        }
        .lp-cta-secondary:hover { background: rgba(253,251,247,0.14); }

        .hero-form {
          background: var(--cream); border-radius: 20px; padding: 30px 28px; box-shadow: 0 30px 70px rgba(0,0,0,0.35);
          display: flex; flex-direction: column; gap: 13px;
        }
        .hero-form-title { font-size: 19px; font-weight: 600; color: var(--ink); margin: 0 0 6px; }
        .hero-form-input {
          width: 100%; padding: 13px 15px; border-radius: 10px; border: 1.5px solid var(--line);
          font-family: 'Instrument Sans', sans-serif; font-size: 13.5px; color: var(--ink); background: var(--parchment);
          outline: none; transition: border-color 0.2s ease;
        }
        .hero-form-input::placeholder { color: rgba(36,26,18,0.42); }
        .hero-form-input:focus { border-color: var(--copper); }
        .hero-form-submit {
          margin-top: 4px; width: 100%; padding: 14px; border: none; border-radius: 10px; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 14px; color: var(--cream);
          background: linear-gradient(90deg,var(--walnut-2),var(--ink)); transition: transform 0.2s ease;
        }
        .hero-form-submit:hover { transform: translateY(-2px); }
        .hero-form-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .lp-stats-strip {
          position: relative; z-index: 5; margin: 0 24px; max-width: 1160px; margin-left: auto; margin-right: auto;
          background: var(--cream); border-radius: 20px; box-shadow: 0 24px 60px rgba(20,17,13,0.14);
          display: grid; grid-template-columns: repeat(4,1fr); padding: 32px 20px; transform: translateY(-46px);
        }
        .stat-block { text-align: center; border-right: 1px solid var(--line); padding: 0 12px; }
        .stat-block:last-child { border-right: none; }
        .stat-number { font-family: 'Fraunces', serif; font-size: clamp(26px,3.2vw,38px); font-weight: 600; color: var(--copper); margin: 0 0 4px; }
        .stat-label { font-size: 12px; font-weight: 500; color: var(--walnut); opacity: 0.65; margin: 0; font-family: 'IBM Plex Mono', monospace; }

        .lp-anchor { scroll-margin-top: 110px; }

        .lp-final-cta-wrap { margin: 130px 24px 0; max-width: 1160px; margin-left: auto; margin-right: auto; }
        .lp-final-cta {
          position: relative; overflow: hidden; border-radius: 28px; padding: 72px 40px; text-align: center;
          background: linear-gradient(160deg,var(--ink),var(--walnut-2));
        }
        .lp-final-cta::before {
          content: ''; position: absolute; width: 460px; height: 460px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,98,44,0.22), transparent 70%); top: -180px; right: -140px;
        }
        .lp-final-cta-title { font-size: clamp(28px,3.8vw,42px); font-weight: 600; color: var(--cream); margin: 0 0 14px; position: relative; z-index: 1; }
        .lp-final-cta-sub { font-size: 14.5px; color: rgba(253,251,247,0.66); margin: 0 0 32px; position: relative; z-index: 1; }
        .lp-final-cta .lp-cta-row { position: relative; z-index: 1; justify-content: center; }

        .lp-float-whatsapp {
          position: fixed; bottom: 15px; right: 18px; z-index: 90; width: 56px; height: 56px; border-radius: 50%;
          background: #25D366; display: flex; align-items: center; justify-content: center; color: #fff;
          box-shadow: 0 10px 26px rgba(37,211,102,0.4); text-decoration: none;
        }

        @media (max-width: 1024px) {
          .lp-hero-content { grid-template-columns: 1fr; padding-top: 210px; }
        }
        @media (max-width: 768px) {
          .lp-nav-links { display: none; }
          .lp-topbar { padding: 8px 20px; flex-wrap: wrap; gap: 8px; }
          .lp-topbar-left, .lp-topbar-right { gap: 12px; }
          .lp-nav, .lp-nav.scrolled { padding: 14px 20px; }
          .lp-hero-content { padding: 150px 20px 60px; }
          .lp-stats-strip { grid-template-columns: repeat(2,1fr); margin: 0 16px; gap: 18px 0; transform: translateY(-30px); }
          .stat-block:nth-child(2) { border-right: none; }
          .stat-block { border-bottom: 1px solid var(--line); padding-bottom: 14px; }
          .lp-final-cta { padding: 52px 22px; }
          .lp-anchor { scroll-margin-top: 80px; }
        }
      `}</style>

      <div className="lp">

        <div className="lp-header">
          <div className={`lp-topbar ${scrolled ? 'hidden' : ''}`}>
            <div className="lp-topbar-left">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`} target="_blank" rel="noopener noreferrer" className="lp-topbar-linkitem">
                <MapPin size={13} /> {CONTACT.address}
              </a>
            </div>
            <div className="lp-topbar-right">
              <a href={`tel:${CONTACT.phone1.replace(/\s+/g, '')}`} className="lp-topbar-linkitem">
                <Phone size={13} /> {CONTACT.phone1}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="lp-topbar-linkitem">
                <Mail size={13} /> {CONTACT.email}
              </a>
            </div>
          </div>
          <nav className={`lp-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="lp-nav-logo"><span className="lp-nav-logo-dot" />The Heating Store</div>
            <div className="lp-nav-links">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="lp-nav-link">
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="lp-hero-wrap" ref={heroWrapRef}>
          <HeroCarousel />
          <div className="lp-hero-gradient" />
          <motion.div className="lp-hero-content" ref={heroRef} style={{ opacity: heroTextOpacity }}>
            <div>
              <motion.span
                className="lp-hero-badge"
                initial={{ opacity: 0, y: -10 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Sparkles size={12} /> Kashmir&rsquo;s Underfloor Heating Specialists
              </motion.span>
              <motion.h1
                className="lp-hero-title"
                initial={{ opacity: 0, y: 22 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              >
                The hamam, <em>reinvented</em>
              </motion.h1>
              <motion.p
                className="lp-hero-sub"
                initial={{ opacity: 0, y: 18 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              >
                Kashmir has warmed its floors for generations. We just moved it under the tile — free site visit, professional install, 5-year warranty.
              </motion.p>
              <motion.div
                className="lp-cta-row"
                initial={{ opacity: 0, y: 18 }}
                animate={heroIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                <Link href="/contact" className="lp-cta-primary">Contact us <ArrowRight size={16} /></Link>
              </motion.div>
            </div>
            <HeroEnquiryForm />
          </motion.div>
        </div>

        <div className="lp-stats-strip" ref={statsRef}>
          {STATS.map((stat) => <StatCounter key={stat.label} stat={stat} inView={statsIn} />)}
        </div>

        <div id="why-hamam" className="lp-anchor">
          <WhyElectricHamam />
        </div>

        <div id="test" className="lp-anchor">
          <Testimonials />
        </div>

        <TrustVideos />

        <div id="process" className="lp-anchor">
          <OurProcess />
        </div>

        <div id="installation" className="lp-anchor">
          <InstallationContent />
        </div>

        <div id="faq" className="lp-anchor">
          <FaqSection />
        </div>

        <div id="why-choose" className="lp-anchor">
          <WhyChooseUFH />
        </div>

        <div className="lp-final-cta-wrap">
          <div className="lp-final-cta">
            <h2 className="lp-final-cta-title">Ready for warm floors this winter?</h2>
            <p className="lp-final-cta-sub">Book a free site visit — no obligation, no pressure.</p>
            <div className="lp-cta-row">
              <Link href="/contact" className="lp-cta-primary">Get a Free Quote <ArrowRight size={16} /></Link>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="lp-cta-secondary">
                <Phone size={16} /> Call Us Now
              </a>
            </div>
          </div>
        </div>

        <div style={{ height: 100 }} />
      </div>

      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="lp-float-whatsapp" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" fill="#fff" width="26" height="26">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.75.75 0 00.918.919l5.628-1.479A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 01-4.953-1.355l-.355-.211-3.676.964.981-3.589-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>
    </>
  );
}
