"use client";

function WarningIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 4L2.5 20h19L12 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.1" r="0.95" fill="currentColor" />
    </svg>
  );
}

export default function MeasurementSummary({ roomTotal, unheatable, netArea, heatableArea, heatablePercentage, isBelowMinimum }) {
  const pct = Math.max(0, Math.min(100, heatablePercentage));

  return (
    <div className="mu-instrument-section">
      <div className="mu-instrument-label">Thermal Analysis</div>

      <div className="mu-hero-figure-label">Heatable Floor Area</div>
      <div className="mu-hero-figure">
        {parseFloat(heatableArea) > 0 ? parseFloat(heatableArea).toFixed(2) : "0.00"}
        <span>m&sup2;</span>
      </div>
      {roomTotal > 0 && (
        <p className="mu-hero-figure-sub">
          <strong>{pct.toFixed(0)}%</strong> usable floor coverage
        </p>
      )}

      {roomTotal > 0 && (
        <div className="mu-coverage">
          <div className="mu-coverage-head">
            <span className="mu-coverage-title">Heatable Coverage</span>
            <span className="mu-coverage-pct">{pct.toFixed(0)}%</span>
          </div>
          <div className="mu-coverage-track">
            <div className={`mu-coverage-fill${isBelowMinimum ? " is-low" : ""}`} style={{ width: `${pct}%` }} />
            <div className="mu-coverage-marker" aria-hidden="true" />
          </div>
        </div>
      )}

      <div className="mu-data-grid">
        <div className="mu-data-cell">
          <div className="mu-data-cell-label">Total Floor Area</div>
          <div className="mu-data-cell-value">{roomTotal.toFixed(2)}m&sup2;</div>
        </div>
        <div className="mu-data-cell">
          <div className="mu-data-cell-label">Fixed / Unheatable</div>
          <div className="mu-data-cell-value">{unheatable.toFixed(2)}m&sup2;</div>
        </div>
        <div className="mu-data-cell">
          <div className="mu-data-cell-label">Net Floor Area</div>
          <div className="mu-data-cell-value">{netArea.toFixed(2)}m&sup2;</div>
        </div>
        <div className="mu-data-cell is-primary">
          <div className="mu-data-cell-label">Heatable Area</div>
          <div className="mu-data-cell-value">{heatableArea}m&sup2;</div>
        </div>
      </div>

      {isBelowMinimum && (
        <div className="mu-warning-card">
          <span style={{ color: "#F5B97A", flexShrink: 0, display: "flex", marginTop: 1 }}>
            <WarningIcon style={{ width: 18, height: 18 }} />
          </span>
          <div>
            <div className="mu-warning-title">Low Heatable Coverage</div>
            <div className="mu-warning-sub">
              Your fixed-area deductions leave less than the recommended 80%
              floor coverage. Reduce them, or contact us to talk through your
              project.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
