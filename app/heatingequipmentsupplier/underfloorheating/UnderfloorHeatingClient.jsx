'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Flame, Volume2, Zap, EyeOff, Snowflake, Home, Building2, Award, ChevronDown } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const BENEFITS = [
  {
    title: 'Even Heat Distribution',
    desc: 'Heat radiates uniformly across the entire floor surface — no cold spots, no drafts, just consistent comfort in every corner of the room.',
    Icon: Flame,
    color: '#B86B45',
  },
  {
    title: 'Silent Operation',
    desc: 'No fans, no pumps, no moving parts. Underfloor heating warms silently, so the only thing you hear is the quiet of your home.',
    Icon: Volume2,
    color: '#4FA3D1',
  },
  {
    title: 'Energy Efficient',
    desc: 'Operates at lower temperatures than radiators while delivering the same warmth — using less power and reducing your monthly bills.',
    Icon: Zap,
    color: '#6BAE7F',
  },
  {
    title: 'Hidden Infrastructure',
    desc: 'No visible radiators, no bulky heaters. Underfloor heating frees your walls and floor plan, giving you total design freedom.',
    Icon: EyeOff,
    color: '#E8933A',
  },
];

const WHY_KASHMIR = [
  {
    title: 'Built for Sub-Zero Climates',
    desc: 'UK-imported underfloor heating is engineered for some of the harshest European winters — making it ideally suited to Kashmir\'s Chilla Kalan.',
    Icon: Snowflake,
    color: '#4FA3D1',
  },
  {
    title: '8–10 Hour Heat Retention',
    desc: 'The concrete screed acts as thermal mass — absorbing heat and releasing it slowly, so rooms stay warm for hours even after a power cut.',
    Icon: Flame,
    color: '#B86B45',
  },
  {
    title: 'Long Winter Comfort',
    desc: 'Kashmir winters run from November to February. Underfloor heating provides consistent, all-day warmth without the dry air of forced-heat systems.',
    Icon: Zap,
    color: '#E8933A',
  },
];

const AUDIENCES = [
  { title: 'Homes', desc: 'Apartments, independent houses, and heritage homes across Kashmir.', Icon: Home, color: '#B86B45' },
  { title: 'Hotels', desc: 'Boutique hotels, houseboats, and guesthouses needing reliable winter heating for guests.', Icon: Building2, color: '#4FA3D1' },
  { title: 'Commercial', desc: 'Offices, showrooms, and commercial buildings requiring zoned, all-day comfort.', Icon: Building2, color: '#6BAE7F' },
];

const FAQS = [
  {
    q: 'What is underfloor heating?',
    a: 'Underfloor heating is a system of heating cables or mats installed beneath your floor surface, encapsulated in a concrete screed. The screed absorbs heat and radiates it slowly and evenly upward, providing silent, draft-free warmth across the entire floor — with 8–10 hour heat retention after a power cut.',
  },
  {
    q: 'Is underfloor heating suitable for Kashmir winters?',
    a: 'Yes. UK-imported underfloor heating is engineered for some of the harshest European winters and is ideally suited to Kashmir\'s sub-zero climate. The thermal mass of the screed retains heat for hours, providing reliable warmth even during the long Chilla Kalan.',
  },
  {
    q: 'Can it be installed in existing homes?',
    a: 'Yes. While new builds are simplest, we routinely retrofit underfloor heating in existing Kashmir homes — typically by lifting the existing floor, installing insulation and heating mats, and re-screeding. We provide a free site survey to confirm feasibility.',
  },
  {
    q: 'How long does installation take?',
    a: 'A single-room installation is typically completed in 1 day. Full-house underfloor heating installation usually takes 1–2 days depending on total area and the number of zones.',
  },
  {
    q: 'Is it energy efficient?',
    a: 'Yes. Underfloor heating operates at lower temperatures than traditional radiators while delivering more even warmth, using less power per square foot. Combined with zoned thermostats, it is one of the most efficient heating options available.',
  },
];

function Badge({ children }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 12 }}>
      <span
        aria-hidden
        style={{
          position: 'absolute', inset: 0, borderRadius: 999, pointerEvents: 'none',
          background: 'linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))',
          opacity: 0.7,
        }}
      />
      <p
        style={{
          position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8,
          whiteSpace: 'nowrap', padding: '8px 22px',
          fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.32em', color: '#4FA3D1',
          borderRadius: 999, background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 14px 40px rgba(15,23,42,0.18)',
          margin: 0,
        }}
      >
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
          <ChevronDown className="w-[18px] h-[18px]" />
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? 360 : 0, overflow: 'hidden',
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

