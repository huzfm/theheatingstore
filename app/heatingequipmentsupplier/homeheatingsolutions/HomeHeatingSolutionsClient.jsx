'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Phone, MapPin, Flame, Thermometer, Wind, Zap, Settings, Home as HomeIcon, Building2, Award, ChevronDown, Sparkles, ShieldCheck, Clock, MapPinned, Layers } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const SOLUTIONS = [
  {
    name: 'Electric Hamam',
    href: '/heatingequipmentsupplier/electrichamam',
    desc: 'Traditional Kashmiri warmth, modernised — UK-imported electric underfloor heating.',
    Icon: Flame,
    color: '#B86B45',
  },
  {
    name: 'Underfloor Heating',
    href: '/heatingequipmentsupplier/underfloorheating',
    desc: 'Even, silent heat from the ground up — for full-home Kashmir comfort.',
    Icon: Thermometer,
    color: '#4FA3D1',
  },
  {
    name: 'Radiant Floor Heating',
    href: '/heatingequipmentsupplier/radiantfloorheating',
    desc: 'Consistent radiant warmth with no visible equipment and no noise.',
    Icon: Wind,
    color: '#E8933A',
  },
  {
    name: 'Electric Floor Heating',
    href: '/heatingequipmentsupplier/electricfloorheating',
    desc: 'Modern electric underfloor systems — fast warm-up, certified safe for wet areas.',
    Icon: Zap,
    color: '#6BAE7F',
  },
  {
    name: 'Heating Systems',
    href: '/heatingequipmentsupplier/heatingsystems',
    desc: 'Complete heating system solutions — design, supply, and installation.',
    Icon: Settings,
    color: '#8B6FAE',
  },
];

const GUIDE = [
  {
    title: 'New build house',
    desc: 'Underfloor heating is installed before the screed is poured — easiest and most cost-effective time to do it.',
    Icon: Layers,
    color: '#4FA3D1',
  },
  {
    title: 'Renovation / retrofit',
    desc: 'Low-profile electric mats designed for retrofit — we lift the existing floor and re-screed in 1–2 days per room.',
    Icon: Sparkles,
    color: '#B86B45',
  },
  {
    title: 'Apartment / flat',
    desc: 'Single-room or whole-flat electric hamam — perfect for apartments, with no boiler or plumbing required.',
    Icon: HomeIcon,
    color: '#6BAE7F',
  },
  {
    title: 'Villa / large home',
    desc: 'Whole-home underfloor heating with zoned thermostats — full control, room by room.',
    Icon: Building2,
    color: '#E8933A',
  },
];

const HIGHLIGHTS = [
  {
    title: 'UK Imported Quality',
    desc: 'Every system is sourced from leading UK manufacturers, certified to CE / IEC 60335 safety standards.',
    Icon: Award,
    color: '#B86B45',
  },
  {
    title: 'Kashmir-Tuned',
    desc: 'Designed for sub-zero floors, Chilla Kalan, and frequent power cuts across the valley.',
    Icon: ShieldCheck,
    color: '#4FA3D1',
  },
  {
    title: 'Free Site Survey',
    desc: 'Free, no-obligation site visit across Srinagar — written quotation within 24 hours.',
    Icon: Clock,
    color: '#6BAE7F',
  },
  {
    title: 'Based in Rajbagh',
    desc: 'Our Srinagar store and installation team are minutes from anywhere in the city.',
    Icon: MapPinned,
    color: '#E8933A',
  },
];

