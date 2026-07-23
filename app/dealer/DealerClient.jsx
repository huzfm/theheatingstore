'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const STATS = [
  { value: '40+', label: 'Dealers' },
  { value: '15', label: 'Cities' },
  { value: 'Since 2019', label: 'Established' },
];

const WHY_PARTNER = [
  {
    title: 'Exclusive Territory',
    desc: 'Protected dealer zones in your city with no internal competition.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'High Margins',
    desc: 'Industry-leading dealer margins on all product lines.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
  {
    title: 'Full Support',
    desc: 'Installation training, marketing materials & WhatsApp support.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8933A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
];

const DEALERS = [
  { name: 'Rauf Traders', city: 'Srinagar', years: 4, initials: 'RT' },
  { name: 'Shah Enterprises', city: 'Anantnag', years: 3, initials: 'SE' },
  { name: 'Kashmir Electricals', city: 'Baramulla', years: 2, initials: 'KE' },
  { name: 'Lone Brothers', city: 'Sopore', years: 2, initials: 'LB' },
  { name: 'Wani & Sons', city: 'Pulwama', years: 1, initials: 'WS' },
  { name: 'Bhat Electric', city: 'Budgam', years: 1, initials: 'BE' },
];

const YEARS_OPTIONS = ['Less than 1 year', '1-3 years', '3-5 years', '5+ years'];
const BUSINESS_OPTIONS = ['Electrical Shop', 'Hardware Store', 'Plumbing & Sanitary', 'Interior Design', 'Other'];

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  color: 'rgba(255,255,255,0.96)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
  fontSize: 12.5,
  fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  color: 'rgba(214,198,184,0.85)',
  marginBottom: 8,
  display: 'block',
  letterSpacing: '0.02em',
};

export default function DealerClient() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    years: '',
    business: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const focusIn = (e) => {
    e.target.style.borderColor = '#E8933A';
    e.target.style.boxShadow = '0 0 0 3px rgba(232,147,58,0.18)';
  };
  const focusOut = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <main
      className="relative isolate overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0906 0%, #1C120F 50%, #2B1E1A 100%)' }}
    >
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 28% at 50% 0%, rgba(184,107,69,0.22), transparent 70%)' }}
      />

      <div className="relative z-10">

        {/* ── SECTION 1: HERO ── */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px) clamp(48px, 6vw, 80px)',
            textAlign: 'center',
          }}
        >
          <motion.div variants={FADE_UP} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: '#E8933A',
                textTransform: 'uppercase',
                marginBottom: 18,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Dealer Program · 2026
            </p>
          </motion.div>

          <motion.h1
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            style={{
              fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.05,
              color: 'rgba(255,255,255,0.96)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            Become a Dealer
          </motion.h1>

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
              color: '#E8933A',
              marginTop: 18,
              fontWeight: 500,
            }}
          >
            Partner with Kashmir&apos;s leading electric heating brand
          </motion.p>

          <motion.p
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={3}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(14px, 1.4vw, 15.5px)',
              color: 'rgba(214,198,184,0.85)',
              lineHeight: 1.75,
              maxWidth: 640,
              margin: '14px auto 0',
            }}
          >
            Join our growing network of authorized dealers across India. Get exclusive margins, product training, and dedicated support.
          </motion.p>

          {/* Stat badges */}
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={4}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginTop: 40,
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#E8933A',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(214,198,184,0.8)',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={5}
            style={{ marginTop: 40 }}
          >
            <a
              href="#apply-form"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #E8933A 0%, #D4642A 100%)',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.03em',
                padding: '14px 32px',
                borderRadius: 999,
                textDecoration: 'none',
                boxShadow: '0 12px 32px rgba(232,147,58,0.32)',
                transition: 'filter 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Apply Now →
            </a>
          </motion.div>
        </section>

        {/* ── SECTION 2: WHY PARTNER ── */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 40px)',
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            variants={FADE_UP}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.96)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Why Partner With Us
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14.5,
                color: 'rgba(214,198,184,0.75)',
                marginTop: 10,
              }}
            >
              Built for dealers who want to grow with a category leader.
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 18,
            }}
          >
            {WHY_PARTNER.map((card, i) => (
              <motion.div
                key={card.title}
                variants={FADE_UP}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i + 1}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(232,147,58,0.10)',
                    border: '1px solid rgba(232,147,58,0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                  }}
                >
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.96)',
                    margin: 0,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: 'rgba(214,198,184,0.8)',
                    lineHeight: 1.7,
                    marginTop: 10,
                  }}
                >
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: DEALER NETWORK ── */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 40px)',
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            variants={FADE_UP}
            style={{ textAlign: 'center', marginBottom: 40 }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: '#E8933A',
                textTransform: 'uppercase',
                marginBottom: 12,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Social Proof
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.96)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Our Dealer Network
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14.5,
                color: 'rgba(214,198,184,0.75)',
                marginTop: 10,
                maxWidth: 540,
                margin: '10px auto 0',
              }}
            >
              Trusted by established electrical and hardware businesses across Kashmir.
            </p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 18,
            }}
          >
            {DEALERS.map((d, i) => (
              <motion.div
                key={d.name}
                variants={FADE_UP}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i + 1}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: '24px 22px',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E8933A 0%, #B86B45 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: 'white',
                      letterSpacing: '0.04em',
                      flexShrink: 0,
                    }}
                  >
                    {d.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 19,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.96)',
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {d.name}
                    </h3>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'rgba(214,198,184,0.85)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 999,
                      padding: '5px 11px',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {d.city}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      color: 'rgba(214,198,184,0.85)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 999,
                      padding: '5px 11px',
                    }}
                  >
                    {d.years} {d.years === 1 ? 'year' : 'years'} active
                  </span>
                </div>

                {/* Authorized tag */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: 14,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#E8933A',
                      background: 'rgba(232,147,58,0.10)',
                      border: '1px solid rgba(232,147,58,0.25)',
                      borderRadius: 999,
                      padding: '4px 11px',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#E8933A',
                        boxShadow: '0 0 6px rgba(232,147,58,0.6)',
                      }}
                    />
                    Authorized Dealer
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: APPLICATION FORM ── */}
        <section
          id="apply-form"
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 40px)',
            scrollMarginTop: 80,
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            variants={FADE_UP}
            style={{ textAlign: 'center', marginBottom: 36 }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.96)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Apply for Dealership
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14.5,
                color: 'rgba(214,198,184,0.75)',
                marginTop: 10,
              }}
            >
              We&apos;ll get back to you within 24 hours
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            variants={FADE_UP}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 'clamp(28px, 4vw, 40px)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label htmlFor="name" style={labelStyle}>
                    Full Name<span style={{ color: '#E8933A' }}> *</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={focusIn}
                    onBlur={focusOut}
                    required
                    placeholder="e.g. Mohammad Ashraf"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                  <div>
                    <label htmlFor="phone" style={labelStyle}>
                      Phone Number<span style={{ color: '#E8933A' }}> *</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      onFocus={focusIn}
                      onBlur={focusOut}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address<span style={{ color: '#E8933A' }}> *</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={focusIn}
                      onBlur={focusOut}
                      required
                      placeholder="you@business.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" style={labelStyle}>
                    City / Location<span style={{ color: '#E8933A' }}> *</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    onFocus={focusIn}
                    onBlur={focusOut}
                    required
                    placeholder="e.g. Srinagar"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
                  <div>
                    <label htmlFor="years" style={labelStyle}>
                      Years in Business
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="years"
                        name="years"
                        value={form.years}
                        onChange={handleChange}
                        onFocus={focusIn}
                        onBlur={focusOut}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: 38, cursor: 'pointer' }}
                      >
                        <option value="" style={{ background: '#1C120F' }}>
                          Select experience
                        </option>
                        {YEARS_OPTIONS.map((y) => (
                          <option key={y} value={y} style={{ background: '#1C120F' }}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{
                          position: 'absolute',
                          right: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#E8933A',
                        }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="business" style={labelStyle}>
                      Current Business Type
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="business"
                        name="business"
                        value={form.business}
                        onChange={handleChange}
                        onFocus={focusIn}
                        onBlur={focusOut}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: 38, cursor: 'pointer' }}
                      >
                        <option value="" style={{ background: '#1C120F' }}>
                          Select type
                        </option>
                        {BUSINESS_OPTIONS.map((b) => (
                          <option key={b} value={b} style={{ background: '#1C120F' }}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{
                          position: 'absolute',
                          right: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          color: '#E8933A',
                        }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: 10,
                    width: '100%',
                    background: 'linear-gradient(135deg, #E8933A 0%, #D4642A 100%)',
                    color: 'white',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14.5,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    padding: '15px 0',
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 12px 32px rgba(232,147,58,0.32)',
                    transition: 'filter 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Submit Application →
                </button>

                <p
                  style={{
                    fontSize: 11.5,
                    color: 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  By submitting, you agree to be contacted by The Heating Store dealer team.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  textAlign: 'center',
                  padding: '24px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E8933A 0%, #B86B45 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 32px rgba(232,147,58,0.32)',
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.96)',
                    margin: 0,
                  }}
                >
                  Application Received!
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14.5,
                    color: 'rgba(214,198,184,0.85)',
                    lineHeight: 1.7,
                    maxWidth: 420,
                    margin: 0,
                  }}
                >
                  Our team will contact you on WhatsApp within 24 hours.
                </p>
                <a
                  href="https://wa.me/919070907035"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#25D366',
                    color: 'white',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '12px 24px',
                    borderRadius: 999,
                    textDecoration: 'none',
                    marginTop: 6,
                    transition: 'filter 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Chat on WhatsApp →
                </a>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* ── SECTION 5: BOTTOM CTA STRIP ── */}
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 clamp(20px, 4vw, 40px) clamp(60px, 8vw, 100px)',
          }}
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            variants={FADE_UP}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #1C120F 0%, #2B1E1A 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 48px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            {/* Radial orange glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(50% 80% at 80% 50%, rgba(232,147,58,0.28), transparent 70%)',
              }}
            />

            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.96)',
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                Have questions? Talk to our dealer team directly.
              </h3>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  color: 'rgba(214,198,184,0.7)',
                  marginTop: 8,
                }}
              >
                Reach out on WhatsApp for a quick chat about territories, margins, and onboarding.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <a
                href="https://wa.me/919070907035"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #E8933A 0%, #D4642A 100%)',
                  color: 'white',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '13px 26px',
                  borderRadius: 999,
                  textDecoration: 'none',
                  boxShadow: '0 12px 32px rgba(232,147,58,0.32)',
                  transition: 'filter 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                WhatsApp Us →
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
}