export default function UnderfloorHeatingClient() {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .ufh-map-container { height: 280px !important; }
          .ufh-map-container iframe { height: 280px !important; }
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
            padding: 'clamp(48px,6vw,72px) clamp(20px,4vw,40px) 32px',
          }}
        >
          <div className="flex justify-start mb-6" style={{ maxWidth: 820, margin: '0 auto' }}>
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
            Underfloor Heating in Jammu Kashmir
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
          }}>
            Premium UK-imported underfloor heating systems, supplied and installed across Kashmir by The Heating Store.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6B4A2D',
            lineHeight: 1.7, marginTop: 10, maxWidth: 580, margin: '10px auto 0',
          }}>
            Engineered for sub-zero Kashmir floors, with 8–10 hour heat retention after a power cut.
          </p>
          <div className="flex flex-row justify-center gap-3 mt-7">
            <a
              href="tel:+919070907035"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
                boxShadow: '0 12px 32px rgba(184,107,69,0.35)', textDecoration: 'none',
              }}
            >
              <Phone className="w-4 h-4" /> Call Now
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
              <MapPin className="w-4 h-4" /> Get Directions
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
              What is Underfloor Heating?
            </h2>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#3C2B27',
              lineHeight: 1.8, marginTop: 16,
            }}>
              <p style={{ margin: 0 }}>
                <strong>Underfloor heating</strong> is a UK-imported heating system installed beneath your floor surface. Heating cables or mats are laid on an insulated subfloor and encapsulated in a concrete screed, which acts as thermal mass — absorbing heat and releasing it slowly for hours, even after the power goes off. The result is silent, even warmth across the entire floor, with no radiators, no fans, and no noise.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── BENEFITS ── */}
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
              accent=" Underfloor Heating"
              sub="Engineered for Kashmir's sub-zero winters, daily power cuts, and the long winter nights."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => (
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
                  <b.Icon className="w-5 h-5" style={{ color: b.color }} />
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

        {/* ── WHY IDEAL FOR KASHMIR ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="Built for Kashmir"
              title="Why Underfloor Heating is"
              accent=" ideal for Kashmir"
              sub="Designed for sub-zero floors, long winters, and frequent power cuts."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {WHY_KASHMIR.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                whileHover={{ y: -3 }}
              >
                <GlassCard style={{ padding: '26px 24px', height: '100%' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, marginBottom: 14,
                    background: `${b.color}15`, border: `1px solid ${b.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <b.Icon className="w-5 h-5" style={{ color: b.color }} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.25,
                  }}>
                    {b.title}
                  </h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                    color: '#6B4A2D', lineHeight: 1.65, margin: '8px 0 0',
                  }}>
                    {b.desc}
                  </p>
                </GlassCard>
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
              sub="Underfloor heating works beautifully across residential and commercial spaces in Kashmir."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AUDIENCES.map((a, i) => (
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
                    <a.Icon className="w-5 h-5" style={{ color: a.color }} />
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
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Award className="w-6 h-6" style={{ color: '#F5B97A' }} />
              </div>
              <Badge>UK Imported</Badge>
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: 'white', lineHeight: 1.2, margin: '8px 0 0',
            }}>
              Why UK-imported underfloor heating?
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8, margin: '16px 0 0', maxWidth: 760,
            }}>
              Every underfloor heating system we install is sourced from leading UK manufacturers and certified to CE / IEC 60335 safety standards. UK heating systems are designed for some of the harshest European winters — making them ideally suited to Kashmir's Chilla Kalan. We don't sell local imitations; we sell the same systems used in European homes for decades, now installed by our Kashmir team.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
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
              accent=" Underfloor Heating?"
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
                    <MapPin className="w-5 h-5" />
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
                    <Phone className="w-5 h-5" />
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
                <Phone className="w-4 h-4" /> Call Now
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
                className="ufh-map-container"
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
                  title="The Heating Store — Underfloor Heating"
                />
              </div>
            </a>
          </div>
        </motion.div>

        {/* ── FAQ ── */}
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
              title="Underfloor Heating"
              accent=" — Frequently Asked Questions"
              center
              sub="Answers to the most common questions we hear from customers across Kashmir."
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((f, i) => (
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

      </div>
    </section>
  );
}
