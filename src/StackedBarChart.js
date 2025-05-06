import React from "react";

const LEGEND_ITEMS = [
  { label: "Non-injured People", color: "#18c1c1" },
  { label: "Killed Cyclists", color: "#e53935" },
  { label: "Injured Pedestrians", color: "#ff9800" },
  { label: "Killed Pedestrians", color: "#1565c0" },
  { label: "Injured Cyclists", color: "#8e24aa" },
  { label: "Injured Motorists", color: "#6d4c41" },
  { label: "Killed Motorists", color: "#ffd600" },
];

function computeBarData(data) {
  if (!data || data.length === 0) return null;
  let total = data.length;
  let injuredPedestrians = 0;
  let killedPedestrians = 0;
  let injuredCyclists = 0;
  let killedCyclists = 0;
  let injuredMotorists = 0;
  let killedMotorists = 0;
  let injuredPeople = 0;
  let killedPeople = 0;

  data.forEach((row) => {
    injuredPedestrians += row["NUMBER OF PEDESTRIANS INJURED"] || 0;
    killedPedestrians += row["NUMBER OF PEDESTRIANS KILLED"] || 0;
    injuredCyclists += row["NUMBER OF CYCLIST INJURED"] || 0;
    killedCyclists += row["NUMBER OF CYCLIST KILLED"] || 0;
    injuredMotorists += row["NUMBER OF MOTORIST INJURED"] || 0;
    killedMotorists += row["NUMBER OF MOTORIST KILLED"] || 0;
    injuredPeople += row["NUMBER OF PERSONS INJURED"] || 0;
    killedPeople += row["NUMBER OF PERSONS KILLED"] || 0;
  });

  // Non-injured people = total incidents - any incident with injury or death
  // But for the bar, we want the number of incidents with no injury or death
  let nonInjuredIncidents = data.filter(
    (row) =>
      (row["NUMBER OF PERSONS INJURED"] || 0) === 0 &&
      (row["NUMBER OF PERSONS KILLED"] || 0) === 0
  ).length;

  // For the bar, we want the percentage of incidents in each category
  // We'll use the same order as the legend
  return [
    {
      label: "Non-injured People",
      value: nonInjuredIncidents,
      color: "#18c1c1",
    },
    {
      label: "Injured Pedestrians",
      value: injuredPedestrians,
      color: "#ff9800",
    },
    { label: "Killed Pedestrians", value: killedPedestrians, color: "#1565c0" },
    { label: "Injured Cyclists", value: injuredCyclists, color: "#8e24aa" },
    { label: "Killed Cyclists", value: killedCyclists, color: "#e53935" },
    { label: "Injured Motorists", value: injuredMotorists, color: "#6d4c41" },
    { label: "Killed Motorists", value: killedMotorists, color: "#ffd600" },
  ];
}

const StackedBarChart = ({ data }) => {
  if (!data || data.length === 0) return <div>Loading...</div>;
  const barData = computeBarData(data);
  const total = data.length;
  const sum = barData.reduce((acc, d) => acc + d.value, 0);
  // Convert to percentages for bar width
  const barDataWithPct = barData.map((d) => ({
    ...d,
    pct: (d.value / sum) * 100,
  }));

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
        margin: "0 -24px",
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
        {barDataWithPct.map((item, idx) => (
          <div
            key={item.label}
            style={{
              width: `${item.pct}%`,
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
              borderTopRightRadius: idx === barDataWithPct.length - 1 ? 5 : 0,
              borderBottomRightRadius:
                idx === barDataWithPct.length - 1 ? 5 : 0,
              position: "relative",
              minWidth: 0,
            }}
          >
            {item.pct >= 4 ? `${Math.round(item.pct)}%` : null}
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
