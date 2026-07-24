
'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const EASE = [0.16, 1, 0.3, 1];
const CARD_GAP = 24;

const Icon = {
  MessageCircle: ({ size = 26, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
    </svg>
  ),
  Layout: ({ size = 26, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='3' width='18' height='18' rx='2' />
      <line x1='3' y1='9' x2='21' y2='9' />
      <line x1='9' y1='21' x2='9' y2='9' />
    </svg>
  ),
  Package: ({ size = 26, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='16.5' y1='9.4' x2='7.5' y2='4.21' />
      <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
      <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
      <line x1='12' y1='22.08' x2='12' y2='12' />
    </svg>
  ),
  Tool: ({ size = 26, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
    </svg>
  ),
  Award: ({ size = 26, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke={color} strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='8' r='6' />
      <path d='M15.477 12.89L17 22l-5-3-5 3 1.523-9.11' />
    </svg>
  ),
};

const REASONS = [
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
    desc: 'Found the same underfloor heating product cheaper elsewhere? We will aim to match the price wherever possible. Simply send us the competitor\'s quote or website link before ordering, and our team will review it promptly.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  },
  {
    num: '03',
    IconComp: Icon.Package,
    title: 'Excellent Service Support',
    desc: 'From your first enquiry to post-installation aftercare, our qualified team is available at every stage. Technical questions, system troubleshooting, or warranty claims — we respond fast and resolve faster.',
    img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
  },
  {
    num: '04',
    IconComp: Icon.Tool,
    title: 'Price Match Promise',
    desc: 'Found the same system cheaper elsewhere? We will match any like-for-like price from an authorised supplier. Same product, same warranty, same certified installation — guaranteed at the best price.',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  },
  {
    num: '05',
    IconComp: Icon.Award,
    title: 'Lifetime Warranty',
    desc: 'We stand by the quality of our underfloor heating systems. That\'s why many of our products come with lifetime warranties, giving you long-term peace of mind.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
];

export default function OurProcess() {
  const processRef = useRef(null);
  const carouselRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(380);
  const [activeStep, setActiveStep] = useState(0);

  const reasonsIn = useInView(processRef, { once: true, amount: 0.05 });

  useEffect(() => {
    const update = () => {
      if (carouselRef.current) {
        const w = carouselRef.current.offsetWidth;
        setCardWidth(w < 500 ? Math.round(w * 0.78) : w < 900 ? 340 : 380);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const trackShift = `calc(50% - ${activeStep * (cardWidth + CARD_GAP) + cardWidth / 2}px)`;

  return (
    <>
      <style>{`
        .wcu-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #1a1008 0%, #2c1810 45%, #3d1f0a 100%);
          padding: 88px 0 72px;
        }
        .wcu-glow {
          position: absolute;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 900px; height: 500px;
          background: radial-gradient(ellipse, rgba(196,98,58,0.22) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .wcu-head {
          position: relative; z-index: 1;
          text-align: center;
          max-width: 680px;
          margin: 0 auto 56px;
          padding: 0 24px;
        }
        .wcu-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 20px;
          font-family: var(--font-body);
          font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.32em;
          color: #E88C2A;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          margin-bottom: 22px;
        }
        .wcu-title {
          font-family: var(--font-heading);
          font-size: clamp(30px, 4vw, 50px);
          font-weight: 700;
          line-height: 1.1;
          color: #FFF8F0;
          margin: 0 0 6px;
        }
        .wcu-title-accent {
          color: #E88C2A;
          font-style: italic;
        }
        .wcu-sub {
          font-family: var(--font-body);
          font-size: clamp(13px, 1.4vw, 15.5px);
          color: rgba(255,248,240,0.62);
          line-height: 1.8;
          margin: 16px 0 0;
        }
        .wcu-carousel-wrap {
          position: relative; z-index: 1;
          overflow: hidden;
        }
        .wcu-track-outer {
          overflow: visible;
          width: 100%;
        }
        .wcu-track {
          display: flex;
          gap: ${CARD_GAP}px;
          padding: 24px 0 40px;
          will-change: transform;
          transition: transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .wcu-card {
          flex-shrink: 0;
          border-radius: 20px;
          overflow: hidden;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          transition: opacity 0.5s ease, transform 0.5s ease, filter 0.5s ease, box-shadow 0.5s ease;
          cursor: pointer;
        }
        .wcu-card.is-active {
          cursor: default;
          box-shadow: 0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.2);
        }
        .wcu-card-top {
          padding: 22px 24px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wcu-card-title {
          font-family: var(--font-heading);
          font-size: clamp(17px, 2vw, 21px);
          font-weight: 700;
          color: #B86B45;
          margin: 0;
          line-height: 1.2;
        }
        .wcu-card-num {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #B86B45;
          opacity: 0.6;
        }
        .wcu-card-img {
          width: 100%;
          height: clamp(180px, 26vw, 260px);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .wcu-card-body {
          padding: 20px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .wcu-card-desc {
          font-family: var(--font-body);
          font-size: clamp(13px, 1.1vw, 14px);
          color: #3C2B27;
          line-height: 1.8;
          margin: 0;
          flex: 1;
        }
        .wcu-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid rgba(184,107,69,0.12);
          margin-top: auto;
        }
        .wcu-card-step-label {
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #B86B45;
        }
        .wcu-arrow {
          position: absolute;
          top: 50%; transform: translateY(-60%);
          z-index: 20;
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, opacity 0.2s ease;
          outline: none;
          padding: 0;
        }
        .wcu-arrow:hover { background: rgba(255,255,255,0.18); }
        .wcu-arrow:disabled { opacity: 0.2; cursor: not-allowed; }
        .wcu-dots {
          display: flex; justify-content: center; align-items: center;
          gap: 8px; margin-top: 8px;
          position: relative; z-index: 1;
        }
        .wcu-dot {
          height: 7px; border-radius: 4px;
          border: none; padding: 0; cursor: pointer;
          transition: all 0.35s ease; outline: none;
        }
        @keyframes wcu-blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        @media (max-width: 768px) {
          .wcu-section { padding: 64px 0 56px; }
          .wcu-arrow { width: 40px; height: 40px; }
        }
      `}</style>

      <div className='wcu-section' ref={processRef}>
        <div className='wcu-glow' />

        {/* ── Heading ── */}
        <motion.div
          className='wcu-head'
          initial={{ opacity: 0, y: 24 }}
          animate={reasonsIn ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className='wcu-badge'>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E88C2A', flexShrink: 0, boxShadow: '0 0 6px rgba(232,140,42,0.8)', animation: 'wcu-blink 2s ease-in-out infinite' }} />
            Why Choose Us
          </div>
          <h2 className='wcu-title'>
            Why Choose The<br />
            <span className='wcu-title-accent'>Underfloor Heating Store?</span>
          </h2>
          <p className='wcu-sub'>
            Expert advice, quality products, and service you can trust. Everything you need for the perfect underfloor heating solution.
          </p>
        </motion.div>

        {/* ── Carousel ── */}
        <motion.div
          className='wcu-carousel-wrap'
          initial={{ opacity: 0 }}
          animate={reasonsIn ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          {/* Left arrow */}
          <button
            className='wcu-arrow'
            style={{ left: 16 }}
            onClick={() => setActiveStep(i => Math.max(0, i - 1))}
            disabled={activeStep === 0}
          >
            <svg width={18} height={18} viewBox='0 0 24 24' fill='none' stroke='#FFF8F0' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='15 18 9 12 15 6' />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            className='wcu-arrow'
            style={{ right: 16 }}
            onClick={() => setActiveStep(i => Math.min(REASONS.length - 1, i + 1))}
            disabled={activeStep === REASONS.length - 1}
          >
            <svg width={18} height={18} viewBox='0 0 24 24' fill='none' stroke='#FFF8F0' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
              <polyline points='9 18 15 12 9 6' />
            </svg>
          </button>

          <div className='wcu-track-outer' ref={carouselRef}>
            <div
              className='wcu-track'
              style={{ transform: `translateX(${trackShift})` }}
            >
              {REASONS.map((step, i) => {
                const dist = Math.abs(i - activeStep);
                const isActive = dist === 0;
                const opacity = dist === 0 ? 1 : dist === 1 ? 0.55 : dist === 2 ? 0.28 : 0;
                const scale = dist === 0 ? 1 : dist === 1 ? 0.90 : 0.82;
                const blur = dist === 0 ? 0 : dist === 1 ? 1 : 2.5;

                return (
                  <div
                    key={step.num}
                    className={`wcu-card${isActive ? ' is-active' : ''}`}
                    onClick={() => !isActive && setActiveStep(i)}
                    style={{
                      width: cardWidth,
                      opacity,
                      transform: `scale(${scale})`,
                      filter: `blur(${blur}px)`,
                      transformOrigin: 'center bottom',
                      pointerEvents: dist > 2 ? 'none' : 'auto',
                      boxShadow: isActive
                        ? '0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.2)'
                        : '0 4px 16px rgba(0,0,0,0.12)',
                    }}
                  >
                    {/* Card top — title + num */}
                    <div className='wcu-card-top'>
                      <h3 className='wcu-card-title'>{step.title}</h3>
                      <span className='wcu-card-num'>{step.num}</span>
                    </div>

                    {/* Image */}
                    <div className='wcu-card-img'>
                      <Image
                        src={step.img}
                        alt={step.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes='(max-width: 768px) 85vw, 400px'
                      />
                    </div>

                    {/* Body */}
                    <div className='wcu-card-body'>
                      <p className='wcu-card-desc'>{step.desc}</p>

                      {isActive && (
                        <div className='wcu-card-footer'>
                          <span className='wcu-card-step-label'>
                            {parseInt(step.num, 10)} of {REASONS.length}
                          </span>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {REASONS.map((_, di) => (
                              <div
                                key={di}
                                onClick={e => { e.stopPropagation(); setActiveStep(di); }}
                                style={{
                                  width: di === activeStep ? 20 : 6,
                                  height: 6,
                                  borderRadius: 3,
                                  background: di === activeStep
                                    ? 'linear-gradient(90deg,#E8933A,#FF7E5F)'
                                    : 'rgba(184,107,69,0.22)',
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
            </div>
          </div>
        </motion.div>

        {/* ── Bottom dots ── */}
        <div className='wcu-dots'>
          {REASONS.map((step, i) => (
            <button
              key={i}
              className='wcu-dot'
              onClick={() => setActiveStep(i)}
              title={step.title}
              style={{
                width: i === activeStep ? 28 : 7,
                background: i === activeStep
                  ? 'linear-gradient(90deg,#E8933A,#FF7E5F)'
                  : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}