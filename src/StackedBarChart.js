import React from "react";

const PLACEHOLDER_DATA = [
  { label: "Non-injured People", value: 80, color: "#18c1c1" },
  { label: "Injured Pedestrians", value: 5, color: "#ff9800" },
  { label: "Killed Pedestrians", value: 5, color: "#1565c0" },
  { label: "Injured Cyclists", value: 4, color: "#8e24aa" },
  { label: "Killed Cyclists", value: 3, color: "#e53935" },
  { label: "Injured Motorists", value: 2, color: "#6d4c41" },
  { label: "Killed Motorists", value: 1, color: "#ffd600" },
];

const LEGEND_ITEMS = [
  { label: "Non-injured People", color: "#18c1c1" },
  { label: "Killed Cyclists", color: "#e53935" },
  { label: "Injured Pedestrians", color: "#ff9800" },
  { label: "Killed Pedestrians", color: "#1565c0" },
  { label: "Injured Cyclists", color: "#8e24aa" },
  { label: "Injured Motorists", color: "#6d4c41" },
  { label: "Killed Motorists", color: "#ffd600" },
];

const total = 207388;

const StackedBarChart = () => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "24px 32px",
        borderRadius: 8,
        width: "100vw",
        maxWidth: "100%",
        boxSizing: "border-box",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        margin: "0 -24px", // to stretch edge-to-edge if inside a padded container
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 500, fontSize: 20, marginRight: 24 }}>
          Incidences and Outcome
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {LEGEND_ITEMS.map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", marginRight: 12 }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  background: item.color,
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: 6,
                  border: "1.5px solid #eee",
                }}
              ></span>
              <span style={{ fontSize: 15 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 54,
          border: "2px solid #bbb",
          borderRadius: 5,
          background: "#fff",
          margin: "0 auto 8px auto",
          display: "flex",
          alignItems: "center",
          minWidth: 300,
        }}
      >
        {PLACEHOLDER_DATA.map((item, idx) => (
          <div
            key={item.label}
            style={{
              width: `${item.value}%`,
              height: "100%",
              background: item.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: idx === 0 ? "#fff" : "#222",
              fontWeight: 600,
              fontSize: 18,
              borderTopLeftRadius: idx === 0 ? 5 : 0,
              borderBottomLeftRadius: idx === 0 ? 5 : 0,
              borderTopRightRadius: idx === PLACEHOLDER_DATA.length - 1 ? 5 : 0,
              borderBottomRightRadius:
                idx === PLACEHOLDER_DATA.length - 1 ? 5 : 0,
              position: "relative",
              minWidth: 0,
            }}
          >
            {item.value >= 4 ? `${item.value}%` : null}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          fontSize: 18,
          color: "#444",
          margin: "0 auto",
          minWidth: 300,
        }}
      >
        <span>0</span>
        <span>{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default StackedBarChart;
