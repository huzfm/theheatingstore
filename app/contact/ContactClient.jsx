'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const EASE = [0.16, 1, 0.3, 1];

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
    accent: '#E8933A',
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
    accent: '#E8933A',
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
    accent: '#E8933A',
    bg: 'from-[#FFF8F0] to-[#FFF0E0]',
  },
};

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://evulation-api-electrichamambackend.0psc8x.easypanel.host'
  : 'http://localhost:5050';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const COVERAGE = [
  {
    icon: '🏔️',
    title: 'North Kashmir',
    body: 'Baramulla, Sopore, Kupwara, Bandipora, Handwara, Rafiabad, Uri, Tangmarg.',
    tag: '45k+ installations',
  },
  {
    icon: '🕌',
    title: 'Central Kashmir',
    body: 'Srinagar, Budgam, Ganderbal, Beerwah, Magam, Chadoora, Narbal, Khansahib.',
    tag: '200k+ installations',
  },
  {
    icon: '🌿',
    title: 'South Kashmir',
    body: 'Anantnag, Pulwama, Shopian, Kulgam, Awantipora, Bijbehara, Dooru, Qazigund.',
    tag: '35k+ installations',
  },
];

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

  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
  };

  return (
    <section className="ctc-root">
      <style>{CSS}</style>

      {/* atmospheric field */}
      <div aria-hidden className="ctc-aura">
        <span className="ctc-orb ctc-orb-1" />
        <span className="ctc-orb ctc-orb-2" />
        <span className="ctc-orb ctc-orb-3" />
      </div>
      <div aria-hidden className="ctc-vignette" />

      <div className="ctc-wrap">

        {/* ── SECTION 1: Hero Header ── */}
        <motion.div {...reveal} transition={{ duration: 0.8, ease: EASE }} className="ctc-hero">
          <div className="ctc-badge"><span className="ctc-badge-dot" />Get In Touch</div>
          <h1 className="ctc-h1">
            Contact <span className="ctc-accent">Us</span>
          </h1>
          <p className="ctc-hero-sub">
            We are here to help you across India. Our technical team handles everything from your first enquiry to post installation support.
          </p>
          <div className="ctc-hero-btns">
            <a href="tel:+919070907035" className="ctc-btn-primary">Call our Team</a>
            <a href="/contact#form" className="ctc-btn-ghost">Get a Quote</a>
          </div>
        </motion.div>

        {/* ── SECTION 2: 4 Contact Method Cards (2x2 grid) ── */}
        <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE }} className="ctc-methods">
          {/* Card 1: Call Us */}
          <div className="ctc-card ctc-method">
            <div className="ctc-method-head">
              <span className="ctc-method-icon"><PhoneIcon /></span>
              <h3>Call Us</h3>
            </div>
            <p className="ctc-method-p">
              To discuss your installation, call us on<br />
              <a href="tel:+919070907035" className="ctc-link">+91 90709 07035</a>
            </p>
            <p className="ctc-method-p ctc-muted">Our team is available Monday to Saturday, 9am to 7pm IST.</p>
            <p className="ctc-method-p ctc-muted">For WhatsApp enquiries, message us any time — we respond within 2 hours during business hours.</p>
          </div>

          {/* Card 2: Email Us */}
          <div className="ctc-card ctc-method">
            <div className="ctc-method-head">
              <span className="ctc-method-icon"><MailIcon /></span>
              <h3>Email Us</h3>
            </div>
            <p className="ctc-method-p">Sales and installation enquiries:{' '}
              <a href="mailto:theheatingstore.in" className="ctc-link ctc-underline">theheatingstore.in</a>
            </p>
            <p className="ctc-method-p">Customer support:{' '}
              <a href="mailto:support@electrichamam.in" className="ctc-link ctc-underline">support@electrichamam.in</a>
            </p>
            <p className="ctc-method-p">Accounts and trade:{' '}
              <a href="mailto:trade@electrichamam.in" className="ctc-link ctc-underline">trade@electrichamam.in</a>
            </p>
          </div>

          {/* Card 3: Book a Site Survey */}
          <div className="ctc-card ctc-method">
            <div className="ctc-method-head">
              <span className="ctc-method-icon"><CalendarIcon /></span>
              <h3>Book a Site Survey</h3>
            </div>
            <p className="ctc-method-p">
              Book site survey with our engineer. We visit your home across J&amp;K and Ladakh, assess the space, and provide a detailed written quotation.
            </p>
            <a href="/contact#form" className="ctc-pill-btn">Book a Survey</a>
          </div>

          {/* Card 4: WhatsApp Us */}
          <div className="ctc-card ctc-method">
            <div className="ctc-method-head">
              <span className="ctc-method-icon"><MessageIcon /></span>
              <h3>WhatsApp Us</h3>
            </div>
            <p className="ctc-method-p">
              Send photos of your space on WhatsApp and get an instant installation estimate. Our team responds within 2 hours during business hours.
            </p>
            <a href="https://wa.me/919070907035" target="_blank" rel="noopener noreferrer" className="ctc-pill-btn ctc-wa">Open WhatsApp</a>
          </div>
        </motion.div>

        {/* ── SECTION 3: Google Maps ── */}
        <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE }} className="ctc-map-section">
          <h2 className="ctc-h2">Visit our showroom in Srinagar</h2>
          <p className="ctc-section-sub">
            Our showroom and technical office is located in Srinagar, Kashmir. Open Saturday to Thursday, 10am to 6pm. Click the map to get directions.
          </p>
          <a
            href="https://maps.google.com/?q=Lal+Chowk,+Srinagar,+Jammu+and+Kashmir"
            target="_blank"
            rel="noopener noreferrer"
            className="ctc-map-link"
            aria-label="Open Electric Hamam Kashmir showroom location in Google Maps"
          >
            <div className="ctc-map-container">
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
        <motion.div id="form" {...reveal} transition={{ duration: 0.7, ease: EASE }} className="ctc-form-section">
          <p className="ctc-eyebrow">Installation Inquiry</p>

          <div className="ctc-card ctc-form-card">
            <span className="ctc-form-bar" />
            <h2 className="ctc-form-title">Electric Hamam Installation Inquiry</h2>
            <p className="ctc-form-lead">Reviewed personally by our installation team within 24 hours.</p>

            <form onSubmit={handleSubmit} className="ctc-form">
              {/* Name */}
              <div className="ctc-field">
                <label className="ctc-label">Full Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Mohammad Ashraf" className="ctc-input" />
              </div>

              {/* Phone */}
              <div className="ctc-field">
                <label className="ctc-label">Phone / WhatsApp</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                  placeholder="+91 70060 00000" className="ctc-input" />
              </div>

              {/* Location dropdown */}
              <div className="ctc-field">
                <label className="ctc-label">Project Location</label>
                <div className="ctc-select-wrap">
                  <select name="location" value={form.location} onChange={handleChange} required className="ctc-input ctc-select">
                    <option value="">— Select your city —</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <div className="ctc-select-caret">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* City pill — appears on select */}
                <AnimatePresence>
                  {cityInfo && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="ctc-city-pill">
                      {cityInfo.badge}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Message */}
              <div className="ctc-field">
                <label className="ctc-label">Project Details <span className="ctc-optional">(optional)</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Room size, flooring type, any questions..." className="ctc-input ctc-textarea" />
              </div>

              {error && <p className="ctc-error">{error}</p>}
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="ctc-success">
                  <span>✅</span>
                  <p>Request submitted! We'll reach out shortly.</p>
                </motion.div>
              )}

              <button type="submit" disabled={loading || success} className="ctc-submit">
                {success ? 'Submitted ✓' : loading ? 'Submitting...' : `Talk to Expert${form.location ? ` in ${form.location}` : ''}`}
              </button>
            </form>
          </div>
        </motion.div>

        {/* ── SECTION 5: Coverage Areas ── */}
        <div className="ctc-coverage">
          {COVERAGE.map((c) => (
            <motion.div key={c.title} {...reveal} transition={{ duration: 0.6, ease: EASE }} className="ctc-card ctc-cov">
              <span className="ctc-cov-emoji">{c.icon}</span>
              <h4 className="ctc-cov-title">{c.title}</h4>
              <p className="ctc-cov-body">{c.body}</p>
              <span className="ctc-cov-tag">{c.tag}</span>
            </motion.div>
          ))}
        </div>

        {/* ── SECTION 6: CTA Banner ── */}
        <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE }} className="ctc-cta-section">
          <div className="ctc-cta-banner">
            <span className="ctc-cta-bar" />
            <div className="ctc-cta-copy">
              <p className="ctc-cta-eyebrow">Not Sure Where to Start?</p>
              <h3 className="ctc-cta-title">Let us help you find the right system.</h3>
              <p className="ctc-cta-desc">
                Answer a few quick questions and our expert will recommend the right electric hamam system for your home.
              </p>
            </div>
            <div className="ctc-cta-buttons">
              <a href="/contact#form" className="ctc-cta-white">Get Started</a>
              <a href="tel:+919070907035" className="ctc-cta-outline">Talk to an Expert</a>
              <a href="https://wa.me/919070907035" target="_blank" rel="noopener noreferrer" className="ctc-cta-wa">WhatsApp Us</a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES  (dark cinematic — matches /why-choose-us)
