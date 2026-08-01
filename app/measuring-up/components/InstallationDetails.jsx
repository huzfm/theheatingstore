"use client";

import { C } from "@/components/sections/WhyChooseUs/theme";
import { labelStyle, inputStyle, helperTextStyle } from "./formStyles";

function RulerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2.5" y="13.5" width="19" height="8" rx="1.6" transform="rotate(-45 12 17.5)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.7 13.7l1.4 1.4M10.6 10.8l1.4 1.4M13.5 7.9l1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function InstallationDetails({ windowSillHeight, setWindowSillHeight }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: C.amberLt,
          }}
        >
          STEP 03 &middot; OPTIONAL
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 600,
          color: C.text,
          margin: "0 0 6px",
        }}
      >
        Installation detail
      </h3>
      <p style={{ fontSize: 13, color: C.soft, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 560 }}>
        Window sill height helps our installation team assess layout
        constraints. It isn't used in the area calculation below.
      </p>

      <div
        className="mu-glass"
        style={{
          padding: "18px 20px",
          borderRadius: 16,
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "linear-gradient(135deg, rgba(196,98,58,0.18), rgba(232,140,42,0.2))",
            border: "1px solid rgba(196,98,58,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.amberLt,
          }}
        >
          <RulerIcon style={{ width: 20, height: 20 }} />
        </div>
        <p style={{ fontSize: 13, color: C.soft, lineHeight: 1.65, margin: 0 }}>
          Measure from the bottom edge of the window down to the finished
          floor level.
        </p>
      </div>

      <div style={{ maxWidth: 260 }}>
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
            if (v === "" || parseFloat(v) >= 0) setWindowSillHeight(v);
          }}
          style={inputStyle}
          aria-describedby="window-sill-height-helper"
        />
        <p id="window-sill-height-helper" style={helperTextStyle}>
          Optional — leave blank if not applicable.
        </p>
      </div>
    </div>
  );
}
