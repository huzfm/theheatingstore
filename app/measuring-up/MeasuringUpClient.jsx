"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ───────────────── DESIGN TOKENS (mirror app/AboutClient & SpaceVerification) ── */
const FONT_HEADING = "var(--font-heading)";
const FONT_BODY = "var(--font-body)";
const COLOR_TEXT = "#2C1810";
const COLOR_BODY = "#6B4A2D";
const COLOR_ACCENT = "#C4623A";
const COLOR_ACCENT_2 = "#E88C2A";
const COLOR_BG_SOFT = "linear-gradient(180deg, #FFFFFF 0%, #FFF4E8 45%, #FFE8D0 100%)";
const COLOR_BG_GREY = "#F5EFE8";

/* ───────────────── GLASS CARD BASE ────────────────────────────────────────── */
const glassCard = {
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  border: "1px solid rgba(255,255,255,0.55)",
  borderRadius: 22,
  boxShadow: "0 8px 32px rgba(60,42,37,0.07)",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.85)",
  border: "1.5px solid rgba(196,98,58,0.20)",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  color: COLOR_TEXT,
  fontFamily: FONT_BODY,
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
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
  background: "linear-gradient(135deg, rgba(196,98,58,0.08), rgba(232,140,42,0.08))",
  border: "1.5px solid rgba(196,98,58,0.30)",
  color: COLOR_ACCENT,
  fontWeight: 600,
  fontFamily: FONT_HEADING,
  fontSize: 18,
  textAlign: "center",
};

