

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const Icon = {
  Zap: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2.5L5 13.5H12.5L9.5 21.5L19 10.5H11.5L14.5 2.5Z"/>
      <path d="M12 8L10 12" strokeOpacity="0.35" strokeWidth="1"/>
    </svg>
  ),
  Grid: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C7 3 3 7 3 12C3 17 7 21 12 21C17 21 21 17 21 12C21 7 17 3 12 3Z"/>
      <path d="M3 12H21"/><path d="M12 3C9 7 9 17 12 21"/><path d="M12 3C15 7 15 17 12 21"/>
      <path d="M5.5 6.5C7.5 8 9.8 8.8 12 8.8C14.2 8.8 16.5 8 18.5 6.5" strokeOpacity="0.35" strokeWidth="0.9"/>
      <path d="M5.5 17.5C7.5 16 9.8 15.2 12 15.2C14.2 15.2 16.5 16 18.5 17.5" strokeOpacity="0.35" strokeWidth="0.9"/>
    </svg>
  ),
  Layers: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7L12 3L21 7L12 11L3 7Z"/><path d="M3 12L12 16L21 12"/><path d="M3 17L12 21L21 17"/>
      <path d="M7 9L5 10" strokeOpacity="0.35" strokeWidth="1"/>
    </svg>
  ),
  DollarSign: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 6V18"/>
      <path d="M15 9.5C15 8.1 13.7 7 12 7C10.3 7 9 8.1 9 9.5C9 10.9 10.3 12 12 12C13.7 12 15 13.1 15 14.5C15 15.9 13.7 17 12 17C10.3 17 9 15.9 9 14.5"/>
    </svg>
  ),
  Shield: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21.5C12 21.5 3.5 17.5 3.5 11V5.5L12 2.5L20.5 5.5V11C20.5 17.5 12 21.5 12 21.5Z"/>
      <path d="M8.5 12L10.5 14L15.5 9.5"/>
      <path d="M12 5V8" strokeOpacity="0.3" strokeWidth="0.9"/>
    </svg>
  ),
  Heart: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5C12 20.5 2.5 14.5 2.5 8.5C2.5 5.5 4.9 3 8 3C9.9 3 11.6 4 12 5.5C12.4 4 14.1 3 16 3C19.1 3 21.5 5.5 21.5 8.5C21.5 14.5 12 20.5 12 20.5Z"/>
      <path d="M7 8C7 7 7.8 6 9 6" strokeOpacity="0.35" strokeWidth="1"/>
    </svg>
  ),
  Clock: ({ size = 32, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7.5V12.5L15.5 15"/>
      <path d="M17 5.5L18.5 4" strokeOpacity="0.35" strokeWidth="1"/>
      <path d="M7 5.5L5.5 4" strokeOpacity="0.35" strokeWidth="1"/>
    </svg>
  ),
};

const REASONS = [
  {
    IconComp: Icon.Zap,
    num: '01',
    title: 'Rapid Warmth',
    desc: 'Our Electric hamam systems reach operating temperature in 45-60 minutes Far faster than wood fired hamams.',
    color: '#E88C2A',
    img: './resons/reason1.jpg',
  },
  {
    IconComp: Icon.Grid,
    num: '02',
    title: 'Even Heat Distribution',
    desc: 'Electric underfloor heating delivers consistent warmth across the entire floor surface, helping to eliminate cold spots and create a more comfortable living environment.',
    color: '#4FA3D1',
    img: './resons/reason2.jpg',
  },
  {
    IconComp: Icon.Layers,
    num: '03',
    title: 'Low Floor Build Up',
    desc: 'Designed for efficient installation with minimal floor height increase, requiring only 2.5–3 inches including insulation, heating system, and concrete finish.',
    color: '#8B3A2A',
    img: './resons/reason3.jpg',
  },
  {
    IconComp: Icon.DollarSign,
    num: '04',
    title: 'Energy Efficient Heating',
    desc: 'A heated hamam system is up to 70% more energy efficient than traditional wood-fired heating methods.',
    color: '#6BAE7F',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop',
  },
  {
    IconComp: Icon.Shield,
    num: '05',
    title: 'Lifetime Reliability',
    desc: 'Electric underfloor heating systems are designed to last for decades with zero maintenance. Our systems include a lifetime warranty with 10–25 year product guarantees.',
    color: '#C4623A',
    img: './resons/reason4.jpg',
  },
  {
    IconComp: Icon.Heart,
    num: '06',
    title: 'Healthier Indoor Comfort',
    desc: 'Unlike wood fired heating, harsh hot-and-cold ACs, or gas heaters, electric hamam heating provides gentle radiant warmth without smoke, dry air, or dust circulation.',
    color: '#C4623A',
    img: './resons/reason5.png',
  },
  {
    IconComp: Icon.Clock,
    num: '07',
    title: 'Fast Installation',
    desc: 'From civil preparation and underfloor heating installation to final floor finishing and guarantee registration, the complete process is typically completed within 5–6 hours.',
    color: '#6BAE7F',
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop',
  },
];

