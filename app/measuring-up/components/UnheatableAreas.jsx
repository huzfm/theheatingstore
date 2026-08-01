"use client";

import { motion, AnimatePresence } from "framer-motion";
import { C, EASE } from "@/components/sections/WhyChooseUs/theme";
import { inputStyle, readOnlyStyle } from "./formStyles";

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

export default function UnheatableAreas({
  areas,
  addArea,
  removeArea,
  updateArea,
  roomTotal,
  unheatable,
  isBelowMinimum,
  heatablePercentage,
}) {
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
          STEP 02
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
        Non-heatable areas
      </h3>
      <p style={{ fontSize: 13, color: C.soft, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 560 }}>
        Enter fixed areas where heating cannot be installed, such as
        built-in units, kitchen cabinets, bathroom suites or other
        permanent fixtures.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <AnimatePresence initial={false}>
          {areas.map((a, i) => {
            const rowTotal = (parseFloat(a.width) || 0) * (parseFloat(a.length) || 0);
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
                  className="mu-area-row-grid"
                  style={{
                    padding: "12px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="mu-field-badge"
                    aria-hidden="true"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.amberLt,
                      background: "rgba(232,147,58,0.1)",
                      border: "1px solid rgba(232,147,58,0.25)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="mu-field-name">
                    <span className="mu-field-label" aria-hidden="true">Area Name</span>
                    <input
                      className="mu-input"
                      type="text"
                      placeholder="e.g. Kitchen island"
                      value={a.name}
                      onChange={(e) => updateArea(a.id, "name", e.target.value)}
                      style={inputStyle}
                      aria-label={`Area ${i + 1} name`}
                    />
                  </div>
                  <div>
                    <span className="mu-field-label" aria-hidden="true">Width (m)</span>
                    <input
                      className="mu-input"
                      type="number"
                      step="0.1"
                      min="0"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={a.width}
                      onChange={(e) => updateArea(a.id, "width", e.target.value)}
                      style={inputStyle}
                      aria-label={`Area ${i + 1} width in metres`}
                    />
                  </div>
                  <div>
                    <span className="mu-field-label" aria-hidden="true">Length (m)</span>
                    <input
                      className="mu-input"
                      type="number"
                      step="0.1"
                      min="0"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={a.length}
                      onChange={(e) => updateArea(a.id, "length", e.target.value)}
                      style={inputStyle}
                      aria-label={`Area ${i + 1} length in metres`}
                    />
                  </div>
                  <div className="mu-field-total">
                    <span className="mu-field-label" aria-hidden="true">Total (m²)</span>
                    <input
                      type="text"
                      readOnly
                      value={rowTotal > 0 ? rowTotal.toFixed(2) : "0.00"}
                      style={{ ...readOnlyStyle, fontSize: 14 }}
                      aria-label={`Area ${i + 1} total in square metres`}
                    />
                  </div>
                  <div className="mu-field-remove">
                    <button
                      type="button"
                      onClick={() => removeArea(a.id)}
                      disabled={areas.length === 1}
                      aria-label={`Remove area ${i + 1}`}
                      className="mu-remove-btn"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: areas.length === 1 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                        color: areas.length === 1 ? "rgba(251,243,234,0.25)" : C.soft,
                        border: "1px solid rgba(255,255,255,0.1)",
                        cursor: areas.length === 1 ? "not-allowed" : "pointer",
                        fontSize: 15,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      &#10005;
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
        className="mu-btn-secondary"
        style={{
          marginTop: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 22px",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          color: C.text,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(245,185,122,0.3)",
          cursor: "pointer",
        }}
      >
        + Add another area
      </button>

      {roomTotal > 0 && unheatable > 0 && (
        <div
          style={{
            marginTop: 18,
            padding: "14px 18px",
            borderRadius: 14,
            background: isBelowMinimum ? "rgba(232,147,58,0.10)" : "rgba(74,222,128,0.08)",
            border: `1.5px solid ${isBelowMinimum ? "rgba(232,147,58,0.35)" : "rgba(74,222,128,0.3)"}`,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <span style={{ flexShrink: 0, color: isBelowMinimum ? C.amberLt : "#4ADE80", display: "flex" }}>
            {isBelowMinimum ? <WarningIcon style={{ width: 20, height: 20 }} /> : <CheckIcon style={{ width: 20, height: 20 }} />}
          </span>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isBelowMinimum ? C.amberLt : "#4ADE80",
                marginBottom: isBelowMinimum ? 4 : 0,
              }}
            >
              {isBelowMinimum
                ? `Available floor area is ${heatablePercentage.toFixed(0)}% — the recommended minimum is 80%`
                : `Available floor area is ${heatablePercentage.toFixed(0)}%`}
            </div>
            {isBelowMinimum && (
              <div style={{ fontSize: 12.5, color: C.soft, lineHeight: 1.6 }}>
                We install underfloor heating on a minimum of 80% of the
                floor area. Reduce your non-heatable areas, or contact us
                to talk through your project.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
