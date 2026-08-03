"use client";

import RoomDimensions from "./RoomDimensions";
import UnheatableAreas from "./UnheatableAreas";
import InstallationDetails from "./InstallationDetails";

function Divider() {
  return <div className="mu-panel-divider" aria-hidden="true" />;
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
    <div className="mu-panel">
      <div className="mu-panel-head">
        <span className="mu-panel-title">Measurement Inputs</span>
        <span className="mu-panel-live" aria-hidden="true">Live</span>
      </div>

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