const FAQS = [
  {
    q: 'Which heating system is best for a Kashmir home?',
    a: 'For most Kashmir homes, electric underfloor heating is the most reliable, efficient, and easy-to-install option. It requires no boiler, no plumbing, and retains heat for 8–10 hours after a power cut — perfect for the long Chilla Kalan winters. We design the system around your home, layout, and usage.',
  },
  {
    q: 'Can I install underfloor heating in an existing home?',
    a: 'Yes. We routinely retrofit underfloor heating in existing Kashmir homes during renovation. The process involves lifting the existing floor, installing insulation and heating mats, and re-screeding — typically completed in 1–2 days for a single room. We provide a free site survey to confirm feasibility.',
  },
  {
    q: 'What is the difference between electric hamam and underfloor heating?',
    a: 'Electric hamam is the Kashmiri term for electric underfloor heating — the systems are essentially the same: UK-imported heating cables installed under the floor, encapsulated in a screed that radiates gentle warmth. "Hamam" reflects the local heritage; the technology is the same world-class UK system.',
  },
  {
    q: 'How long do installations take?',
    a: 'A single-room installation is typically completed in 1 day. A full-house system usually takes 1–2 days depending on the number of rooms and zones. We provide a written project timeline as part of every quotation.',
  },
  {
    q: 'Do you serve all of Srinagar?',
    a: 'Yes. We supply and install home heating solutions across all of Srinagar — Rajbagh, Jawahar Nagar, Lal Chowk, Sonwar, Gogji Bagh, Dalgate, Bemina, Hyderpora, Sanat Nagar, Chanapora, Rawalpora, Nowgam, Nishat, Hazratbal, and Pantha Chowk.',
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

export default function HomeHeatingSolutionsClient() {
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
          .hhs-map-container { height: 280px !important; }
          .hhs-map-container iframe { height: 280px !important; }
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
            Home Heating Solutions in Jammu Kashmir
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
          }}>
            Premium UK-imported home heating solutions for houses, villas, and apartments across Kashmir.
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6B4A2D',
            lineHeight: 1.7, marginTop: 10, maxWidth: 580, margin: '10px auto 0',
          }}>
            From single-room electric hamams to whole-home underfloor heating — designed for Kashmir's sub-zero winters.
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
            <Badge>Why It Matters</Badge>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 600,
              color: '#3C2A25', lineHeight: 1.2, margin: '4px 0 0',
            }}>
              Kashmir winters demand quality home heating
            </h2>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: '#3C2B27',
              lineHeight: 1.8, marginTop: 16,
            }}>
              <p style={{ margin: 0 }}>
                Kashmir's winters are long, cold, and unforgiving — temperatures drop well below zero during Chilla Kalan, and power cuts are a regular occurrence. For homeowners, that means the heating system you choose isn't a luxury — it's a necessity. The Heating Store supplies and installs <strong>UK-imported home heating solutions</strong> that are designed for sub-zero floors, retain heat for hours after a power cut, and run silently for decades. Whether you live in a heritage houseboat, a Srinagar apartment, or a new-build villa, we design, supply, and install the right system for your home.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── HEATING SOLUTIONS WE OFFER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="Our Solutions"
              title="Heating solutions"
              accent=" we offer"
              center
              sub="Explore the full range of UK-imported heating systems we supply and install for homes across Kashmir."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOLUTIONS.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                whileHover={{ y: -4 }}
                style={{
                  background: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.55)',
                  borderRadius: 22,
                  boxShadow: '0 8px 32px rgba(60,42,37,0.08)',
                  padding: '26px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 16,
                  background: `${s.color}15`, border: `1px solid ${s.color}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.Icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22, fontWeight: 600, color: '#3C2A25',
                  margin: 0, lineHeight: 1.2,
                }}>
                  {s.name}
                </h3>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: '#6B4A2D', lineHeight: 1.65, margin: '10px 0 0',
                  flexGrow: 1,
                }}>
                  {s.desc}
                </p>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition-transform hover:translate-x-1"
                  style={{
                    color: '#B86B45', textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── WHICH SOLUTION IS RIGHT FOR YOUR HOME ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="Find Your Fit"
              title="Which solution is"
              accent=" right for your home?"
              sub="A simple guide to help you choose the right system for your space and stage."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GUIDE.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                whileHover={{ y: -3 }}
              >
                <GlassCard style={{ padding: '24px 22px', height: '100%' }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12, marginBottom: 14,
                    background: `${g.color}15`, border: `1px solid ${g.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <g.Icon className="w-5 h-5" style={{ color: g.color }} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.25,
                  }}>
                    {g.title}
                  </h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
                    color: '#6B4A2D', lineHeight: 1.65, margin: '8px 0 0',
                  }}>
                    {g.desc}
                  </p>
                </GlassCard>
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
              Why choose The Heating Store for your home?
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8, margin: '16px 0 0', maxWidth: 760,
            }}>
              We've been supplying and installing premium UK-imported heating systems for Kashmir homes since 2011. Every project is handled by our own Srinagar-based team — from the free site survey to the final thermal check — and backed by a 10–25 year manufacturer warranty plus our own Kashmir installation guarantee.
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
            <SectionHeading
              badge="Talk to an Expert"
              title="Ready to heat"
              accent=" your home?"
              center
              sub="Our Kashmir-based team is available for free site surveys, technical consultations, and quotations across Srinagar."
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
                className="hhs-map-container"
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
                  title="The Heating Store — Home Heating Solutions"
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
              title="Home Heating Solutions"
              accent=" — Frequently Asked Questions"
              center
              sub="Answers to the most common questions we hear from homeowners across Kashmir."
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
