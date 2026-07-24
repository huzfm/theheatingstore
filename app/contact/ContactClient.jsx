'use client';

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

const LOCATIONS = ['Kashmir', 'Jammu', 'Ladakh'];

// ── City-specific content ─────────────────────────────────────────────────────
const CITY_DATA = {
  Kashmir: {
    badge: 'Kashmir Valley',
    headline: 'Serving the Entire Kashmir Valley',
    tagline: 'Srinagar to Sopore, Anantnag to Baramulla — fully covered.',
    coverageAreas: ['Srinagar', 'Baramulla', 'Anantnag', 'Sopore', 'Kupwara', 'Pulwama', 'Shopian', 'Ganderbal'],
    stats: [
      { value: '200+', label: 'Installations in Valley' },
      { value: '4.9★', label: 'Customer Rating' },
      { value: '48 hrs', label: 'Average Response Time' },
    ],
    highlight: {
      icon: '🏔️',
      title: 'Kashmir Valley\'s Most Trusted Electric Hamam Installer',
      body: 'With over 200 completed installations across the Kashmir Valley — from Srinagar city homes to remote district residences — our certified engineers understand Kashmiri construction methods, sub-zero subfloor conditions, and the load-shedding reality that demands genuine thermal mass, not just a heated wire.',
    },
    process: [
      { step: '01', title: 'Site Survey', desc: 'Our Kashmir-based engineer visits your location to assess flooring substrate, room dimensions, and insulation requirements.' },
      { step: '02', title: 'Custom Design', desc: 'We create a system layout mapped to your exact room shape and Kashmir\'s −15°C winter profile.' },
      { step: '03', title: 'Professional Installation', desc: 'Our Kashmir installation team completes the full concrete sandwich layering, typically within 1–2 days.' },
      { step: '04', title: 'Testing & Handover', desc: 'Full thermal test, thermostat calibration, user walkthrough, and warranty documentation handed over on-site.' },
    ],
    testimonial: {
      quote: 'I was skeptical at first — we have 10-hour cuts every night in Chilla Kalan. But the floor stayed warm till morning. Best decision we made for our home.',
      author: 'Bashir Ahmad Mir',
      location: 'Jawahar Nagar, Srinagar',
    },
    accent: '#B86B45',
    bg: 'from-[#FFF8F0] to-[#FFF0E0]',
  },
  Jammu: {
    badge: 'Jammu Region',
    headline: 'Bringing Electric Hamam to Jammu & Surrounding Districts',
    tagline: 'Jammu city, Kathua, Udhampur — now covered.',
    coverageAreas: ['Jammu City', 'Kathua', 'Udhampur', 'Samba', 'Reasi', 'Ramban', 'Rajouri', 'Poonch'],
    stats: [
      { value: '80+', label: 'Installations Completed' },
      { value: '4.8★', label: 'Customer Rating' },
      { value: '72 hrs', label: 'Average Response Time' },
    ],
    highlight: {
      icon: '🏙️',
      title: 'Jammu\'s Growing Electric Hamam Network',
      body: 'Jammu winters are colder than most people expect — dropping to −4°C in the hills and cutting power for hours across districts. Our Jammu installations are configured for the region\'s mixed climate: efficient enough for mild city winters, robust enough for Udhampur and Ramban elevations.',
    },
    process: [
      { step: '01', title: 'Remote Consultation', desc: 'Initial consultation via phone or WhatsApp to understand your space and heating requirements.' },
      { step: '02', title: 'On-Site Survey', desc: 'Our engineer travels to your Jammu-region location for a full substrate and space assessment.' },
      { step: '03', title: 'Installation', desc: 'Dedicated Jammu team handles the complete installation using our Kashmir-proven layering method.' },
      { step: '04', title: 'Quality Check', desc: 'Final thermal test, system demo, and warranty registration before handover.' },
    ],
    testimonial: {
      quote: 'We had tried room heaters for years. The electric hamam changed everything — silent, even heat, and it actually stays warm when the power goes. Worth every rupee.',
      author: 'Rakesh Kumar Sharma',
      location: 'Udhampur, Jammu',
    },
    accent: '#B86B45',
    bg: 'from-[#FFF8F0] to-[#FFF0E0]',
  },
  Ladakh: {
    badge: 'Ladakh Region',
    headline: 'High-Altitude Electric Hamam for Ladakh\'s Extreme Winters',
    tagline: 'Leh, Kargil, and surrounding villages — purpose-built for your climate.',
    coverageAreas: ['Leh Town', 'Kargil', 'Nubra Valley', 'Zanskar', 'Drass', 'Diskit', 'Padum', 'Khaltsi'],
    stats: [
      { value: '35+', label: 'Installations Completed' },
      { value: '4.9★', label: 'Customer Rating' },
      { value: '96 hrs', label: 'Average Response Time' },
    ],
    highlight: {
      icon: '❄️',
      title: 'Engineered for Ladakh\'s −25°C Winters',
      body: 'Standard underfloor heating systems are not designed for Ladakh. Ours are. We use high-output heating elements, double-layer insulation boards, and thicker concrete pours specifically configured for altitudes above 3,000m. Every Ladakh installation is individually spec\'d — not adapted from a European catalogue.',
    },
    process: [
      { step: '01', title: 'Phone / Video Survey', desc: 'Detailed remote assessment including altitude, flooring type, and room insulation to spec the right system.' },
      { step: '02', title: 'Site Visit', desc: 'Our engineer travels to your Ladakh location for on-ground measurement and substrate inspection.' },
      { step: '03', title: 'Installation', desc: 'High-altitude installation using reinforced layering designed for Ladakh\'s ground frost conditions.' },
      { step: '04', title: 'Commissioning', desc: 'Full cold-weather startup test, performance verification, and complete warranty handover.' },
    ],
    testimonial: {
      quote: 'In Leh, every heating product we tried before either failed in winter or cost too much to run. This system runs for hours after the power cuts — exactly what we needed.',
      author: 'Stanzin Dorje',
      location: 'Leh Town, Ladakh',
    },
    accent: '#B86B45',
    bg: 'from-[#FFF8F0] to-[#FFF0E0]',
  },
};

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://evulation-api-electrichamambackend.0psc8x.easypanel.host'
  : 'http://localhost:5050';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default function ContactPage() {
  const reduce = useReducedMotion();

  const [form, setForm] = useState({ name: '', phone: '', location: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const cityInfo = form.location ? CITY_DATA[form.location] : null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length < 8) { setError('Please enter a valid phone number'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone,
          message: form.message || '',
          source: 'Contact Form',
          location: LOCATIONS.includes(form.location) ? form.location : 'Unknown',
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setForm({ name: '', phone: '', location: '', message: '' });
    } catch { setError('Failed to submit. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#FFF4E8] to-[#F5B97A]">
      <style>{`
        @media (max-width: 640px) {
          .contact-map-container { height: 260px !important; }
          .contact-map-container iframe { height: 260px !important; }
          .contact-cta-banner { flex-direction: column !important; }
          .contact-cta-buttons { flex-direction: column !important;
                                 align-items: stretch !important; min-width: unset !important; }
          .contact-cta-buttons a { text-align: center !important; }
        }
      `}</style>
      <motion.div aria-hidden
        animate={reduce ? {} : { opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)' }}
      />

      <div className="relative z-10 w-full">

        {/* ── SECTION 1: Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', padding: 'clamp(64px,8vw,96px) clamp(20px,4vw,40px) 56px' }}
        >
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, fontFamily: "var(--font-heading)", color: '#3C2A25', lineHeight: 1.2 }}>
            Contact Us
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: '16px', color: '#6B4A2D', lineHeight: 1.75, marginTop: '12px', maxWidth: '560px', margin: '12px auto 0' }}>
            We are here to help you across India. Our technical team handles everything from your first enquiry to post installation support.
          </p>
          <div className="flex flex-row justify-center gap-3 mt-8 sm:mt-7">
            <a
              href="tel:+919070907035"
              className="rounded-full px-7 py-3 text-white font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)', boxShadow: '0 12px 32px rgba(184,107,69,0.35)' }}
            >
              Call our Team
            </a>
            <a
              href="/contact#form"
              className="rounded-full px-7 py-3 font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{ border: '1.5px solid rgba(184,107,69,0.35)', color: '#3C2A25', background: 'rgba(255,255,255,0.6)' }}
            >
              Get a Quote
            </a>
          </div>
        </motion.div>

        {/* ── SECTION 2: 4 Contact Method Cards (2x2 grid) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 56px' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Call Us */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className="rounded-[20px] p-7 backdrop-blur"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 28px rgba(60,42,37,0.08)' }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span style={{ color: '#B86B45' }}><PhoneIcon /></span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '20px', fontWeight: 600, color: '#3C2A25', marginBottom: 0 }}>Call Us</h3>
              </div>
   <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: '#6B4A2D', lineHeight: 1.6 }}>
  To discuss your installation, call us on
  <br />
  <a href="tel:+919070907035" style={{ color: '#B86B45', fontWeight: 600, textDecoration: 'none' }}>
    +91 90709 07035
  </a>
</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '13px', color: '#6B4A2D', marginTop: '10px' }}>
                Our team is available Monday to Saturday, 9am to 7pm IST.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '13px', color: '#6B4A2D', marginTop: '6px' }}>
                For WhatsApp enquiries, message us any time — we respond within 2 hours during business hours.
              </p>
            </motion.div>

            {/* Card 2: Email Us */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className="rounded-[20px] p-7 backdrop-blur"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 28px rgba(60,42,37,0.08)' }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span style={{ color: '#B86B45' }}><MailIcon /></span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '20px', fontWeight: 600, color: '#3C2A25', marginBottom: 0 }}>Email Us</h3>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: '#6B4A2D' }}>
                Sales and installation enquiries:{' '}
                <a href="mailto:theheatingstore.in" style={{ color: '#B86B45', fontWeight: 600, textDecoration: 'underline' }}>theheatingstore.in</a>
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: '#6B4A2D', marginTop: '8px' }}>
                Customer support:{' '}
                <a href="mailto:support@electrichamam.in" style={{ color: '#B86B45', fontWeight: 600, textDecoration: 'underline' }}>support@electrichamam.in</a>
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: '#6B4A2D', marginTop: '8px' }}>
                Accounts and trade:{' '}
                <a href="mailto:trade@electrichamam.in" style={{ color: '#B86B45', fontWeight: 600, textDecoration: 'underline' }}>trade@electrichamam.in</a>
              </p>
            </motion.div>

            {/* Card 3: Book a Site Survey */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className="rounded-[20px] p-7 backdrop-blur"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 28px rgba(60,42,37,0.08)' }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span style={{ color: '#B86B45' }}><CalendarIcon /></span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '20px', fontWeight: 600, color: '#3C2A25', marginBottom: 0 }}>Book a Site Survey</h3>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: '#6B4A2D', lineHeight: 1.6 }}>
                Book site survey with our engineer. We visit your home across J&K and Ladakh, assess the space, and provide a detailed written quotation.
              </p>
              <a
                href="/contact#form"
                style={{ display: 'inline-flex', marginTop: '14px', borderRadius: '9999px', padding: '10px 20px', background: '#B86B45', color: 'white', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              >
                Book a Survey
              </a>
            </motion.div>

            {/* Card 4: WhatsApp Us */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              className="rounded-[20px] p-7 backdrop-blur"
              style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 28px rgba(60,42,37,0.08)' }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <span style={{ color: '#B86B45' }}><MessageIcon /></span>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '20px', fontWeight: 600, color: '#3C2A25', marginBottom: 0 }}>WhatsApp Us</h3>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: '#6B4A2D', lineHeight: 1.6 }}>
                Send photos of your space on WhatsApp and get an instant installation estimate. Our team responds within 2 hours during business hours.
              </p>
              <a
                href="https://wa.me/919070907035"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', marginTop: '14px', borderRadius: '9999px', padding: '10px 20px', background: '#25D366', color: 'white', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              >
                Open WhatsApp
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* ── SECTION 3: Google Maps ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 56px' }}
        >
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 600, color: '#3C2A25',
            textAlign: 'center', marginBottom: '6px',
          }}>
            Visit our showroom in Srinagar
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: '14px',
            color: '#6B4A2D', textAlign: 'center', marginBottom: '24px',
          }}>
            Our showroom and technical office is located in Srinagar, Kashmir. Open Saturday to Thursday, 10am to 6pm. Click the map to get directions.
          </p>
          <a
            href="https://maps.google.com/?q=Lal+Chowk,+Srinagar,+Jammu+and+Kashmir"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textDecoration: 'none' }}
            aria-label="Open Electric Hamam Kashmir showroom location in Google Maps"
          >
            <div className="contact-map-container" style={{
              width: '100%', height: '400px', borderRadius: '20px',
              overflow: 'hidden', border: '1px solid rgba(230,199,165,0.6)',
              boxShadow: '0 8px 28px rgba(60,42,37,0.10)',
              cursor: 'pointer',
              transition: 'box-shadow 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(60,42,37,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(60,42,37,0.10)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3300!2d74.7973!3d34.0836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1855f5454a0c1%3A0x7f39f9d5a9e3c2b0!2sLal%20Chowk%2C%20Srinagar%2C%20Jammu%20%26%20Kashmir!5e0!3m2!1sen!2sin!4v1715000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Electric Hamam Kashmir — Srinagar Showroom"
              />
            </div>
          </a>
        </motion.div>

        {/* ── SECTION 4: Contact Form ── */}
        <motion.div
          id="form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '640px', margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 56px' }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', color: '#B86B45', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            Installation Inquiry
          </p>

          <div
            className="rounded-[28px] bg-white/85 backdrop-blur border border-black/8 p-7 sm:p-10"
            style={{ boxShadow: '0 40px 90px -40px rgba(60,42,37,0.3)' }}
          >
            <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.625rem)', fontWeight: 600, fontFamily: "var(--font-heading)", color: '#3C2A25', lineHeight: 1.2 }}>
              Electric Hamam Installation Inquiry
            </h2>
            <p className="mt-1.5 text-sm text-[#6B4A2D]">Reviewed personally by our installation team within 24 hours.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-[#3C2A25] mb-2 block">Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Mohammad Ashraf"
                  className="w-full rounded-xl border border-[#E6C7A5] px-4 py-3 text-sm outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 text-[#3C2A25] transition-all bg-white/80" />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-[#3C2A25] mb-2 block">Phone / WhatsApp</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                  placeholder="+91 70060 00000"
                  className="w-full rounded-xl border border-[#E6C7A5] px-4 py-3 text-sm outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 text-[#3C2A25] transition-all bg-white/80" />
              </div>

              {/* Location dropdown */}
              <div>
                <label className="text-sm font-semibold text-[#3C2A25] mb-2 block">Project Location</label>
                <div className="relative">
                  <select name="location" value={form.location} onChange={handleChange} required
                    className="w-full appearance-none rounded-xl border border-[#E6C7A5] px-4 py-3 text-sm outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 text-[#3C2A25] transition-all bg-white/80 pr-10">
                    <option value="">— Select your city —</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#B86B45]">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* City pill — appears on select */}
                <AnimatePresence>
                  {cityInfo && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: `${cityInfo.accent}15`, color: cityInfo.accent, border: `1px solid ${cityInfo.accent}30` }}>
                      {cityInfo.badge}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-[#3C2A25] mb-2 block">Project Details <span className="text-[#B86B45]/50 font-normal">(optional)</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Room size, flooring type, any questions..."
                  className="w-full rounded-xl border border-[#E6C7A5] px-4 py-3 text-sm outline-none focus:border-[#B86B45] focus:ring-2 focus:ring-[#B86B45]/15 text-[#3C2A25] transition-all resize-none bg-white/80" />
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                  <span className="text-green-500 text-base">✅</span>
                  <p className="text-sm text-green-700 font-semibold">Request submitted! We'll reach out shortly.</p>
                </motion.div>
              )}

              <button type="submit" disabled={loading || success}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: cityInfo ? `linear-gradient(135deg, ${cityInfo.accent}, ${cityInfo.accent}cc)` : 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
                  boxShadow: cityInfo ? `0 16px 40px ${cityInfo.accent}40` : '0 16px 40px rgba(184,107,69,0.4)',
                }}>
                {success ? 'Submitted ✓' : loading ? 'Submitting...' : `Talk to Expert${form.location ? ` in ${form.location}` : ''}`}
              </button>
            </form>
          </div>
        </motion.div>

        {/* ── SECTION 5: Coverage Areas ── */}
