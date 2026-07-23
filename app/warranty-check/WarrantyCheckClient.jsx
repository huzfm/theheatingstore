
'use client';

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search, ShieldCheck, ShieldX, Phone,
  Calendar, Package, User, XCircle, Clock, Hash
} from "lucide-react";

/* ---------- TOKENS ---------- */

const T = {
  cream: "#FFF8F0",
  ink: "#3C2A25",
  mocha: "#8A6552",
  terracotta: "#B86B45",
  ember: "#E8933A",
  border: "#FFE0C2",
  verifiedInk: "#2F6E86",
  verifiedBg: "#E7F1F4",
  verifiedBorder: "#C7DEE6",
  expiredInk: "#A83B2E",
  expiredBg: "#FBEAE7",
  expiredBorder: "#F0C9C2",
};

const MONO =
  "ui-monospace, 'SF Mono', 'Cascadia Mono', 'Roboto Mono', Menlo, Consolas, monospace";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

/* ---------- SEGMENTED TOGGLE ---------- */

function SegmentedToggle({ value, onChange, reduce }) {
  const options = [
    { id: "phone", label: "Phone Number", icon: Phone },
    { id: "warrantyId", label: "Warranty ID", icon: Hash },
  ];
  return (
    <div className="inline-flex gap-1 p-1 rounded-full bg-white/70 border border-[#FFD6A6] backdrop-blur w-fit mb-5">
      {options.map((opt) => {
        const active = value === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="relative px-4 py-2 rounded-full text-xs font-semibold"
          >
            {active && (
              <motion.span
                layoutId="segPill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C]"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className="relative z-10 inline-flex items-center gap-1.5"
              style={{ color: active ? "#fff" : "#3C2B27" }}
            >
              <Icon size={12} /> {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- INK STAMP (signature element) ---------- */

function InkStamp({ status, index, reduce }) {
  const active = status === "ACTIVE";
  const ink = active ? T.verifiedInk : T.expiredInk;
  const pathId = `stampPath-${index}`;
  const label = active ? "ELECTRIC HAMAM · VERIFIED ·" : "ELECTRIC HAMAM · EXPIRED ·";

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.7, rotate: -22 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -9 }}
      transition={
        reduce
          ? { duration: 0.3 }
          : { type: "spring", stiffness: 210, damping: 14, delay: 0.35 }
      }
      className="absolute -top-4 -right-3 sm:-top-5 sm:-right-5 pointer-events-none select-none"
      style={{ width: 92, height: 92, mixBlendMode: "multiply" }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" width="92" height="92">
        <defs>
          <path id={pathId} d="M 8,50 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0" />
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke={ink} strokeWidth="2" opacity="0.85" />
        <circle cx="50" cy="50" r="39" fill="none" stroke={ink} strokeWidth="1" opacity="0.55" />
        <text fontSize="7.4" fontWeight="700" letterSpacing="1.5" fill={ink} opacity="0.9">
          <textPath href={`#${pathId}`} startOffset="2%">
            {label}
          </textPath>
        </text>
        {active ? (
          <path
            d="M35 51 L45 61 L67 39"
            stroke={ink}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        ) : (
          <g stroke={ink} strokeWidth="5" strokeLinecap="round" opacity="0.9">
            <path d="M37 37 L63 63" />
            <path d="M63 37 L37 63" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/* ---------- INFO CARD ---------- */

function InfoCard({ icon: Icon, label, value, highlight }) {
  return (
    <div className="rounded-xl p-3.5 bg-white/70 border border-[#FFE0C2]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={11} className="text-[#B86B45]" />
        <span className="text-[10px] text-[#9A7060] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-semibold tabular-nums ${highlight ? "" : ""}`}
        style={{ color: highlight ? T.expiredInk : T.ink, fontFamily: MONO, letterSpacing: "-0.01em" }}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------- MAIN ---------- */

export default function WarrantyCheck() {
  const reduce = useReducedMotion();
  const [searchType, setSearchType] = useState("phone");
  const [phone, setPhone] = useState("");
  const [warrantyId, setWarrantyId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const switchType = (type) => {
    setSearchType(type);
    setError("");
    setSearched(false);
    setResult(null);
  };

  const handleCheck = async () => {
    const isPhone = searchType === "phone";
    const raw = isPhone ? phone : warrantyId;
    const cleaned = raw.replace(/\s/g, "");

    if (!cleaned) return setError(`Please enter your ${isPhone ? "phone number" : "warranty ID"}`);
    if (isPhone && cleaned.length < 10) return setError("Please enter a valid phone number");

    setError("");
    setLoading(true);
    setSearched(false);
    setResult(null);

    try {
      const param = isPhone ? "phone" : "warrantyId";
      const res = await fetch(`/api/warranty/check?${param}=${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      setResult(Array.isArray(data.results) ? data.results : []);
      setSearched(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    ACTIVE: {
      icon: ShieldCheck,
      color: T.verifiedInk,
      bg: T.verifiedBg,
      border: T.verifiedBorder,
      label: "Active",
    },
    EXPIRED: {
      icon: ShieldX,
      color: T.expiredInk,
      bg: T.expiredBg,
      border: T.expiredBorder,
      label: "Expired",
    },
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const getDaysLeft = (d) => (d ? Math.ceil((new Date(d) - new Date()) / 86400000) : null);

  return (
    <div
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 35%,#FFE0C2 70%,#F5B97A 100%)",
      }}
    >
      {/* Ambient heat glow */}
      <motion.div
        aria-hidden
        animate={reduce ? {} : { opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(60% 35% at 50% 0%,rgba(245,185,122,0.35),transparent 70%)" }}
      />

      {/* Radiant heat rings — nods to underfloor radiant heating, kept faint */}
      <motion.div
        aria-hidden
        className="absolute -right-24 top-24 pointer-events-none hidden lg:block"
        animate={reduce ? {} : { scale: [1, 1.06, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="380" height="380" viewBox="0 0 380 380">
          {[60, 100, 140, 180].map((r) => (
            <circle
              key={r}
              cx="190"
              cy="190"
              r={r}
              fill="none"
              stroke="#B86B45"
              strokeOpacity="0.12"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('/noise.png')", opacity: 0.02 }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-22 lg:py-24">
        <div className="grid gap-8 sm:gap-12 lg:gap-20 lg:grid-cols-[1.05fr_0.95fr] items-center">

          {/* LEFT — form */}
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>

            <motion.div variants={fadeUp} className="relative inline-flex mb-1">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.08))] opacity-70"
              />
              <p className="relative inline-flex items-center whitespace-nowrap px-6 py-2 sm:px-7 sm:py-2.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.28em] sm:tracking-[0.45em] text-[#4FA3D1] rounded-full bg-[rgba(255,255,255,0.22)] backdrop-blur-xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_40px_rgba(15,23,42,0.22)]">
                Kashmir #1 Seller · Since 2011
              </p>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              style={{ fontSize: "clamp(1.625rem, 4vw, 3rem)" }}
              className="mt-4 sm:mt-6 font-serif font-semibold leading-tight text-[#3C2A25]"
            >
              Verify Your Electric Hamam
              <br />
              <span className="text-[#B86B45] font-darker">Warranty &amp; Coverage in Kashmir</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#3C2B27]"
              style={{ fontWeight: 500 }}
            >
              Enter your registered phone number or warranty ID to instantly view your electric hamam
              warranty details, installation date, and remaining coverage period in Kashmir.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 space-y-4 text-sm text-[#4A342E]">
              {[
                "Instant lookup by phone number or warranty ID",
                "View installation date & expiry coverage",
                "Know exactly how many days remain",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <p>{text}</p>
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-14">
              <SegmentedToggle value={searchType} onChange={switchType} reduce={reduce} />

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#6B4A2D] mb-3">
                {searchType === "phone" ? "Phone Number" : "Warranty ID"}
              </p>

              <div className="flex flex-wrap gap-4 max-w-lg">
                <div className="relative flex-1 min-w-[180px]">
                  {searchType === "phone" ? (
                    <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B86B45]" />
                  ) : (
                    <Hash size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B86B45]" />
                  )}
                  <input
                    type={searchType === "phone" ? "tel" : "text"}
                    placeholder={searchType === "phone" ? "e.g. 03001234567" : "e.g. WH-2024-001234"}
                    value={searchType === "phone" ? phone : warrantyId}
                    onChange={(e) => {
                      if (searchType === "phone") setPhone(e.target.value);
                      else setWarrantyId(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    aria-label={searchType === "phone" ? "Phone number" : "Warranty ID"}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-full border border-[#FFD6A6] bg-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-[#E8933A]/40 focus:border-[#B86B45] transition text-[#3C2A25] placeholder:text-[#C4A882]"
                  />
                </div>

                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full px-10 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF7E5F] to-[#FFB88C] shadow-[0_22px_70px_rgba(184,107,69,0.45)] transition-all duration-300 hover:scale-[1.05] disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search size={15} />
                  )}
                  {loading ? "Checking..." : "Check Warranty"}
                </button>
              </div>

              {error && (
                <p className="text-sm mt-3 flex items-center gap-1.5" style={{ color: T.expiredInk }}>
                  <XCircle size={13} /> {error}
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* RIGHT — certificate card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="relative overflow-hidden rounded-[32px] bg-[#FFF8F0] shadow-[0_50px_140px_rgba(0,0,0,0.18)] min-h-[300px] sm:min-h-[400px] lg:min-h-[460px] p-8 flex flex-col justify-center"
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                {!searched ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                      style={{
                        background: "linear-gradient(135deg,rgba(255,126,95,0.1),rgba(255,184,140,0.18))",
                        border: "1px solid rgba(255,184,140,0.4)",
                      }}
                    >
                      <ShieldCheck size={36} className="text-[#B86B45]" />
                    </div>
                    <p className="text-center text-xl font-serif font-semibold mb-2 text-[#3C2A25]">
                      Your Warranty Details
                    </p>
                    <p className="text-center text-sm text-[#9A7060] leading-relaxed max-w-xs">
                      Enter your registered phone number or warranty ID to view your electric hamam
                      warranty coverage and installation status in Kashmir.
                    </p>
                  </motion.div>
                ) : result && result.length === 0 ? (
                  <motion.div
                    key="empty-result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 border"
                      style={{ background: T.expiredBg, borderColor: T.expiredBorder }}
                    >
                      <ShieldX size={36} style={{ color: T.expiredInk }} />
                    </div>
                    <h3 className="text-xl font-serif font-semibold mb-2 text-[#3C2A25]">
                      No Warranty Found
                    </h3>
                    <p className="text-sm text-[#6B4A2D] text-center leading-relaxed">
                      No records for <span className="font-semibold">{searchType === "phone" ? phone : warrantyId}</span>.
                      <br />
                      Please verify or contact support.
                    </p>
                  </motion.div>
                ) : (
                  result &&
                  result.map((w, i) => {
                    const st = statusConfig[w.status] || statusConfig.ACTIVE;
                    const StatusIcon = st.icon;
                    const daysLeft = getDaysLeft(w.expiryDate);
                    return (
                      <motion.div
                        key={w._id || i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                      >
                        <InkStamp status={w.status} index={w._id || i} reduce={reduce} />

                        <div className="flex items-start justify-between mb-6 pr-16">
                          <div>
                            <h3 className="text-2xl font-serif font-semibold text-[#3C2A25]">
                              {w.product || "Product"}
                            </h3>
                            <p className="text-sm text-[#6B4A2D] mt-1">{w.customerName}</p>
                          </div>
                          <span
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0"
                            style={{ background: st.bg, color: st.color, borderColor: st.border }}
                          >
                            <StatusIcon size={11} /> {st.label}
                          </span>
                        </div>

                        {w.status === "ACTIVE" && daysLeft !== null && (
                          <div
                            className="mb-5 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium border"
                            style={
                              daysLeft <= 30
                                ? { background: "#FFF4E0", color: "#B4700B", borderColor: "#F4DBA0" }
                                : { background: "#FFF4E8", color: T.terracotta, borderColor: "#FFD6A6" }
                            }
                          >
                            <Clock size={14} />
                            {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining` : "Expires today"}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <InfoCard icon={Hash} label="Warranty ID" value={w.warrantyId || "—"} />
                          <InfoCard
                            icon={Package}
                            label="Period"
                            value={w.warrantyYears ? `${w.warrantyYears} Year${w.warrantyYears > 1 ? "s" : ""}` : "—"}
                          />
                          <InfoCard icon={Calendar} label="Installation" value={formatDate(w.installationDate)} />
                          <InfoCard
                            icon={Calendar}
                            label="Expiry"
                            value={formatDate(w.expiryDate)}
                            highlight={w.status === "EXPIRED"}
                          />
                          <InfoCard icon={User} label="Customer" value={w.customerName || "—"} />
                          <InfoCard icon={Phone} label="Phone" value={w.phone || "—"} />
                        </div>

                        {/* Perforation + barcode footer — certificate/ticket motif */}
                        <div
                          className="mt-6 pt-4"
                          style={{ borderTop: `1.5px dashed ${T.border}` }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div
                              aria-hidden
                              className="h-6 flex-1"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(90deg, #3C2A25 0px, #3C2A25 1px, transparent 1px, transparent 3px, #3C2A25 3px, #3C2A25 5px, transparent 5px, transparent 7px, #3C2A25 7px, #3C2A25 8px, transparent 8px, transparent 12px)",
                                opacity: 0.25,
                              }}
                            />
                            <span
                              className="text-[11px] tracking-wider shrink-0"
                              style={{ fontFamily: MONO, color: T.mocha }}
                            >
                              {w.warrantyId || "—"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <div className="absolute -bottom-8 left-8 rounded-2xl bg-white px-6 py-4 shadow-xl border border-[#FFE8D0]">
              <p className="font-semibold text-[#3C2A25]">Kashmir-Tested Systems</p>
              <p className="mt-1 text-xs text-[#6B4A2D]">Since 2011 · Kashmir Installation Warranty</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
