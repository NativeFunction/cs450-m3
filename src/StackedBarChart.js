import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Order and colors must match the screenshot
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
  let injuredPedestrians = 0;
  let killedPedestrians = 0;
  let injuredCyclists = 0;
  let killedCyclists = 0;
  let injuredMotorists = 0;
  let killedMotorists = 0;

  data.forEach((row) => {
    injuredPedestrians += row["NUMBER OF PEDESTRIANS INJURED"] || 0;
    killedPedestrians += row["NUMBER OF PEDESTRIANS KILLED"] || 0;
    injuredCyclists += row["NUMBER OF CYCLIST INJURED"] || 0;
    killedCyclists += row["NUMBER OF CYCLIST KILLED"] || 0;
    injuredMotorists += row["NUMBER OF MOTORIST INJURED"] || 0;
    killedMotorists += row["NUMBER OF MOTORIST KILLED"] || 0;
  });

  let nonInjuredIncidents = data.filter(
    (row) =>
      (row["NUMBER OF PERSONS INJURED"] || 0) === 0 &&
      (row["NUMBER OF PERSONS KILLED"] || 0) === 0
  ).length;

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

const BAR_HEIGHT = 54;
const LEGEND_CIRCLE_RADIUS = 9;
const LEGEND_ITEM_HEIGHT = 24;
const LEGEND_GAP = 18;
const LEGEND_FONT_SIZE = 15;
const HEADER_FONT_SIZE = 20;
const HEADER_HEIGHT = 30;
const PADDING = 32;
const BOTTOM_LABEL_HEIGHT = 30;

const StackedBarChart = ({ data }) => {
  const svgRef = useRef();
  const width =
    typeof window !== "undefined" ? window.innerWidth - 2 * PADDING : 800;
  const barY = HEADER_HEIGHT + LEGEND_ITEM_HEIGHT + 24;
  const svgHeight = barY + BAR_HEIGHT + BOTTOM_LABEL_HEIGHT + 24;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    if (!data || data.length === 0) return;
    const barData = computeBarData(data);
    if (!barData) return;
    const sum = barData.reduce((acc, d) => acc + d.value, 0);
    if (sum === 0) return;
    const barDataWithPct = barData.map((d) => ({ ...d, pct: d.value / sum }));
    const total = data.length;

    // Header
    svg
      .append("text")
      .attr("x", PADDING)
      .attr("y", HEADER_FONT_SIZE + 2)
      .attr("font-size", HEADER_FONT_SIZE)
      .attr("font-weight", 500)
      .text("Incidences and Outcome");

    // Legend
    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${PADDING + 180},${HEADER_HEIGHT - 6})`);
    legendGroup
      .selectAll("g")
      .data(LEGEND_ITEMS)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${i * 140},0)`)
      .each(function (d) {
        d3.select(this)
          .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", LEGEND_CIRCLE_RADIUS)
          .attr("fill", d.color)
          .attr("stroke", "#eee")
          .attr("stroke-width", 1.5);
        d3.select(this)
          .append("text")
          .attr("x", LEGEND_CIRCLE_RADIUS + 6)
          .attr("y", 5)
          .attr("font-size", LEGEND_FONT_SIZE)
          .text(d.label);
      });

    // Stacked Bar background
    svg
      .append("rect")
      .attr("x", PADDING)
      .attr("y", barY)
      .attr("width", width - 2 * PADDING)
      .attr("height", BAR_HEIGHT)
      .attr("fill", "#fff")
      .attr("stroke", "#bbb")
      .attr("stroke-width", 2)
      .attr("rx", 5);

    // Stacked Bar segments
    let barStart = PADDING;
    barDataWithPct.forEach((d, i) => {
      const barWidth = d.pct * (width - 2 * PADDING);
      svg
        .append("rect")
        .attr("x", barStart)
        .attr("y", barY)
        .attr("width", barWidth)
        .attr("height", BAR_HEIGHT)
        .attr("fill", d.color)
        .attr("rx", i === 0 ? 5 : 0)
        .attr("ry", i === 0 ? 5 : 0)
        .attr("stroke-width", 0)
        .attr("stroke", "none");
      // Percentage label
      if (d.pct >= 0.04) {
        svg
          .append("text")
          .attr("x", barStart + barWidth / 2)
          .attr("y", barY + BAR_HEIGHT / 2 + 7)
          .attr("text-anchor", "middle")
          .attr("fill", i === 0 ? "#fff" : "#222")
          .attr("font-size", 18)
          .attr("font-weight", 600)
          .text(`${Math.round(d.pct * 100)}%`);
      }
      barStart += barWidth;
    });

    // Bottom labels (0 and total)
    svg
      .append("text")
      .attr("x", PADDING)
      .attr("y", barY + BAR_HEIGHT + 28)
      .attr("font-size", 18)
      .attr("fill", "#444")
      .text("0");
    svg
      .append("text")
      .attr("x", width - PADDING)
      .attr("y", barY + BAR_HEIGHT + 28)
      .attr("font-size", 18)
      .attr("fill", "#444")
      .attr("text-anchor", "end")
      .text(total.toLocaleString());
  }, [data, width]);

  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100%",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: 8,
        padding: 0,
        margin: 0,
      }}
    >
      <svg
        ref={svgRef}
        style={{ width: "100%", height: svgHeight, display: "block" }}
      />
    </div>
  );
};

export default StackedBarChart;
