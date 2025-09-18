import React, { useState, useMemo } from "react";

const serviceColors = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#feca57",
  "#fd79a8",
  "#fdcb6e",
  "#6c5ce7",
];

// Styles
const tooltipStyle = {
  position: "fixed",
  zIndex: 1000,
  background: "#2a2a2a",
  color: "#fff",
  padding: 16,
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  fontSize: 14,
  minWidth: 220,
  pointerEvents: "none",
  fontFamily: "system-ui",
};
const arrowStyle = {
  position: "absolute",
  bottom: -6,
  left: "50%",
  transform: "translateX(-50%)",
  width: 0,
  height: 0,
  borderLeft: "6px solid transparent",
  borderRight: "6px solid transparent",
  borderTop: "6px solid #2a2a2a",
};

// Helper
function aggregateServices(phases) {
  const map = {};
  phases?.forEach((phase) =>
    phase.breakdownByService?.forEach((service) => {
      if (!map[service.name])
        map[service.name] = {
          ...service,
          cost: 0,
          numberOfUnits: 0,
          breakdownByPhase: [],
        };
      map[service.name].cost += service.cost || 0;
      map[service.name].numberOfUnits += service.numberOfUnits || 0;
      map[service.name].breakdownByPhase.push({
        name: phase.name,
        numberOfUnits: service.numberOfUnits || 0,
        cost: service.cost || 0,
      });
    })
  );
  return Object.values(map);
}

function Tooltip({ service, segmentRef, visible, viewMode }) {
  if (!visible || !service || !segmentRef) return null;
  const rect = segmentRef.getBoundingClientRect();
  return (
    <div
      style={{
        ...tooltipStyle,
        left: rect.left + rect.width / 2,
        top: rect.top - 10,
        transform: "translateX(-50%) translateY(-100%)",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        {service.name}
      </div>
      <div style={{ marginBottom: 4, textAlign: "center" }}>
        Cost: ${service.cost?.toFixed(4) || "0.0000"}
      </div>
      <div style={{ marginBottom: 12, textAlign: "center" }}>
        Total: {service.numberOfUnits || 0} units
      </div>
      {viewMode === "service" && service.breakdownByPhase?.length > 0 && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 8, textAlign: "left" }}>
            Breakdown by Phase:
          </div>
          <div>
            {service.breakdownByPhase.map((phase, i) => (
              <div
                key={i}
                style={{ marginBottom: 4, paddingLeft: 4, textAlign: "left" }}
              >
                • {phase.name}: {phase.numberOfUnits || 0} units ($
                {phase.cost?.toFixed(4) || "0.0000"})
              </div>
            ))}
          </div>
        </>
      )}
      {viewMode === "phase" && service.breakdownByService?.length > 0 && (
        <>
          <div style={{ fontWeight: 600, marginBottom: 8, textAlign: "left" }}>
            Breakdown by Service:
          </div>
          <div>
            {service.breakdownByService.map((svc, i) => (
              <div
                key={i}
                style={{ marginBottom: 4, paddingLeft: 4, textAlign: "left" }}
              >
                • {svc.name}: {svc.numberOfUnits || 0} units ($
                {svc.cost?.toFixed(4) || "0.0000"})
              </div>
            ))}
          </div>
        </>
      )}
      <div style={arrowStyle}></div>
    </div>
  );
}

export function UsageChart({ video }) {
  const [viewMode, setViewMode] = useState("service");
  const [hiddenKeys, setHiddenKeys] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    service: null,
    segmentRef: null,
  });

  const data = useMemo(() => {
    if (!video?.trackByPhase) return [];
    return viewMode === "service"
      ? aggregateServices(video.trackByPhase).map((item) => ({
          ...item,
          displayName: item.name,
          unitName: "units",
          unit: item.numberOfUnits || 0,
        }))
      : video.trackByPhase.map((item) => ({
          ...item,
          displayName: item.name,
          unitName: "units",
          unit: item.numberOfUnits || 0,
        }));
  }, [video, viewMode]);

  const totalCost = useMemo(
    () => data.reduce((sum, item) => sum + item.cost, 0),
    [data]
  );
  const visibleData = data.filter((item) => !hiddenKeys.includes(item.name));
  const visibleTotal =
    visibleData.reduce((sum, item) => sum + item.cost, 0) || 1;

  const toggleVisibility = (key) =>
    setHiddenKeys((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]
    );

  const handleMouseEnter = (e, item) =>
    setTooltip({ visible: true, service: item, segmentRef: e.target });
  const handleMouseLeave = () =>
    setTooltip({ visible: false, service: null, segmentRef: null });

  return (
    <div className="usage-chart-container p-4 border rounded-lg bg-white shadow-sm">
      <div className="usage-chart-header flex justify-between items-center mb-3">
        <h6 className="text-md font-semibold">API Usage & Cost</h6>
        <div className="view-mode-buttons flex gap-1">
          {["service", "phase"].map((mode) => (
            <button
              key={mode}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
              }`}
              onClick={() => {
                setViewMode(mode);
                setHiddenKeys([]);
              }}
            >
              Track by {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="total-cost mb-2">
        <strong>Total Cost:</strong>{" "}
        <span className="cost-amount">${video?.totalCost?.toFixed(4)}</span>
      </div>
      {totalCost === 0 ? (
        <div className="no-data">No cost data available</div>
      ) : (
        <div className="usage-chart">
          <div
            className="usage-bar"
            style={{
              display: "flex",
              height: 32,
              overflow: "hidden",
              borderRadius: 16,
              background: "#e5e7eb",
              border: "1px solid #d1d5db",
            }}
          >
            {data.map((item, i) => {
              const color = serviceColors[i % serviceColors.length];
              const isHidden = hiddenKeys.includes(item.name);
              const percentage = isHidden
                ? 0
                : (item.cost / visibleTotal) * 100;
              return (
                <div
                  key={item.name}
                  className="usage-segment"
                  style={{
                    width: `${percentage}%`,
                    background: color,
                    transition: "all 0.3s",
                    minWidth: isHidden ? 0 : 1,
                    opacity: isHidden ? 0 : 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                  title={`${item.displayName}: $${item.cost.toFixed(4)} (${
                    item.unit
                  } ${item.unitName})`}
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseLeave={handleMouseLeave}
                >
                  {percentage > 5 ? `$${item.cost.toFixed(3)}` : ""}
                </div>
              );
            })}
          </div>
          <div className=" mt-4 grid gap-2 md:grid-cols-3">
            {data.map((item, i) => {
              const color = serviceColors[i % serviceColors.length];
              const isHidden = hiddenKeys.includes(item.name);
              return (
                <div
                  key={item.name}
                  className="legend-item flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => toggleVisibility(item.name)}
                >
                  <div
                    className="legend-color w-4 h-4 rounded"
                    style={{ background: color, opacity: isHidden ? 0.3 : 1 }}
                  />
                  <span
                    className={`text-sm ${
                      isHidden ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {item.displayName}: ${item.cost.toFixed(4)} ({item.unit}{" "}
                    {item.unitName})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Tooltip {...tooltip} viewMode={viewMode} />
    </div>
  );
}
