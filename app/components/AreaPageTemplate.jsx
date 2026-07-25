'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  MapPin,
  Flame,
  Zap,
  VolumeX,
  Wrench,
  Shield,
  Map,
  ChevronDown,
} from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

// ── Icon wrappers, consistent size + brand colour, sized per usage ──────────
// `color` prop is forwarded as a CSS color so the existing call sites
// (`<f.Icon color={f.color} />`, `<item.Icon color="#B86B45" />`) keep working.
function withIconDefaults(Icon, { size = 'w-5 h-5', strokeWidth = 1.75, defaultColor = '#B86B45' } = {}) {
  const Wrapped = ({ color, className = '', style = {}, ...rest }) => (
    <Icon
      className={`${size} inline-block ${className}`}
      strokeWidth={strokeWidth}
      style={{ color: color || defaultColor, ...style }}
      {...rest}
    />
  );
  Wrapped.displayName = `Lucide(${Icon.displayName || Icon.name || 'Icon'})`;
  return Wrapped;
}

const PhoneIcon = withIconDefaults(Phone, { size: 'w-5 h-5' });
const MapPinIcon = withIconDefaults(MapPin, { size: 'w-5 h-5' });
const FlameIcon = withIconDefaults(Flame, { size: 'w-6 h-6' });
const BoltIcon = withIconDefaults(Zap, { size: 'w-6 h-6' });
const VolumeOffIcon = withIconDefaults(VolumeX, { size: 'w-6 h-6' });
const ToolIcon = withIconDefaults(Wrench, { size: 'w-6 h-6' });
const ShieldIcon = withIconDefaults(Shield, { size: 'w-6 h-6' });
const MapIcon = withIconDefaults(Map, { size: 'w-6 h-6' });
const ChevronDownIcon = withIconDefaults(ChevronDown, { size: 'w-[18px] h-[18px]' });

const FEATURE_ICONS = [FlameIcon, BoltIcon, VolumeOffIcon, ToolIcon];

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
        fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
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

// ── Section heading ──────────────────────────────────────────────────────────
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

