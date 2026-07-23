'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

const EASE = [0.16, 1, 0.3, 1];

const CARDS = [
  {
    accentColor: '#DC2626',
    stat: '4M+ deaths/yr WHO',
    title: 'Clean & Smoke-Free Heating',
    body: 'No wood smoke, ash, soot, kerosene odours, or chimney cleaning inside the home.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 6 4 9.5 4 14a8 8 0 1 0 16 0c0-4.5-4-8-8-12z"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      </svg>
    ),
  },
  {
    accentColor: '#D97706',
    stat: 'Forests disappearing',
    title: 'Even Whole-Room Warmth',
    body: 'Radiant floor heating distributes warmth evenly across the floor and throughout the room.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/>
        <path d="M12 12L8 8"/>
        <path d="M12 12L16 8"/>
        <path d="M8 6L6 4"/>
        <path d="M16 6L18 4"/>
        <circle cx="12" cy="3" r="2"/>
      </svg>
    ),
  },
  {
    accentColor: '#EA580C',
    stat: '2-3 hrs daily labour',
    title: 'Simple Everyday Comfort',
    body: 'No wood storage, fire preparation, or daily maintenance required during winter.',

    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z"/>
      </svg>
    ),
  },
  {
    accentColor: '#7C3AED',
    stat: 'No control at all',
     title: 'Precise Temperature Control',
    body: 'Easily control room temperature using manual, programmable, or WiFi thermostats.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
      </svg>
    ),
  },
  {
    accentColor: '#B91C1C',
    stat: 'Children at real risk',
   title: 'Heat Retention During Power Cuts',
    body: 'The heated screed layer stores warmth for long-lasting comfort even after shutdown.',

    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </svg>
    ),
  },
  {
    accentColor: '#475569',
    stat: 'Hidden costs always',
     title: 'Compatible With Modern Interiors',
    body: 'Suitable beneath carpet, marble, tile, stone, and engineered flooring systems.',

    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: '6-10 hrs', label: 'Heat retained after power off' },
  { value: '2-4 inches', label: 'Floor height added only' },
  { value: '10-25+ yrs', label: 'System lifespan warranty' },
  { value: 'Zero', label: 'Smoke, fumes & emissions' },
];

