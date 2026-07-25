'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const EASE = [0.16, 1, 0.3, 1];

const AREAS = [
  { name: 'Rajbagh', slug: 'rajbagh', desc: 'Premium electric hamams for Rajbagh homeowners' },
  { name: 'Jawahar Nagar', slug: 'jawaharnagar', desc: 'UK-imported heating for Jawahar Nagar residents' },
  { name: 'Lal Chowk', slug: 'lalchowk', desc: 'Trusted hamam installation in central Lal Chowk' },
  { name: 'Sonwar', slug: 'sonwar', desc: 'Underfloor heating solutions for Sonwar homes' },
  { name: 'Gogji Bagh', slug: 'gogjibagh', desc: 'Engineered heating for Gogji Bagh households' },
  { name: 'Dalgate', slug: 'dalgate', desc: 'Electric hamam systems for Dalgate families' },
  { name: 'Bemina', slug: 'bemina', desc: 'Winter-ready heating for Bemina properties' },
  { name: 'Hyderpora', slug: 'hyderpora', desc: 'Certified hamam installation in Hyderpora' },
  { name: 'Sanat Nagar', slug: 'sanatnagar', desc: 'Sub-zero heating for Sanat Nagar homes' },
  { name: 'Chanapora', slug: 'chanapora', desc: 'Premium underfloor heating in Chanapora' },
  { name: 'Rawalpora', slug: 'rawalpora', desc: 'Kashmir-grade heating for Rawalpora' },
  { name: 'Nowgam', slug: 'nowgam', desc: 'Reliable hamam systems for Nowgam residents' },
  { name: 'Nishat', slug: 'nishat', desc: 'Luxury heating installations near Nishat' },
  { name: 'Hazratbal', slug: 'hazratbal', desc: 'Electric hamam for Hazratbal homeowners' },
  { name: 'Pantha Chowk', slug: 'panthachowk', desc: 'Trusted heating experts in Pantha Chowk' },
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

export default function AreasWeServeClient() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 35%, #FFE0C2 70%, #F5B97A 100%)',
      }}
    >
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
          <Badge>Coverage Area · Srinagar</Badge>
          <h1
            style={{
              fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
              fontWeight: 600,
              fontFamily: "var(--font-heading)",
              color: '#3C2A25', lineHeight: 1.15, margin: '8px 0 0',
            }}
          >
            Areas We Serve in Srinagar
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)", fontSize: 16, color: '#6B4A2D',
              lineHeight: 1.75, marginTop: 16, maxWidth: 620, margin: '16px auto 0',
            }}
          >
            The Heating Store supplies and installs premium UK-imported electric hamams across Srinagar and Kashmir. Find your area below.
          </p>
        </motion.div>

        {/* ── SECTION 2: Areas Grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 80px' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AREAS.map((area) => (
              <motion.div
                key={area.slug}
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
                  padding: '26px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'rgba(184,107,69,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <MapPin className="w-5 h-5 text-[#B86B45]" />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 22, fontWeight: 600, color: '#3C2A25',
                    margin: 0, lineHeight: 1.2,
                  }}
                >
                  {area.name}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)", fontSize: 14,
                    color: '#6B4A2D', lineHeight: 1.6, margin: '10px 0 0',
                    flexGrow: 1,
                  }}
                >
                  {area.desc}
                </p>
                <Link
                  href={`/areasweserve/${area.slug}`}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition-transform hover:translate-x-1"
                  style={{
                    color: '#B86B45', textDecoration: 'none',
                    fontFamily: "var(--font-body)",
                  }}
                >
                  View Page
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SECTION 3: Contact CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ maxWidth: 960, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(72px,10vw,96px)' }}
        >
          <div
            className="rounded-[28px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3C2A25 0%, #5C3D2E 50%, #B86B45 100%)',
              padding: '48px clamp(24px, 5vw, 64px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
            }}
          >
            <div style={{ flex: '1', minWidth: '280px' }}>
              <p
                style={{
                  fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase', marginBottom: '10px',
                }}
              >
                Can't find your area?
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                  fontWeight: 600, color: 'white', lineHeight: 1.2,
                }}
              >
                We serve all of Srinagar.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)", fontSize: 14,
                  color: 'rgba(255,255,255,0.75)', marginTop: '10px',
                }}
              >
                Rajbagh, Srinagar, J&amp;K 190008, call our team and we'll arrange a free site survey at your home.
              </p>
            </div>

            <div
              style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                minWidth: '180px',
              }}
            >
              <a
                href="tel:+919070907035"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                style={{
                  background: 'white', color: '#3C2A25',
                  textDecoration: 'none',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                }}
              >
                <Phone className="w-4 h-4" />
                Call +91 90709 07035
              </a>
              <a
                href="https://wa.me/919070907035"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition-transform hover:scale-[1.02]"
                style={{
                  background: '#25D366', color: 'white',
                  textDecoration: 'none',
                }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
