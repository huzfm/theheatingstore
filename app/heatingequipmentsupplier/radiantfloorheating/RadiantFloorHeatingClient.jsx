'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Flame, EyeOff, Volume2, ShieldCheck, Home, Building2, Award, ChevronDown, Sparkles } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const BENEFITS = [
  {
    title: 'Consistent Warmth',
    desc: 'Radiant heat radiates uniformly across the entire floor — enveloping the room in consistent, even warmth from the ground up.',
    Icon: Flame,
    color: '#B86B45',
  },
  {
    title: 'No Visible Equipment',
    desc: 'No radiators, no vents, no heaters on display. Radiant floor heating keeps every wall and floor space free for your design.',
    Icon: EyeOff,
    color: '#4FA3D1',
  },
  {
    title: 'Silent Operation',
    desc: 'No fans, no pumps, no moving parts. The system warms silently in the background — perfect for bedrooms, studies, and quiet spaces.',
    Icon: Volume2,
    color: '#6BAE7F',
  },
  {
    title: 'Long-Term Reliability',
    desc: 'No moving parts means nothing to service. Install once, enjoy silent radiant warmth for decades — backed by a 25-year warranty.',
    Icon: ShieldCheck,
    color: '#E8933A',
  },
];

const COMPARISON = [
  {
    feature: 'Heat Distribution',
    radiant: 'Even, edge-to-edge warmth from the entire floor',
    traditional: 'Hot near the radiator, cold everywhere else',
  },
  {
    feature: 'Air Quality',
    radiant: 'No drafts, no dust, no dry air — gentle radiant warmth',
    traditional: 'Forced air stirs dust and dries the air',
  },
  {
    feature: 'Noise',
    radiant: 'Completely silent — no fans, no clicks',
    traditional: 'Bangs, clicks, and fan noise from radiators and boilers',
  },
  {
    feature: 'Wall & Floor Space',
    radiant: 'Zero visible equipment — total design freedom',
    traditional: 'Bulky radiators take up wall and floor space',
  },
  {
    feature: 'Power Cut Resilience',
    radiant: 'Screed retains heat for 8–10 hours after power loss',
    traditional: 'Cold within minutes of a power cut',
  },
  {
    feature: 'Energy Use',
    radiant: 'Lower operating temperature, less power per square foot',
    traditional: 'Higher temperatures, more power for the same warmth',
  },
];

const AUDIENCES = [
  { title: 'Homes', desc: 'Apartments, independent houses, and heritage homes across Kashmir.', Icon: Home },
  { title: 'Villas', desc: 'Large villas and luxury homes needing consistent whole-home comfort.', Icon: Home },
  { title: 'Hotels', desc: 'Boutique hotels, houseboats, and guesthouses — silent warmth for guests.', Icon: Building2 },
  { title: 'Commercial', desc: 'Offices, showrooms, and commercial buildings requiring zoned, all-day comfort.', Icon: Building2 },
];

const FAQS = [
  {
    q: 'What is radiant floor heating?',
    a: 'Radiant floor heating is a UK-imported underfloor heating system that warms the entire floor surface of a room or home. Heating cables or mats are installed beneath the floor, encapsulated in a concrete screed, and radiate gentle, even heat upward — enveloping the room in consistent warmth with no radiators and no fans.',
  },
  {
    q: 'How does it differ from underfloor heating?',
    a: 'The terms are often used interchangeably. "Underfloor heating" describes where the system is — under the floor. "Radiant floor heating" describes how the heat is delivered — through radiation rather than convection. All radiant floor heating is underfloor heating; the difference is in the principle of heat transfer, which produces the same consistent, draft-free warmth.',
  },
  {
    q: 'Is it suitable for Kashmir?',
    a: 'Yes. Radiant floor heating is ideally suited to Kashmir\'s sub-zero climate. The screed acts as thermal mass, retaining heat for 8–10 hours after a power cut — perfect for the long Chilla Kalan winters and frequent power cuts across the valley.',
  },
  {
    q: 'What types of flooring work best?',
    a: 'Radiant floor heating works beautifully under tile, stone, marble, granite, and engineered wood. We design the cable spacing and output for your specific floor finish to deliver the right balance of warmth and efficiency.',
  },
  {
    q: 'Can it be installed during renovation?',
    a: 'Yes. We routinely retrofit radiant floor heating in existing Kashmir homes during renovation. The process involves lifting the existing floor, installing insulation and heating mats, and re-screeding — typically completed in 1–2 days for a single room.',
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
          fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
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
        fontFamily: "var(--font-heading)",
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
          marginTop: 14, fontFamily: "var(--font-body)",
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
          fontFamily: "var(--font-body)",
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
          fontFamily: "var(--font-body)", fontSize: 14,
          color: '#6B4A2D', lineHeight: 1.75,
        }}>
          {a}
        </p>
      </div>
    </GlassCard>
  );
}

