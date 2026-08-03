"use client";

import { useState } from "react";

function DimensionField({ id, label, value, onChange, touched, onBlur, placeholder }) {
  const numeric = parseFloat(value);
  const showError = touched && value !== "" && (Number.isNaN(numeric) || numeric <= 0);

  return (
    <div>
      <label className="mu-field-label" htmlFor={id}>
        {label}
      </label>
      <div className={`mu-field-shell${showError ? " is-error" : ""}`}>
        <input
          id={id}
          className="mu-field-input"
          type="number"
          step="0.1"
          min="0"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-required="true"
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        <span className="mu-field-unit" aria-hidden="true">m</span>
      </div>
      {showError && (
        <p id={`${id}-error`} className="mu-field-error-text" role="alert">
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
      <div className="mu-step-row">
        <span className="mu-step-index" aria-hidden="true">01</span>
      </div>
      <h3 className="mu-step-title">Room dimensions</h3>
      <p className="mu-step-copy">Enter the length and width of the full room, wall to wall.</p>

      <div className="mu-field-grid">
        <DimensionField
          id="room-width"
          label="Room Width *"
          placeholder="e.g. 4.5"
          value={roomWidth}
          onChange={setRoomWidth}
          touched={touched.width}
          onBlur={() => setTouched((t) => ({ ...t, width: true }))}
        />
        <DimensionField
          id="room-length"
          label="Room Length *"
          placeholder="e.g. 6.0"
          value={roomLength}
          onChange={setRoomLength}
          touched={touched.length}
          onBlur={() => setTouched((t) => ({ ...t, length: true }))}
        />
        <div>
          <label className="mu-field-label" htmlFor="room-total-readout">
            Room Total
          </label>
          <div className="mu-readout">
            <div className="mu-readout-value" id="room-total-readout" aria-label="Room total area in square metres">
              {roomTotal > 0 ? roomTotal.toFixed(2) : "0.00"}
              <span>m&sup2;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
