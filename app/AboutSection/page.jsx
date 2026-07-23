// 'use client';

// import { motion, useInView } from 'framer-motion';
// import { useRef } from 'react';
// import VideoGallery from '../components/VideoGallery';

// const EASE = [0.16, 1, 0.3, 1];



// const MEDIA_LOGOS = [
//   'Ideal Home', 'Country Living', 'Good Housekeeping', 'Evening News', 'Daily Express', 'MSN',
//   'Ideal Home', 'Country Living', 'Good Housekeeping', 'Evening News', 'Daily Express', 'MSN',
// ];

// const SECTIONS = [
//   {
//     title: 'Experts of the Trade',
//     desc: 'Our team consists of experienced heating engineers, sales experts, and customer service professionals who are dedicated to helping our customers find the perfect heating solution for their needs. We work closely with our customers to understand their requirements and provide expert advice and support throughout the buying process.',
//     img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
//     imgLeft: false,
//   },
//   {
//     title: 'Committed to Energy Efficiency',
//     desc: 'We believe that underfloor heating is the future of heating, and we are committed to making it accessible and affordable for everyone. We offer a wide range of products, including electric and water underfloor heating systems, thermostats, insulation, and accessories, from leading brands such as ProWarm, Warmup and Heatmiser.',
//     img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
//     imgLeft: true,
//   },
//   {
//     title: 'Striving for Success',
//     desc: 'At TheHeatingStore, we are passionate about what we do, and we are always looking for ways to improve our products and services. We believe that our success comes from the satisfaction of our customers, and we will always go the extra mile to ensure that they are happy with their purchase.',
//     img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
//     imgLeft: false,
//   },
// ];

// function AlternatingRow({ section, index }) {
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, amount: 0.15 });
//   const isLeft = section.imgLeft;

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 28 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.75, ease: EASE }}
//       style={{
//         display: 'grid',
//         gridTemplateColumns: '1fr 1fr',
//         gap: 64,
//         alignItems: 'center',
//         padding: '56px 0',
//         borderTop: '1px solid rgba(184,107,69,0.18)',
//       }}
//     >
//       {/* Image */}
//       <div style={{ order: isLeft ? 0 : 1 }}>
//         <div style={{
//           borderRadius: 20,
//           overflow: 'hidden',
//           height: 300,
//           boxShadow: '0 16px 48px rgba(60,42,37,0.12)',
//         }}>
//           <img
//             src={section.img}
//             alt={section.title}
//             style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
//           />
//         </div>
//       </div>

//       {/* Text */}
//       <div style={{ order: isLeft ? 1 : 0 }}>
//         <h3 style={{
//           fontFamily: "'Cormorant Garamond', serif",
//           fontSize: 'clamp(22px, 2.5vw, 32px)',
//           fontWeight: 700,
//           color: '#2C1810',
//           margin: '0 0 16px',
//           lineHeight: 1.2,
//         }}>
//           {section.title}
//         </h3>
//         <div style={{ width: 40, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#C4623A,#E88C2A)', marginBottom: 18 }} />
//         <p style={{
//           fontFamily: "'DM Sans', sans-serif",
//           fontSize: 'clamp(13.5px, 1.3vw, 15px)',
//           color: '#3C2B27',
//           lineHeight: 1.85,
//           margin: 0,
//           opacity: 0.85,
//         }}>
//           {section.desc}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// export default function AboutSection() {
//   const heroRef = useRef(null);
//   const trustRef = useRef(null);
//   const introRef = useRef(null);
//   const mediaRef = useRef(null);

//   const trustIn = useInView(trustRef, { once: true, amount: 0.2 });
//   const introIn = useInView(introRef, { once: true, amount: 0.2 });
//   const mediaIn = useInView(mediaRef, { once: true, amount: 0.2 });

//   return (
//     <>
//       <style>{`
//         .about-page { font-family: 'DM Sans', sans-serif; }

