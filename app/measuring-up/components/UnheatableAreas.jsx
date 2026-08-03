"use client";

import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/components/sections/WhyChooseUs/theme";

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
function RemoveIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
      <div className="mu-step-row">
        <span className="mu-step-index" aria-hidden="true">02</span>
      </div>
      <h3 className="mu-step-title">Fixed areas</h3>
      <p className="mu-step-copy">
        Deduct permanent furniture or areas where heating cannot be installed —
        built-in units, kitchen islands, bathroom suites or other fixtures.
      </p>

      <div className="mu-row-list">
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
                <div className="mu-row">
                  <span className="mu-row-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="mu-row-name">
                    <label className="mu-field-label" htmlFor={`area-name-${a.id}`}>
                      Area Name
                    </label>
                    <div className="mu-field-shell">
                      <input
                        id={`area-name-${a.id}`}
                        className="mu-field-input"
                        type="text"
                        placeholder="e.g. Kitchen island"
                        value={a.name}
                        onChange={(e) => updateArea(a.id, "name", e.target.value)}
                        style={{ fontSize: 15 }}
                        aria-label={`Area ${i + 1} name`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mu-field-label" htmlFor={`area-width-${a.id}`}>
                      Width
                    </label>
                    <div className="mu-field-shell">
                      <input
                        id={`area-width-${a.id}`}
                        className="mu-field-input"
                        type="number"
                        step="0.1"
                        min="0"
                        inputMode="decimal"
                        placeholder="0.0"
                        value={a.width}
                        onChange={(e) => updateArea(a.id, "width", e.target.value)}
                        aria-label={`Area ${i + 1} width in metres`}
                      />
                      <span className="mu-field-unit" aria-hidden="true">m</span>
                    </div>
                  </div>

                  <div>
                    <label className="mu-field-label" htmlFor={`area-length-${a.id}`}>
                      Length
                    </label>
                    <div className="mu-field-shell">
                      <input
                        id={`area-length-${a.id}`}
                        className="mu-field-input"
                        type="number"
                        step="0.1"
                        min="0"
                        inputMode="decimal"
                        placeholder="0.0"
                        value={a.length}
                        onChange={(e) => updateArea(a.id, "length", e.target.value)}
                        aria-label={`Area ${i + 1} length in metres`}
                      />
                      <span className="mu-field-unit" aria-hidden="true">m</span>
                    </div>
                  </div>

                  <div className="mu-row-total">
                    <span className="mu-field-label">Total</span>
                    <div className="mu-readout">
                      <div className="mu-readout-value" aria-label={`Area ${i + 1} total in square metres`} style={{ fontSize: 17 }}>
                        {rowTotal > 0 ? rowTotal.toFixed(2) : "0.00"}
                        <span>m&sup2;</span>
                      </div>
                    </div>
                  </div>

                  <div className="mu-row-remove-cell">
                    <button
                      type="button"
                      onClick={() => removeArea(a.id)}
                      disabled={areas.length === 1}
                      aria-label={`Remove area ${i + 1}`}
                      className="mu-row-remove"
                    >
                      <RemoveIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button type="button" onClick={addArea} className="mu-add-row">
        <PlusIcon style={{ width: 12, height: 12 }} />
        Add Fixed Area
      </button>

      {roomTotal > 0 && unheatable > 0 && (
        <div className="mu-status-row">
          <span className="mu-status-icon" style={{ color: isBelowMinimum ? "#F5B97A" : "#4ADE80" }}>
            {isBelowMinimum ? <WarningIcon style={{ width: 18, height: 18 }} /> : <CheckIcon style={{ width: 18, height: 18 }} />}
          </span>
          <div>
            <div className="mu-status-text" style={{ color: isBelowMinimum ? "#F5B97A" : "#4ADE80" }}>
              {isBelowMinimum
                ? `Available floor area is ${heatablePercentage.toFixed(0)}% — below the 80% recommended minimum`
                : `Available floor area is ${heatablePercentage.toFixed(0)}%`}
            </div>
            {isBelowMinimum && (
              <div className="mu-status-sub">
                We install underfloor heating on a minimum of 80% of the floor
                area. Reduce your fixed-area deductions, or contact us to talk
                through your project.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
