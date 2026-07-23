// 'use client';
// import Link from 'next/link';
// import { motion } from 'framer-motion';

// const QUICK_LINKS = [
//   { label: 'Home', href: '/' },
//   { label: 'About', href: '/AboutSection' },
//   { label: 'Why Choose Us', href: '/why-choose-us' },
//   { label: 'Contact', href: '/contact' },
// ];

// const SERVICES = [
//   { label: 'Installation', href: '/installation' },
//   { label: 'Our Brands', href: '/product' },
//   { label: 'How It Works', href: '/how-it-works' },
//   { label: 'Local Experience', href: '/local-experience' },
// ];

// const RESOURCES = [
//   { label: 'Warranty Verification', href: '/warranty-check' },
//   { label: 'Certifications', href: '/certifications' },
//   { label: 'Measuring Up', href: '/measuring-up' },
//   { label: 'Blog & Articles', href: '/bloginfo' },
// ];

// const FADE_UP = {
//   hidden: { opacity: 0, y: 24 },
//   show: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
//   }),
// };

// export default function Footer() {
//   return (
//     <footer
//       className="relative isolate overflow-hidden"
//       style={{ background: 'linear-gradient(180deg, #2B1E1A 0%, #1C120F 100%)' }}
//     >
//       {/* Radial glow top */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0"
//         style={{ background: 'radial-gradient(60% 28% at 50% 0%, rgba(184,107,69,0.28), transparent 70%)' }}
//       />

//       {/* Top accent line */}
//       <div
//         aria-hidden
//         className="absolute top-0 left-0 right-0 h-px"
//         style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,147,58,0.6) 50%, transparent 100%)' }}
//       />

//       <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">

//         {/* ── MAIN GRID ── */}
//         <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr]">

//           {/* ── COL 1: BRAND ── */}
//           <motion.div
//             variants={FADE_UP}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true }}
//             custom={0}
//           >
//             {/* Wordmark */}
//             <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
//               <span style={{
//                 fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
//                 fontSize: 26,
//                 letterSpacing: '0.04em',
//                 whiteSpace: 'nowrap',
//                 display: 'flex',
//                 alignItems: 'baseline',
//                 gap: 0,
//               }}>
//                 <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>The</span>
//                 <span style={{ fontWeight: 700, color: '#E8933A' }}>Heating</span>
//                 <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>Store</span>
//               </span>
//             </Link>

//             {/* Tagline */}
//             <p style={{
//               marginTop: 14,
//               fontSize: 13.5,
//               lineHeight: 1.75,
//               color: 'rgba(214,198,184,0.85)',
//               maxWidth: 280,
//               fontFamily: "'DM Sans', sans-serif",
//             }}>
//               Premium electric hammam &amp; underfloor heating — engineered for Kashmir's extreme winters and India's most demanding spaces.
//             </p>

//             {/* Contact */}
//             <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
//               {[
//                 {
//                   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
//                   text: '+91 9070907035',
//                 },
//                 {
//                   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
//                   text: 'info@theheatingstore.in',
//                 },
//                 {
//                   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
//                   text: 'Srinagar · Anantnag · Baramulla, Kashmir',
//                 },
//               ].map(({ icon, text }, i) => (
//                 <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
//                   <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span>
//                   <span style={{ fontSize: 13, color: 'rgba(214,198,184,0.8)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{text}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Social */}
//             <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
//               {/* WhatsApp */}
//               <a href="https://wa.me/919070907035" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
//                 style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', color: 'white', textDecoration: 'none' }}
//                 onMouseEnter={e => e.currentTarget.style.background = '#25D366'}
//                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
//               >
//                 <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.75.75 0 00.918.919l5.628-1.479A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 01-4.953-1.355l-.355-.211-3.676.964.981-3.589-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
//               </a>
//               {/* Instagram */}
//               <a href="https://www.instagram.com/theheatingstore?igsh=dnQ4NzZlbGhuZmlj" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
//                 style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', color: 'white', textDecoration: 'none' }}
//                 onMouseEnter={e => e.currentTarget.style.background = '#E1306C'}
//                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
//               >
//                 <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
//               </a>
//               {/* Facebook */}
//               <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
//                 style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', color: 'white', textDecoration: 'none' }}
//                 onMouseEnter={e => e.currentTarget.style.background = '#1877F2'}
//                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
//               >
//                 <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
//               </a>
//             </div>
//           </motion.div>

