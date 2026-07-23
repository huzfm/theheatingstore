'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

// ── SVG Icons ────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const BoltIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const VolumeOffIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

const ToolIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="9" y1="6" x2="9" y2="6"/>
    <line x1="15" y1="6" x2="15" y2="6"/>
    <line x1="9" y1="10" x2="9" y2="10"/>
    <line x1="15" y1="10" x2="15" y2="10"/>
    <line x1="9" y1="14" x2="9" y2="14"/>
    <line x1="15" y1="14" x2="15" y2="14"/>
    <path d="M10 22v-4h4v4"/>
  </svg>
);

const StoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l1-5h16l1 5"/>
    <path d="M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9"/>
    <path d="M9 21V13h6v8"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Reusable badge (matches existing "Since 2011" pill style) ───────────────
function Badge({ children }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 12 }}>
      <span aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: 999, pointerEvents: 'none',
        background: 'linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))',
        opacity: 0.7,
      }} />
      <p style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8,
        whiteSpace: 'nowrap', padding: '8px 22px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.32em', color: '#4FA3D1',
        borderRadius: 999, background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 14px 40px rgba(15,23,42,0.18)',
        margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(255,255,255,0.5)',
      borderRadius: 22,
      boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionHeading({ badge, title, accent, sub, center = false }) {
  return (
    <div style={{
      textAlign: center ? 'center' : 'left',
      maxWidth: center ? 640 : 'none',
      margin: center ? '0 auto' : 0,
    }}>
      <Badge>{badge}</Badge>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(1.625rem, 3.5vw, 2.5rem)',
        fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.01em',
        color: '#3C2A25', margin: 0,
      }}>
        {title}
        {accent && (
          <span style={{ display: 'inline', fontWeight: 300, color: '#B86B45' }}>{accent}</span>
        )}
      </h2>
      {sub && (
        <p style={{
          marginTop: 14, fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(14px, 1.6vw, 16px)', lineHeight: 1.75, color: '#3C2B27',
          fontWeight: 400, maxWidth: 560, margin: center ? '14px auto 0' : '14px 0 0',
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <GlassCard style={{ overflow: 'hidden' }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
        aria-expanded={isOpen}
      >
        <span style={{
          fontSize: 15, fontWeight: 600, color: '#3C2A25', lineHeight: 1.4, flex: 1,
        }}>
          {q}
        </span>
        <span style={{
          color: '#B86B45', display: 'flex', flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
        }}>
          <ChevronDownIcon />
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? 320 : 0, overflow: 'hidden',
        transition: 'max-height 0.35s ease',
      }}>
        <p style={{
          padding: '0 24px 22px', margin: 0,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          color: '#6B4A2D', lineHeight: 1.75,
        }}>
          {a}
        </p>
      </div>
    </GlassCard>
  );
}

// ── Main product template component ──────────────────────────────────────────
export default function ProductPageTemplate({
  productName,
  heroTagline,
  heroSubtitle,
  whatIsText,
  benefits = [],
  audiences = [],
  whyUkImportedText,
  areasServed = [],
  faqs = [],
  jsonLd,
}) {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);

  const defaultBenefits = [
    { title: 'Consistent Warmth', desc: 'Even heat across the entire floor surface — no cold spots, no drafts.', Icon: FlameIcon, color: '#B86B45' },
    { title: 'Energy Efficient', desc: 'Engineered to use less power while delivering more heat per watt.', Icon: BoltIcon, color: '#4FA3D1' },
    { title: 'Silent Operation', desc: 'No fans, no noise — just quiet, radiant warmth from the floor up.', Icon: VolumeOffIcon, color: '#6BAE7F' },
    { title: 'Low Maintenance', desc: 'No moving parts, no servicing — install once, enjoy for decades.', Icon: ToolIcon, color: '#E8933A' },
  ];

  const finalBenefits = benefits.length > 0 ? benefits : defaultBenefits;

  const defaultAudiences = [
    { title: 'Homes', desc: 'Apartments, independent houses, and heritage homes across Kashmir.', Icon: HomeIcon },
    { title: 'Hotels', desc: 'Boutique hotels and houseboats needing reliable winter heating for guests.', Icon: BuildingIcon },
    { title: 'Commercial', desc: 'Offices, showrooms, and commercial buildings requiring zoned comfort.', Icon: StoreIcon },
  ];

  const finalAudiences = audiences.length > 0 ? audiences : defaultAudiences;

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .product-map-container { height: 280px !important; }
          .product-map-container iframe { height: 280px !important; }
        }
      `}</style>
      <motion.div
        aria-hidden
        animate={reduce ? {} : { opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            maxWidth: 820, margin: '0 auto', textAlign: 'center',
            padding: 'clamp(64px,8vw,96px) clamp(20px,4vw,40px) 56px',
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: 820, margin: '-32px auto 28px' }}>
            <Link
              href="/heatingequipmentsupplier"
              className="inline-flex items-center gap-2 text-sm text-[#B86B45] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Heating Equipment
            </Link>
          </div>
          <Badge>UK Imported · Kashmir Specialist</Badge>
          <h1 style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            fontWeight: 600, fontFamily: "'Cormorant Garamond', serif",
            color: '#3C2A25', lineHeight: 1.15, margin: '8px 0 0',
          }}>
            {productName}
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
          }}>
            {heroTagline}
          </p>
          {heroSubtitle && (
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6B4A2D',
              lineHeight: 1.7, marginTop: 10, maxWidth: 580, margin: '10px auto 0',
            }}>
              {heroSubtitle}
            </p>
          )}
          <div className="flex flex-row justify-center gap-3 mt-7">
            <a
              href="tel:+919070907035"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
                boxShadow: '0 12px 32px rgba(184,107,69,0.35)', textDecoration: 'none',
              }}
            >
              <PhoneIcon /> Call Now
            </a>
            <a
              href="https://maps.google.com/?q=Rajbagh+Srinagar+Jammu+and+Kashmir"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                border: '1.5px solid rgba(184,107,69,0.35)', color: '#3C2A25',
                background: 'rgba(255,255,255,0.6)', textDecoration: 'none',
              }}
            >
              <MapPinIcon /> Get Directions
            </a>
          </div>
        </motion.div>

        {/* ── WHAT IS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 880, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <GlassCard style={{ padding: 'clamp(28px,4vw,44px)' }}>
            <Badge>The Basics</Badge>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: '#3C2A25', lineHeight: 1.2, margin: '4px 0 0',
            }}>
              What is {productName}?
            </h2>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#3C2B27',
              lineHeight: 1.8, marginTop: 16,
            }}>
              {whatIsText}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── KEY BENEFITS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="Key Benefits"
              title="Why homeowners choose"
              accent={` ${productName}`}
              sub="Engineered for Kashmir's sub-zero winters, daily power cuts, and the long winter nights."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {finalBenefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                whileHover={{ y: -4 }}
                style={{
                  background: 'rgba(255,255,255,0.72)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  borderRadius: 22,
                  padding: '24px 22px',
                  boxShadow: '0 8px 32px rgba(60,42,37,0.07)',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 14,
                  background: `${b.color}15`, border: `1px solid ${b.color}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <b.Icon color={b.color} />
                </div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 19, fontWeight: 600, color: '#3C2A25',
                  margin: 0, lineHeight: 1.25,
                }}>
                  {b.title}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  color: '#6B4A2D', lineHeight: 1.6, margin: '8px 0 0',
                }}>
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── WHO IS IT FOR ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <SectionHeading
              badge="Ideal For"
              title="Who is it"
              accent=" for?"
              sub={`${productName} works beautifully across residential and commercial spaces in Kashmir.`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {finalAudiences.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                whileHover={{ y: -3 }}
              >
                <GlassCard style={{ padding: '24px 24px', height: '100%' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'rgba(184,107,69,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 14,
                  }}>
                    <a.Icon color="#B86B45" />
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 19, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.25,
                  }}>
                    {a.title}
                  </h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                    color: '#6B4A2D', lineHeight: 1.65, margin: '8px 0 0',
                  }}>
                    {a.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── WHY UK IMPORTED ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #3C2A25 0%, #5C3D2E 50%, #B86B45 100%)',
              borderRadius: 28,
              padding: 'clamp(36px,5vw,56px)',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 24,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <AwardIcon color="#F5B97A" />
              </div>
              <Badge>UK Imported</Badge>
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: 'white', lineHeight: 1.2, margin: 0,
            }}>
              Why UK-imported {productName}?
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8, margin: 0, maxWidth: 760,
            }}>
              {whyUkImportedText || `Every ${productName} we install is sourced from leading UK manufacturers, certified for safety and efficiency, and built to perform in the most demanding climates. We don't sell local imitations — we sell the same systems used in European homes for decades, now installed by our Kashmir team.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              {['CE Certified', '25+ Year Warranty', '0.01% Fault Rate', 'Since 2011'].map((t) => (
                <span key={t} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 999, padding: '6px 14px', color: 'rgba(255,255,255,0.9)',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── CONTACT CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SectionHeading
              badge="Talk to an Expert"
              title="Ready to install"
              accent={` ${productName}?`}
              center
              sub="Our Kashmir-based team is available for site surveys, technical consultations, and quotations."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 items-stretch">
            <GlassCard style={{ padding: '28px 26px' }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                fontWeight: 600, color: '#3C2A25', margin: 0, lineHeight: 1.2,
              }}>
                The Heating Store
              </h3>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#B86B45', marginTop: 2, display: 'flex' }}>
                    <MapPinIcon />
                  </span>
                  <div>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                      color: '#3C2A25', margin: 0,
                    }}>
                      Store Address
                    </p>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                      color: '#6B4A2D', margin: '2px 0 0', lineHeight: 1.6,
                    }}>
                      Rajbagh, Srinagar, J&amp;K 190008
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#B86B45', marginTop: 2, display: 'flex' }}>
                    <PhoneIcon />
                  </span>
                  <div>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                      color: '#3C2A25', margin: 0,
                    }}>
                      Phone
                    </p>
                    <a
                      href="tel:+919070907035"
                      style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#B86B45',
                        fontWeight: 600, textDecoration: 'none', display: 'inline-block',
                        marginTop: 2,
                      }}
                    >
                      +91 90709 07035
                    </a>
                  </div>
                </div>
              </div>
              <a
                href="tel:+919070907035"
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
                  boxShadow: '0 12px 28px rgba(184,107,69,0.32)',
                  textDecoration: 'none', marginTop: 22,
                }}
              >
                <PhoneIcon /> Call Now
              </a>
            </GlassCard>

            <a
              href="https://maps.google.com/?q=Rajbagh+Srinagar+Jammu+and+Kashmir"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none' }}
              aria-label="Open The Heating Store location in Google Maps"
            >
              <div
                className="product-map-container"
                style={{
                  width: '100%', height: '100%', minHeight: 320, borderRadius: 22,
                  overflow: 'hidden', border: '1px solid rgba(230,199,165,0.6)',
                  boxShadow: '0 8px 28px rgba(60,42,37,0.10)', cursor: 'pointer',
                }}
              >
                <iframe
                  src="https://www.google.com/maps?q=Rajbagh+Srinagar&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block', pointerEvents: 'none', minHeight: 320 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`The Heating Store — ${productName}`}
                />
              </div>
            </a>
          </div>
        </motion.div>

        {/* ── AREAS WE SERVE ── */}
        {areasServed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
          >
            <div
              style={{
                paddingTop: 40,
                borderTop: '1px solid rgba(184,107,69,0.18)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <SectionHeading
                  badge="Coverage Area"
                  title="Areas We Serve"
                  accent=" in Srinagar"
                  center
                  sub={`The Heating Store supplies and installs ${productName} across all of Srinagar.`}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {areasServed.map((a, i) => (
                  <motion.div
                    key={a.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                    whileHover={{ y: -2 }}
                  >
                    <Link
                      href={a.href}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '12px 22px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.55)',
                        color: '#3C2A25', fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14, fontWeight: 500, textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(60,42,37,0.05)',
                        transition: 'all 0.22s ease',
                      }}
                    >
                      <MapPinIcon />
                      {a.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ maxWidth: 800, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(72px,10vw,96px)' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <SectionHeading
                badge="FAQ"
                title={productName}
                accent=" — Frequently Asked Questions"
                center
                sub="Answers to the most common questions we hear from customers across Kashmir."
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((f, i) => (
                <FaqItem
                  key={i}
                  q={f.q}
                  a={f.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