export default function FiveReasonsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(null);
  const dragStartActive = useRef(null);
  const total = REASONS.length;

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

  // Position offset for each card relative to active
  const getOffset = (i) => {
    let off = i - active;
    // Wrap for circular effect
    if (off > total / 2) off -= total;
    if (off < -total / 2) off += total;
    return off;
  };

  return (
    <>
      <style>{`
        .fr-section { position: relative; overflow: hidden; }
        .fr-glow { position: absolute; inset: 0; pointer-events: none; }
        .fr-content { max-width: 1320px; margin: 0 auto; padding: 88px 0 72px; position: relative; z-index: 1; }
        .fr-head { text-align: center; max-width: 620px; margin: 0 auto 64px; padding: 0 40px; }
        .fr-carousel { position: relative; width: 100%; height: 520px; display: flex; align-items: center; justify-content: center; overflow: hidden; user-select: none; }
        .fr-carousel-track { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .fr-card-wrap { position: absolute; top: 0; left: 50%; height: 100%; display: flex; align-items: center; cursor: pointer; }
        .fr-card { background: #fff; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.22); width: 340px; height: 460px; flex-shrink: 0; }
        .fr-card-img { width: 100%; height: 220px; object-fit: cover; display: block; flex-shrink: 0; }
        .fr-card-body { padding: 24px 26px 28px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .fr-card-icon-wrap { width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .fr-dots { display: flex; gap: 8px; justify-content: center; margin-top: 40px; }
        .fr-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(196,98,58,0.25); border: none; padding: 0; cursor: pointer; transition: all 0.25s ease; }
        .fr-dot.active { background: #C4623A; width: 24px; border-radius: 4px; }
        @keyframes fr-blink { 0%,100%{opacity:1} 50%{opacity:.18} }
        @media (max-width: 768px) { .fr-content { padding: 64px 0 48px; } .fr-head { margin-bottom: 40px; padding: 0 20px; } .fr-carousel { height: 440px; } .fr-card { width: 290px; height: 400px; } .fr-card-img { height: 180px; } }
        @media (max-width: 480px) { .fr-carousel { height: 400px; } .fr-card { width: 270px; height: 380px; } .fr-card-img { height: 160px; } .fr-card-body { padding: 18px 20px 22px; } }
      `}</style>

      <div
        className='fr-section'
        style={{ backgroundImage: 'linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 45%,#FFE8D0 100%)' }}
      >
        <div className='fr-glow' style={{ background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)' }} />

        <div ref={ref} className='fr-content'>
          {/* ── Heading ── */}
          <div className='fr-head'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 24px', fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#4FA3D1', borderRadius: 999, background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.45)', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E88C2A', flexShrink: 0, boxShadow: '0 0 6px rgba(232,140,42,0.7)', animation: 'fr-blink 2s ease-in-out infinite' }} />
              Why Electric Hamam
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.1, color: '#2C1810', margin: 0 }}>
              7 Reasons to Install
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
              style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#E88C2A', margin: '4px 0 0' }}>
              Electric Hamam This Winter
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              style={{ width: 48, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#C4623A,#E88C2A)', margin: '20px auto 0' }} />
          </div>

          {/* ── Carousel ── */}
          <div
            className='fr-carousel'
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={onPointerDown}
            onTouchMove={onPointerMove}
            onTouchEnd={onPointerUp}
          >
            <div className='fr-carousel-track'>
              {REASONS.map((r, i) => {
                const off = getOffset(i);
                const absOff = Math.abs(off);
                const isActive = off === 0;
                const isVisible = absOff <= 2;
                if (!isVisible) return null;

                const xPx = off * 260;
                const scale = isActive ? 1 : absOff === 1 ? 0.82 : 0.68;
                const opacity = isActive ? 1 : absOff === 1 ? 0.55 : 0.28;
                const zIndex = isActive ? 10 : absOff === 1 ? 5 : 2;
                const blur = isActive ? 0 : absOff === 1 ? 1.5 : 3;

                return (
                  <motion.div
                    key={r.num}
                    className='fr-card-wrap'
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
                    <div className='fr-card'>
                      <img
                        src={r.img}
                        alt={r.title}
                        className='fr-card-img'
                        loading='lazy'
                        decoding='async'
                        draggable={false}
                        onError={e => { e.target.style.background = `${r.color}20`; e.target.style.display = 'block'; }}
                      />
                      <div className='fr-card-body'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 2 }}>
                          <div
                            className='fr-card-icon-wrap'
                            style={{ background: `${r.color}15`, border: `1.5px solid ${r.color}30` }}
                          >
                            <r.IconComp size={22} color={r.color} />
                          </div>
                          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '1.18rem', fontWeight: 700, color: '#2C1810', lineHeight: 1.2, margin: 0 }}>
                            {r.title}
                          </h3>
                        </div>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D', lineHeight: 1.7, margin: 0 }}>
                          {r.desc}
                        </p>
                        <div style={{ marginTop: 'auto', width: 28, height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${r.color}, ${r.color}50)` }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Dots ── */}
          <div className='fr-dots'>
            {REASONS.map((_, i) => (
              <button
                key={i}
                className={`fr-dot${active === i ? ' active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}