// ─────────────────────────────────────────────────────────────────────────────

const CSS = `
.ctc-root {
  position: relative;
  z-index: 1;
  overflow: hidden;
  isolation: isolate;
  color: #FBF3EA;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%),
    linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%);
}
.ctc-root::before {
  content:''; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.04;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ctc-root::after {
  content:''; position:absolute; inset:0; z-index:0; pointer-events:none;
  background-image: repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 88px,rgba(255,255,255,.02) 88px), repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0,transparent 1px,transparent 88px,rgba(255,255,255,.02) 88px);
  -webkit-mask-image: radial-gradient(130% 90% at 50% 0%, #000 35%, transparent 78%);
  mask-image: radial-gradient(130% 90% at 50% 0%, #000 35%, transparent 78%);
}

.ctc-aura { position:absolute; inset:-10%; z-index:0; pointer-events:none; filter: blur(14px); }
.ctc-orb { position:absolute; border-radius:50%; }
.ctc-orb-1 { top:-8%; left:6%; width:46vw; height:46vw; max-width:720px; max-height:720px; background: radial-gradient(circle, rgba(232,147,58,0.26), transparent 62%); animation: ctc-drift 24s ease-in-out infinite; }
.ctc-orb-2 { top:12%; right:0%; width:40vw; height:40vw; max-width:620px; max-height:620px; background: radial-gradient(circle, rgba(255,126,95,0.16), transparent 62%); animation: ctc-drift2 30s ease-in-out infinite; }
.ctc-orb-3 { top:52%; left:34%; width:38vw; height:38vw; max-width:560px; max-height:560px; background: radial-gradient(circle, rgba(127,192,232,0.10), transparent 64%); animation: ctc-drift 34s ease-in-out infinite reverse; }
.ctc-vignette { position:absolute; inset:0; z-index:0; pointer-events:none; background: radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.5) 100%); }

@keyframes ctc-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
@keyframes ctc-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }
@keyframes ctc-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
@keyframes ctc-shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }

.ctc-wrap { position:relative; z-index:2; width:100%; }

/* badge */
.ctc-badge {
  display:inline-flex; align-items:center; gap:9px; margin-bottom:22px;
  padding:8px 22px; border-radius:999px;
  font-family:var(--font-body); font-size:10px; font-weight:600;
  text-transform:uppercase; letter-spacing:0.4em; color:#F5B97A;
  background: rgba(232,147,58,0.08); border:1px solid rgba(232,147,58,0.22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4);
  backdrop-filter: blur(12px);
}
.ctc-badge-dot { width:6px; height:6px; border-radius:50%; background:#FF7E5F; box-shadow:0 0 8px rgba(255,126,95,0.9); flex-shrink:0; animation: ctc-blink 2s ease-in-out infinite; }

.ctc-accent {
  font-weight:300;
  background:linear-gradient(100deg,#E8933A,#F5B97A 30%,#FF7E5F 55%,#F5B97A 80%,#E8933A);
  background-size:200% auto; -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; color:transparent;
  animation: ctc-shimmer 6s linear infinite;
}

/* glass card base */
.ctc-card {
  position:relative;
  background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(20,13,8,0.5);
  backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
  border:1px solid rgba(255,255,255,0.10);
  border-radius:24px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
}
.ctc-card::after {
  content:''; position:absolute; inset:0; border-radius:inherit; padding:1px; pointer-events:none;
  opacity:0; transition:opacity .5s ease;
  background:linear-gradient(135deg, rgba(255,255,255,0.5), rgba(232,147,58,0.5) 45%, rgba(255,126,95,0.3));
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}

/* hero */
.ctc-hero { max-width:720px; margin:0 auto; text-align:center; padding:clamp(72px,9vw,110px) clamp(20px,4vw,40px) 56px; }
.ctc-h1 { font-family:var(--font-heading); font-size:clamp(2.2rem,5vw,3.4rem); font-weight:600; color:#FBF3EA; line-height:1.1; margin:0; text-shadow:0 2px 40px rgba(0,0,0,0.4); }
.ctc-hero-sub { font-family:var(--font-body); font-size:16px; color:rgba(251,243,234,0.6); line-height:1.75; margin:14px auto 0; max-width:560px; }
.ctc-hero-btns { display:flex; flex-direction:row; justify-content:center; gap:12px; margin-top:32px; }

.ctc-btn-primary { display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:13px 30px; font-family:var(--font-body); font-size:13px; font-weight:600; color:#fff; text-decoration:none; background:linear-gradient(135deg,#FF7E5F,#FFB88C); box-shadow:0 16px 40px rgba(255,126,95,0.35); transition:transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s ease; }
.ctc-btn-primary:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 22px 56px rgba(255,126,95,0.5); }
.ctc-btn-ghost { display:inline-flex; align-items:center; justify-content:center; border-radius:999px; padding:13px 30px; font-family:var(--font-body); font-size:13px; font-weight:600; color:#FBF3EA; text-decoration:none; border:1px solid rgba(245,185,122,0.35); background:rgba(255,255,255,0.04); transition:background .2s, border-color .2s; }
.ctc-btn-ghost:hover { background:rgba(232,147,58,0.12); border-color:rgba(232,147,58,0.5); }

/* method cards */
.ctc-methods { max-width:900px; margin:0 auto; padding:0 clamp(16px,4vw,40px) 56px; display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.ctc-method { padding:28px; transition:transform .4s cubic-bezier(0.16,1,0.3,1), box-shadow .4s ease; }
.ctc-method:hover { transform:translateY(-4px); box-shadow:0 34px 80px rgba(0,0,0,0.5); }
.ctc-method:hover::after { opacity:1; }
.ctc-method-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.ctc-method-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#F5B97A; background:rgba(232,147,58,0.12); border:1px solid rgba(232,147,58,0.24); }
.ctc-method-head h3 { font-family:var(--font-heading); font-size:20px; font-weight:600; color:#FBF3EA; margin:0; }
.ctc-method-p { font-family:var(--font-body); font-size:14px; color:rgba(251,243,234,0.72); line-height:1.6; margin-top:8px; }
.ctc-method-p:first-of-type { margin-top:0; }
.ctc-muted { font-size:13px; color:rgba(251,243,234,0.5); }
.ctc-link { color:#F5B97A; font-weight:600; text-decoration:none; }
.ctc-underline { text-decoration:underline; text-underline-offset:2px; }
.ctc-pill-btn { display:inline-flex; margin-top:16px; border-radius:999px; padding:10px 22px; background:linear-gradient(135deg,#E8933A,#FF7E5F); color:#fff; font-family:var(--font-body); font-size:13px; font-weight:600; text-decoration:none; transition:transform .25s ease; }
.ctc-pill-btn:hover { transform:translateY(-2px); }
.ctc-wa { background:#25D366; }

/* section headings */
.ctc-h2 { font-family:var(--font-heading); font-size:clamp(1.6rem,3vw,2.1rem); font-weight:600; color:#FBF3EA; text-align:center; margin:0 0 8px; }
.ctc-section-sub { font-family:var(--font-body); font-size:14px; color:rgba(251,243,234,0.6); text-align:center; margin:0 auto 24px; max-width:600px; }

/* map */
.ctc-map-section { max-width:900px; margin:0 auto; padding:0 clamp(16px,4vw,40px) 56px; }
.ctc-map-link { display:block; text-decoration:none; }
.ctc-map-container { width:100%; height:400px; border-radius:22px; overflow:hidden; border:1px solid rgba(232,147,58,0.28); box-shadow:0 24px 60px rgba(0,0,0,0.5); cursor:pointer; transition:box-shadow .25s ease, transform .25s ease, border-color .25s ease; }
.ctc-map-container:hover { transform:translateY(-3px); border-color:rgba(232,147,58,0.5); box-shadow:0 32px 80px rgba(0,0,0,0.6), 0 0 40px -12px rgba(232,147,58,0.5); }
.ctc-map-container iframe { filter: grayscale(0.25) brightness(0.92) contrast(1.05); }

/* form */
.ctc-form-section { max-width:640px; margin:0 auto; padding:0 clamp(16px,4vw,40px) 56px; }
.ctc-eyebrow { font-family:var(--font-body); font-size:10px; font-weight:700; letter-spacing:0.3em; color:#F5B97A; text-transform:uppercase; margin-bottom:16px; text-align:center; }
.ctc-form-card { overflow:hidden; padding:clamp(28px,4vw,42px); }
.ctc-form-bar { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#F5B97A,#FF7E5F 30%,#FFB88C 55%,#FF7E5F 75%,#F5B97A); background-size:200% auto; animation:ctc-shimmer 5s linear infinite; }
.ctc-form-title { font-family:var(--font-heading); font-size:clamp(1.3rem,3vw,1.7rem); font-weight:600; color:#FBF3EA; line-height:1.2; margin:0; }
.ctc-form-lead { margin-top:6px; font-family:var(--font-body); font-size:14px; color:rgba(251,243,234,0.6); }
.ctc-form { margin-top:30px; display:flex; flex-direction:column; gap:20px; }
.ctc-field { display:flex; flex-direction:column; }
.ctc-label { font-family:var(--font-body); font-size:14px; font-weight:600; color:#FBF3EA; margin-bottom:8px; }
.ctc-optional { color:rgba(245,185,122,0.5); font-weight:400; }
.ctc-input {
  width:100%; border-radius:12px; border:1px solid rgba(255,255,255,0.12);
  background:rgba(255,255,255,0.05); padding:12px 16px; font-family:var(--font-body); font-size:14px; color:#FBF3EA;
  outline:none; transition:border-color .2s, box-shadow .2s, background .2s;
}
.ctc-input::placeholder { color:rgba(251,243,234,0.38); }
.ctc-input:focus { border-color:#E8933A; background:rgba(255,255,255,0.08); box-shadow:0 0 0 3px rgba(232,147,58,0.18); }
.ctc-textarea { resize:none; }
.ctc-select-wrap { position:relative; }
.ctc-select { appearance:none; -webkit-appearance:none; padding-right:40px; cursor:pointer; }
.ctc-select option { background:#1a0f08; color:#FBF3EA; }
.ctc-select-caret { position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; color:#F5B97A; }
.ctc-city-pill { display:inline-flex; align-items:center; gap:6px; margin-top:10px; padding:6px 14px; border-radius:999px; font-family:var(--font-body); font-size:12px; font-weight:600; color:#F5B97A; background:rgba(232,147,58,0.12); border:1px solid rgba(232,147,58,0.3); width:fit-content; }
.ctc-error { font-family:var(--font-body); font-size:14px; color:#ff8a8a; font-weight:500; margin:0; }
.ctc-success { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.3); }
.ctc-success p { font-family:var(--font-body); font-size:14px; color:#6ee7b7; font-weight:600; margin:0; }
.ctc-submit {
  width:100%; margin-top:4px; display:flex; align-items:center; justify-content:center; gap:8px;
  border-radius:999px; padding:14px; font-family:var(--font-body); font-size:14px; font-weight:600; color:#fff; border:none; cursor:pointer;
  background:linear-gradient(135deg,#FF7E5F,#FFB88C); box-shadow:0 16px 40px rgba(255,126,95,0.4);
  transition:transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s ease, opacity .2s;
}
.ctc-submit:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); box-shadow:0 22px 56px rgba(255,126,95,0.5); }
.ctc-submit:disabled { opacity:0.5; cursor:not-allowed; }

/* coverage */
.ctc-coverage { max-width:960px; margin:0 auto; padding:0 clamp(16px,4vw,40px); display:flex; flex-wrap:wrap; justify-content:center; gap:16px; }
.ctc-cov { width:clamp(260px, calc(33% - 16px), 300px); padding:26px 28px; transition:transform .4s cubic-bezier(0.16,1,0.3,1), box-shadow .4s ease; }
.ctc-cov:hover { transform:translateY(-4px); box-shadow:0 34px 80px rgba(0,0,0,0.5); }
.ctc-cov:hover::after { opacity:1; }
.ctc-cov-emoji { font-size:28px; }
.ctc-cov-title { font-family:var(--font-heading); font-size:18px; font-weight:600; color:#FBF3EA; margin-top:12px; }
.ctc-cov-body { font-family:var(--font-body); font-size:13px; color:rgba(251,243,234,0.6); line-height:1.6; margin-top:8px; }
.ctc-cov-tag { display:inline-block; margin-top:14px; background:rgba(232,147,58,0.14); color:#F5B97A; font-family:var(--font-body); font-size:11px; font-weight:700; border-radius:999px; padding:5px 13px; border:1px solid rgba(232,147,58,0.28); }

/* cta banner */
.ctc-cta-section { max-width:960px; margin:40px auto 0; padding:40px clamp(16px,4vw,40px) clamp(64px,8vw,96px); }
.ctc-cta-banner { position:relative; overflow:hidden; border-radius:28px; padding:48px clamp(24px,5vw,64px); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:32px;
  background: radial-gradient(120% 160% at 100% 0%, rgba(255,126,95,0.14), transparent 55%), linear-gradient(135deg,#1c1109 0%,#2a1810 55%,#3a220f 100%);
  border:1px solid rgba(232,147,58,0.25); box-shadow:0 30px 80px rgba(0,0,0,0.5);
}
.ctc-cta-bar { position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#F5B97A,#FF7E5F 30%,#FFB88C 55%,#FF7E5F 75%,#F5B97A); background-size:200% auto; animation:ctc-shimmer 5s linear infinite; }
.ctc-cta-copy { flex:1; min-width:280px; }
.ctc-cta-eyebrow { font-family:var(--font-body); font-size:10px; font-weight:700; letter-spacing:0.3em; color:#F5B97A; text-transform:uppercase; margin-bottom:10px; }
.ctc-cta-title { font-family:var(--font-heading); font-size:clamp(1.4rem,2.6vw,1.9rem); font-weight:600; color:#fff; line-height:1.2; margin:0; }
.ctc-cta-desc { font-family:var(--font-body); font-size:14px; color:rgba(251,243,234,0.65); margin-top:10px; }
.ctc-cta-buttons { display:flex; flex-direction:column; gap:10px; min-width:190px; }
.ctc-cta-white, .ctc-cta-outline, .ctc-cta-wa { display:flex; align-items:center; justify-content:center; border-radius:999px; padding:12px 28px; font-family:var(--font-body); font-size:13px; text-decoration:none; text-align:center; transition:transform .25s ease; }
.ctc-cta-white:hover, .ctc-cta-outline:hover, .ctc-cta-wa:hover { transform:translateY(-2px); }
.ctc-cta-white { background:#fff; color:#2a1810; font-weight:700; }
.ctc-cta-outline { border:1.5px solid rgba(255,255,255,0.35); color:#fff; font-weight:600; background:transparent; }
.ctc-cta-wa { background:#25D366; color:#fff; font-weight:600; }

/* responsive */
@media (max-width:640px) {
  .ctc-methods { grid-template-columns:1fr; }
  .ctc-map-container, .ctc-map-container iframe { height:260px !important; }
  .ctc-cta-banner { flex-direction:column; }
  .ctc-cta-buttons { flex-direction:column; align-items:stretch; min-width:unset; width:100%; }
}
@media (prefers-reduced-motion: reduce) {
  .ctc-orb, .ctc-accent, .ctc-form-bar, .ctc-cta-bar, .ctc-badge-dot { animation:none !important; }
}
`;
