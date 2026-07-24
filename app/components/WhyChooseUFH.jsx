'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const EASE = [0.16, 1, 0.3, 1];

export default function WhyChooseUFH() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <>
      <style>{`
        @keyframes wc-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        .wc-section {
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 560px;
          display: flex;
          flex-direction: row;
          background: linear-gradient(160deg, #1a1008 0%, #2c1810 45%, #3d1f0a 100%);
        }
        .wc-left {
          position: relative;
          width: 48%;
          min-height: 560px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .wc-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 72px 80px 56px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 900px) {
          .wc-section { flex-direction: column; }
          .wc-left { width: 100%; min-height: 360px; }
          .wc-right { padding: 48px 28px 56px; }
        }
        @media (max-width: 640px) {
          .wc-left { min-height: 300px; }
          .wc-right { padding: 36px 20px 48px; }
        }
      `}</style>

      <section className='wc-section' ref={ref}>
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(196,98,58,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* LEFT COLUMN */}
        <motion.div
          className='wc-left'
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <img
            src="/images/k.png"
            alt="Electric Hamam Interior"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent 55%, #2c1810 95%, #2c1810 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, transparent, rgba(26,16,8,0.4))',
            pointerEvents: 'none',
            zIndex: 1
          }} />
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div
          className='wc-right'
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >

          <h2>
            <span style={{
              fontFamily: "var(--font-heading)",
              fontSize: 'clamp(38px,4vw,58px)',
              fontWeight: 700,
              color: '#FFF8F0',
              display: 'block',
              lineHeight: 1.1
            }}>
              Why Kashmir Families Are
            </span>
            <span style={{
              fontFamily: "var(--font-heading)",
              fontSize: 'clamp(38px,4vw,58px)',
              fontWeight: 700,
              color: '#C4623A',
              display: 'block',
              lineHeight: 1.1,
              marginBottom: '32px'
            }}>
              Choosing Electric Hamam
            </span>
          </h2>

          <div style={{
            width: '48px',
            height: '3px',
            background: 'linear-gradient(90deg, #C4623A, #E88C2A)',
            borderRadius: '2px',
            marginBottom: '40px'
          }} />

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '28px' }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1.5px solid rgba(196,98,58,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4623A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 'clamp(13.5px, 1.3vw, 15px)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.85,
              margin: 0
            }}>
              Electric hamam is transforming the way Kashmir homes stay warm during winter. Unlike traditional wood-fired heating systems, electric underfloor heating delivers clean, silent, and evenly distributed radiant warmth without smoke, wood storage, kerosene, or maintenance.

            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
            style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '28px' }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1.5px solid rgba(196,98,58,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4623A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 'clamp(13.5px, 1.3vw, 15px)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.85,
              margin: 0
            }}>
          Designed specifically for Kashmir’s harsh winters, the heated concrete layer stores warmth for long periods, helping rooms remain comfortable even during power cuts. The system heats both the floor and the entire room evenly, creating a more natural and comfortable indoor environment without the dry airflow of conventional heating systems.

            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '28px' }}
          >
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1.5px solid rgba(196,98,58,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4623A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
         <p style={{
              fontFamily: "var(--font-body)",
              fontSize: 'clamp(13.5px, 1.3vw, 15px)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.85,
              margin: 0
            }}>
Electric hamam systems can be installed beneath carpet, marble, tile, stone, and other common floor finishes — making them suitable for modern homes, villas, hotels, and traditional Kashmiri interiors alike.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}