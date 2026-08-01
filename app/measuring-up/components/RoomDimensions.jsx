"use client";

import { useState } from "react";
import { C } from "@/components/sections/WhyChooseUs/theme";
import { labelStyle, inputStyle, readOnlyStyle, errorTextStyle } from "./formStyles";

function DimensionField({ id, label, value, onChange, touched, onBlur, placeholder }) {
  const numeric = parseFloat(value);
  const showError = touched && value !== "" && (Number.isNaN(numeric) || numeric <= 0);

  return (
    <div>
      <label style={labelStyle} htmlFor={id}>
        {label} (m)<span style={{ color: C.amber }}> *</span>
      </label>
      <input
        id={id}
        className={`mu-input${showError ? " mu-input-error" : ""}`}
        type="number"
        step="0.1"
        min="0"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={inputStyle}
        aria-required="true"
        aria-invalid={showError}
        aria-describedby={showError ? `${id}-error` : undefined}
      />
      {showError && (
        <p id={`${id}-error`} style={errorTextStyle} role="alert">
          Enter a value greater than 0m.
        </p>
      )}
    </div>
  );
}

export default function RoomDimensions({ roomWidth, setRoomWidth, roomLength, setRoomLength, roomTotal }) {
  const [touched, setTouched] = useState({ width: false, length: false });

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
          STEP 01
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
        Room dimensions
      </h3>
      <p style={{ fontSize: 13, color: C.soft, lineHeight: 1.6, margin: "0 0 20px" }}>
        Enter the length and width of the full room, wall to wall.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <DimensionField
          id="room-width"
          label="Room Width"
          placeholder="e.g. 4.5"
          value={roomWidth}
          onChange={setRoomWidth}
          touched={touched.width}
          onBlur={() => setTouched((t) => ({ ...t, width: true }))}
        />
        <DimensionField
          id="room-length"
          label="Room Length"
          placeholder="e.g. 6.0"
          value={roomLength}
          onChange={setRoomLength}
          touched={touched.length}
          onBlur={() => setTouched((t) => ({ ...t, length: true }))}
        />
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
  );
}
