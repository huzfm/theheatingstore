"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { EASE } from "@/components/sections/WhyChooseUs/theme";

function ArrowIcon(props) {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" {...props}>
      <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mu-cta-wrap">
        <button
          type="button"
          onClick={onCalculate}
          disabled={!hasRoomDims || isBelowMinimum}
          className="mu-cta"
          title={isBelowMinimum ? "Available floor area must be at least 80% of the room" : ""}
        >
          Calculate System Size
          <ArrowIcon style={{ width: 13, height: 13 }} />
        </button>

        {!hasRoomDims && <p className="mu-cta-hint">Enter your room width and length to enable the calculator.</p>}
      </div>

      <div className="mu-result-panel" id="calculator-result">
        {!(showResult && hasRoomDims) ? (
          <div className="mu-result-ready">
            <div className="mu-result-ready-title">System Assessment</div>
            <p className="mu-result-ready-sub">
              Complete your room dimensions and calculate to generate a
              heatable-area recommendation.
            </p>
          </div>
        ) : (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
          >
            <div className="mu-result-eyebrow">Your Heatable Area</div>
            <div className="mu-result-figure">{parseFloat(heatableArea) > 0 ? `${heatableArea} m²` : "0.00 m²"}</div>

            <div className="mu-result-badge">
              <div className="mu-result-badge-inner">
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, color: "var(--brand-orange-light)" }}>
                  {heatablePercentage.toFixed(0)}%
                </span>
                <span style={{ fontSize: 11.5, color: "var(--brand-soft)" }}>of room available for heating</span>
              </div>
            </div>

            <dl className="mu-spec-list">
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
                <div key={row.label} className="mu-spec-row">
                  <dt className="mu-spec-label">{row.label}</dt>
                  <dd className="mu-spec-value" style={{ margin: 0 }}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mu-result-note">
              Includes a <strong>10% reduction</strong> to accommodate the long
              end of the heating mat sitting at the edge of the heated area.
            </p>

            <div className="mu-result-actions">
              <Link href="/contact" className="mu-btn-solid">
                Talk to an Expert
              </Link>
              <Link href="/product" className="mu-btn-outline">
                Explore Underfloor Heating
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
