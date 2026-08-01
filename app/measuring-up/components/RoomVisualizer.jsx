"use client";

import { C } from "@/components/sections/WhyChooseUs/theme";

const BOX_W = 220;
const BOX_H = 150;

// Contain-fit the room's true aspect ratio inside a fixed box, so the
// rectangle drawn always reflects the entered width/length proportions
// rather than a generic placeholder shape.
function fitRect(ratio) {
  const boxRatio = BOX_W / BOX_H;
  if (ratio >= boxRatio) {
    return { width: BOX_W, height: BOX_W / ratio };
  }
  return { width: BOX_H * ratio, height: BOX_H };
}

export default function RoomVisualizer({ roomWidth, roomLength, roomTotal, unheatable }) {
  const w = parseFloat(roomWidth) || 0;
  const l = parseFloat(roomLength) || 0;
  const hasDims = w > 0 && l > 0;
  const ratio = hasDims ? Math.min(Math.max(w / l, 0.4), 2.5) : 1;
  const rect = fitRect(ratio);

  const fixedShare = roomTotal > 0 ? Math.min(100, (unheatable / roomTotal) * 100) : 0;
  const heatableShare = 100 - fixedShare;

  return (
    <div className="mu-glass" style={{ padding: "22px 22px 20px", borderRadius: 20 }}>
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
        Room Plan
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: BOX_H + 40 }}>
        {hasDims ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              role="img"
              aria-label={`Room outline, ${w.toFixed(2)} metres wide by ${l.toFixed(2)} metres long`}
              style={{
                width: rect.width,
                height: rect.height,
                border: "1.5px solid rgba(245,185,122,0.55)",
                borderRadius: 4,
                background: "rgba(232,147,58,0.06)",
                position: "relative",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: -22,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 11,
                  color: C.soft,
                  whiteSpace: "nowrap",
                }}
              >
                &#8596; {w.toFixed(2)}m
              </span>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: -8,
                  top: "50%",
                  transform: "translateY(-50%) translateX(100%) rotate(90deg)",
                  transformOrigin: "left center",
                  fontSize: 11,
                  color: C.soft,
                  whiteSpace: "nowrap",
                }}
              >
                &#8597; {l.toFixed(2)}m
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              width: BOX_W * 0.8,
              height: BOX_H * 0.8,
              border: "1.5px dashed rgba(255,255,255,0.18)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 16,
            }}
          >
            <span style={{ fontSize: 12, color: C.mute, lineHeight: 1.5 }}>
              Enter room dimensions to see your plan
            </span>
          </div>
        )}
      </div>

      {roomTotal > 0 && (
        <div style={{ marginTop: 18 }}>
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              width: "100%",
              height: 8,
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: `${heatableShare}%`,
                background: "linear-gradient(90deg, #E8933A, #FF7E5F)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: C.mute }}>
            <span>Heatable {heatableShare.toFixed(0)}%</span>
            <span>Fixed {fixedShare.toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
