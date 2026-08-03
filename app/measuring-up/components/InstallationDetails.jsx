"use client";

import { helperTextStyle } from "./formStyles";

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
      <div className="mu-step-row">
        <span className="mu-step-index" aria-hidden="true">03 &middot; Optional</span>
      </div>
      <h3 className="mu-step-title">Installation detail</h3>
      <p className="mu-step-copy">
        Window sill height helps our installation team assess layout
        constraints — it plays no part in the heatable-area figures below.
      </p>

      <div style={{ maxWidth: 220 }}>
        <label className="mu-field-label" htmlFor="window-sill-height">
          Window Sill Height
        </label>
        <div className="mu-field-shell">
          <input
            id="window-sill-height"
            className="mu-field-input"
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
            aria-describedby="window-sill-height-helper"
          />
          <span className="mu-field-unit" aria-hidden="true">mm</span>
        </div>
        <p id="window-sill-height-helper" style={helperTextStyle}>
          Optional — leave blank if not applicable.
        </p>
      </div>

      <div className="mu-note">
        <span className="mu-note-icon">
          <RulerIcon style={{ width: 16, height: 16 }} />
        </span>
        <p className="mu-note-text">
          <strong>Not used in the calculation.</strong> Measured from the
          bottom edge of the window down to finished floor level, for
          installation planning only.
        </p>
      </div>
    </div>
  );
}