//         /* Hero */
//         .about-hero {
//           position: relative;
//           height: clamp(280px, 40vw, 480px);
//           overflow: hidden;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .about-hero-img {
//           position: absolute; inset: 0;
//           width: 100%; height: 100%;
//           object-fit: cover;
//           object-position: center 30%;
//         }
//         .about-hero-overlay {
//           position: absolute; inset: 0;
//           background: rgba(28,14,8,0.52);
//         }
//         .about-hero-text {
//           position: relative; z-index: 1;
//           text-align: center;
//         }

//         /* Trust bar */
//         .about-trust-bar {
//           background: transparent;
//           border-bottom: 1px solid rgba(184,107,69,0.18);
//           padding: 28px 40px;
//         }
//         .about-trust-inner {
//           max-width: 960px;
//           margin: 0 auto;
//           display: grid;
//           grid-template-columns: repeat(4,1fr);
//           gap: 24px;
//         }
//         .about-trust-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//         }

//         /* Intro */
//         .about-intro {
//           background: transparent;
//           padding: 64px 40px;
//           text-align: center;
//         }
//         .about-intro-inner {
//           max-width: 700px;
//           margin: 0 auto;
//         }

//         /* Marquee */
//         .about-marquee-wrap {
//           background: transparent;
//           border-top: 1px solid rgba(184,107,69,0.18);
//           border-bottom: 1px solid rgba(184,107,69,0.18);
//           padding: 28px 0;
//           overflow: hidden;
//         }
//         .about-marquee-heading {
//           text-align: center;
//           font-family: 'Cormorant Garamond', serif;
//           font-size: clamp(18px,2vw,24px);
//           font-weight: 600;
//           color: #2C1810;
//           margin: 0 0 24px;
//         }
//         .about-marquee-track {
//           display: flex;
//           gap: 64px;
//           animation: about-scroll 28s linear infinite;
//           width: max-content;
//         }
//         .about-marquee-track:hover { animation-play-state: paused; }
//         @keyframes about-scroll {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         .about-marquee-logo {
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px;
//           font-weight: 700;
//           letter-spacing: 0.08em;
//           color: #9CA3AF;
//           text-transform: uppercase;
//           white-space: nowrap;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }
//         .about-marquee-logo::before {
//           content: '';
//           display: inline-block;
//           width: 18px; height: 1.5px;
//           background: rgba(184,107,69,0.3);
//           border-radius: 2px;
//         }

//         /* Alternating sections */
//         .about-sections {
//           max-width: 1160px;
//           margin: 0 auto;
//           padding: 0 40px 80px;
//           background: transparent;
//         }

//         @keyframes about-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

//         @media (max-width: 900px) {
//           .about-trust-inner { grid-template-columns: repeat(2,1fr); }
//         }
//         @media (max-width: 640px) {
//           .about-trust-bar { padding: 24px 20px; }
//           .about-trust-inner { grid-template-columns: 1fr 1fr; gap: 16px; }
//           .about-intro { padding: 48px 20px; }
//           .about-sections { padding: 0 20px 56px; }
//           .about-alt-row { grid-template-columns: 1fr !important; gap: 28px !important; }
//         }
//       `}</style>

//       <div className="about-page" style={{
//         background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE8D0 70%, #F8C084 100%)',
//         minHeight: '100vh',
//       }}>

//         {/* ── 1. HERO ── */}
//         <div className="about-hero" ref={heroRef}>
//           <img
//             className="about-hero-img"
//             src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80&auto=format&fit=crop"
//             alt="About TheHeatingStore"
//           />
//           <div className="about-hero-overlay" />
//           <motion.div
//             className="about-hero-text"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.9, ease: EASE }}
//           >
//             <h1 style={{
//               fontFamily: "'Cormorant Garamond', serif",
//               fontSize: 'clamp(32px, 5vw, 64px)',
//               fontWeight: 700,
//               color: '#FFFFFF',
//               margin: '0 0 10px',
//               lineHeight: 1.1,
//             }}>
//               About Us
//             </h1>
//             <p style={{
//               fontFamily: "'DM Sans', sans-serif",
//               fontSize: 'clamp(13px, 1.5vw, 17px)',
//               color: 'rgba(255,255,255,0.75)',
//               margin: 0,
//             }}>
//               Discover our award-winning company
//             </p>
//           </motion.div>
//         </div>

