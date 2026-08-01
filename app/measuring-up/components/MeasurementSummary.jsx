"use client";

import { C } from "@/components/sections/WhyChooseUs/theme";

const ROWS = (roomTotal, unheatable, netArea, heatableArea) => [
  { label: "Total Room", value: `${roomTotal.toFixed(2)}m²` },
  { label: "Fixed Areas", value: `${unheatable.toFixed(2)}m²` },
  { label: "Available", value: `${netArea.toFixed(2)}m²` },
  { label: "Heatable", value: `${heatableArea}m²`, emphasis: true },
];

export default function MeasurementSummary({ roomTotal, unheatable, netArea, heatableArea }) {
  const rows = ROWS(roomTotal, unheatable, netArea, heatableArea);

  return (
    <div className="mu-glass" style={{ padding: "20px 22px", borderRadius: 20 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: C.amberLt,
          marginBottom: 16,
        }}
      >
        Live Calculation
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {rows.map((r) => (
          <div key={r.label}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.mute, marginBottom: 4 }}>
              {r.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: r.emphasis ? 26 : 20,
                fontWeight: 600,
                color: r.emphasis ? C.amberLt : C.text,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