<div className="flex flex-wrap justify-center gap-4 mt-8 sm:mt-10" style={{ maxWidth: '960px', margin: '32px auto 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>

  {/* North Kashmir */}
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
    style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 6px 24px rgba(60,42,37,0.07)',
      borderRadius: '20px',
      width: 'clamp(260px, calc(33% - 16px), 300px)',
      padding: '24px 28px',
    }}
  >
    <span style={{ fontSize: '28px' }}>🏔️</span>
    <h4 style={{ fontFamily: "var(--font-heading)", fontSize: '18px', fontWeight: 600, color: '#3C2A25', marginTop: '12px' }}>North Kashmir</h4>
    <p style={{ fontFamily: "var(--font-body)", fontSize: '13px', color: '#6B4A2D', lineHeight: 1.6, marginTop: '8px' }}>
      Baramulla, Sopore, Kupwara, Bandipora, Handwara, Rafiabad, Uri, Tangmarg.
    </p>
    <span style={{ display: 'inline-block', marginTop: '12px', background: 'rgba(184,107,69,0.10)', color: '#B86B45', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '4px 12px' }}>
      45k+ installations
    </span>
  </motion.div>

  {/* Central Kashmir */}
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
    style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 6px 24px rgba(60,42,37,0.07)',
      borderRadius: '20px',
      width: 'clamp(260px, calc(33% - 16px), 300px)',
      padding: '24px 28px',
    }}
  >
    <span style={{ fontSize: '28px' }}>🕌</span>
    <h4 style={{ fontFamily: "var(--font-heading)", fontSize: '18px', fontWeight: 600, color: '#3C2A25', marginTop: '12px' }}>Central Kashmir</h4>
    <p style={{ fontFamily: "var(--font-body)", fontSize: '13px', color: '#6B4A2D', lineHeight: 1.6, marginTop: '8px' }}>
      Srinagar, Budgam, Ganderbal, Beerwah, Magam, Chadoora, Narbal, Khansahib.
    </p>
    <span style={{ display: 'inline-block', marginTop: '12px', background: 'rgba(184,107,69,0.10)', color: '#B86B45', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '4px 12px' }}>
      200k+ installations
    </span>
  </motion.div>

  {/* South Kashmir */}
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.25 }}
    style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 6px 24px rgba(60,42,37,0.07)',
      borderRadius: '20px',
      width: 'clamp(260px, calc(33% - 16px), 300px)',
      padding: '24px 28px',
    }}
  >
    <span style={{ fontSize: '28px' }}>🌿</span>
    <h4 style={{ fontFamily: "var(--font-heading)", fontSize: '18px', fontWeight: 600, color: '#3C2A25', marginTop: '12px' }}>South Kashmir</h4>
    <p style={{ fontFamily: "var(--font-body)", fontSize: '13px', color: '#6B4A2D', lineHeight: 1.6, marginTop: '8px' }}>
      Anantnag, Pulwama, Shopian, Kulgam, Awantipora, Bijbehara, Dooru, Qazigund.
    </p>
    <span style={{ display: 'inline-block', marginTop: '12px', background: 'rgba(184,107,69,0.10)', color: '#B86B45', fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '4px 12px' }}>
      35k+ installations
    </span>
  </motion.div>

</div>

        {/* ── SECTION 6: CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '960px', margin: '30px auto', padding: '0 clamp(16px,4vw,40px) clamp(56px,8vw,88px)' }}
        >
          <div
            className="contact-cta-banner rounded-[28px] overflow-hidden"
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
              <p style={{ fontFamily: "var(--font-body)", fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Not Sure Where to Start?
              </p>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
                Let us help you find the right system.
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>
                Answer a few quick questions and our expert will recommend the right electric hamam system for your home.
              </p>
            </div>

            <div className="contact-cta-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
              <a
                href="/contact#form"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  padding: '12px 28px',
                  background: 'white',
                  color: '#3C2A25',
                  fontWeight: 700,
                  fontSize: '13px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Get Started
              </a>
              <a
                href="tel:+919070907035"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  padding: '12px 28px',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: 'transparent',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                Talk to an Expert
              </a>
              <a
                href="https://wa.me/919070907035"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '9999px',
                  padding: '12px 28px',
                  background: '#25D366',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '13px',
                  textDecoration: 'none',
                  textAlign: 'center',
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