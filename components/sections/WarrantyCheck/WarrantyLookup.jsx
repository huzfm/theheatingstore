'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Search, ShieldCheck, ShieldX, Ban, Phone, Calendar,
  Package, AlertCircle, Clock, Hash,
} from 'lucide-react';
import { RevealText, Reveal } from '@/components/ui/RevealText';
import { Skeleton, SkeletonGroup } from '@/components/ui/loading/Skeleton';
import Spinner from '@/components/ui/loading/Spinner';
import PendingLabel from '@/components/ui/loading/PendingLabel';
import { LOOKUP, LOOKUP_ENDPOINT, PHONE, PHONE_DISPLAY } from './data';

/**
 * The lookup itself: search on the left, the returned certificate on the
 * right.
 *
 * ── What the register actually returns ──────────────────────────────────────
 * Confirmed against `buildLookupResponse` in the backend's
 * warranty.controller.js. A caller without an admin session gets exactly this
 * and nothing more:
 *
 *   { warrantyId, product, installationDate, expiryDate, warrantyYears,
 *     status, computedStatus, phone }            // phone is masked: ••••••7035
 *
 * plus `revokedReason` and `revokedAt` when, and only when, the record is
 * revoked. There is no `customerName`, no `_id` and no `serialNumber` in a
 * public response — the earlier version of this component rendered all three,
 * so the certificate always showed "Registered owner" and an em dash where the
 * customer's name should be.
 *
 * `computedStatus` is the field to read, never `status`. The stored `status` is
 * only ever ACTIVE or REVOKED; EXPIRED is derived from the expiry date by the
 * server. Reading `status` and falling back to the date, which is what this
 * component used to do, rendered a REVOKED warranty whose expiry had not yet
 * passed as **Active, with days of cover remaining** — the most damaging wrong
 * answer this page can give.
 *
 * Responses are 200 { count, results }, 404 { message } for a miss, 400 for
 * input under four characters, 429 when the register's per-IP throttle trips,
 * and 500 on its own errors. The proxy at LOOKUP_ENDPOINT turns 404 into an
 * empty result set and passes every other message through.
 */

const MONO =
  "ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Menlo, Consolas, monospace";

/* Panel treatment shared by the form and the certificate, the same raised
   heat-lit surface the closing panels use site-wide. */
const PANEL_BG =
  'radial-gradient(85% 120% at 0% 0%, rgba(255,138,61,0.10), transparent 58%), linear-gradient(180deg, #161512 0%, #0b0b0a 100%)';

const EM_DASH = '—';

/**
 * The three states the register can report, and how each one looks.
 *
 * Revoked is deliberately the loudest: it is the only one of the three that
 * says the cover was taken away rather than simply used up, and it is the only
 * one that owes the reader an explanation.
 */
const STATUS = {
  ACTIVE: {
    label: 'Valid',
    icon: ShieldCheck,
    stampLabel: 'THE HEATING STORE · VERIFIED ·',
    ink: '#ffb061',
    badge: 'border-heat-500/30 bg-heat-500/[0.12] text-heat-300',
  },
  EXPIRED: {
    label: 'Expired',
    icon: ShieldX,
    stampLabel: 'THE HEATING STORE · EXPIRED ·',
    ink: '#8c857d',
    badge: 'border-white/12 bg-white/[0.05] text-bone-500',
  },
  REVOKED: {
    label: 'Revoked',
    icon: Ban,
    stampLabel: 'THE HEATING STORE · REVOKED ·',
    ink: '#e05a45',
    badge: 'border-[#e05a45]/35 bg-[#e05a45]/[0.12] text-[#f08b79]',
  },
};

/**
 * Which of the three states a record is in.
 *
 * `computedStatus` is the server's own answer and is trusted first. The
 * fallbacks exist only for a response that predates that field: an explicit
 * REVOKED still wins over the date, because a revoked warranty with a future
 * expiry must never resolve to valid.
 */
