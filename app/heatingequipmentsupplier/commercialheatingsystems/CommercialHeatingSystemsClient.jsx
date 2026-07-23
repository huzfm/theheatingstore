'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Phone, MapPin, Award, ChevronDown,
  Hotel, BedDouble, Briefcase, ShoppingBag, Stethoscope, GraduationCap,
  Layers, Clock, ShieldCheck, MapPinned, Settings, Flame, Thermometer,
  TrendingUp, Wrench, Sparkles,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const APPLICATIONS = [
  { title: 'Hotels & Resorts', desc: 'Whole-property underfloor heating and electric hamams for guest rooms, lobbies, spas, and staff quarters.', Icon: Hotel, color: '#B86B45' },
  { title: 'Guest Houses', desc: 'Reliable, silent heating for boutique guest houses and heritage properties across Kashmir.', Icon: BedDouble, color: '#4FA3D1' },
  { title: 'Offices', desc: 'Zoned electric underfloor heating for productive, comfortable workspaces all winter long.', Icon: Briefcase, color: '#6BAE7F' },
  { title: 'Retail', desc: 'Even, silent warmth for showrooms and retail floors — without bulky radiators taking up space.', Icon: ShoppingBag, color: '#E8933A' },
  { title: 'Healthcare', desc: 'Clean, dust-free radiant heating for clinics, diagnostic centres, and small hospitals.', Icon: Stethoscope, color: '#8B6FAE' },
  { title: 'Education', desc: 'Comfortable classrooms, hostels, and dormitories — silent and low maintenance for decades.', Icon: GraduationCap, color: '#4FA3D1' },
];

const BENEFITS = [
  {
    title: 'Scalable',
    desc: 'From a single guest house to a 100-room hotel — we design and install heating systems at any scale.',
    Icon: Layers,
    color: '#B86B45',
  },
  {
    title: 'Reliable',
    desc: 'UK-imported systems with 0.01% global fault rate — built for the harshest European winters, ideal for Kashmir.',
    Icon: ShieldCheck,
    color: '#4FA3D1',
  },
  {
    title: 'Low Maintenance',
    desc: 'No moving parts, no annual servicing. Install once, enjoy silent, reliable heat for 25+ years.',
    Icon: Wrench,
    color: '#6BAE7F',
  },
  {
    title: 'Guest Comfort',
    desc: 'Silent, draft-free radiant warmth — the premium comfort today\'s guests expect from a top property.',
    Icon: Sparkles,
    color: '#E8933A',
  },
  {
    title: 'Long-Term Value',
    desc: 'Lower operating costs, fewer breakdowns, and a 25-year warranty — the strongest ROI of any heating system.',
    Icon: TrendingUp,
    color: '#8B6FAE',
  },
];

const HIGHLIGHTS = [
  { title: 'Commercial Experience', desc: 'Hotels, guest houses, offices, schools, and healthcare facilities across Kashmir since 2011.', Icon: Award },
  { title: 'In-House Kashmir Team', desc: 'Our own trained installers handle every project — no subcontractors, no hand-offs.', Icon: ShieldCheck },
  { title: 'Project Management', desc: 'Site survey, system design, installation timeline, and post-installation support — all written.', Icon: Clock },
  { title: 'Srinagar Based', desc: 'Our Rajbagh office and warehouse keep your project moving — parts in stock, no waiting.', Icon: MapPinned },
];

