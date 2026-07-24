


'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

const EASE = [0.16, 1, 0.3, 1];

const BRANDS = [
  {
    name: 'ProWarm',
    tag: 'ELECTRIC',
    img: '/brandimages/prowarm.webp',
    desc: 'One of the top-selling underfloor heating brands in India, trusted for its proven reliability, premium build quality, and advanced heating performance. ProWarm systems are widely chosen for residential, luxury, and commercial projects across the country.',
    accent: '#C4623A',
    accent2: '#E88C2A',
  },
  {
    name: 'Warmup',
    tag: 'UNDERFLOOR',
    img: '/brandimages/warmup.webp',
    desc: "A globally recognised underfloor heating brand known for innovative controls, modern design, and premium European engineering. Warmup is a popular choice for high-end interiors and smart heating applications.",
    accent: '#4FA3D1',
    accent2: '#6BAE7F',
  },
  {
    name: 'ThermoSphere',
    tag: 'TECHNOLOGY',
    img: '/brandimages/thermosphere.webp',
    desc: 'British-designed heating systems focused on energy efficiency, comfort, and long-term durability. Thermosphere products are well suited for modern homes, bathrooms, and renovation projects.',
    accent: '#8B3A2A',
    accent2: '#C4623A',
  },
  {
    name: 'AmberHeat',
    tag: 'RADIANT',
    img: '/brandimages/amberheat.webp',
    desc: 'A practical and cost-effective underfloor heating solution offering efficient radiant warmth and dependable comfort for residential applications.',
    accent: '#E88C2A',
    accent2: '#C4623A',
  },
  {
    name: 'FastWarm',
    tag: 'ALL-IN-ONE',
    img: '/brandimages/fastwarm.webp',
    desc: 'Specialist electric underfloor heating systems designed for reliable daily performance and practical installation flexibility. Fastwarm offers dependable heating solutions for a wide range of floor types and spaces.',
    accent: '#6BAE7F',
    accent2: '#4FA3D1',
  },
  {
    name: 'nVent RAYCHEM',
    tag: 'RADIANT',
    img: '/brandimages/nvent.png',
    desc: 'An internationally established heating and thermal technology brand known for engineered reliability and professional-grade performance. nVent systems are widely used in residential, commercial, and specialist heating applications worldwide.',
    accent: '#C4623A',
    accent2: '#E88C2A',
  },
];

