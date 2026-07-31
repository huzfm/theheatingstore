"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ───────────────── DESIGN TOKENS (dark system, mirrors WhyChooseUsClient /
   HowItWorksClient / UnderfloorHeatingIndiaClient / GlobalExperienceClient /
   CertificationsClient) ── */
const FONT_HEADING = "var(--font-heading)";
const FONT_BODY = "var(--font-body)";
const COLOR_TEXT = "#FBF3EA";
const COLOR_BODY = "rgba(251,243,234,0.60)";
const COLOR_ACCENT = "#C4623A";
const COLOR_ACCENT_2 = "#E88C2A";
const COLOR_BG_SOFT =
  "radial-gradient(120% 80% at 50% -10%, rgba(232,147,58,0.14), transparent 55%), linear-gradient(180deg,#0d0805 0%,#150d07 30%,#1a0f08 60%,#0f0906 100%)";
const COLOR_BG_GREY = "#120b07";
const EASE = [0.16, 1, 0.3, 1];

// Form fields and the measurement "receipt" panel intentionally stay on a
// light/cream surface (not dark-glass) so they read as "type here" against
// the dark page — these constants hold the dark text that surface needs.
const COLOR_INPUT_TEXT = "#2C1810";
const COLOR_RECEIPT_TEXT = "#2C1810";
const COLOR_RECEIPT_BODY = "#6B4A2D";

/* ───────────────── GLASS CARD BASE (dark-glass) ───────────────────────────── */
const glassCard = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)), rgba(20,13,8,0.5)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 22,
  boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
};

/* Inputs stay lit/cream — only the border/shadow changed so they glow softly
   against the new dark page instead of sitting on the old light backdrop. */
const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.92)",
  border: "1.5px solid rgba(255,255,255,0.65)",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  color: COLOR_INPUT_TEXT,
  fontFamily: FONT_BODY,
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
  boxShadow: "0 4px 22px rgba(232,140,42,0.16), 0 1px 3px rgba(0,0,0,0.35)",
};

const labelStyle = {
  display: "block",
  fontFamily: FONT_BODY,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: COLOR_ACCENT,
  marginBottom: 6,
};

const readOnlyStyle = {
  ...inputStyle,
  background:
    "linear-gradient(135deg, rgba(196,98,58,0.10), rgba(232,140,42,0.10)), rgba(255,255,255,0.92)",
  border: "1.5px solid rgba(196,98,58,0.35)",
  color: COLOR_ACCENT,
  fontWeight: 600,
  fontFamily: FONT_HEADING,
  fontSize: 18,
  textAlign: "center",
  boxShadow: "0 4px 26px rgba(232,140,42,0.26), 0 1px 3px rgba(0,0,0,0.35)",
};

/* ───────────────── INLINE ICONS (replace emoji for cross-platform,
   premium rendering — same recipe as HomeHero/GlobalExperienceClient) ── */
function ShieldIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function TruckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M2.5 6.5h11v9h-11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M13.5 10h4l3 3.2V15.5h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="6.5" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M11.5 3H4v7.5L13.5 20a1.5 1.5 0 0 0 2.1 0l4.4-4.4a1.5 1.5 0 0 0 0-2.1L11.5 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="8" cy="7" r="1.3" fill="currentColor" />
    </svg>
  );
}
function RefreshIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3.5 12a8.5 8.5 0 0 1 14.6-5.9M20.5 12a8.5 8.5 0 0 1-14.6 5.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18.5 3.5v3.2h-3.2M5.5 20.5v-3.2h3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RulerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="13.5" width="19" height="8" rx="1.6" transform="rotate(-45 12 17.5)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.7 13.7l1.4 1.4M10.6 10.8l1.4 1.4M13.5 7.9l1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function WarningIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 4L2.5 20h19L12 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.1" r="0.95" fill="currentColor" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────────────── TRUST BADGES (hero) ────────────────────────────────────── */
const TRUST_BADGES = [
  { Icon: ShieldIcon, title: "Lifetime Warranty", sub: "On electric & water systems" },
  { Icon: TruckIcon, title: "Next Day Delivery", sub: "On all orders" },
  { Icon: TagIcon, title: "Price Smash Promise", sub: "If it's cheaper, it's free" },
  { Icon: RefreshIcon, title: "60 Day Money Back", sub: "Guarantee" },
];

/* ───────────────── 3-STEP CARDS DATA ──────────────────────────────────────── */
const STEPS = [
  {
    n: "Step 1",
    title: "Room Size",
    body: "Measure the Length and Width of the room to work out the overall square metres of the room.",
    img: "/images/m1.png",
    alt: "Top-down floor plan of an empty room",
  },
  {
    n: "Step 2",
    title: "Fixed Furniture",
    body: "A standard deduction of 20% is applied to the total room area to account for fixed furniture and built-in fittings, including kitchen units, islands, storage radiators, bathroom suites, and similar immovable fixtures. This ensures your underfloor heating coverage is calculated on the actual usable floor space.",
    img: "/images/m2.png",
    alt: "Bathroom interior with fixed furniture",
  },
  {
    n: "Step 3",
    title: "Total Area",
    body: "Once these deductions are applied, you will be left with your heatable floor area.",
    img: "/images/m3.png",
    alt: "Clean modern floor ready for underfloor heating",
  },
];

