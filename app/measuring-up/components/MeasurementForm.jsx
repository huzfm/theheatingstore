"use client";

import RoomDimensions from "./RoomDimensions";
import UnheatableAreas from "./UnheatableAreas";
import InstallationDetails from "./InstallationDetails";

function Divider() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        height: 1,
        margin: "32px 0",
        background: "linear-gradient(90deg, transparent, rgba(232,147,58,0.22), transparent)",
      }}
    />
  );
}

export default function MeasurementForm({
  roomWidth,
  setRoomWidth,
  roomLength,
  setRoomLength,
  roomTotal,
  areas,
  addArea,
  removeArea,
  updateArea,
  unheatable,
  isBelowMinimum,
  heatablePercentage,
  windowSillHeight,
  setWindowSillHeight,
}) {
  return (
    <div className="mu-glass" style={{ padding: "clamp(24px, 4vw, 36px)", borderRadius: 24 }}>
      <RoomDimensions
        roomWidth={roomWidth}
        setRoomWidth={setRoomWidth}
        roomLength={roomLength}
        setRoomLength={setRoomLength}
        roomTotal={roomTotal}
      />

      <Divider />

      <UnheatableAreas
        areas={areas}
        addArea={addArea}
        removeArea={removeArea}
        updateArea={updateArea}
        roomTotal={roomTotal}
        unheatable={unheatable}
        isBelowMinimum={isBelowMinimum}
        heatablePercentage={heatablePercentage}
      />

      <Divider />

      <InstallationDetails windowSillHeight={windowSillHeight} setWindowSillHeight={setWindowSillHeight} />
    </div>
  );
}
