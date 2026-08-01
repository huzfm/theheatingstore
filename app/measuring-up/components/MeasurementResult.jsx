"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { C, EASE } from "@/components/sections/WhyChooseUs/theme";

export default function MeasurementResult({
  hasRoomDims,
  isBelowMinimum,
  showResult,
  onCalculate,
  roomWidth,
  roomLength,
  roomTotal,
  unheatable,
  netArea,
  heatableArea,
  heatablePercentage,
  hasWindowSillHeight,
  windowSillHeightNum,
}) {
  return (
    <div className="mu-glass" style={{ padding: "22px 22px 24px", borderRadius: 20 }}>
      <button
        type="button"
        onClick={onCalculate}
        disabled={!hasRoomDims || isBelowMinimum}
        className="mu-btn-primary"
        title={isBelowMinimum ? "Available floor area must be at least 80% of the room" : ""}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "15px 24px",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(to right,#FF7E5F,#FFB88C)",
          color: "#fff",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          fontWeight: 600,
          boxShadow: "0 18px 45px rgba(255,126,95,0.32)",
        }}
      >
        Calculate heatable area
      </button>

      {!hasRoomDims && (
        <p style={{ fontSize: 12, color: C.mute, margin: "12px 0 0", textAlign: "center" }}>
          Enter your room width and length to enable the calculator.
        </p>
      )}

      {showResult && hasRoomDims && (
        <motion.div
          id="calculator-result"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            marginTop: 22,
            paddingTop: 22,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.amberLt,
              marginBottom: 8,
            }}
          >
            Your Heatable Area
          </div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
              fontWeight: 600,
              color: C.text,
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            {parseFloat(heatableArea) > 0 ? `${heatableArea} m²` : "0.00 m²"}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 6,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(232,147,58,0.1)",
              border: "1px solid rgba(232,147,58,0.28)",
              marginBottom: 22,
            }}
          >
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 600, color: C.amberLt }}>
              {heatablePercentage.toFixed(0)}%
            </span>
            <span style={{ fontSize: 11.5, color: C.soft }}>of room available for heating</span>
          </div>

          <dl
            style={{
              margin: "0 0 20px",
              display: "flex",
              flexDirection: "column",
              gap: 9,
              textAlign: "left",
            }}
          >
            {[
              { label: "Room Width", value: `${(parseFloat(roomWidth) || 0).toFixed(2)}m` },
              { label: "Room Length", value: `${(parseFloat(roomLength) || 0).toFixed(2)}m` },
              { label: "Room Area", value: `${roomTotal.toFixed(2)}m²` },
              ...(hasWindowSillHeight
                ? [{ label: "Window Sill Height", value: `${windowSillHeightNum.toFixed(0)}mm` }]
                : []),
              { label: "Non-Heatable Areas", value: `${unheatable.toFixed(2)}m²` },
              { label: "Net Area", value: `${netArea.toFixed(2)}m²` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <dt style={{ fontSize: 12.5, color: C.soft }}>{row.label}</dt>
                <dd style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text, fontVariantNumeric: "tabular-nums" }}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <p style={{ fontSize: 12, color: C.mute, lineHeight: 1.6, margin: "0 0 22px" }}>
            Includes a <strong style={{ color: C.soft }}>10% reduction</strong> to accommodate the long
            end of the heating mat sitting at the edge of the heated area.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href="/contact"
              className="mu-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "13px 24px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(to right,#FF7E5F,#FFB88C)",
                boxShadow: "0 16px 40px rgba(255,126,95,0.3)",
                textDecoration: "none",
              }}
            >
              Talk to an Expert
            </Link>
            <Link
              href="/product"
              className="mu-btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                color: C.text,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(245,185,122,0.3)",
                textDecoration: "none",
              }}
            >
              Explore Underfloor Heating
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
