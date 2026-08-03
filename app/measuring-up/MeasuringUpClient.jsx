"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/sections/WhyChooseUs/theme";
import "./measuring-up.css";

import MeasurementHero from "./components/MeasurementHero";
import MeasurementGuide from "./components/MeasurementGuide";
import MeasurementForm from "./components/MeasurementForm";
import RoomVisualizer from "./components/RoomVisualizer";
import MeasurementSummary from "./components/MeasurementSummary";
import MeasurementResult from "./components/MeasurementResult";
import SystemConsiderations from "./components/SystemConsiderations";

/* ───────────────── MAIN PAGE ──────────────────────────────────────────────── */
export default function MeasuringUpClient() {
  // ── CALCULATOR STATE ──
  const [roomWidth, setRoomWidth] = useState("");
  const [roomLength, setRoomLength] = useState("");
  // Window sill height is for installation planning only, NOT used in any
  // area / heatable-area formula. Stored in millimetres. Optional field.
  const [windowSillHeight, setWindowSillHeight] = useState("");
  const [areas, setAreas] = useState([{ id: 1, name: "", width: "", length: "" }]);
  const [showResult, setShowResult] = useState(false);

  // Parsed numeric view of the sill height, used only for display/summary.
  const windowSillHeightNum = parseFloat(windowSillHeight);
  const hasWindowSillHeight =
    windowSillHeight !== "" && !Number.isNaN(windowSillHeightNum) && windowSillHeightNum > 0;

  // ── LIVE CALCS ──
  const roomTotal = useMemo(
    () => (parseFloat(roomWidth) || 0) * (parseFloat(roomLength) || 0),
    [roomWidth, roomLength]
  );

  const unheatable = useMemo(
    () => areas.reduce((sum, a) => sum + (parseFloat(a.width) || 0) * (parseFloat(a.length) || 0), 0),
    [areas]
  );

  const netArea = Math.max(0, roomTotal - unheatable);
  const heatableArea = (netArea * 0.9).toFixed(2);

  const heatablePercentage = roomTotal > 0 ? (netArea / roomTotal) * 100 : 100;
  const isBelowMinimum = roomTotal > 0 && heatablePercentage < 80;

  const hasRoomDims =
    roomWidth !== "" && roomLength !== "" && parseFloat(roomWidth) > 0 && parseFloat(roomLength) > 0;

  // ── ROW HANDLERS ──
  const addArea = () => setAreas((prev) => [...prev, { id: Date.now(), name: "", width: "", length: "" }]);

  const removeArea = (id) => setAreas((prev) => (prev.length === 1 ? prev : prev.filter((a) => a.id !== id)));

  const updateArea = (id, field, value) =>
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  const handleCalculate = () => {
    if (!hasRoomDims) return;
    setShowResult(true);
    setTimeout(() => {
      const el = document.getElementById("calculator-result");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  return (
    <main className="mu-noise" style={{ background: "#0d0805", minHeight: "100vh" }}>
      <MeasurementHero />
      <MeasurementGuide />

      {/* ────────────────────────────────────────────────────────── */}
      {/* HEATABLE AREA CALCULATOR */}
      {/* ────────────────────────────────────────────────────────── */}
      <section
        id="mu-calculator"
        style={{
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(180deg,#0f0906 0%,#150d07 100%)",
          borderTop: "1px solid rgba(232,140,42,0.12)",
          borderBottom: "1px solid rgba(232,140,42,0.12)",
          padding: "96px 20px 100px",
          fontFamily: "var(--font-body)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 640, margin: "0 0 56px" }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mu-eyebrow-row"
            >
              <span className="mu-eyebrow">Space Analysis / 01</span>
              <span className="mu-eyebrow-rule" aria-hidden="true" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
              className="mu-headline"
            >
              Find the right
              <br />
              <span className="brand-h-accent">system size.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
              className="brand-sub"
              style={{ marginTop: 22 }}
            >
              Enter your room dimensions and deduct fixed areas. Your heatable
              floor area updates instantly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
              className="mu-metric-line"
            >
              <span className="mu-metric-live">Live Calculation</span>
              <span className="mu-metric-dot" aria-hidden="true" />
              <span>Metric</span>
              <span className="mu-metric-dot" aria-hidden="true" />
              <span>Thermal Floor Area</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mu-studio"
          >
            <MeasurementForm
              roomWidth={roomWidth}
              setRoomWidth={setRoomWidth}
              roomLength={roomLength}
              setRoomLength={setRoomLength}
              roomTotal={roomTotal}
              areas={areas}
              addArea={addArea}
              removeArea={removeArea}
              updateArea={updateArea}
              unheatable={unheatable}
              isBelowMinimum={isBelowMinimum}
              heatablePercentage={heatablePercentage}
              windowSillHeight={windowSillHeight}
              setWindowSillHeight={setWindowSillHeight}
            />

            <div className="mu-calc-rail">
              <div className="mu-instrument">
                <RoomVisualizer
                  roomWidth={roomWidth}
                  roomLength={roomLength}
                  roomTotal={roomTotal}
                  unheatable={unheatable}
                />
                <div className="mu-instrument-rule" aria-hidden="true" />
                <MeasurementSummary
                  roomTotal={roomTotal}
                  unheatable={unheatable}
                  netArea={netArea}
                  heatableArea={heatableArea}
                  heatablePercentage={heatablePercentage}
                  isBelowMinimum={isBelowMinimum}
                />
              </div>

              <MeasurementResult
                hasRoomDims={hasRoomDims}
                isBelowMinimum={isBelowMinimum}
                showResult={showResult}
                onCalculate={handleCalculate}
                roomWidth={roomWidth}
                roomLength={roomLength}
                roomTotal={roomTotal}
                unheatable={unheatable}
                netArea={netArea}
                heatableArea={heatableArea}
                heatablePercentage={heatablePercentage}
                hasWindowSillHeight={hasWindowSillHeight}
                windowSillHeightNum={windowSillHeightNum}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <SystemConsiderations />
    </main>
  );
}