// ── FAQ accordion item ───────────────────────────────────────────────────────
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
          <ChevronDownIcon />
        </span>
      </button>
      <div style={{
        maxHeight: isOpen ? 320 : 0, overflow: 'hidden',
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

// ── Main template component ──────────────────────────────────────────────────
export default function AreaPageTemplate({
  areaName,
  areaSlug,
  heroTagline,
  bodyText,
  landmarks = [],
  directionsText,
  nearbyAreas = [],
  allAreas = [],
  productLinks = [],
  faqs = [],
  jsonLd,
}) {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    { title: 'Consistent Warmth', desc: 'Even heat across the entire floor surface, no cold spots, no drafts.', Icon: FlameIcon, color: '#B86B45' },
    { title: 'Energy Efficient', desc: 'Engineered to use less power while delivering more heat per watt.', Icon: BoltIcon, color: '#4FA3D1' },
    { title: 'Silent Operation', desc: 'No fans, no noise, just quiet, radiant warmth from the floor up.', Icon: VolumeOffIcon, color: '#6BAE7F' },
    { title: 'Low Maintenance', desc: 'No moving parts, no servicing, install once, enjoy for decades.', Icon: ToolIcon, color: '#E8933A' },
  ];

  const whyUs = [
    { Icon: ShieldIcon, title: 'UK Imported Quality', desc: 'Every system we install is sourced from leading UK manufacturers and certified for safety, efficiency, and longevity.' },
    { Icon: MapIcon, title: 'Local Kashmir Expertise', desc: 'Our team is based in Srinagar and has installed hundreds of systems across the valley, we know Kashmiri winters.' },
    { Icon: MapPinIcon, title: 'Based in Rajbagh', desc: 'Visit our Rajbagh showroom to see, touch, and compare the systems we install. Same-day site visits are possible.' },
  ];

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .area-map-container { height: 280px !important; }
          .area-map-container iframe { height: 280px !important; }
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

        {/* ── SECTION 1: Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            maxWidth: 760, margin: '0 auto', textAlign: 'center',
            padding: 'clamp(64px,8vw,96px) clamp(20px,4vw,40px) 56px',
          }}
        >
          <Badge>Serving {areaName} · Srinagar</Badge>
          <h1 style={{
            fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
            fontWeight: 600,
            fontFamily: "var(--font-heading)",
            color: '#3C2A25', lineHeight: 1.15, margin: '8px 0 0',
          }}>
            Electric Hamam in {areaName}
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: 16, color: '#6B4A2D',
            lineHeight: 1.75, marginTop: 16, maxWidth: 580, margin: '16px auto 0',
          }}>
            {heroTagline}
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

        {/* ── SECTION 2: Why Electric Hamam ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <SectionHeading
              badge="Why Electric Hamam"
              title={`Why ${areaName} homeowners choose`}
              accent=" Electric Hamam"
              sub="Premium UK-imported systems engineered for Kashmir's sub-zero winters and daily power cuts."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
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
                  background: `${f.color}15`, border: `1px solid ${f.color}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <f.Icon color={f.color} />
                </div>
                <h3 style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 19, fontWeight: 600, color: '#3C2A25',
                  margin: 0, lineHeight: 1.25,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 13,
                  color: '#6B4A2D', lineHeight: 1.6, margin: '8px 0 0',
                }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 3: Why Choose The Heating Store ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ marginBottom: 32 }}>
            <SectionHeading
              badge="The Heating Store"
              title="Why choose"
              accent={` The Heating Store for ${areaName}`}
              sub="A decade of installations, UK-imported systems, and a Kashmir-based team you can call on."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
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
                    <item.Icon color="#B86B45" />
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 19, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.25,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: 13.5,
                    color: '#6B4A2D', lineHeight: 1.65, margin: '8px 0 0',
                  }}>
                    {item.desc}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 4: Areas We Serve (internal links) ── */}
        {nearbyAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <SectionHeading
                badge="Nearby Areas"
                title="Other areas we serve near"
                accent={` ${areaName}`}
                center
                sub="We install UK-imported electric hamam systems across Srinagar. Click an area to learn more."
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyAreas.map((a, i) => (
                <motion.a
                  key={a.name}
                  href={a.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                  whileHover={{ y: -2 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '12px 22px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.55)',
                    color: '#3C2A25', fontFamily: "var(--font-body)",
                    fontSize: 14, fontWeight: 500, textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(60,42,37,0.05)',
                    transition: 'all 0.22s ease',
                  }}
                >
                  <MapPinIcon />
                  {a.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SECTION 5: Contact & Directions ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <SectionHeading
              badge="Visit Us"
              title="Contact &"
              accent=" Directions"
              center
              sub="Drop into our Rajbagh showroom or call us to book a free site survey in your area."
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
                    <MapPinIcon />
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
                    <PhoneIcon />
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
              {directionsText && (
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: 13, color: '#6B4A2D',
                  lineHeight: 1.7, margin: '20px 0 0', padding: '14px 0 0',
                  borderTop: '1px solid rgba(184,107,69,0.12)',
                }}>
                  <strong style={{ color: '#3C2A25' }}>Directions:</strong> {directionsText}
                </p>
              )}
              <a
                href="https://maps.google.com/?q=Rajbagh+Srinagar+Jammu+and+Kashmir"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
                  boxShadow: '0 12px 28px rgba(184,107,69,0.32)',
                  textDecoration: 'none', marginTop: 22,
                }}
              >
                <MapPinIcon /> Get Directions
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
                className="area-map-container"
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
                  title={`The Heating Store, serving ${areaName}`}
                />
              </div>
            </a>
          </div>
        </motion.div>

        {/* ── SECTION 6: FAQ ── */}
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
                title={`Electric Hamam in ${areaName}`}
                accent=", Frequently Asked Questions"
                center
                sub="Answers to the most common questions we hear from homeowners in your area."
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

        {/* ── SECTION 7: Our Products ── */}
        {productLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 64px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <SectionHeading
                badge="Our Products"
                title="UK-Imported Heating"
                accent=" Solutions"
                center
                sub="Browse our full range of premium heating systems, all UK-imported and engineered for Kashmir's sub-zero winters."
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {productLinks.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={p.href}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '12px 22px', borderRadius: 999,
                      background: 'linear-gradient(135deg, rgba(255,126,95,0.12), rgba(255,184,140,0.18))',
                      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(184,107,69,0.28)',
                      color: '#3C2A25', fontFamily: "var(--font-body)",
                      fontSize: 14, fontWeight: 600, textDecoration: 'none',
                      boxShadow: '0 4px 16px rgba(60,42,37,0.05)',
                      transition: 'all 0.22s ease',
                    }}
                  >
                    <FlameIcon />
                    {p.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SECTION 8: More Areas We Serve ── */}
        {allAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(72px,10vw,96px)' }}
          >
            <div
              style={{
                paddingTop: 40,
                borderTop: '1px solid rgba(184,107,69,0.18)',
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <SectionHeading
                  badge="Coverage Area"
                  title="More Areas We Serve"
                  accent=" in Srinagar"
                  sub="The Heating Store supplies and installs premium electric hamams across all of Srinagar."
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {allAreas
                  .filter((a) => a.slug !== areaSlug)
                  .map((a, i) => (
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
                          color: '#3C2A25', fontFamily: "var(--font-body)",
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

      </div>
    </section>
  );
}