const FAQS = [
  {
    q: 'Do you supply heating for hotels in Kashmir?',
    a: 'Yes. We supply and install commercial heating systems for hotels, resorts, and houseboats across Kashmir — from single guest rooms to 100+ room properties. Every system is designed around the property layout, occupancy, and peak winter demand, with zoned thermostats for room-by-room control.',
  },
  {
    q: 'What heating systems work best for commercial spaces?',
    a: 'For most commercial spaces in Kashmir, electric underfloor heating is the most efficient, reliable, and low-maintenance option. It requires no boiler room, no plumbing, and runs silently for decades. For hotels and guest houses, electric hamams in bathrooms and zoned underfloor heating in guest rooms deliver the best guest experience.',
  },
  {
    q: 'Can you handle large-scale installations?',
    a: 'Yes. We have the in-house team and project management experience to handle large-scale commercial installations — multi-floor hotels, schools, and office buildings. Every project comes with a written timeline, a single point of contact, and our Kashmir installation guarantee.',
  },
  {
    q: 'Do you provide after-installation support?',
    a: 'Yes. Every commercial installation includes a free post-installation thermal check, a 10–25 year manufacturer warranty, and our Kashmir installation guarantee. We are available on call for any after-service needs — typically same-day across Srinagar.',
  },
  {
    q: 'How do I get a quote for a commercial project?',
    a: 'Call us at 9070907035 or message us on WhatsApp. We will arrange a free site survey across Srinagar, prepare a written quotation within 24–48 hours, and walk you through the recommended system, timeline, and warranty.',
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
        maxHeight: isOpen ? 400 : 0, overflow: 'hidden',
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

export default function CommercialHeatingSystemsClient() {
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
          .chs-map-container { height: 280px !important; }
          .chs-map-container iframe { height: 280px !important; }
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
          <Badge>UK Imported · Commercial Specialists</Badge>
          <h1 style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            fontWeight: 600, fontFamily: "'Cormorant Garamond', serif",
            color: '#3C2A25', lineHeight: 1.15, margin: '8px 0 0',
          }}>
            Commercial Heating Systems in Jammu Kashmir
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
          }}>
            Premium UK-imported heating systems for hotels, offices, guest houses, and commercial properties across Kashmir.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6B4A2D',
            lineHeight: 1.7, marginTop: 10, maxWidth: 580, margin: '10px auto 0',
          }}>
            Scalable, silent, low-maintenance — designed for guest comfort, productivity, and long-term ROI.
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

        {/* ── INTRODUCTION ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 880, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <GlassCard style={{ padding: 'clamp(28px,4vw,44px)' }}>
            <Badge>The Brief</Badge>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: '#3C2A25', lineHeight: 1.2, margin: '4px 0 0',
            }}>
              Heating built for Kashmir's commercial properties
            </h2>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#3C2B27',
              lineHeight: 1.8, marginTop: 16,
            }}>
              <p style={{ margin: 0 }}>
                Commercial properties in Kashmir face unique heating challenges — long sub-zero winters, frequent power cuts, and high guest or staff expectations. The Heating Store supplies and installs <strong>UK-imported commercial heating systems</strong> designed for hotels, guest houses, offices, retail, healthcare, and education. Our systems are silent, scalable, and built to deliver consistent comfort and productivity through the toughest Chilla Kalan — with the lowest operating cost and zero annual servicing.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── COMMERCIAL APPLICATIONS ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="Where We Work"
              title="Commercial"
              accent=" applications"
              center
              sub="From boutique hotels to multi-floor offices — we design, supply, and install heating systems for every commercial property type."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {APPLICATIONS.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                whileHover={{ y: -3 }}
              >
                <GlassCard style={{ padding: '24px 22px', height: '100%' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, marginBottom: 14,
                    background: `${a.color}15`, border: `1px solid ${a.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <a.Icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 21, fontWeight: 600, color: '#3C2A25',
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

        {/* ── WHY ELECTRIC HAMAM & UNDERFLOOR FOR COMMERCIAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <GlassCard style={{ padding: 'clamp(28px,4vw,44px)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <Badge>The Commercial Case</Badge>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
                color: '#3C2A25', lineHeight: 1.2, margin: '4px 0 0',
              }}>
                Why electric hamam and underfloor heating work for commercial use
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div style={{
                background: 'rgba(184,107,69,0.06)',
                border: '1px solid rgba(184,107,69,0.14)',
                borderRadius: 18,
                padding: '22px 22px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: 'rgba(184,107,69,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Flame className="w-5 h-5" style={{ color: '#B86B45' }} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 600, color: '#3C2A25', margin: 0,
                  }}>
                    Electric Hamam
                  </h3>
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: '#6B4A2D', lineHeight: 1.7, margin: 0,
                }}>
                  Perfect for hotel bathrooms, spas, and guest-room floors. Premium warmth for guests, certified safe for wet areas, and silent operation — exactly what a top-tier property needs.
                </p>
              </div>
              <div style={{
                background: 'rgba(79,163,209,0.06)',
                border: '1px solid rgba(79,163,209,0.14)',
                borderRadius: 18,
                padding: '22px 22px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: 'rgba(79,163,209,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Thermometer className="w-5 h-5" style={{ color: '#4FA3D1' }} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 600, color: '#3C2A25', margin: 0,
                  }}>
                    Underfloor Heating
                  </h3>
                </div>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: '#6B4A2D', lineHeight: 1.7, margin: 0,
                }}>
                  Ideal for offices, lobbies, retail floors, schools, and healthcare facilities. Zoned thermostats, silent operation, no visible equipment — premium comfort with the lowest total cost of ownership.
                </p>
              </div>
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
              badge="Why Commercial"
              title="The commercial"
              accent=" advantage"
              center
              sub="Five reasons commercial properties across Kashmir choose UK-imported heating from The Heating Store."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.slice(0, 3).map((b, i) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" style={{ maxWidth: 760, margin: '16px auto 0' }}>
            {BENEFITS.slice(3).map((b, i) => (
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

        {/* ── WHY CHOOSE THE HEATING STORE ── */}
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
              <Badge>Why Us</Badge>
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: 'white', lineHeight: 1.2, margin: '8px 0 0',
            }}>
              Why choose The Heating Store for commercial projects?
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8, margin: '16px 0 0', maxWidth: 760,
            }}>
              We have been designing, supplying, and installing commercial heating systems across Kashmir since 2011. Every project — from boutique guest houses to large multi-floor hotels — is handled by our own in-house team, with a single point of contact, a written timeline, and a 25-year warranty.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 18,
                  padding: '16px 18px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(255,255,255,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <h.Icon className="w-4 h-4" style={{ color: '#F5B97A' }} />
                  </div>
                  <div>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      color: 'white', margin: 0, lineHeight: 1.3,
                    }}>
                      {h.title}
                    </p>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
                      color: 'rgba(255,255,255,0.75)', margin: '4px 0 0', lineHeight: 1.5,
                    }}>
                      {h.desc}
                    </p>
                  </div>
                </div>
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
            <Badge>Plan a Project</Badge>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: '#3C2A25', lineHeight: 1.2, margin: '4px 0 0',
            }}>
              Planning a commercial heating project?
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15,
              color: '#6B4A2D', lineHeight: 1.7, margin: '14px auto 0', maxWidth: 560,
            }}>
              Call us and we'll arrange a free site survey, walk you through the recommended system, and provide a written quotation within 24–48 hours.
            </p>
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
                className="chs-map-container"
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
                  title="The Heating Store — Commercial Heating Systems"
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
              title="Commercial Heating"
              accent=" — Frequently Asked Questions"
              center
              sub="Answers to the most common questions we hear from hotels, offices, and commercial property owners in Kashmir."
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