//           {/* ── COL 2: QUICK LINKS ── */}
//           <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
//             <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
//               Quick Links
//             </p>
//             <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {QUICK_LINKS.map((item) => (
//                 <li key={item.href}>
//                   <Link href={item.href} style={{
//                     fontSize: 13.5,
//                     color: 'rgba(214,198,184,0.75)',
//                     textDecoration: 'none',
//                     fontFamily: "'DM Sans', sans-serif",
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 6,
//                     transition: 'color 0.2s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.color = '#E8933A'}
//                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,198,184,0.75)'}
//                   >
//                     <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(232,147,58,0.5)', flexShrink: 0 }} />
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* ── COL 3: SERVICES ── */}
//           <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}>
//             <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
//               Services
//             </p>
//             <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {SERVICES.map((item) => (
//                 <li key={item.label}>
//                   <Link href={item.href} style={{
//                     fontSize: 13.5,
//                     color: 'rgba(214,198,184,0.75)',
//                     textDecoration: 'none',
//                     fontFamily: "'DM Sans', sans-serif",
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 6,
//                     transition: 'color 0.2s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.color = '#E8933A'}
//                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,198,184,0.75)'}
//                   >
//                     <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(232,147,58,0.5)', flexShrink: 0 }} />
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* ── COL 4: RESOURCES ── */}
//           <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}>
//             <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
//               Resources
//             </p>
//             <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {RESOURCES.map((item) => (
//                 <li key={item.label}>
//                   <Link href={item.href} style={{
//                     fontSize: 13.5,
//                     color: 'rgba(214,198,184,0.75)',
//                     textDecoration: 'none',
//                     fontFamily: "'DM Sans', sans-serif",
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 6,
//                     transition: 'color 0.2s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.color = '#E8933A'}
//                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,198,184,0.75)'}
//                   >
//                     <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(232,147,58,0.5)', flexShrink: 0 }} />
//                     {item.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           {/* ── COL 5: OUTREACH ── */}
//           <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={4}>
//             <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
//               Outreach
//             </p>

//             {/* Card 1 — Start a Project */}
            

//             {/* Card 2 — Become a Dealer */}
//             <div style={{
//               background: 'rgba(255,255,255,0.04)',
//               border: '1px solid rgba(255,255,255,0.08)',
//               borderRadius: 16,
//               padding: '16px 18px',
//               marginTop: 12,
//             }}>
//               <p style={{ fontSize: 13.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.92)', margin: '0 0 6px' }}>
//                 Become a Dealer
//               </p>
//               <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(214,198,184,0.75)', fontFamily: "'DM Sans', sans-serif", margin: '0 0 14px' }}>
//                 Join our authorized dealer network across India.
//               </p>

//               <Link href="/dealer" style={{
//                 display: 'block',
//                 textAlign: 'center',
//                 background: 'transparent',
//                 border: '1px solid rgba(232,147,58,0.4)',
//                 color: '#E8933A',
//                 fontFamily: "'DM Sans', sans-serif",
//                 fontSize: 12.5,
//                 fontWeight: 600,
//                 letterSpacing: '0.03em',
//                 padding: '10px 0',
//                 borderRadius: 999,
//                 textDecoration: 'none',
//                 transition: 'background 0.2s, color 0.2s, transform 0.2s',
//               }}
//               onMouseEnter={e => {
//                 e.currentTarget.style.background = '#E8933A';
//                 e.currentTarget.style.color = 'white';
//                 e.currentTarget.style.transform = 'translateY(-1px)';
//               }}
//               onMouseLeave={e => {
//                 e.currentTarget.style.background = 'transparent';
//                 e.currentTarget.style.color = '#E8933A';
//                 e.currentTarget.style.transform = 'translateY(0)';
//               }}
//               >
//                 Apply for Dealership →
//               </Link>
//             </div>
//           </motion.div>

//         </div>

//         {/* ── DIVIDER + BOTTOM BAR ── */}
//         <div style={{
//           marginTop: 64,
//           paddingTop: 24,
//           borderTop: '1px solid rgba(255,255,255,0.08)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 12,
//         }}
//         className="sm:flex-row sm:items-center sm:justify-between"
//         >
//           <p style={{ fontSize: 12, color: 'rgba(250, 249, 247, 1)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
//             © 2011 The Heating Store. All rights reserved.
//           </p>
//           <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
//             {['Safety-Driven', 'Compliance-Ready', 'Built for Longevity'].map(t => (
//               <span key={t} style={{ fontSize: 11.5, color: 'rgba(250, 248, 247, 0.5)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em' }}>
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// }

