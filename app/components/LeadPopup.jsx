
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
  });

  useEffect(() => {
    const alreadyShown = localStorage.getItem('lead_popup_shown');
    const alreadySubmitted = localStorage.getItem('lead_submitted');

    if (alreadyShown || alreadySubmitted) return;

    const timer = setTimeout(() => {
      setOpen(true);
      localStorage.setItem('lead_popup_shown', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const submit = async () => {
    if (!form.name || !form.whatsapp) {
      setError('Please fill all details');
      return;
    }
// fixed command
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`https://evulation-api-electrichamambackend.0psc8x.easypanel.host/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.whatsapp,
          message: 'Interested in electric underfloor heating',
          source: 'Hero Popup',
        }),
      });

      if (!res.ok) throw new Error();

      localStorage.setItem('lead_submitted', 'true');
      setOpen(false);
      setForm({ name: '', whatsapp: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 60 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white px-6 pt-6 pb-20 sm:pb-10 sm:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.25)]"
          >
            {/* Drag handle, mobile only */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 sm:hidden" />

            {/* Close button, absolute top right */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Let's Plan Your Installation
            </h3>

            <p className="mt-2 text-sm text-[#E8933A] leading-relaxed">
              Share your details and our heating expert will contact you on WhatsApp.
            </p>

            <div className="mt-4 space-y-3">
              <input
                placeholder="Your Name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-400 outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="WhatsApp Number"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black focus:ring-2 focus:ring-orange-400 outline-none"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="mt-4 mb-2 w-full rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] py-4 text-base sm:text-sm font-bold text-white shadow-lg transition hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Get Consultation'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