function resolveStatus(record) {
  const computed = String(record?.computedStatus || '').toUpperCase();
  if (STATUS[computed]) return computed;

  const stored = String(record?.status || '').toUpperCase();
  if (stored === 'REVOKED') return 'REVOKED';
  if (stored === 'EXPIRED') return 'EXPIRED';

  const expiry = record?.expiryDate ? new Date(record.expiryDate) : null;
  if (expiry && !Number.isNaN(expiry.getTime())) {
    return expiry < new Date() ? 'EXPIRED' : 'ACTIVE';
  }
  return stored === 'ACTIVE' ? 'ACTIVE' : 'EXPIRED';
}

// en-IN, matching the backend's own formatDate. This is an Indian business
// selling in Jammu & Kashmir.
const formatDate = (d) => {
  if (!d) return EM_DASH;
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? EM_DASH
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const daysUntil = (d) => {
  if (!d) return null;
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? null : Math.ceil((date - new Date()) / 86400000);
};

/* ---------- SEGMENTED TOGGLE ---------- */

function SegmentedToggle({ value, onChange, reduce }) {
  const options = [
    { id: 'phone', label: 'Phone number', icon: Phone },
    { id: 'warrantyId', label: 'Warranty ID', icon: Hash },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Search by"
      className="inline-flex w-fit gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
    >
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className="relative rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200"
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId="warrantySegPill"
                className="absolute inset-0 rounded-full bg-heat-500"
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 inline-flex items-center gap-1.5 ${
                active ? 'text-ink-950' : 'text-bone-300'
              }`}
            >
              <Icon size={12} strokeWidth={2} aria-hidden />
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- INK STAMP ---------- */

/**
 * The certificate stamp, carried over from the cream version but re-inked for
 * the dark ground. `mixBlendMode: multiply` went with the light background; it
 * renders as near-black on ink.
 */
function InkStamp({ state, index, reduce }) {
  const { ink, stampLabel } = STATUS[state];
  const pathId = `warrantyStamp-${index}`;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.7, rotate: -22 }}
      animate={reduce ? { opacity: 0.9 } : { opacity: 0.9, scale: 1, rotate: -9 }}
      transition={
        reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 210, damping: 14, delay: 0.35 }
      }
      className="pointer-events-none absolute -top-2 -right-1 select-none sm:-top-3 sm:-right-2"
      style={{ width: 88, height: 88 }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" width="88" height="88">
        <defs>
          <path id={pathId} d="M 8,50 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke={ink} strokeWidth="2" opacity="0.75" />
        <circle cx="50" cy="50" r="39" fill="none" stroke={ink} strokeWidth="1" opacity="0.45" />
        <text fontSize="7.2" fontWeight="700" letterSpacing="1.3" fill={ink} opacity="0.85">
          <textPath href={`#${pathId}`} startOffset="2%">
            {stampLabel}
          </textPath>
        </text>
        {state === 'ACTIVE' && (
          <path
            d="M35 51 L45 61 L67 39"
            stroke={ink}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        )}
        {state === 'EXPIRED' && (
          <g stroke={ink} strokeWidth="5" strokeLinecap="round" opacity="0.9">
            <path d="M37 37 L63 63" />
            <path d="M63 37 L37 63" />
          </g>
        )}
        {state === 'REVOKED' && (
          /* The "no entry" bar, not a cross: revoked is a decision taken, and
             it should not read as the same thing as simply having run out. */
          <g stroke={ink} opacity="0.9" fill="none">
            <circle cx="50" cy="50" r="17" strokeWidth="5" />
            <path d="M38 38 L62 62" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/* ---------- INFO CARD ---------- */

function InfoCard({ icon: Icon, label, value, muted, className = '' }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-3.5 ${className}`}>
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon size={11} strokeWidth={2} aria-hidden className="text-heat-400" />
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-bone-500">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-semibold tabular-nums ${muted ? 'text-heat-300' : 'text-bone-100'}`}
        style={{ fontFamily: MONO, letterSpacing: '-0.01em' }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------- THE VERDICT BANNER ---------- */

/**
 * The one line that answers the question the visitor came with. Every record
 * gets one, whichever of the three states it is in — the previous version
 * rendered a banner for live cover only, so an expired record simply had a
 * quieter badge and no statement about what that meant.
 */
function Verdict({ state, record }) {
  if (state === 'REVOKED') {
    const reason = String(record.revokedReason || '').trim();
    return (
      <div className="mb-5 rounded-xl border border-[#e05a45]/35 bg-[#e05a45]/[0.10] px-4 py-3.5">
        <p className="flex items-center gap-2 text-sm font-semibold text-[#f08b79]">
          <Ban size={14} strokeWidth={2} aria-hidden />
          Cover revoked
          {record.revokedAt ? ` on ${formatDate(record.revokedAt)}` : ''}
        </p>
        {/* The reason is free text typed by staff in the CRM. It is rendered
            as text, never as markup, and the register's own comment flags that
            whatever was typed goes in front of the customer. */}
        <p className="mt-2 text-[13.5px] leading-relaxed text-bone-300">
          {reason ? (
            <>
              <span className="text-bone-500">Reason given: </span>
              {reason}
            </>
          ) : (
            'No reason was recorded against this revocation. Please call us and we will explain.'
          )}
        </p>
      </div>
    );
  }

  if (state === 'EXPIRED') {
    return (
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-bone-300">
        <ShieldX size={14} strokeWidth={1.9} aria-hidden />
        Cover ended on {formatDate(record.expiryDate)}
      </div>
    );
  }

  const daysLeft = daysUntil(record.expiryDate);
  if (daysLeft === null) {
    return (
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-heat-500/25 bg-heat-500/[0.10] px-4 py-3 text-sm font-medium text-heat-300">
        <ShieldCheck size={14} strokeWidth={1.9} aria-hidden />
        This warranty is valid.
      </div>
    );
  }

  return (
    <div
      className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
        daysLeft <= 30
          ? 'border-heat-500/35 bg-heat-500/[0.14] text-heat-300'
          : 'border-heat-500/25 bg-heat-500/[0.08] text-heat-300'
      }`}
    >
      <Clock size={14} strokeWidth={1.9} aria-hidden />
      {daysLeft > 0
        ? `Valid · ${daysLeft} day${daysLeft === 1 ? '' : 's'} of cover remaining`
        : 'Valid · cover expires today'}
    </div>
  );
}

/* ---------- MAIN ---------- */

export default function WarrantyLookup() {
  const reduce = useReducedMotion();

  const [searchType, setSearchType] = useState('phone');
  const [phone, setPhone] = useState('');
  const [warrantyId, setWarrantyId] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedFor, setSearchedFor] = useState('');

  const isPhone = searchType === 'phone';
  const value = isPhone ? phone : warrantyId;

  const switchType = (type) => {
    if (type === searchType) return;
    setSearchType(type);
    setError('');
    setResults(null);
    setSearchedFor('');
  };

  const handleCheck = async () => {
    const cleaned = value.replace(/\s/g, '').trim();

    if (!cleaned) {
      setError(`Please enter your ${isPhone ? 'phone number' : 'warranty ID'}.`);
      return;
    }
    // Digits only, so a pasted +91 / 0-prefixed number is measured on the
    // number itself rather than on its formatting.
    if (isPhone && cleaned.replace(/\D/g, '').length < 10) {
      setError('That does not look like a complete phone number.');
      return;
    }
    // The register rejects anything shorter than four characters outright.
    if (!isPhone && cleaned.length < 4) {
      setError('A warranty ID is at least four characters.');
      return;
    }

    setError('');
    setLoading(true);
    setResults(null);

    try {
      const param = isPhone ? 'phone' : 'warrantyId';
      const res = await fetch(`${LOOKUP_ENDPOINT}?${param}=${encodeURIComponent(cleaned)}`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || 'We could not reach the warranty register. Please try again.');
        return;
      }

      setResults(Array.isArray(data?.results) ? data.results : []);
      setSearchedFor(cleaned);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Which of the four panel states is showing. `results === null` means no
     search has resolved yet, which is not the same as an empty result. */
  const panelState = loading
    ? 'loading'
    : results === null
      ? 'idle'
      : results.length === 0
        ? 'none'
        : 'found';

  const field =
    'w-full rounded-full border border-white/12 bg-white/[0.04] py-3.5 pl-11 pr-4 text-[15px] text-bone-100 outline-none transition-colors duration-200 placeholder:text-bone-500/50 focus:border-heat-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-heat-500/20';

  return (
    <section
      id="lookup"
      className="relative scroll-mt-24 bg-ink-950 px-5 py-24 text-bone-100 sm:px-8 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(55vw 40vh at 50% 0%, rgba(255,138,61,0.07), transparent 62%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Stretch, not items-start: the two panels are a matched pair and a
            15px height difference between them reads as a mistake. */}
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          {/* ── Search ── */}
          <div
            className="relative isolate overflow-hidden rounded-[28px] border border-white/10 p-6 sm:p-9"
            style={{ background: PANEL_BG }}
          >
            <Reveal>
              <span className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-heat-400">
                <span className="h-px w-8 bg-heat-500/60" />
                {LOOKUP.eyebrow}
              </span>
            </Reveal>
            <RevealText
              as="h2"
              className="mt-6 font-serif text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.04] text-bone-100 [&_span]:leading-[inherit]"
            >
              {LOOKUP.title}
            </RevealText>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-bone-300">
                {LOOKUP.intro}
              </p>
            </Reveal>

            <div className="mt-8">
              <SegmentedToggle value={searchType} onChange={switchType} reduce={reduce} />

              <label
                htmlFor="warranty-query"
                className="mb-2 mt-6 block text-[10px] font-medium uppercase tracking-[0.2em] text-bone-500"
              >
                {isPhone ? 'Registered phone number' : 'Warranty ID or serial number'}
              </label>

              <div className="flex flex-wrap gap-3">
                <div className="relative min-w-[200px] flex-1">
                  {isPhone ? (
                    <Phone
                      size={15}
                      strokeWidth={1.9}
                      aria-hidden
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-heat-400"
                    />
                  ) : (
                    <Hash
                      size={15}
                      strokeWidth={1.9}
                      aria-hidden
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-heat-400"
                    />
                  )}
                  <input
                    id="warranty-query"
                    // `key` forces a fresh input on switch, so the browser does
                    // not carry a phone's autofill/inputmode into the ID field.
                    key={searchType}
                    type={isPhone ? 'tel' : 'text'}
                    inputMode={isPhone ? 'tel' : 'text'}
                    autoComplete={isPhone ? 'tel' : 'off'}
                    placeholder={isPhone ? 'e.g. 90709 07035' : 'e.g. WAR-3F9A21'}
                    value={value}
                    onChange={(e) => {
                      if (isPhone) setPhone(e.target.value);
                      else setWarrantyId(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheck();
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'warranty-error' : undefined}
                    className={field}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={loading}
                  aria-busy={loading}
                  className="inline-flex items-center justify-center rounded-full bg-heat-500 px-8 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_10px_40px_-12px_rgba(255,138,61,0.75)] transition-colors duration-200 hover:bg-heat-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-bone-500 disabled:shadow-none"
                >
                  {/* Both labels share one grid cell, so the button is always
                      as wide as "Check warranty" and does not shrink to
                      "Checking…" mid-request and drag the row with it. */}
                  <PendingLabel
                    pending={loading}
                    idle={
                      <>
                        <Search size={15} strokeWidth={2} aria-hidden />
                        Check warranty
                      </>
                    }
                    busy={
                      <>
                        <Spinner size={15} />
                        Checking…
                      </>
                    }
                  />
                </button>
              </div>

              {error && (
                <p
                  id="warranty-error"
                  role="alert"
                  className="mt-3 flex items-start gap-1.5 text-[13.5px] text-heat-300"
                >
                  <AlertCircle size={14} strokeWidth={2} aria-hidden className="mt-1 shrink-0" />
                  {error}
                </p>
              )}

              <p className="mt-6 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-bone-500">
                Can&apos;t find the certificate? Call{' '}
                <a
                  href={`tel:${PHONE}`}
                  className="text-heat-400 transition-colors duration-200 hover:text-heat-300"
                >
                  {PHONE_DISPLAY}
                </a>{' '}
                and we will look it up from the installation address.
              </p>
            </div>
          </div>

          {/* ── Certificate ── */}
          <Reveal delay={0.1} className="h-full">
            <div
              className="relative isolate flex h-full min-h-[420px] flex-col justify-center overflow-hidden rounded-[28px] border border-white/10 p-6 sm:min-h-[480px] sm:p-9"
              style={{ background: PANEL_BG }}
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {panelState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-heat-500/25 bg-heat-500/[0.08]">
                      <ShieldCheck size={34} strokeWidth={1.5} aria-hidden className="text-heat-400" />
                    </div>
                    <h3 className="font-serif text-2xl leading-tight tracking-wide text-bone-100">
                      Your certificate appears here
                    </h3>
                    <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-bone-300">
                      Search on the left and the registered record comes back with its dates and
                      remaining cover.
                    </p>
                  </motion.div>
                )}

                {panelState === 'loading' && (
                  /**
                   * Heights below are the real line boxes, not estimates.
                   * globals.css gives every p/span/div a 1.75 line-height and
                   * every h1-h6 a 1.05, so a 14px paragraph occupies 24.5px and
                   * the 24px serif heading occupies 25.2px. The five InfoCard
                   * shells are that component's own markup, so those boxes are
                   * the real height by construction.
                   */
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SkeletonGroup label="Checking the warranty register">
                      <div className="mb-6 flex items-start justify-between pr-16">
                        <Skeleton tone="dark" className="h-[25.2px] w-44" rounded="rounded-lg" />
                        <Skeleton
                          tone="dark"
                          className="h-[35px] w-[86px] shrink-0"
                          rounded="rounded-full"
                        />
                      </div>

                      {/* The verdict banner. Every record renders one, so
                          unlike the previous version this block is never a
                          reservation for something that does not arrive. */}
                      <Skeleton tone="dark" className="mb-5 h-[50.5px] w-full" rounded="rounded-xl" />

                      <div className="grid grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                            <div className="mb-1.5 flex items-center gap-1.5">
                              <Skeleton tone="dark" className="h-[11px] w-[11px] shrink-0" />
                              <Skeleton tone="dark" className="h-[17.5px] w-16" />
                            </div>
                            <Skeleton tone="dark" className="h-[24.5px] w-24" />
                          </div>
                        ))}
                        <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                          <div className="mb-1.5 flex items-center gap-1.5">
                            <Skeleton tone="dark" className="h-[11px] w-[11px] shrink-0" />
                            <Skeleton tone="dark" className="h-[17.5px] w-16" />
                          </div>
                          <Skeleton tone="dark" className="h-[24.5px] w-28" />
                        </div>
                      </div>

                      <div className="mt-6 border-t border-dashed border-white/15 pt-4">
                        <div className="flex items-center justify-between gap-4">
                          <Skeleton tone="dark" className="h-6 flex-1" />
                          <Skeleton tone="dark" className="h-[19.25px] w-20 shrink-0" />
                        </div>
                      </div>
                    </SkeletonGroup>
                  </motion.div>
                )}

                {panelState === 'none' && (
                  <motion.div
                    key="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 text-center"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04]">
                      <ShieldX size={34} strokeWidth={1.5} aria-hidden className="text-bone-500" />
                    </div>
                    <h3 className="font-serif text-2xl leading-tight tracking-wide text-bone-100">
                      No record found
                    </h3>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-bone-300">
                      Nothing is filed against{' '}
                      <span className="font-semibold text-bone-100" style={{ fontFamily: MONO }}>
                        {searchedFor}
                      </span>
                      . That usually means a different number, not a missing warranty, see below.
                    </p>
                    <a
                      href={`tel:${PHONE}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-bone-500/30 px-6 py-3 text-[13px] font-semibold text-bone-100 transition-colors duration-200 hover:border-heat-500/60 hover:text-white"
                    >
                      <Phone size={14} strokeWidth={1.9} aria-hidden />
                      {PHONE_DISPLAY}
                    </a>
                  </motion.div>
                )}

                {panelState === 'found' && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-10"
                  >
                    {results.map((w, i) => {
                      const state = resolveStatus(w);
                      const cfg = STATUS[state];
                      const StatusIcon = cfg.icon;

                      return (
                        <motion.div
                          key={w.warrantyId || i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative"
                        >
                          <InkStamp state={state} index={w.warrantyId || i} reduce={reduce} />

                          <div className="mb-6 flex items-start justify-between gap-4 pr-20">
                            <h3 className="min-w-0 font-serif text-2xl leading-tight tracking-wide text-bone-100">
                              {w.product || 'Registered system'}
                            </h3>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${cfg.badge}`}
                            >
                              <StatusIcon size={11} strokeWidth={2.2} aria-hidden />
                              {cfg.label}
                            </span>
                          </div>

                          <Verdict state={state} record={w} />

                          {/* The public response carries no customer name, so
                              there is no name row here. The masked phone is the
                              only identifying field the register returns, and
                              it is what confirms the record is the right one. */}
                          <div className="grid grid-cols-2 gap-3">
                            <InfoCard icon={Hash} label="Warranty ID" value={w.warrantyId || EM_DASH} />
                            <InfoCard
                              icon={Package}
                              label="Period"
                              value={
                                w.warrantyYears
                                  ? `${w.warrantyYears} year${w.warrantyYears === 1 ? '' : 's'}`
                                  : EM_DASH
                              }
                            />
                            <InfoCard
                              icon={Calendar}
                              label="Installed"
                              value={formatDate(w.installationDate)}
                            />
                            <InfoCard
                              icon={Calendar}
                              label="Expires"
                              value={formatDate(w.expiryDate)}
                              muted={state !== 'ACTIVE'}
                            />
                            <InfoCard
                              icon={Phone}
                              label="Registered phone"
                              value={w.phone || EM_DASH}
                              className="col-span-2"
                            />
                          </div>

                          {/* Perforation + barcode footer, the certificate motif
                              carried over from the previous design. */}
                          <div className="mt-6 border-t border-dashed border-white/15 pt-4">
                            <div className="flex items-center justify-between gap-4">
                              <div
                                aria-hidden
                                className="h-6 flex-1 opacity-30"
                                style={{
                                  backgroundImage:
                                    'repeating-linear-gradient(90deg, #f5f1ec 0px, #f5f1ec 1px, transparent 1px, transparent 3px, #f5f1ec 3px, #f5f1ec 5px, transparent 5px, transparent 7px, #f5f1ec 7px, #f5f1ec 8px, transparent 8px, transparent 12px)',
                                }}
                              />
                              <span
                                className="shrink-0 text-[11px] tracking-wider text-bone-500"
                                style={{ fontFamily: MONO }}
                              >
                                {w.warrantyId || EM_DASH}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