'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/AboutSection' },
  { label: 'Why Choose Us', href: '/why-choose-us' },
  { label: 'Contact', href: '/contact' },
];

const SERVICES = [
  { label: 'Installation', href: '/installation' },
  { label: 'Our Brands', href: '/product' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Local Experience', href: '/local-experience' },
  { label: 'Global Experience', href: '/global-experience' },
];

const RESOURCES = [
  { label: 'Warranty Verification', href: '/warranty-check' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Measuring Up', href: '/measuring-up' },
  { label: 'Blog & Articles', href: '/bloginfo' },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2B1E1A 0%, #1C120F 100%)' }}
    >
      {/* Radial glow top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 28% at 50% 0%, rgba(184,107,69,0.28), transparent 70%)' }}
      />

      {/* Top accent line */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(232,147,58,0.6) 50%, transparent 100%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-10">

        {/* ── MAIN GRID ── */}
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.4fr]">

          {/* ── COL 1: BRAND ── */}
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
          >
            {/* Wordmark */}
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                fontSize: 26,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'baseline',
                gap: 0,
              }}>
                <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>The</span>
                <span style={{ fontWeight: 700, color: '#E8933A' }}>Heating</span>
                <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>Store</span>
              </span>
            </Link>

            {/* Tagline */}
            <p style={{
              marginTop: 14,
              fontSize: 13.5,
              lineHeight: 1.75,
              color: 'rgba(214,198,184,0.85)',
              maxWidth: 280,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Premium electric hammam &amp; underfloor heating — engineered for Kashmir's extreme winters and India's most demanding spaces.
            </p>

            {/* Contact */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
                  text: '+91 9070907035',
                },
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                  text: 'info@theheatingstore.in',
                },
                {
                  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  text: 'Srinagar · Anantnag · Baramulla, Kashmir',
                },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ marginTop: 2, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(214,198,184,0.8)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              {/* WhatsApp */}
              <a href="https://wa.me/919070907035" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', color: 'white', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#25D366'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.75.75 0 00.918.919l5.628-1.479A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 01-4.953-1.355l-.355-.211-3.676.964.981-3.589-.231-.368A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/theheatingstore?igsh=dnQ4NzZlbGhuZmlj" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', color: 'white', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E1306C'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.25s', color: 'white', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1877F2'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </motion.div>

          {/* ── COL 2: QUICK LINKS ── */}
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
              Quick Links
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} style={{
                    fontSize: 13.5,
                    color: 'rgba(214,198,184,0.75)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8933A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,198,184,0.75)'}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(232,147,58,0.5)', flexShrink: 0 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── COL 3: SERVICES ── */}
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
              Services
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SERVICES.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} style={{
                    fontSize: 13.5,
                    color: 'rgba(214,198,184,0.75)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8933A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,198,184,0.75)'}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(232,147,58,0.5)', flexShrink: 0 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── COL 4: RESOURCES ── */}
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={3}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
              Resources
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESOURCES.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} style={{
                    fontSize: 13.5,
                    color: 'rgba(214,198,184,0.75)',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E8933A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(214,198,184,0.75)'}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(232,147,58,0.5)', flexShrink: 0 }} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── COL 5: OUTREACH ── */}
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={4}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>
              Outreach
            </p>

            {/* Card 2 — Become a Dealer */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '16px 18px',
              marginTop: 12,
            }}>
              <p style={{ fontSize: 13.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.92)', margin: '0 0 6px' }}>
                Become a Dealer
              </p>
              <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(214,198,184,0.75)', fontFamily: "'DM Sans', sans-serif", margin: '0 0 14px' }}>
                Join our authorized dealer network across India.
              </p>

              <Link href="/dealer" style={{
                display: 'block',
                textAlign: 'center',
                background: 'transparent',
                border: '1px solid rgba(232,147,58,0.4)',
                color: '#E8933A',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: '0.03em',
                padding: '10px 0',
                borderRadius: 999,
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#E8933A';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#E8933A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                Apply for Dealership →
              </Link>
            </div>
          </motion.div>

        </div>

        {/* ── DIVIDER + BOTTOM BAR ── */}
        <div style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
        className="sm:flex-row sm:items-center sm:justify-between"
        >
          <p style={{ fontSize: 12, color: 'rgba(250, 249, 247, 1)', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            © 2011 The Heating Store. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {['Safety-Driven', 'Compliance-Ready', 'Built for Longevity'].map(t => (
              <span key={t} style={{ fontSize: 11.5, color: 'rgba(250, 248, 247, 0.5)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
