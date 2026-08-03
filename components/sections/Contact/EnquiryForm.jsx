'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { FORM, LOCATIONS, SHOWROOM } from './data';

/**
 * Enquiry form, paired with the showroom map.
 *
 * The submission is carried across from the previous implementation
 * unchanged, same endpoint, same payload shape, same phone-length guard, same
 * success and error handling:
 *
 *   POST {API_URL}/api/leads
 *   { name, phone, message, source: 'Contact Form', location }
 *
 * `location` is validated against LOCATIONS before it is sent and falls back
 * to 'Unknown', which is what the backend expects, so that guard stays too.
 *
 * The API base is resolved the same way as before, a local server in
 * development and the hosted one in production.
 */
const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://evulation-api-electrichamambackend.0psc8x.easypanel.host'
    : 'http://localhost:5050';

export default function EnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', location: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length < 8) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message || '',
          source: 'Contact Form',
          location: LOCATIONS.includes(form.location) ? form.location : 'Unknown',
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setForm({ name: '', phone: '', location: '', message: '' });
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field =
    'w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-bone-100 outline-none transition-colors duration-200 placeholder:text-bone-500/50 focus:border-heat-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-heat-500/20';
  const label =
    'mb-2 block text-[10px] font-medium uppercase tracking-[0.2em] text-bone-500';

  return (
    <section
      id="enquiry"
      className="relative scroll-mt-24 bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55vw 40vh at 50% 0%, rgba(255,138,61,0.07), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* ── Form ── */}
          <div
            className="relative isolate overflow-hidden rounded-[28px] border border-white/10 p-6 sm:p-9"
            style={{
              background:
                'radial-gradient(85% 120% at 0% 0%, rgba(255,138,61,0.10), transparent 58%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)',
            }}
          >
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {FORM.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-6 font-serif text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit]"
            >
              {FORM.title}
            </RevealText>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-bone-300">
                {FORM.intro}
              </p>
            </Reveal>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className={label}>
                    Full name
                  </label>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Mohammad Ashraf"
                    className={field}
                  />
                </div>
                <div>
                  <label htmlFor="ct-phone" className={label}>
                    Phone / WhatsApp
                  </label>
                  <input
                    id="ct-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 70060 00000"
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ct-loc" className={label}>
                  Project location
                </label>
                <select
                  id="ct-loc"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className={`${field} appearance-none bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-11`}
                  style={{
                    // Inline caret, so the select keeps a native control's
                    // behaviour without a wrapper element over the top of it.
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238c857d' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="" className="bg-ink-900">
                    Select your region
                  </option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-ink-900">
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ct-msg" className={label}>
                  Project details <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  id="ct-msg"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Room sizes, floor type, anything you already know…"
                  className={`${field} resize-y`}
                />
              </div>

              {error && (
                <p role="alert" className="text-[13.5px] text-heat-300">
                  {error}
                </p>
              )}

              <AnimatePresence>
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 rounded-xl border border-heat-500/25 bg-heat-500/[0.08] px-4 py-3 text-[13.5px] text-bone-100"
                  >
                    <Check size={16} strokeWidth={2} aria-hidden className="text-heat-400" />
                    Sent. We will be in touch shortly.
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full rounded-full bg-heat-500 px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)] transition-colors duration-200 hover:bg-heat-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-bone-500 disabled:shadow-none sm:w-auto"
              >
                {success ? 'Submitted' : loading ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          </div>

          {/* ── Showroom ── */}
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-ink-900/60">
              <a
                href={SHOWROOM.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the Srinagar showroom location in Google Maps"
                className="group relative block"
              >
                {/* pointer-events none on the iframe so the whole tile is one
                    link target rather than a map that swallows the click. */}
                <iframe
                  src={SHOWROOM.embedUrl}
                  title="The Heating Store, Srinagar showroom"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none block h-[280px] w-full border-0 grayscale-[0.35] transition-all duration-700 group-hover:grayscale-0 sm:h-[340px]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.25) 0%, transparent 45%, rgba(10,10,10,0.55) 100%)',
                  }}
                />
              </a>

              <div className="p-6 sm:p-8">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-heat-400">
                  {SHOWROOM.eyebrow}
                </span>
                <h2 className="mt-4 font-serif text-2xl leading-tight tracking-wide text-bone-100">
                  {SHOWROOM.title}
                </h2>
                <p className="mt-3.5 text-[14px] leading-relaxed text-bone-300">
                  {SHOWROOM.body}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
