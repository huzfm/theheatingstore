"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/sections/WhyChooseUs/theme";

// Drawable area inside the viewBox, leaving room for dimension lines/labels
// on the top and left edges (architectural-drawing convention).
const VB_W = 440;
const VB_H = 300;
const MARGIN = { top: 34, right: 20, bottom: 20, left: 46 };
const DRAW_W = VB_W - MARGIN.left - MARGIN.right;
const DRAW_H = VB_H - MARGIN.top - MARGIN.bottom;

// Contain-fit a target ratio inside a box, so the drawn rectangle always
// reflects the entered width/length proportions rather than a placeholder.
function fitRect(ratio, boxW, boxH) {
  const boxRatio = boxW / boxH;
  if (ratio >= boxRatio) return { width: boxW, height: boxW / ratio };
  return { width: boxH * ratio, height: boxH };
}

export default function RoomVisualizer({ roomWidth, roomLength, roomTotal, unheatable }) {
  const reduce = useReducedMotion();
  const w = parseFloat(roomWidth) || 0;
  const l = parseFloat(roomLength) || 0;
  const hasDims = w > 0 && l > 0;
  const ratio = hasDims ? Math.min(Math.max(w / l, 0.4), 2.5) : 1;
  const rect = fitRect(ratio, DRAW_W, DRAW_H);
  const offsetX = MARGIN.left + (DRAW_W - rect.width) / 2;
  const offsetY = MARGIN.top + (DRAW_H - rect.height) / 2;

  const fixedShare = roomTotal > 0 ? Math.min(unheatable / roomTotal, 0.95) : 0;
  const showFixed = fixedShare > 0.003;
  let fixedBox = null;
  if (showFixed) {
    const scale = Math.sqrt(fixedShare);
    const fw = Math.min(rect.width * scale, rect.width - 10);
    const fh = Math.min(rect.height * scale, rect.height - 10);
    fixedBox = { fw, fh, fx: offsetX + rect.width - fw - 5, fy: offsetY + rect.height - fh - 5 };
  }

  const emptyRect = fitRect(1.3, DRAW_W * 0.72, DRAW_H * 0.72);
  const ex = MARGIN.left + (DRAW_W - emptyRect.width) / 2;
  const ey = MARGIN.top + (DRAW_H - emptyRect.height) / 2;

  const topDimY = offsetY - 16;
  const leftDimX = offsetX - 16;

  return (
    <div className="mu-instrument-section">
      <div className="mu-instrument-label">Room Plan</div>

      <div className="mu-floorplan-wrap">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={hasDims ? `Floor plan, ${w.toFixed(2)} metres wide by ${l.toFixed(2)} metres long` : "Floor plan, no dimensions entered yet"}>
          <defs>
            <pattern id="mu-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 0 20" fill="none" className="mu-fp-grid-line" />
            </pattern>
            <radialGradient id="mu-thermal-fill" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#E8933A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#E8933A" stopOpacity="0" />
            </radialGradient>
            <pattern id="mu-hatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(245,185,122,0.4)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#mu-grid)" />

          <AnimatePresence mode={reduce ? "sync" : "wait"} initial={false}>
            {hasDims ? (
              <motion.g
                key="dims"
                initial={reduce ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              >
                {/* corner registration ticks */}
                {[
                  { x: offsetX, y: offsetY, dx: -1, dy: -1 },
                  { x: offsetX + rect.width, y: offsetY, dx: 1, dy: -1 },
                  { x: offsetX, y: offsetY + rect.height, dx: -1, dy: 1 },
                  { x: offsetX + rect.width, y: offsetY + rect.height, dx: 1, dy: 1 },
                ].map((c, i) => (
                  <g key={i}>
                    <line x1={c.x} y1={c.y} x2={c.x + c.dx * 7} y2={c.y} className="mu-fp-tick" />
                    <line x1={c.x} y1={c.y} x2={c.x} y2={c.y + c.dy * 7} className="mu-fp-tick" />
                  </g>
                ))}

                <rect x={offsetX} y={offsetY} width={rect.width} height={rect.height} rx="1" className="mu-fp-outline" />

                {fixedBox && (
                  <>
                    <rect x={fixedBox.fx} y={fixedBox.fy} width={fixedBox.fw} height={fixedBox.fh} className="mu-fp-fixed" />
                    {fixedBox.fw > 46 && fixedBox.fh > 20 && (
                      <text x={fixedBox.fx + 8} y={fixedBox.fy + 16} className="mu-fp-fixed-label">
                        FIXED
                      </text>
                    )}
                  </>
                )}

                {/* top dimension — width */}
                <line x1={offsetX} y1={topDimY} x2={offsetX + rect.width} y2={topDimY} className="mu-fp-dim-line" />
                <line x1={offsetX} y1={topDimY - 4} x2={offsetX} y2={topDimY + 4} className="mu-fp-dim-line" />
                <line x1={offsetX + rect.width} y1={topDimY - 4} x2={offsetX + rect.width} y2={topDimY + 4} className="mu-fp-dim-line" />
                <text x={offsetX + rect.width / 2} y={topDimY - 8} textAnchor="middle" className="mu-fp-dim-text">
                  {w.toFixed(2)} m
                </text>

                {/* left dimension — length */}
                <line x1={leftDimX} y1={offsetY} x2={leftDimX} y2={offsetY + rect.height} className="mu-fp-dim-line" />
                <line x1={leftDimX - 4} y1={offsetY} x2={leftDimX + 4} y2={offsetY} className="mu-fp-dim-line" />
                <line x1={leftDimX - 4} y1={offsetY + rect.height} x2={leftDimX + 4} y2={offsetY + rect.height} className="mu-fp-dim-line" />
                <text
                  x={leftDimX - 8}
                  y={offsetY + rect.height / 2}
                  textAnchor="middle"
                  transform={`rotate(-90 ${leftDimX - 8} ${offsetY + rect.height / 2})`}
                  className="mu-fp-dim-text"
                >
                  {l.toFixed(2)} m
                </text>
              </motion.g>
            ) : (
              <motion.g
                key="empty"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
              >
                <rect
                  x={ex}
                  y={ey}
                  width={emptyRect.width}
                  height={emptyRect.height}
                  rx="2"
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <text
                  x={ex + emptyRect.width / 2}
                  y={ey + emptyRect.height / 2 - 8}
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-heading)", fontSize: 12, letterSpacing: "0.08em", fill: "rgba(251,243,234,0.4)", textTransform: "uppercase" }}
                >
                  Room Plan
                </text>
                <text
                  textAnchor="middle"
                  style={{ fontFamily: "var(--font-body)", fontSize: 11, fill: "rgba(251,243,234,0.38)" }}
                >
                  <tspan x={ex + emptyRect.width / 2} y={ey + emptyRect.height / 2 + 12}>
                    Enter dimensions to generate
                  </tspan>
                  <tspan x={ex + emptyRect.width / 2} y={ey + emptyRect.height / 2 + 27}>
                    your floor area.
                  </tspan>
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", marginTop: 14 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, color: "var(--brand-mute)" }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, border: "1.25px solid rgba(251,243,234,0.5)", background: "rgba(232,147,58,0.14)", display: "inline-block" }} />
          Heatable area
        </span>
        {showFixed && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11, color: "var(--brand-mute)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, border: "1.25px dashed rgba(245,185,122,0.6)", display: "inline-block" }} />
            Fixed area (aggregate)
          </span>
        )}
      </div>
    </div>
  );
}