//         {/* ── 3. INTRO PARAGRAPH ── */}
//         <div className="about-intro" ref={introRef}>
//           <motion.div
//             className="about-intro-inner"
//             initial={{ opacity: 0, y: 20 }}
//             animate={introIn ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.75, ease: EASE }}
//           >
//             <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.4vw,16px)', color: '#3C2B27', lineHeight: 1.9, margin: '0 0 16px' }}>
//               At TheHeatingStore, we are dedicated to providing high quality underfloor heating solutions to our customers. Our company was founded in 2011 by a team of heating experts who wanted to offer a better, more efficient way to heat homes and businesses.
//             </p>
//             <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.4vw,16px)', color: '#3C2B27', lineHeight: 1.9, margin: 0 }}>
//               Since then, we have grown into one of the largest suppliers of underfloor heating systems in Kashmir, with a range of products to suit every need and budget. We pride ourselves on our excellent customer service, knowledgeable staff, and commitment to providing the best possible products and solutions.
//             </p>
//           </motion.div>
//         </div>

        

//         {/* ── 5. ALTERNATING SECTIONS ── */}
//         <div className="about-sections">
//           {SECTIONS.map((section, i) => (
//             <AlternatingRow key={section.title} section={section} index={i} />
//           ))}
//         </div>

//       </div>
//       <VideoGallery/>
//     </>
//   );
// }

'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import VideoGallery from '../components/VideoGallery';

const EASE = [0.16, 1, 0.3, 1];

/* ── content ─────────────────────────────────────────────────────── */

const TRUST_ITEMS = [
  {
    label: 'Est. 2011',
    sub: '14+ years in trade',
    icon: (
      <path d="M8 2v3M16 2v3M3.5 8.5h17M5 4.5h14A1.5 1.5 0 0 1 20.5 6v13A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5Z" />
    ),
  },
  {
    label: "Kashmir's Largest",
    sub: 'Underfloor heating supplier',
    icon: <path d="M4 20.5V10l8-6 8 6v10.5M9 20.5v-6h6v6" />,
  },
  {
    label: 'Certified Engineers',
    sub: 'Trained & accredited',
    icon: <path d="M12 3 4 6.5v5c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10v-5L12 3Zm-2.5 9 2 2 4-4.5" />,
  },
  {
    label: '5-Year Warranty',
    sub: 'On every install',
    icon: <path d="M12 2v20M4.5 7 12 2l7.5 5M6 10.5v6c0 2.5 2.7 4.5 6 5.5 3.3-1 6-3 6-5.5v-6" />,
  },
];

const SECTIONS = [
  {
    coilLabel: 'Loop 01',
    title: 'Experts of the Trade',
    desc: 'Our team consists of experienced heating engineers, sales experts, and customer service professionals who are dedicated to helping our customers find the perfect heating solution for their needs. We work closely with our customers to understand their requirements and provide expert advice and support throughout the buying process.',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    imgLeft: false,
  },
  {
    coilLabel: 'Loop 02',
    title: 'Committed to Energy Efficiency',
    desc: 'We believe that underfloor heating is the future of heating, and we are committed to making it accessible and affordable for everyone. We offer a wide range of products, including electric and water underfloor heating systems, thermostats, insulation, and accessories, from leading brands such as ProWarm, Warmup and Heatmiser.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    imgLeft: true,
  },
  {
    coilLabel: 'Loop 03',
    title: 'Striving for Success',
    desc: 'At TheHeatingStore, we are passionate about what we do, and we are always looking for ways to improve our products and services. We believe that our success comes from the satisfaction of our customers, and we will always go the extra mile to ensure that they are happy with their purchase.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop',
    imgLeft: false,
  },
];

const STATS = [
  { value: '14+', label: 'Years installing' },
  { value: '6,000+', label: 'Systems supplied' },
  { value: '98%', label: 'Customers satisfied' },
  { value: '5 yr', label: 'Warranty as standard' },
];

const MEDIA_LOGOS = [
  'Ideal Home', 'Country Living', 'Good Housekeeping', 'Evening News', 'Daily Express', 'MSN',
  'Ideal Home', 'Country Living', 'Good Housekeeping', 'Evening News', 'Daily Express', 'MSN',
];