export default function WhyElectricHamam() {
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef(null);
  const quoteRef = useRef(null);

  const headerIn = useInView(headerRef, { once: true, amount: 0.2 });
  const statsIn = useInView(statsRef, { once: true, amount: 0.2 });
  const quoteIn = useInView(quoteRef, { once: true, amount: 0.3 });

  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const dragStartActive = useRef(null);
  const total = CARDS.length;

  const goTo = useCallback((index) => {
    let i = index;
    if (i < 0) i = total - 1;
    if (i >= total) i = 0;
    setActive(i);
  }, [total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goTo(active - 1);
      if (e.key === 'ArrowRight') goTo(active + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  const onPointerDown = (e) => {
    setIsDragging(false);
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragStartActive.current = active;
  };
  const onPointerMove = (e) => {
    if (dragStartX.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    if (Math.abs(x - dragStartX.current) > 8) setIsDragging(true);
  };
  const onPointerUp = (e) => {
    if (dragStartX.current === null) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const diff = dragStartX.current - endX;
    if (Math.abs(diff) > 48) goTo(dragStartActive.current + (diff > 0 ? 1 : -1));
    dragStartX.current = null;
    setTimeout(() => setIsDragging(false), 50);
  };

  const getOffset = (i) => {
    let off = i - active;
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    return off;
  };

  return (
    <>
      <style>{`
        .weh-section { font-family: 'DM Sans', sans-serif; }
        @keyframes weh-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media (max-width: 640px) {
          .weh-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .weh-quote { flex-direction: column !important; }
        }
        @media (max-width: 900px) {
          .weh-cards-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        .weh-carousel { position: relative; width: 100%; height: 380px; display: flex; align-items: center; justify-content: center; overflow: hidden; user-select: none; }
        .weh-carousel-track { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .weh-card-wrap { position: absolute; top: 0; left: 50%; height: 100%; display: flex; align-items: center; cursor: pointer; }
        .weh-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(196,98,58,0.25); border: none; padding: 0; cursor: pointer; transition: all 0.25s ease; }
        .weh-dot.active { background: #C4623A; width: 24px; border-radius: 4px; }
        @media (max-width: 768px) {
          .weh-carousel { height: 340px; }
          .weh-card { width: 280px !important; height: 300px !important; }
        }
        @media (max-width: 480px) {
          .weh-carousel { height: 310px; }
          .weh-card { width: 260px !important; height: 280px !important; }
        }
      `}</style>

      <section className="weh-section" id="why-electric-hamam" style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE8D0 70%, #F8C084 100%)',
        padding: '64px 40px',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>

          {/* 1. HEADER */}
          <div ref={headerRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={headerIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ textAlign: 'center', marginBottom: 40 }}
            >
              {/* Badge pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(196,98,58,0.08)',
                border: '1px solid rgba(184,107,69,0.18)',
                borderRadius: 999,
                padding: '6px 16px',
                marginBottom: 20,
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#E88C2A',
                  display: 'inline-block',
                  animation: 'weh-blink 2s infinite',
                }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#B86B45',
                }}>
                  The Modern Choice
                </span>
              </div>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#2C1810',
                lineHeight: 1.1,
                margin: '0 auto',
                maxWidth: 640,
              }}>
               The Modern Evolution of Traditional Warmth
              </h2>

              {/* Orange underline bar */}
              <div style={{
                width: 48,
                height: 3,
                background: 'linear-gradient(90deg,#C4623A,#E88C2A)',
                borderRadius: 2,
                margin: '16px auto',
              }} />

           
            </motion.div>
          </div>

          {/* 2. STATS ROW */}
          <div ref={statsRef} style={{
            borderTop: '1px solid rgba(184,107,69,0.18)',
            borderBottom: '1px solid rgba(184,107,69,0.18)',
            padding: '20px 0',
            margin: '32px 0',
          }}>
            <motion.div
              className="weh-stats-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={statsIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
              }}
            >
              {STATS.map((stat, i) => (
                <div key={stat.value} style={{
                  textAlign: 'center',
                  padding: '0 16px',
                  borderRight: i < STATS.length - 1 ? '1px solid rgba(184,107,69,0.18)' : 'none',
                }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(28px, 3vw, 36px)',
                    fontWeight: 700,
                    color: '#C4623A',
                    lineHeight: 1.1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11.5,
                    color: '#6B4A2D',
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 3. SIX CARDS CAROUSEL */}
          <div ref={cardsRef}>
            <div
              className="weh-carousel"
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            >
              <div className="weh-carousel-track">
                {CARDS.map((card, i) => {
                  const off = getOffset(i);
                  const absOff = Math.abs(off);
                  const isActive = off === 0;
                  const isVisible = absOff <= 2;
                  if (!isVisible) return null;

                  const xPx = off * 240;
                  const scale = isActive ? 1 : absOff === 1 ? 0.84 : 0.70;
                  const opacity = isActive ? 1 : absOff === 1 ? 0.5 : 0.25;
                  const zIndex = isActive ? 10 : absOff === 1 ? 5 : 2;
                  const blur = isActive ? 0 : absOff === 1 ? 1.5 : 3;

                  return (
                    <motion.div
                      key={card.title}
                      className="weh-card-wrap"
                      onClick={() => !isDragging && goTo(i)}
                      animate={{
                        x: `calc(-50% + ${xPx}px)`,
                        scale,
                        opacity,
                        filter: `blur(${blur}px)`,
                        zIndex,
                      }}
                      transition={{ duration: 0.48, ease: EASE }}
                      style={{ zIndex }}
                    >
                      <div
                        className="weh-card"
                        style={{
                          position: 'relative',
                          width: 320,
                          height: 340,
                          background: 'rgba(255,255,255,0.92)',
                          backdropFilter: 'blur(28px)',
                          border: '1px solid rgba(184,107,69,0.22)',
                          borderRadius: 24,
                          boxShadow: isActive
                            ? '0 24px 64px rgba(60,42,37,0.14), 0 0 0 2px rgba(196,98,58,0.15)'
                            : '0 24px 64px rgba(60,42,37,0.14)',
                          padding: '28px 26px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 14,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {/* Top accent line */}
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                          background: `linear-gradient(90deg, ${card.accentColor}, ${card.accentColor}60)`,
                          borderRadius: '24px 24px 0 0',
                        }} />

                        {/* Watermark number */}
                        <div style={{
                          position: 'absolute', bottom: 16, right: 20,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 64, fontWeight: 700,
                          color: card.accentColor + '08',
                          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>

                        {/* Top row: icon + stat */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: card.accentColor + '12',
                            border: `1px solid ${card.accentColor}25`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: card.accentColor, flexShrink: 0,
                          }}>
                            {card.icon}
                          </div>
                         
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 'clamp(20px, 2vw, 24px)',
                          fontWeight: 700, color: '#2C1810',
                          lineHeight: 1.2, margin: 0,
                        }}>
                          {card.title}
                        </h3>

                        {/* Micro bar */}
                        <div style={{
                          width: 32, height: 2.5,
                          background: `linear-gradient(90deg, ${card.accentColor}, ${card.accentColor}50)`,
                          borderRadius: 2,
                        }} />

                        {/* Body */}
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13.5, color: '#3C2B27',
                          opacity: 0.82, lineHeight: 1.72, margin: 0, flex: 1,
                        }}>
                          {card.body}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28 }}>
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  className={`weh-dot${active === i ? ' active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 4. DOCTOR QUOTE */}
          <div ref={quoteRef} style={{
            borderTop: '1px solid rgba(184,107,69,0.18)',
            paddingTop: 24,
            marginTop: 32,
          }}>
            <motion.div
              className="weh-quote"
              initial={{ opacity: 0, y: 20 }}
              animate={quoteIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
              }}
            >
              {/* Quote mark */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 72,
                color: 'rgba(196,98,58,0.2)',
                lineHeight: 1,
                marginTop: -8,
                flexShrink: 0,
              }}>
                "
              </div>

              {/* Content */}
              <div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(15px, 1.5vw, 18px)',
                  fontStyle: 'italic',
                  color: '#2C1810',
                  lineHeight: 1.7,
                  opacity: 0.9,
                  margin: 0,
                }}>
                  "The underfloor heating system has no generation of gases, is completely insulated which makes it safe. There is no production of smoke — it is as good as a traditional hamam in every way."
                </p>

                {/* Attribution */}
                <div style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  marginTop: 12,
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#E88C2A',
                    display: 'inline-block',
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#B86B45',
                  }}>
                    Dr. Naveed Nazir — Pulmonologist, Kashmir
                  </span>
                  <span style={{
                    background: 'rgba(196,98,58,0.08)',
                    border: '1px solid rgba(184,107,69,0.18)',
                    color: '#B86B45',
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                  }}>
                    Kashmir Observer, Dec 2023
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}