/* ───────────────── SCROLL-STAGGER VARIANTS ─────────────────────────────────── */
const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const gridCard = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

/* ───────────────── REUSABLE ───────────────────────────────────────────────── */
function SectionHeading({ children, sub, light = false }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 40px" }}>
      <h2
        style={{
          fontFamily: FONT_HEADING,
          fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
          fontWeight: 700,
          color: light ? "#FFFFFF" : COLOR_TEXT,
          lineHeight: 1.15,
          margin: "0 0 12px",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 15,
            color: light ? "rgba(255,255,255,0.85)" : COLOR_BODY,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Pill({ children, color = COLOR_ACCENT }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 14px",
        borderRadius: 999,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color,
        fontFamily: FONT_BODY,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

/* Subtle divider between calculator subsections — a hairline gradient with a
   soft centred glow dot, deliberately quiet since this is a working form. */
function MuDivider({ margin = "8px 0 36px" }) {
  return (
    <div
      style={{
        position: "relative",
        height: 1,
        margin,
        background:
          "linear-gradient(90deg, transparent, rgba(196,98,58,0.22), rgba(232,140,42,0.22), transparent)",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: COLOR_ACCENT_2,
          boxShadow: "0 0 10px 2px rgba(232,140,42,0.5)",
        }}
      />
    </div>
  );
}

/* ───────────────── MAIN PAGE ──────────────────────────────────────────────── */
export default function MeasuringUpClient() {
  // ── CALCULATOR STATE ──
  const [roomWidth, setRoomWidth] = useState("");
  const [roomLength, setRoomLength] = useState("");
  // Window sill height is for installation planning only, NOT used in any
  // area / heatable-area formula. Stored in millimetres. Optional field.
  const [windowSillHeight, setWindowSillHeight] = useState("");
  const [areas, setAreas] = useState([
    { id: 1, name: "", width: "", length: "" },
  ]);
  const [showResult, setShowResult] = useState(false);

  // Parsed numeric view of the sill height, used only for display/summary.
  const windowSillHeightNum = parseFloat(windowSillHeight);
  const hasWindowSillHeight =
    windowSillHeight !== "" &&
    !Number.isNaN(windowSillHeightNum) &&
    windowSillHeightNum > 0;

  // ── LIVE CALCS ──
  const roomTotal = useMemo(
    () => (parseFloat(roomWidth) || 0) * (parseFloat(roomLength) || 0),
    [roomWidth, roomLength]
  );

  const unheatable = useMemo(
    () =>
      areas.reduce(
        (sum, a) => sum + (parseFloat(a.width) || 0) * (parseFloat(a.length) || 0),
        0
      ),
    [areas]
  );

  const netArea = Math.max(0, roomTotal - unheatable);
  const heatableArea = (netArea * 0.9).toFixed(2);

  const heatablePercentage = roomTotal > 0 ? (netArea / roomTotal) * 100 : 100;
  const isBelowMinimum = roomTotal > 0 && heatablePercentage < 80;

  const hasRoomDims = roomWidth !== "" && roomLength !== "" &&
    parseFloat(roomWidth) > 0 && parseFloat(roomLength) > 0;

  // ── ROW HANDLERS ──
  const addArea = () =>
    setAreas((prev) => [...prev, { id: Date.now(), name: "", width: "", length: "" }]);

  const removeArea = (id) =>
    setAreas((prev) => (prev.length === 1 ? prev : prev.filter((a) => a.id !== id)));

  const updateArea = (id, field, value) =>
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );

  const handleCalculate = () => {
    if (!hasRoomDims) return;
    setShowResult(true);
    setTimeout(() => {
      const el = document.getElementById("calculator-result");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  return (
    <>
      {/* ── GLOBAL INLINE STYLES (matches SpaceVerification tokens) ── */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .mu-cta-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 32px; border-radius: 16px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #C4623A, #E88C2A);
          color: #fff; font-family: var(--font-body); font-size: 15px; font-weight: 600;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 24px rgba(196,98,58,0.35);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .mu-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(196,98,58,0.45); }
        .mu-cta-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: 0 8px 24px rgba(196,98,58,0.2); }
        .mu-cta-outline {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 32px; border-radius: 16px; cursor: pointer;
          background: transparent;
          color: #FBF3EA; border: 1.5px solid rgba(251,243,234,0.30);
          font-family: var(--font-body); font-size: 15px; font-weight: 600;
          letter-spacing: 0.02em;
          transition: all .2s ease;
        }
        .mu-cta-outline:hover { background: rgba(251,243,234,0.08); border-color: rgba(251,243,234,0.55); }
        .mu-input:focus { border-color: rgba(196,98,58,0.55) !important; box-shadow: 0 0 0 3px rgba(196,98,58,0.16) !important; }
        .mu-input::placeholder { color: rgba(107,74,45,0.45); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* un-heatable areas table — mobile-only visible field labels
           (aria-hidden; each input already carries its own aria-label, so
           screen-reader behaviour is unchanged) and a stacked row layout
           below the point the 5-column grid gets too tight to use. */
        .mu-field-label { display: none; }
        @media (max-width: 640px) {
          .mu-table-head { display: none !important; }
          .mu-table-row {
            grid-template-columns: 1fr 1fr !important;
            row-gap: 12px;
            padding: 14px !important;
            border-radius: 14px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
          }
          .mu-field-name { grid-column: 1 / -1; }
          .mu-field-label {
            display: block; font-family: var(--font-body); font-size: 10px; font-weight: 700;
            letter-spacing: 0.08em; text-transform: uppercase; color: #C4623A; margin-bottom: 5px;
          }
          .mu-field-remove { display: flex; align-items: flex-end; justify-content: flex-end; }
        }

        .mu-step-card { transition: box-shadow .25s ease; }
        .mu-step-card:hover { box-shadow: 0 28px 70px rgba(0,0,0,0.5), 0 0 40px -12px rgba(232,147,58,0.35); }
        .mu-step-card img { transition: transform .4s ease; }
        .mu-step-card:hover img { transform: scale(1.05); }

        /* connecting thread across the 3-step guide, so the cards read as a
           sequence: a numbered badge on each card, plus a hairline rail
           joining them on desktop and a short vertical link on mobile. */
        .mu-steps-wrap { position: relative; }
        .mu-steps-rail { display: none; }
        .mu-step-num {
          position: absolute; top: -18px; left: 24px; z-index: 2;
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-heading); font-weight: 700; font-size: 15px;
          color: #FBF3EA;
          background: linear-gradient(135deg, #C4623A, #E88C2A);
          border: 2px solid #150d07;
          box-shadow: 0 8px 20px rgba(196,98,58,0.4);
        }
        /* the vertical link only makes sense once the grid is truly a
           single stacked column (auto-fit collapses to 1 col below ~640px);
           the horizontal rail only makes sense once all 3 cards share one
           row (needs ~940px so 3x minmax(280px) + gaps actually fit) — in
           between, neither is shown rather than risk a line that floats
           disconnected from a wrapped card. */
        @media (max-width: 640px) {
          .mu-steps-grid .mu-step-card:not(:last-child)::after {
            content: ""; position: absolute; left: 50%; bottom: -24px; transform: translateX(-50%);
            width: 2px; height: 24px;
            background: linear-gradient(180deg, rgba(232,147,58,0.5), rgba(255,126,95,0.1));
          }
        }
        @media (min-width: 940px) {
          .mu-steps-rail {
            display: block; position: absolute; left: 8%; right: 8%; top: 20px; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(196,98,58,0.35), rgba(232,140,42,0.35), transparent);
            z-index: 0;
          }
        }

        /* three-orb drift + noise + vignette, same DNA as the rest of the site */
        @keyframes mu-drift { 0%{transform:translate3d(-5%,-3%,0) scale(1)} 33%{transform:translate3d(5%,4%,0) scale(1.08)} 66%{transform:translate3d(-3%,6%,0) scale(.95)} 100%{transform:translate3d(-5%,-3%,0) scale(1)} }
        @keyframes mu-drift2 { 0%{transform:translate3d(4%,2%,0) scale(1.05)} 50%{transform:translate3d(-5%,-4%,0) scale(.94)} 100%{transform:translate3d(4%,2%,0) scale(1.05)} }
        .mu-noise::before {
          content:''; position:absolute; inset:0; pointer-events:none; z-index:0; opacity:.035;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .mu-vignette {
          position:absolute; inset:0; z-index:0; pointer-events:none;
          background: radial-gradient(120% 120% at 50% 30%, transparent 55%, rgba(0,0,0,0.45) 100%);
        }
        .mu-aura { position:absolute; left:0; right:0; top:0; height:1000px; z-index:0; pointer-events:none; filter: blur(14px); overflow:hidden; }
        .mu-orb { position:absolute; border-radius:50%; }
        .mu-orb-1 { top:-8%; left:2%; width:32vw; height:32vw; max-width:440px; max-height:440px; background: radial-gradient(circle, rgba(232,147,58,0.16), transparent 62%); animation: mu-drift 26s ease-in-out infinite; }
        .mu-orb-2 { top:4%; right:-4%; width:28vw; height:28vw; max-width:380px; max-height:380px; background: radial-gradient(circle, rgba(255,126,95,0.11), transparent 62%); animation: mu-drift2 31s ease-in-out infinite; }
        .mu-orb-3 { bottom:-8%; left:36%; width:24vw; height:24vw; max-width:320px; max-height:320px; background: radial-gradient(circle, rgba(127,192,232,0.07), transparent 64%); animation: mu-drift 33s ease-in-out infinite reverse; }

        /* ── 1.1 hero (image + scrim overlay) ── */
        .mu-hero {
          position: relative;
          z-index: 1;
          width: 100%;
          min-height: clamp(380px, 46vw, 480px);
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .mu-hero-plate { position: absolute; inset: 0; z-index: 0; }
        .mu-hero-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(13,8,5,0.18) 0%, rgba(13,8,5,0.58) 58%, rgba(13,8,5,0.94) 100%);
        }
        .mu-hero-inner {
          position: relative; z-index: 2; width: 100%;
          max-width: 900px; margin: 0 auto;
          padding: 132px 24px 36px;
          text-align: center;
        }
        .mu-hero-title {
          font-family: ${FONT_HEADING};
          font-size: clamp(1.875rem, 4vw, 2.75rem);
          font-weight: 700;
          color: ${COLOR_TEXT};
          line-height: 1.15;
          margin: 16px auto 14px;
          max-width: 760px;
          letter-spacing: -0.01em;
        }
        .mu-hero-lede {
          font-family: ${FONT_BODY};
          font-size: 15.5px;
          color: rgba(251,243,234,0.78);
          line-height: 1.7;
          max-width: 640px;
          margin: 0 auto;
          font-weight: 500;
        }
        .mu-trust-row {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 10px; margin-top: 22px;
        }
        .mu-badge-chip {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 14px 7px 7px; border-radius: 999px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          text-align: left;
        }
        .mu-badge-icon {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(196,98,58,0.35), rgba(232,140,42,0.35));
          color: #FBF3EA;
        }
        .mu-badge-title { display: block; font-family: var(--font-body); font-size: 11px; font-weight: 700; color: #FBF3EA; line-height: 1.25; }
        .mu-badge-sub { display: block; font-family: var(--font-body); font-size: 10px; color: rgba(251,243,234,0.62); line-height: 1.25; }

        @media (max-width: 640px) {
          .mu-hero-inner { padding-top: 124px; padding-bottom: 28px; }
          .mu-trust-row { justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mu-orb-1, .mu-orb-2, .mu-orb-3 { animation: none !important; }
        }
      `}</style>

      <main
        className="mu-noise"
        style={{
          backgroundImage: COLOR_BG_SOFT,
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* three-orb drift, subtle here since this is a utility/calculator page */}
        <div aria-hidden className="mu-aura">
          <span className="mu-orb mu-orb-1" />
          <span className="mu-orb mu-orb-2" />
          <span className="mu-orb mu-orb-3" />
        </div>
        <div aria-hidden className="mu-vignette" />

        {/* ────────────────────────────────────────────────────────── */}
        {/* 1.1 HERO BANNER — image + scrim overlay carrying the merged
             pill/heading/lede (previously a separate section below it).
             Kept to a confident banner height, not full-viewport, since
             this is a utility/calculator page rather than a landing page. */}
        {/* ────────────────────────────────────────────────────────── */}
        <section className="mu-hero" aria-label="How to measure up for underfloor heating">
          <div className="mu-hero-plate">
            <Image
              src="/images/measure.png"
              alt="Cozy warm underfloor heating room"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="mu-hero-scrim" aria-hidden="true" />

          <div className="mu-hero-inner">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Pill>How to measure up</Pill>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
              className="mu-hero-title"
            >
              How to measure up for Underfloor Heating
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
              className="mu-hero-lede"
            >
              Measuring for underfloor heating within you property is an easy task to complete. You'll need to gain your available heated area following these 3 easy steps.
            </motion.p>

            <motion.div
              className="mu-trust-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.36 }}
            >
              {TRUST_BADGES.map(({ Icon, title, sub }) => (
                <div className="mu-badge-chip" key={title}>
                  <span className="mu-badge-icon" aria-hidden="true">
                    <Icon style={{ width: 16, height: 16 }} />
                  </span>
                  <span>
                    <span className="mu-badge-title">{title}</span>
                    <span className="mu-badge-sub">{sub}</span>
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 1.3 THREE-STEP GUIDE */}
        {/* ────────────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "56px 24px 24px",
          }}
        >
          <div className="mu-steps-wrap">
            <div className="mu-steps-rail" aria-hidden="true" />
            <motion.div
              variants={gridContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="mu-steps-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {STEPS.map((s, i) => (
                <motion.div
                  key={i}
                  variants={gridCard}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE } }}
                  className="mu-step-card"
                  style={{
                    ...glassCard,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span className="mu-step-num" aria-hidden="true">{i + 1}</span>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      borderRadius: "22px 22px 0 0",
                    }}
                  >
                    <Image
                      src={s.img}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div style={{ padding: "24px 24px 28px" }}>
                    <Pill color={COLOR_ACCENT}>{s.n}</Pill>
                    <h3
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLOR_TEXT,
                      margin: "14px 0 10px",
                      lineHeight: 1.2,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 14,
                      color: COLOR_BODY,
                      lineHeight: 1.7,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {s.body}
                  </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 1.4 HEATABLE AREA CALCULATOR */}
        {/* ────────────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 32,
            background: COLOR_BG_GREY,
            borderTop: "1px solid rgba(232,140,42,0.14)",
            borderBottom: "1px solid rgba(232,140,42,0.14)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading sub="Find the perfect system size in seconds. Enter your room dimensions, deduct any fixed furniture, and we calculate the heatable area for you.">
              Heatable Area Calculator
            </SectionHeading>

            <motion.div
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{
                ...glassCard,
                padding: "clamp(24px, 5vw, 40px) clamp(18px, 5vw, 36px)",
                borderRadius: 28,
              }}
            >
              {/* ── SUBSECTION A: ROOM ── */}
              <div style={{ marginBottom: 36 }}>
                <motion.h3
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  1. Measure your room
                </motion.h3>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    color: COLOR_BODY,
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                  }}
                >
                  Enter the length and width of the full room, wall to wall.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="room-width">
                      Room Width (m)<span style={{ color: "#C4623A" }}>*</span>
                    </label>
                    <input
                      id="room-width"
                      className="mu-input"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g. 4.5"
                      value={roomWidth}
                      onChange={(e) => setRoomWidth(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="room-length">
                      Room Length (m)<span style={{ color: "#C4623A" }}>*</span>
                    </label>
                    <input
                      id="room-length"
                      className="mu-input"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g. 6.0"
                      value={roomLength}
                      onChange={(e) => setRoomLength(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Room Total (m²)</label>
                    <input
                      type="text"
                      readOnly
                      value={roomTotal > 0 ? roomTotal.toFixed(2) : "0.00"}
                      aria-label="Room total area in square metres"
                      style={readOnlyStyle}
                    />
                  </div>
                </div>
              </div>

              <MuDivider margin="8px 0 36px" />

              {/* ── SUBSECTION B: WINDOW INFORMATION (planning only) ── */}
              <div style={{ marginBottom: 36 }}>
                <motion.h3
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  2. Window Information
                </motion.h3>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    color: COLOR_BODY,
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                  }}
                >
                  Measure from the bottom edge of the window down to the
                  finished floor level. This helps our installation team
                  assess your electric hamam installation requirements.
                </p>

                {/* Luxury informational card */}
                <div
                  style={{
                    ...glassCard,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 55%, rgba(232,140,42,0.08) 100%), rgba(20,13,8,0.5)",
                    borderRadius: 18,
                    padding: "20px 22px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background:
                        "linear-gradient(135deg, rgba(196,98,58,0.18), rgba(232,140,42,0.22))",
                      border: "1px solid rgba(196,98,58,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 6px 18px rgba(196,98,58,0.15)",
                      color: COLOR_ACCENT,
                    }}
                  >
                    <RulerIcon style={{ width: 22, height: 22 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: FONT_HEADING,
                        fontSize: 17,
                        fontWeight: 700,
                        color: COLOR_TEXT,
                        lineHeight: 1.25,
                        margin: "0 0 6px",
                      }}
                    >
                      Why We Need This Measurement
                    </div>
                    <p
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        color: COLOR_BODY,
                        lineHeight: 1.65,
                        margin: 0,
                        fontWeight: 500,
                      }}
                    >
                      The window sill height helps us understand room layout
                      constraints and installation conditions, ensuring your
                      electric hamam system is correctly specified.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  <div>
                    <label style={labelStyle} htmlFor="window-sill-height">
                      Window Sill Height (mm)
                    </label>
                    <input
                      id="window-sill-height"
                      className="mu-input"
                      type="number"
                      step="1"
                      min="0"
                      inputMode="numeric"
                      placeholder="e.g. 900"
                      value={windowSillHeight}
                      onChange={(e) => {
                        const v = e.target.value;
                        // Reject negative values; allow empty for optional state.
                        if (v === "" || parseFloat(v) >= 0) {
                          setWindowSillHeight(v);
                        }
                      }}
                      style={inputStyle}
                      aria-describedby="window-sill-height-helper"
                    />
                    <p
                      id="window-sill-height-helper"
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 12,
                        color: COLOR_BODY,
                        margin: "8px 0 0",
                        lineHeight: 1.5,
                        opacity: 0.85,
                      }}
                    >
                      Measure from the bottom edge of the window to the
                      finished floor. Optional, leave blank if not
                      applicable.
                    </p>
                  </div>
                </div>
              </div>

              <MuDivider margin="8px 0 36px" />

              {/* ── SUBSECTION C: UN-HEATABLE AREAS ── */}
              <div style={{ marginBottom: 32 }}>
                <motion.h3
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  3. Measure your un-heatable areas
                </motion.h3>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    color: COLOR_BODY,
                    lineHeight: 1.6,
                    margin: "0 0 20px",
                  }}
                >
                  Under floor heating cannot be laid under fixed furniture or
                  appliances without an installation underneath. Please add each
                  applicable area.
                </p>

                {/* table header (desktop) */}
                <div
                  className="mu-table-head"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  {["Area Name", "Width (m)", "Length (m)", "Total (m²)", ""].map(
                    (h, i) => (
                      <div
                        key={i}
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: COLOR_ACCENT,
                        }}
                      >
                        {h}
                      </div>
                    )
                  )}
                </div>

                {/* rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <AnimatePresence initial={false}>
                    {areas.map((a) => {
                      const rowTotal =
                        (parseFloat(a.width) || 0) * (parseFloat(a.length) || 0);
                      return (
                        <motion.div
                          key={a.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="mu-table-row"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
                              gap: 12,
                              alignItems: "center",
                              paddingTop: 2,
                              paddingBottom: 2,
                            }}
                          >
                            <div className="mu-field mu-field-name">
                              <span className="mu-field-label" aria-hidden="true">Area Name</span>
                              <input
                                className="mu-input"
                                type="text"
                                placeholder="e.g. Kitchen unit"
                                value={a.name}
                                onChange={(e) =>
                                  updateArea(a.id, "name", e.target.value)
                                }
                                style={inputStyle}
                                aria-label="Area name"
                              />
                            </div>
                            <div className="mu-field mu-field-width">
                              <span className="mu-field-label" aria-hidden="true">Width (m)</span>
                              <input
                                className="mu-input"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0.0"
                                value={a.width}
                                onChange={(e) =>
                                  updateArea(a.id, "width", e.target.value)
                                }
                                style={inputStyle}
                                aria-label="Area width in metres"
                              />
                            </div>
                            <div className="mu-field mu-field-length">
                              <span className="mu-field-label" aria-hidden="true">Length (m)</span>
                              <input
                                className="mu-input"
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="0.0"
                                value={a.length}
                                onChange={(e) =>
                                  updateArea(a.id, "length", e.target.value)
                                }
                                style={inputStyle}
                                aria-label="Area length in metres"
                              />
                            </div>
                            <div className="mu-field mu-field-total">
                              <span className="mu-field-label" aria-hidden="true">Total (m²)</span>
                              <input
                                type="text"
                                readOnly
                                value={rowTotal > 0 ? rowTotal.toFixed(2) : "0.00"}
                                style={{ ...readOnlyStyle, fontSize: 15 }}
                                aria-label="Row total in square metres"
                              />
                            </div>
                            <div className="mu-field-remove">
                              <button
                                type="button"
                                onClick={() => removeArea(a.id)}
                                disabled={areas.length === 1}
                                aria-label="Remove area"
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 10,
                                  background:
                                    areas.length === 1
                                      ? "rgba(196,98,58,0.05)"
                                      : "rgba(196,98,58,0.10)",
                                  color:
                                    areas.length === 1
                                      ? "rgba(196,98,58,0.4)"
                                      : COLOR_ACCENT,
                                  border: "1px solid rgba(196,98,58,0.20)",
                                  cursor:
                                    areas.length === 1 ? "not-allowed" : "pointer",
                                  fontSize: 16,
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={addArea}
                  className="mu-cta-outline"
                  style={{ marginTop: 18, fontSize: 13, padding: "10px 22px" }}
                >
                  + Add area
                </button>

                {roomTotal > 0 && unheatable > 0 && (
                  <div style={{
                    marginTop: 16,
                    padding: "14px 18px",
                    borderRadius: 14,
                    background: isBelowMinimum
                      ? "rgba(220, 60, 40, 0.14)"
                      : "rgba(60, 160, 80, 0.14)",
                    border: `1.5px solid ${isBelowMinimum
                      ? "rgba(220, 60, 40, 0.40)"
                      : "rgba(60, 160, 80, 0.40)"}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}>
                    <span
                      style={{
                        flexShrink: 0,
                        color: isBelowMinimum ? "#FF6B5B" : "#4ADE80",
                        display: "flex",
                      }}
                    >
                      {isBelowMinimum ? (
                        <WarningIcon style={{ width: 20, height: 20 }} />
                      ) : (
                        <CheckIcon style={{ width: 20, height: 20 }} />
                      )}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        fontWeight: 700,
                        color: isBelowMinimum ? "#FF6B5B" : "#4ADE80",
                        marginBottom: 4,
                      }}>
                        {isBelowMinimum
                          ? `Heatable area is ${heatablePercentage.toFixed(0)}%, minimum is 80%`
                          : `Heatable area is ${heatablePercentage.toFixed(0)}% ✓`
                        }
                      </div>
                      {isBelowMinimum && (
                        <div style={{
                          fontFamily: FONT_BODY,
                          fontSize: 12,
                          color: COLOR_BODY,
                          lineHeight: 1.6,
                        }}>
                          We install underfloor heating on a minimum of 80% of the floor area.
                          Please reduce your un-heatable areas or contact us to discuss your project.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <MuDivider margin="8px 0 28px" />

              {/* ── CALCULATE ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <button
                  type="button"
                  onClick={handleCalculate}
                  disabled={!hasRoomDims || isBelowMinimum}
                  className="mu-cta-primary"
                  title={isBelowMinimum
                    ? "Heatable area must be at least 80% of the room"
                    : ""}
                >
                  Calculate heatable area
                </button>

                {!hasRoomDims && (
                  <p
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 12,
                      color: COLOR_BODY,
                      margin: 0,
                      opacity: 0.75,
                    }}
                  >
                    Enter your room width and length to enable the calculator.
                  </p>
                )}

                {showResult && hasRoomDims && (
                  <motion.div
                    id="calculator-result"
                    initial={{ opacity: 0, y: 20, scale: 0.97, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    style={{
                      width: "100%",
                      marginTop: 8,
                      background:
                        "linear-gradient(135deg, rgba(196,98,58,0.10), rgba(232,140,42,0.10)), rgba(20,13,8,0.4)",
                      border: "1.5px solid rgba(196,98,58,0.25)",
                      borderRadius: 20,
                      padding: "28px 24px",
                      textAlign: "center",
                    }}
                  >
                    {/* ── MEASUREMENT SUMMARY — kept as a lighter "receipt"
                         surface (like the inputs) for legibility of the
                         dl/dt/dd rows, rather than dark-glass chrome ── */}
                    <div
                      style={{
                        ...glassCard,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,244,232,0.92))",
                        border: "1px solid rgba(196,98,58,0.22)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                        borderRadius: 18,
                        padding: "22px 22px 18px",
                        marginBottom: 24,
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: COLOR_ACCENT,
                          marginBottom: 14,
                          textAlign: "center",
                        }}
                      >
                        Measurement Summary
                      </div>
                      <dl
                        style={{
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 11,
                        }}
                      >
                        {[
                          {
                            label: "Room Width",
                            value: `${(parseFloat(roomWidth) || 0).toFixed(2)}m`,
                          },
                          {
                            label: "Room Length",
                            value: `${(parseFloat(roomLength) || 0).toFixed(2)}m`,
                          },
                          {
                            label: "Room Area",
                            value: `${roomTotal.toFixed(2)}m²`,
                          },
                          ...(hasWindowSillHeight
                            ? [
                                {
                                  label: "Window Sill Height",
                                  value: `${windowSillHeightNum.toFixed(0)}mm`,
                                },
                              ]
                            : []),
                          {
                            label: "Un-Heatable Areas",
                            value: `${unheatable.toFixed(2)}m²`,
                          },
                          {
                            label: "Net Area",
                            value: `${netArea.toFixed(2)}m²`,
                          },
                          {
                            label: "Final Heatable Area",
                            value: `${heatableArea}m²`,
                            emphasis: true,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 10,
                              padding: row.emphasis ? "10px 12px" : "0 0 9px",
                              margin: row.emphasis ? "5px -12px -4px" : 0,
                              borderRadius: row.emphasis ? 12 : 0,
                              background: row.emphasis
                                ? "linear-gradient(135deg, rgba(196,98,58,0.09), rgba(232,140,42,0.13))"
                                : "transparent",
                              borderTop: row.emphasis
                                ? "1px solid rgba(196,98,58,0.22)"
                                : "none",
                              borderBottom: row.emphasis
                                ? "none"
                                : "1px dashed rgba(196,98,58,0.16)",
                            }}
                          >
                            <dt
                              style={{
                                fontFamily: FONT_BODY,
                                fontSize: 13,
                                color: row.emphasis ? COLOR_RECEIPT_TEXT : COLOR_RECEIPT_BODY,
                                fontWeight: row.emphasis ? 700 : 500,
                                flexShrink: 0,
                              }}
                            >
                              {row.label}
                            </dt>
                            <span
                              aria-hidden
                              style={{
                                flex: 1,
                                borderBottom:
                                  "1px dotted rgba(107,74,45,0.30)",
                                transform: "translateY(-3px)",
                              }}
                            />
                            <dd
                              style={{
                                margin: 0,
                                fontFamily: row.emphasis
                                  ? FONT_HEADING
                                  : FONT_BODY,
                                fontSize: row.emphasis ? 18 : 14,
                                fontWeight: row.emphasis ? 700 : 600,
                                color: row.emphasis
                                  ? COLOR_ACCENT
                                  : COLOR_RECEIPT_TEXT,
                                flexShrink: 0,
                                fontVariantNumeric: "tabular-nums",
                              }}
                            >
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: COLOR_ACCENT_2,
                        marginBottom: 8,
                      }}
                    >
                      Your Heatable Area
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_HEADING,
                        fontSize: "clamp(2.5rem, 6vw, 4rem)",
                        fontWeight: 800,
                        color: COLOR_ACCENT_2,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {parseFloat(heatableArea) > 0
                        ? `${heatableArea} m²`
                        : "0.00 m²"}
                    </div>
                    <p
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        color: COLOR_BODY,
                        margin: 0,
                        lineHeight: 1.6,
                        maxWidth: 540,
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      This includes a <strong>10% reduction</strong> to
                      accommodate the long end of the heating mat to sit at the
                      edge of the heating area.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 1.5 THINGS TO CONSIDER */}
        {/* ────────────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: "80px 24px",
          }}
        >
          <SectionHeading sub="Different systems, different considerations. Here's a quick overview to help you choose the right one for your project.">
            Things to consider
          </SectionHeading>

          <motion.div
            variants={gridContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {/* Card A, Electric */}
            <motion.article
              variants={gridCard}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE } }}
              className="mu-step-card"
              style={{
                ...glassCard,
                borderRadius: 24,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 220,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/e.png"
                  alt="Electric underfloor heating cables close-up"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "26px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                <Pill color={COLOR_ACCENT_2}>Electric</Pill>
                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "12px 0 14px",
                    lineHeight: 1.2,
                  }}
                >
                  Electric Underfloor Heating
                </h3>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: COLOR_BODY,
                    lineHeight: 1.7,
                    margin: "0 0 14px",
                    fontWeight: 500,
                  }}
                >
                  When purchasing your mat system, you'll reduce this heatable area by 10% to allow for a 50mm to 100mm perimeter around the room, along with an allowance to space matting so it doesn't overlap.
                </p>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: COLOR_BODY,
                    lineHeight: 1.7,
                    margin: "0 0 14px",
                    fontWeight: 500,
                  }}
                >
                  For areas that are awkward in shape such as bathrooms a loose cable is suggested, this will maximise the heating area, provide an easy install solution and a more efficient and even heat.
                </p>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: COLOR_BODY,
                    lineHeight: 1.7,
                    margin: "0 0 24px",
                    fontWeight: 500,
                  }}
                >
                  The underfloor heating element cannot be shortened in length as this will invalidate your lifetime warranty so ordering the correct size system is essential.
                </p>
                <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <Link
                    href="/electric-underfloor-heating"
                    className="mu-cta-primary"
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    Shop Electric Underfloor Heating →
                  </Link>
                </div>
              </div>
            </motion.article>

            {/* Card B, Water/Wet */}
            <motion.article
              variants={gridCard}
              whileHover={{ y: -6, transition: { duration: 0.25, ease: EASE } }}
              className="mu-step-card"
              style={{
                ...glassCard,
                borderRadius: 24,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 220,
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/p1.png"
                  alt="Water underfloor heating pipes laid in a serpentine pattern"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "26px 28px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
                <Pill color={COLOR_ACCENT}>Water / Wet</Pill>
                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "12px 0 14px",
                    lineHeight: 1.2,
                  }}
                >
                  Water (Wet) Underfloor Heating
                </h3>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: COLOR_BODY,
                    lineHeight: 1.7,
                    margin: "0 0 14px",
                    fontWeight: 500,
                  }}
                >
                  Wet systems circulate warm water through pipework connected to a manifold, so your heatable area also needs to account for pipe centres and the manifold's own footprint within the room.
                </p>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: COLOR_BODY,
                    lineHeight: 1.7,
                    margin: "0 0 14px",
                    fontWeight: 500,
                  }}
                >
                  Because pipework is typically set into a screed or low-profile board, water systems suit new builds and larger renovations best, where floor build-up height can be planned in from the start.
                </p>
                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 14,
                    color: COLOR_BODY,
                    lineHeight: 1.7,
                    margin: "0 0 24px",
                    fontWeight: 500,
                  }}
                >
                  Pipe runs are continuous per zone and can't be shortened on site, so accurate room measurements up front are essential to specifying the correct manifold and pipe lengths.
                </p>
                <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <Link
                    href="/contact"
                    className="mu-cta-primary"
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    Talk to Us About Water Systems →
                  </Link>
                </div>
              </div>
            </motion.article>

          </motion.div>
        </section>
      </main>
    </>
  );
}