/* ── signature element: a coiled "heating cable" trail that threads
   the story sections together, one loop per chapter ─────────────── */

function CoilTrail() {
  return (
    <svg
      className="about-coil-trail"
      viewBox="0 0 40 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M20 0
           C 4 40, 4 90, 20 130
           C 36 170, 36 220, 20 260
           C 4 300, 4 350, 20 390
           C 36 430, 36 480, 20 520
           C 4 560, 4 610, 20 650
           C 36 690, 36 740, 20 780
           C 4 820, 4 860, 20 900"
        className="about-coil-path-bg"
      />
      <path
        d="M20 0
           C 4 40, 4 90, 20 130
           C 36 170, 36 220, 20 260
           C 4 300, 4 350, 20 390
           C 36 430, 36 480, 20 520
           C 4 560, 4 610, 20 650
           C 36 690, 36 740, 20 780
           C 4 820, 4 860, 20 900"
        className="about-coil-path-glow"
      />
    </svg>
  );
}

function AlternatingRow({ section, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const isLeft = section.imgLeft;

  return (
    <motion.div
      ref={ref}
      className="about-alt-row"
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: EASE }}
    >
      {/* Image */}
      <div className="about-alt-imgcol" style={{ order: isLeft ? 0 : 1 }}>
        <div className="about-alt-imgframe">
          <img
            src={section.img}
            alt={section.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span className="about-coil-badge">{section.coilLabel}</span>
        </div>
      </div>

      {/* Text */}
      <div className="about-alt-textcol" style={{ order: isLeft ? 1 : 0 }}>
        <span className="about-alt-eyebrow">{section.coilLabel}</span>
        <h3 className="about-alt-title">{section.title}</h3>
        <div className="about-alt-rule" />
        <p className="about-alt-desc">{section.desc}</p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const trustRef = useRef(null);
  const introRef = useRef(null);
  const mediaRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const trustIn = useInView(trustRef, { once: true, amount: 0.2 });
  const introIn = useInView(introRef, { once: true, amount: 0.2 });
  const mediaIn = useInView(mediaRef, { once: true, amount: 0.2 });
  const statsIn = useInView(statsRef, { once: true, amount: 0.3 });
  const ctaIn = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <>
      <style>{`
        .about-page { font-family: 'DM Sans', sans-serif; }

        /* Hero */
        .about-hero {
          position: relative;
          height: clamp(300px, 42vw, 500px);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .about-hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 30%;
          transform: scale(1.05);
        }
        .about-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(28,14,8,0.35) 0%, rgba(28,14,8,0.62) 100%);
        }
        .about-hero-text {
          position: relative; z-index: 1;
          text-align: center;
          padding: 0 20px;
        }
        .about-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FFD9B0;
          margin-bottom: 14px;
        }
        .about-hero-eyebrow::before,
        .about-hero-eyebrow::after {
          content: '';
          width: 22px; height: 1.5px;
          background: rgba(255,217,176,0.6);
        }

        /* Trust bar */
        .about-trust-bar {
          background: rgba(255,255,255,0.4);
          border-bottom: 1px solid rgba(184,107,69,0.18);
          padding: 30px 40px;
        }
        .about-trust-inner {
          max-width: 1040px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 24px;
        }
        .about-trust-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .about-trust-icon {
          flex: none;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg,#FF7E5F,#FFB88C);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 16px rgba(184,107,69,0.3);
        }
        .about-trust-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 700;
          color: #2C1810;
          line-height: 1.3;
        }
        .about-trust-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          color: #3C2B27;
          opacity: 0.7;
          margin-top: 2px;
        }

        /* Intro */
        .about-intro {
          background: transparent;
          padding: 68px 40px 56px;
          text-align: center;
        }
        .about-intro-inner {
          max-width: 700px;
          margin: 0 auto;
        }
        .about-intro-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #B86B45;
          margin: 0 0 14px;
        }

        /* Marquee */
        .about-marquee-wrap {
          background: transparent;
          border-top: 1px solid rgba(184,107,69,0.18);
          border-bottom: 1px solid rgba(184,107,69,0.18);
          padding: 30px 0;
          overflow: hidden;
        }
        .about-marquee-heading {
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9C6B4F;
          margin: 0 0 22px;
        }
        .about-marquee-track {
          display: flex;
          gap: 64px;
          animation: about-scroll 28s linear infinite;
          width: max-content;
        }
        .about-marquee-track:hover { animation-play-state: paused; }
        @keyframes about-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .about-marquee-logo {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #9CA3AF;
          text-transform: uppercase;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .about-marquee-logo::before {
          content: '';
          display: inline-block;
          width: 18px; height: 1.5px;
          background: rgba(184,107,69,0.3);
          border-radius: 2px;
        }

        /* Alternating sections + coil signature */
        .about-sections {
          position: relative;
          max-width: 1160px;
          margin: 0 auto;
          padding: 24px 40px 40px;
          background: transparent;
        }
        .about-coil-trail {
          position: absolute;
          left: 50%;
          top: 0;
          width: 40px;
          height: 100%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
        }
        .about-coil-path-bg {
          fill: none;
          stroke: rgba(184,107,69,0.22);
          stroke-width: 2;
          stroke-linecap: round;
        }
        .about-coil-path-glow {
          fill: none;
          stroke: url(#about-coil-gradient);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-dasharray: 14 18;
          animation: about-coil-flow 5.5s linear infinite;
        }
        @keyframes about-coil-flow {
          to { stroke-dashoffset: -320; }
        }

        .about-alt-row {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          padding: 52px 0;
          border-top: 1px solid rgba(184,107,69,0.18);
        }
        .about-alt-imgframe {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          height: 300px;
          box-shadow: 0 16px 48px rgba(60,42,37,0.14);
        }
        .about-coil-badge {
          position: absolute;
          top: 14px; left: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(28,14,8,0.55);
          backdrop-filter: blur(6px);
          padding: 5px 11px;
          border-radius: 999px;
        }
        .about-alt-eyebrow {
          display: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #B86B45;
          margin-bottom: 10px;
        }
        .about-alt-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 700;
          color: #2C1810;
          margin: 0 0 16px;
          line-height: 1.2;
        }
        .about-alt-rule {
          width: 40px; height: 3px; border-radius: 2px;
          background: linear-gradient(90deg,#C4623A,#E88C2A);
          margin-bottom: 18px;
        }
        .about-alt-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13.5px, 1.3vw, 15px);
          color: #3C2B27;
          line-height: 1.85;
          margin: 0;
          opacity: 0.85;
        }

        /* Stats */
        .about-stats-wrap {
          padding: 20px 40px 72px;
        }
        .about-stats-inner {
          max-width: 1040px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 20px;
        }
        .about-stat-card {
          text-align: center;
          padding: 26px 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(184,107,69,0.16);
        }
        .about-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 700;
          color: #B86B45;
          line-height: 1;
          margin-bottom: 8px;
        }
        .about-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          color: #3C2B27;
          opacity: 0.75;
        }

        /* CTA band */
        .about-cta-wrap {
          padding: 0 40px 88px;
        }
        .about-cta-inner {
          max-width: 1000px;
          margin: 0 auto;
          border-radius: 24px;
          padding: 48px 40px;
          text-align: center;
          background: linear-gradient(135deg, #2C1810 0%, #4A2A1C 100%);
          box-shadow: 0 24px 60px rgba(44,24,16,0.28);
        }
        .about-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700;
          color: #fff;
          margin: 0 0 12px;
        }
        .about-cta-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.72);
          margin: 0 0 26px;
        }
        .about-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #2C1810;
          background: linear-gradient(135deg,#FF7E5F,#FFB88C);
          padding: 14px 30px;
          border-radius: 999px;
          box-shadow: 0 12px 28px rgba(184,107,69,0.45);
          transition: transform 0.25s ease;
        }
        .about-cta-btn:hover { transform: scale(1.05); }

        @media (max-width: 900px) {
          .about-trust-inner { grid-template-columns: repeat(2,1fr); }
          .about-stats-inner { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 640px) {
          .about-trust-bar { padding: 22px 20px; }
          .about-trust-inner { grid-template-columns: 1fr 1fr; gap: 18px 14px; }
          .about-intro { padding: 48px 20px 40px; }
          .about-sections { padding: 8px 20px 8px; }
          .about-coil-trail { display: none; }
          .about-alt-row {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
            padding: 34px 0 !important;
          }
          .about-alt-imgframe { height: 220px; }
          .about-alt-imgcol { order: 0 !important; }
          .about-alt-textcol { order: 1 !important; }
          .about-alt-eyebrow { display: block; }
          .about-stats-wrap { padding: 8px 20px 56px; }
          .about-stat-card { padding: 20px 8px; }
          .about-cta-wrap { padding: 0 20px 64px; }
          .about-cta-inner { padding: 38px 22px; border-radius: 20px; }
          .about-marquee-heading { font-size: 11px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-marquee-track,
          .about-coil-path-glow { animation: none !important; }
        }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="about-coil-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7E5F" />
            <stop offset="100%" stopColor="#E88C2A" />
          </linearGradient>
        </defs>
      </svg>

      <div className="about-page" style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE8D0 70%, #F8C084 100%)',
        minHeight: '100vh',
      }}>

        {/* ── 1. HERO ── */}
        <div className="about-hero">
          <img
            className="about-hero-img"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80&auto=format&fit=crop"
            alt="About TheHeatingStore"
          />
          <div className="about-hero-overlay" />
          <motion.div
            className="about-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="about-hero-eyebrow">Since 2011</div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(34px, 5.5vw, 68px)',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 10px',
              lineHeight: 1.1,
            }}>
              About Us
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(13px, 1.5vw, 17px)',
              color: 'rgba(255,255,255,0.78)',
              margin: 0,
            }}>
              Warming Kashmir's homes, one floor at a time
            </p>
          </motion.div>
        </div>

        {/* ── 2. TRUST BAR ── */}
        <div className="about-trust-bar" ref={trustRef}>
          <motion.div
            className="about-trust-inner"
            initial={{ opacity: 0, y: 16 }}
            animate={trustIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {TRUST_ITEMS.map((item) => (
              <div className="about-trust-item" key={item.label}>
                <div className="about-trust-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </div>
                <div>
                  <div className="about-trust-label">{item.label}</div>
                  <div className="about-trust-sub">{item.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── 3. INTRO PARAGRAPH ── */}
        <div className="about-intro" ref={introRef}>
          <motion.div
            className="about-intro-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={introIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <p className="about-intro-eyebrow">Our Story</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.4vw,16px)', color: '#3C2B27', lineHeight: 1.9, margin: '0 0 16px' }}>
              At TheHeatingStore, we are dedicated to providing high quality underfloor heating solutions to our customers. Our company was founded in 2011 by a team of heating experts who wanted to offer a better, more efficient way to heat homes and businesses.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.4vw,16px)', color: '#3C2B27', lineHeight: 1.9, margin: 0 }}>
              Since then, we have grown into one of the largest suppliers of underfloor heating systems in Kashmir, with a range of products to suit every need and budget. We pride ourselves on our excellent customer service, knowledgeable staff, and commitment to providing the best possible products and solutions.
            </p>
          </motion.div>
        </div>

       
        {/* ── 5. ALTERNATING SECTIONS with coil signature ── */}
        <div className="about-sections">
          <CoilTrail />
          {SECTIONS.map((section, i) => (
            <AlternatingRow key={section.title} section={section} index={i} />
          ))}
        </div>

        {/* ── 6. STATS STRIP ── */}
        <div className="about-stats-wrap" ref={statsRef}>
          <motion.div
            className="about-stats-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={statsIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {STATS.map((stat) => (
              <div className="about-stat-card" key={stat.label}>
                <div className="about-stat-value">{stat.value}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── 7. CLOSING CTA ── */}
        <div className="about-cta-wrap" ref={ctaRef}>
          <motion.div
            className="about-cta-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <h3 className="about-cta-title">Ready for a warmer home?</h3>
            <p className="about-cta-sub">Talk to our team and get a free, no-obligation installation quote.</p>
            <a href="/contact" className="about-cta-btn">
              Book Installation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C1810" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </motion.div>
        </div>

      </div>
      <VideoGallery />
    </>
  );
}