export default function TrustedBrandsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const CARD_WIDTH = 320;
  const CARD_GAP = 20;

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const targetScroll = index * (CARD_WIDTH + CARD_GAP);
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const index = Math.round(container.scrollLeft / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(Math.min(Math.max(index, 0), BRANDS.length - 1));
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.pageX - scrollRef.current.offsetLeft;
    dragScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.2;
    scrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  return (
    <>
      <style>{`
        .tbs-wrap { position: relative; overflow: hidden; }
        .tbs-glow { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .tbs-content { max-width: 1320px; margin: 0 auto; padding: 88px 40px 72px; position: relative; z-index: 1; }
        .tbs-scroll-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          padding: 16px 0 32px;
        }
        .tbs-scroll-track::-webkit-scrollbar { display: none; }
        .tbs-brand-card {
          flex: 0 0 320px;
          scroll-snap-align: start;
          background: rgba(255,255,255,0.88);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 8px 32px rgba(60,42,37,0.09), 0 2px 8px rgba(60,42,37,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          position: relative;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .tbs-brand-card:hover {
          box-shadow: 0 24px 64px rgba(60,42,37,0.16), 0 4px 16px rgba(60,42,37,0.08);
          transform: translateY(-6px);
        }
        .tbs-card-logo-zone {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 28px 24px;
          box-sizing: border-box;
          position: relative;
        }
        .tbs-card-body {
          width: 100%;
          padding: 0 28px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
          flex: 1;
          box-sizing: border-box;
        }
        .tbs-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 14px;
          border-radius: 999px;
          font-family: var(--font-body);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .tbs-dots { display: flex; gap: 8px; justify-content: center; margin-top: 36px; }
        .tbs-dot { width: 8px; height: 8px; border-radius: 50%; border: none; padding: 0; cursor: pointer; transition: all 0.25s ease; }
        .tbs-dot.active { width: 24px; border-radius: 4px; }
        .tbs-fade-left {
          position: absolute; left: 0; top: 0; bottom: 0; width: 60px;
          background: linear-gradient(to right, rgba(255,248,240,0.95), transparent);
          pointer-events: none; z-index: 2;
        }
        .tbs-fade-right {
          position: absolute; right: 0; top: 0; bottom: 0; width: 60px;
          background: linear-gradient(to left, rgba(248,192,132,0.9), transparent);
          pointer-events: none; z-index: 2;
        }
        @keyframes tbs-blink { 0%,100%{opacity:1} 50%{opacity:.35} }
        @media (max-width: 768px) {
          .tbs-content { padding: 64px 20px 48px; }
          .tbs-brand-card { flex: 0 0 280px; }
          .tbs-card-logo-zone { height: 160px; }
        }
        @media (max-width: 480px) {
          .tbs-brand-card { flex: 0 0 85vw; }
        }
      `}</style>

      <div className='tbs-wrap' style={{ backgroundImage: 'linear-gradient(180deg,#FFFFFF 0%,#f5e1cbff 35%,#f4e7dbff 70%,#f8c084ff 100%)' }}>
        <div className='tbs-glow' style={{ background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)' }} />

        <div ref={ref} className='tbs-content'>

          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 52 }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 24px', fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#2C1810', borderRadius: 999, background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.45)', boxShadow: '0 4px 16px rgba(60,42,37,0.08)', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E88C2A', flexShrink: 0, boxShadow: '0 0 6px rgba(232,140,42,0.7)', animation: 'tbs-blink 2s ease-in-out infinite' }} />
              Trusted Brands
            </div>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 600, lineHeight: 1.1, color: '#2C1810', margin: '0 0 4px', textAlign: 'center' }}>
              World Class Heating,
            </h2>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 600, lineHeight: 1.1, color: '#8B3A2A', margin: '0 0 20px', textAlign: 'center' }}>
              Backed by Our Warranty
            </h2>
            <div style={{ width: 56, height: 2, borderRadius: 2, background: 'linear-gradient(90deg,#E88C2A,#FF7E5F)', marginBottom: 20 }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: 'clamp(14px, 1.5vw, 16px)', lineHeight: 1.8, color: '#3C2B27', maxWidth: 500, margin: 0 }}>
              We partner exclusively with the world's most trusted underfloor heating and electric hamam brands.
            </p>
          </motion.div>

          {/* ── Carousel ── */}
          <div style={{ position: 'relative' }}>
            <div className='tbs-fade-left' />
            <div className='tbs-fade-right' />
            <div
              className='tbs-scroll-track'
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {BRANDS.map((b, i) => (
                <motion.div
                  key={b.name}
                  className='tbs-brand-card'
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.2 + i * 0.09, ease: EASE }}
                >
                  {/* Logo zone */}
                  <div
                    className='tbs-card-logo-zone'
                    style={{ background: `linear-gradient(160deg, ${b.accent}08, ${b.accent2}12)` }}
                  >
                    <motion.img
                      src={b.img}
                      alt={b.name}
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: EASE }}
                      style={{
                        maxWidth: '80%',
                        maxHeight: 100,
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                        filter: 'drop-shadow(0 4px 14px rgba(0,0,0,0.12))',
                        userSelect: 'none',
                        pointerEvents: 'none',
                      }}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span style="font-family:var(--font-heading);font-size:26px;font-weight:700;color:#2C1810">${b.name}</span>`;
                      }}
                    />
                  </div>

                  {/* Body */}
                  <div className='tbs-card-body'>
                    {/* Tag pill */}
                    {/* <span
                      className='tbs-tag'
                      style={{ background: `${b.accent}15`, color: b.accent, border: `1px solid ${b.accent}30` }}
                    >
                      {b.tag}
                    </span> */}

                    {/* Brand name */}
                    {/* <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '1.35rem', fontWeight: 700, color: '#2C1810', margin: 0, lineHeight: 1.2 }}>
                      {b.name}
                    </h3> */}

                    {/* Divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.09, ease: EASE }}
                      style={{ width: 36, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${b.accent}, ${b.accent2})`, transformOrigin: 'left', flexShrink: 0 }}
                    />

                    {/* Description */}
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: '#5A3A2A', lineHeight: 1.75, margin: 0 }}>
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Dots ── */}
          <div className='tbs-dots'>
            {BRANDS.map((_, i) => (
              <button
                key={i}
                className={`tbs-dot${activeIndex === i ? ' active' : ''}`}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to brand ${i + 1}`}
                style={{
                  background: activeIndex === i ? '#C4623A' : 'rgba(196,98,58,0.25)',
                }}
              />
            ))}
          </div>

          {/* ── Stats row ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 52, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: 20, overflow: 'hidden' }}>
            {[
              { val: '500K+', label: 'India Installations' },
              { val: '2M+', label: 'Worldwide Systems' },
              { val: '2011', label: 'Trusted Since' },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '22px 0', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(184,107,69,0.12)' : 'none' }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, color: '#2C1810', margin: 0 }}>{s.val}</p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: '#6B4A2D', marginTop: 4, margin: '4px 0 0' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Footer CTA ── */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <a href='/contact' style={{ fontFamily: "var(--font-body)", fontSize: 13.5, fontWeight: 500, color: '#8B3A2A', textDecoration: 'none' }}>
              Talk to our experts to find the perfect fit →
            </a>
          </div>

        </div>
      </div>
    </>
  );
}