export default function RadiantFloorHeatingClient() {
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
          .rfh-map-container { height: 280px !important; }
          .rfh-map-container iframe { height: 280px !important; }
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
            fontWeight: 600, fontFamily: "var(--font-heading)",
            color: '#3C2A25', lineHeight: 1.15, margin: '8px 0 0',
          }}>
            Radiant Floor Heating in Jammu Kashmir
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
          }}>
            Premium UK-imported radiant floor heating systems, supplied and installed across Kashmir by The Heating Store.
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 14, color: '#6B4A2D',
            lineHeight: 1.7, marginTop: 10, maxWidth: 580, margin: '10px auto 0',
          }}>
            Silent, even radiant warmth — designed for sub-zero Kashmir floors with 8–10 hour heat retention.
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
              fontFamily: "var(--font-heading)",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: '#3C2A25', lineHeight: 1.2, margin: '4px 0 0',
            }}>
              What is Radiant Floor Heating?
            </h2>
            <div style={{
              fontFamily: "var(--font-body)", fontSize: 15, color: '#3C2B27',
              lineHeight: 1.8, marginTop: 16,
            }}>
              <p style={{ margin: 0 }}>
                <strong>Radiant floor heating</strong> delivers heat by radiation — the same principle that warms you in sunlight. UK-imported heating cables or mats are installed beneath the floor surface and encapsulated in a concrete screed. The screed absorbs heat from the cables and radiates it gently and evenly upward, enveloping the entire room in consistent, draft-free warmth. No radiators, no fans, no noise — just radiant comfort from the floor up.
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
              accent=" Radiant Floor Heating"
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
                  fontFamily: "var(--font-heading)",
                  fontSize: 19, fontWeight: 600, color: '#3C2A25',
                  margin: 0, lineHeight: 1.25,
                }}>
                  {b.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 13,
                  color: '#6B4A2D', lineHeight: 1.6, margin: '8px 0 0',
                }}>
                  {b.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── RADIANT VS TRADITIONAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="The Comparison"
              title="Radiant vs."
              accent=" Traditional Heating"
              sub="See why radiant floor heating outperforms radiators and forced-air systems in Kashmir's climate."
            />
          </div>
          <GlassCard style={{ padding: 'clamp(20px,3vw,32px)', overflow: 'hidden' }}>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr>
                    <th style={{
                      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#6B4A2D', textAlign: 'left', padding: '14px 18px',
                      borderBottom: '1px solid rgba(184,107,69,0.18)',
                    }}>
                      Feature
                    </th>
                    <th style={{
                      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#B86B45', textAlign: 'left', padding: '14px 18px',
                      borderBottom: '1px solid rgba(184,107,69,0.18)',
                    }}>
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" /> Radiant Floor Heating
                      </span>
                    </th>
                    <th style={{
                      fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#6B4A2D', textAlign: 'left', padding: '14px 18px',
                      borderBottom: '1px solid rgba(184,107,69,0.18)',
                    }}>
                      Traditional Heating
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature}>
                      <td style={{
                        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                        color: '#3C2A25', padding: '16px 18px',
                        borderBottom: i === COMPARISON.length - 1 ? 'none' : '1px solid rgba(184,107,69,0.10)',
                        verticalAlign: 'top',
                      }}>
                        {row.feature}
                      </td>
                      <td style={{
                        fontFamily: "var(--font-body)", fontSize: 13.5,
                        color: '#3C2B27', padding: '16px 18px', lineHeight: 1.6,
                        background: 'rgba(184,107,69,0.06)',
                        borderBottom: i === COMPARISON.length - 1 ? 'none' : '1px solid rgba(184,107,69,0.10)',
                        verticalAlign: 'top',
                      }}>
                        {row.radiant}
                      </td>
                      <td style={{
                        fontFamily: "var(--font-body)", fontSize: 13.5,
                        color: '#6B4A2D', padding: '16px 18px', lineHeight: 1.6,
                        borderBottom: i === COMPARISON.length - 1 ? 'none' : '1px solid rgba(184,107,69,0.10)',
                        verticalAlign: 'top',
                      }}>
                        {row.traditional}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
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
              sub="Radiant floor heating works beautifully across residential and commercial spaces in Kashmir."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <a.Icon className="w-5 h-5" style={{ color: '#B86B45' }} />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 19, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.25,
                  }}>
                    {a.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: 13.5,
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
              fontFamily: "var(--font-heading)",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: 'white', lineHeight: 1.2, margin: '8px 0 0',
            }}>
              Why UK-imported radiant floor heating?
            </h2>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: 15, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8, margin: '16px 0 0', maxWidth: 760,
            }}>
              Every radiant floor heating system we install is sourced from leading UK manufacturers and certified to CE / IEC 60335 safety standards. UK heating systems are designed for some of the harshest European winters — making them ideally suited to Kashmir's Chilla Kalan. We don't sell local imitations; we sell the same systems used in European homes for decades, now installed by our Kashmir team.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {['CE Certified', '25+ Year Warranty', '0.01% Fault Rate', 'Since 2011'].map((t) => (
                <span key={t} style={{
                  fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
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
              accent=" Radiant Floor Heating?"
              center
              sub="Our Kashmir-based team is available for site surveys, technical consultations, and quotations."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 items-stretch">
            <GlassCard style={{ padding: '28px 26px' }}>
              <h3 style={{
                fontFamily: "var(--font-heading)", fontSize: 22,
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
                      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                      color: '#3C2A25', margin: 0,
                    }}>
                      Store Address
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: 14,
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
                      fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                      color: '#3C2A25', margin: 0,
                    }}>
                      Phone
                    </p>
                    <a
                      href="tel:+919070907035"
                      style={{
                        fontFamily: "var(--font-body)", fontSize: 14, color: '#B86B45',
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
                className="rfh-map-container"
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
                  title="The Heating Store — Radiant Floor Heating"
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
              title="Radiant Floor Heating"
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