/* ───────────────── TRUST BADGES (hero) ────────────────────────────────────── */
// const TRUST_BADGES = [
//   { icon: "🛡️", title: "Lifetime Warranty", sub: "On electric & water systems" },
//   { icon: "🚚", title: "Next Day Delivery", sub: "On all orders" },
//   { icon: "💰", title: "Price Smash Promise", sub: "If its cheaper, its free" },
//   { icon: "🔄", title: "60 Day Money Back", sub: "Guarantee" },
// ];

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
          color: #2C1810; border: 1.5px solid rgba(44,24,16,0.30);
          font-family: var(--font-body); font-size: 15px; font-weight: 600;
          letter-spacing: 0.02em;
          transition: all .2s ease;
        }
        .mu-cta-outline:hover { background: rgba(44,24,16,0.05); border-color: rgba(44,24,16,0.55); }
        .mu-input:focus { border-color: rgba(196,98,58,0.55) !important; box-shadow: 0 0 0 3px rgba(196,98,58,0.12) !important; }
        .mu-input::placeholder { color: rgba(107,74,45,0.45); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .mu-step-card { transition: transform .25s ease, box-shadow .25s ease; }
        .mu-step-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(60,42,37,0.12); }
        .mu-step-card img { transition: transform .4s ease; }
        .mu-step-card:hover img { transform: scale(1.05); }
        .mu-result-fade { animation: muFadeIn .35s ease-out; }
        @keyframes muFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .mu-hero-grid { grid-template-columns: 1fr !important; }
          .mu-trust-row { justify-content: flex-start !important; }
        }
      `}</style>

      <main
        style={{
          backgroundImage: COLOR_BG_SOFT,
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* warm radial glow, same DNA as AboutPage */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(60% 35% at 50% 0%, rgba(245,185,122,0.35), transparent 70%)",
          }}
        />

        {/* ────────────────────────────────────────────────────────── */}
        {/* 1.1 HERO BANNER */}
        {/* ────────────────────────────────────────────────────────── */}
   <section
  style={{
    position: "relative",
    width: "100%",
    minHeight: 280,
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  }}
>
  <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
    <Image
      src="/images/measure.png"
      alt="Cozy warm underfloor heating room"
      fill
      priority
      sizes="100vw"
      style={{ objectFit: "cover" }}
    />
  </div>
</section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 1.2 INTRO SECTION */}
        {/* ────────────────────────────────────────────────────────── */}
        <section
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "72px 24px 24px",
            textAlign: "center",
          }}
        >
          <Pill>How to measure up</Pill>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: COLOR_TEXT,
              lineHeight: 1.15,
              margin: "16px auto 18px",
              maxWidth: 760,
              letterSpacing: "-0.01em",
            }}
          >
            How to measure up for Underfloor Heating
          </h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 16,
              color: COLOR_BODY,
              lineHeight: 1.75,
              maxWidth: 720,
              margin: "0 auto",
              fontWeight: 500,
            }}
          >
           Measuring for underfloor heating within you property is an easy task to complete. You'll need to gain your available heated area following these 3 easy steps.
          </p>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="mu-step-card"
                style={{
                  ...glassCard,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 200,
                    overflow: "hidden",
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
              </div>
            ))}
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
            borderTop: "1px solid rgba(196,98,58,0.08)",
            borderBottom: "1px solid rgba(196,98,58,0.08)",
            padding: "72px 24px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeading sub="Find the perfect system size in seconds. Enter your room dimensions, deduct any fixed furniture, and we calculate the heatable area for you.">
              Heatable Area Calculator
            </SectionHeading>

            <div
              style={{
                ...glassCard,
                padding: "40px 36px",
                borderRadius: 28,
              }}
            >
              {/* ── SUBSECTION A: ROOM ── */}
              <div style={{ marginBottom: 36 }}>
                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  1. Measure your room
                </h3>
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

              {/* divider */}
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(196,98,58,0.25), transparent)",
                  margin: "8px 0 36px",
                }}
              />

              {/* ── SUBSECTION B: WINDOW INFORMATION (planning only) ── */}
              <div style={{ marginBottom: 36 }}>
                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  2. Window Information
                </h3>
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
                      "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,244,232,0.88) 55%, rgba(232,140,42,0.10) 100%)",
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
                      fontSize: 22,
                      boxShadow: "0 6px 18px rgba(196,98,58,0.15)",
                    }}
                  >
                    📏
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

              {/* divider */}
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(196,98,58,0.25), transparent)",
                  margin: "8px 0 36px",
                }}
              />

              {/* ── SUBSECTION C: UN-HEATABLE AREAS ── */}
              <div style={{ marginBottom: 32 }}>
                <h3
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLOR_TEXT,
                    margin: "0 0 6px",
                  }}
                >
                  3. Measure your un-heatable areas
                </h3>
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
                  {areas.map((a) => {
                    const rowTotal =
                      (parseFloat(a.width) || 0) * (parseFloat(a.length) || 0);
                    return (
                      <div
                        key={a.id}
                        className="mu-table-row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
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
                        <input
                          type="text"
                          readOnly
                          value={rowTotal > 0 ? rowTotal.toFixed(2) : "0.00"}
                          style={{ ...readOnlyStyle, fontSize: 15 }}
                          aria-label="Row total in square metres"
                        />
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
                    );
                  })}
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
                      ? "rgba(220, 60, 40, 0.08)"
                      : "rgba(60, 160, 80, 0.08)",
                    border: `1.5px solid ${isBelowMinimum
                      ? "rgba(220, 60, 40, 0.30)"
                      : "rgba(60, 160, 80, 0.30)"}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>
                      {isBelowMinimum ? "⚠️" : "✅"}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: FONT_BODY,
                        fontSize: 13,
                        fontWeight: 700,
                        color: isBelowMinimum ? "#C0392B" : "#27AE60",
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

              {/* divider */}
              <div
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(196,98,58,0.25), transparent)",
                  margin: "8px 0 28px",
                }}
              />

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
                  <div
                    id="calculator-result"
                    className="mu-result-fade"
                    style={{
                      width: "100%",
                      marginTop: 8,
                      background:
                        "linear-gradient(135deg, rgba(196,98,58,0.07), rgba(232,140,42,0.07))",
                      border: "1.5px solid rgba(196,98,58,0.20)",
                      borderRadius: 20,
                      padding: "28px 24px",
                      textAlign: "center",
                    }}
                  >
                    {/* ── MEASUREMENT SUMMARY ── */}
                    <div
                      style={{
                        ...glassCard,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,244,232,0.85))",
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
                          gap: 10,
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
                              paddingBottom: 8,
                              borderBottom: row.emphasis
                                ? "none"
                                : "1px dashed rgba(196,98,58,0.18)",
                            }}
                          >
                            <dt
                              style={{
                                fontFamily: FONT_BODY,
                                fontSize: 13,
                                color: row.emphasis ? COLOR_TEXT : COLOR_BODY,
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
                                  : COLOR_TEXT,
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
                        color: COLOR_TEXT,
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
                        color: "#8B6A5A",
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
                  </div>
                )}
              </div>
            </div>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
              alignItems: "stretch",
            }}
          >
            {/* Card A, Electric */}
            <article
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
                    margin: "0 0 12px",
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
                    margin: "0 0 12px",
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
                    margin: "0 0 22px",
                    fontWeight: 500,
                  }}
                >
                  The underfloor heating element cannot be shortened in length as this will invalidate your lifetime warranty so ordering the correct size system is essential.
                </p>
                <div style={{ marginTop: "auto" }}>
                  <Link
                    href="/electric-underfloor-heating"
                    className="mu-cta-primary"
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    Shop Electric Underfloor Heating →
                  </Link>
                </div>
              </div>
            </article>

          </div>
        </section>
      </main>
    </>
  );
}
