'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Thermometer, Home, Building2, Zap, Settings, Wind, ArrowRight, Phone, MapPin, Award, ShieldCheck, MapPinned } from 'lucide-react';
import Link from 'next/link';

const EASE = [0.16, 1, 0.3, 1];

const SERVICES = [
  {
    name: 'Electric Hamam',
    slug: '/heatingequipmentsupplier/electrichamam',
    desc: 'Traditional Kashmiri warmth, modernised',
    Icon: Flame,
    color: '#B86B45',
  },
  {
    name: 'Underfloor Heating',
    slug: '/heatingequipmentsupplier/underfloorheating',
    desc: 'Even heat from the ground up',
    Icon: Thermometer,
    color: '#4FA3D1',
  },
  {
    name: 'Radiant Floor Heating',
    slug: '/heatingequipmentsupplier/radiantfloorheating',
    desc: 'Consistent radiant warmth',
    Icon: Wind,
    color: '#E8933A',
  },
  {
    name: 'Home Heating Solutions',
    slug: '/heatingequipmentsupplier/homeheatingsolutions',
    desc: 'Complete home heating packages',
    Icon: Home,
    color: '#6BAE7F',
  },
  {
    name: 'Commercial Heating',
    slug: '/heatingequipmentsupplier/commercialheatingsystems',
    desc: 'Heating for hotels, offices & more',
    Icon: Building2,
    color: '#8B6FAE',
  },
  {
    name: 'Electric Floor Heating',
    slug: '/heatingequipmentsupplier/electricfloorheating',
    desc: 'Modern electric underfloor systems',
    Icon: Zap,
    color: '#B86B45',
  },
  {
    name: 'Heating Systems',
    slug: '/heatingequipmentsupplier/heatingsystems',
    desc: 'Full heating system solutions',
    Icon: Settings,
    color: '#4FA3D1',
  },
];

const HIGHLIGHTS = [
  {
    title: 'UK Imported Quality',
    desc: 'Every system we supply is sourced from leading UK manufacturers and certified to CE / IEC 60335 safety standards, the same systems used in European homes for decades.',
    Icon: Award,
    color: '#B86B45',
  },
  {
    title: 'Kashmir Expertise',
    desc: 'Engineered for sub-zero Kashmir floors, Chilla Kalan, and daily power cuts. Our team understands local conditions better than anyone else.',
    Icon: ShieldCheck,
    color: '#4FA3D1',
  },
  {
    title: 'Based in Rajbagh',
    desc: 'Our Srinagar store and installation team are based in Rajbagh, minutes from anywhere in the city, with a free site survey as standard.',
    Icon: MapPinned,
    color: '#6BAE7F',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

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

export default function HeatingEquipmentClient() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .heating-map-container { height: 280px !important; }
          .heating-map-container iframe { height: 280px !important; }
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
          <Badge>UK Imported · Kashmir Specialist</Badge>
          <h1 style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            fontWeight: 600, fontFamily: "var(--font-heading)",
            color: '#3C2A25', lineHeight: 1.15, margin: '8px 0 0',
          }}>
            Heating Equipment Supplier in Srinagar
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
          }}>
            The Heating Store supplies and installs premium UK-imported heating equipment for homes, hotels, and commercial properties across Kashmir.
          </p>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 14, color: '#6B4A2D',
            lineHeight: 1.7, marginTop: 10, maxWidth: 580, margin: '10px auto 0',
          }}>
            Electric hamams, underfloor heating, radiant floor heating, and complete home & commercial heating solutions, engineered for sub-zero Kashmir winters.
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

        {/* ── SERVICES GRID ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 80px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <SectionHeading
              badge="Our Services"
              title="Complete Heating"
              accent=" Solutions"
              center
              sub="From single-room electric hamams to full-house underfloor heating and large-scale commercial installations, we supply, install, and warranty every system."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <motion.div
                key={s.slug}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.55)',
                  borderRadius: 22,
                  boxShadow: '0 8px 32px rgba(60,42,37,0.08)',
                  padding: '28px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `${s.color}15`, border: `1px solid ${s.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 18,
                  }}
                >
                  <s.Icon className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 22, fontWeight: 600, color: '#3C2A25',
                  margin: 0, lineHeight: 1.2,
                }}>
                  {s.name}
                </h3>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 14,
                  color: '#6B4A2D', lineHeight: 1.65, margin: '10px 0 0',
                  flexGrow: 1,
                }}>
                  {s.desc}
                </p>
                <Link
                  href={s.slug}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition-transform hover:translate-x-1"
                  style={{
                    color: '#B86B45', textDecoration: 'none',
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── WHY CHOOSE US ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 80px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <SectionHeading
              badge="Why Choose Us"
              title="The Heating Store"
              accent=" Advantage"
              center
              sub="Three reasons Kashmir trusts us with their heating."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((h) => (
              <motion.div
                key={h.title}
                variants={fadeUp}
                whileHover={{ y: -3 }}
              >
                <GlassCard style={{ padding: '28px 26px', height: '100%' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 14,
                    background: `${h.color}15`, border: `1px solid ${h.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <h.Icon className="w-6 h-6" style={{ color: h.color }} />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 21, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.25,
                  }}>
                    {h.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: 14,
                    color: '#6B4A2D', lineHeight: 1.7, margin: '10px 0 0',
                  }}>
                    {h.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CONTACT CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(72px,10vw,96px)' }}
        >
          <div
            className="rounded-[28px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3C2A25 0%, #5C3D2E 50%, #B86B45 100%)',
              padding: 'clamp(40px,5vw,64px)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Badge>Talk to an Expert</Badge>
              <h2 style={{
                fontFamily: "var(--font-heading)",
                fontSize: 'clamp(1.5rem, 3vw, 2.125rem)',
                fontWeight: 600, color: 'white', lineHeight: 1.2, margin: 0,
              }}>
                Ready to heat your space?
              </h2>
              <p style={{
                fontFamily: "var(--font-body)", fontSize: 15,
                color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: '14px auto 0',
                maxWidth: 560,
              }}>
                Our Kashmir-based team is available for site surveys, technical consultations, and quotations across Srinagar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 items-stretch">
              <div
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: 22,
                  padding: '28px 26px',
                }}
              >
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
              </div>

              <a
                href="https://maps.google.com/?q=Rajbagh+Srinagar+Jammu+and+Kashmir"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none' }}
                aria-label="Open The Heating Store location in Google Maps"
              >
                <div
                  className="heating-map-container"
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
                    title="The Heating Store, Heating Equipment Supplier"
                  />
                </div>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
