import React, { Component } from "react";
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
  ].sort((a,b) => b.value - a.value);
}

const BAR_HEIGHT = 54;
const LEGEND_CIRCLE_RADIUS = 8;
const LEGEND_ITEM_HEIGHT = 20;
const LEGEND_FONT_SIZE = 13;
const HEADER_FONT_SIZE = 22;
const HEADER_HEIGHT = 32;
const PADDING = 32;
const BOTTOM_LABEL_HEIGHT = 30;
const MIN_WIDTH = 600;
const MIN_HEIGHT = 200;
const TITLE_LEGEND_GAP = 18;
const MIN_BAR_SEGMENT_WIDTH = 0; // px

class StackedBarChart extends Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    const data = this.props.data;
    const svg = d3.select(this.svgRef.current);
    svg.selectAll("*").remove();
    if (!data || data.length === 0) return;
    const barData = computeBarData(data);
    if (!barData) return;
    const sum = barData.reduce((acc, d) => acc + d.value, 0);
    if (sum === 0) return;
    const width = Math.max(
      typeof window !== "undefined" ? window.innerWidth - 2 * PADDING : 800,
      MIN_WIDTH
    );
    const titleY = HEADER_FONT_SIZE + 8;
    const legendY = titleY + TITLE_LEGEND_GAP + 4;
    const legendRowHeight = LEGEND_ITEM_HEIGHT + 8;
    const legendPerRow = Math.floor((width - 2 * PADDING) / 180) || 1;
    const legendRows = Math.ceil(LEGEND_ITEMS.length / legendPerRow);
    const barY = legendY + legendRows * legendRowHeight + 8;
    const svgHeight = Math.max(
      barY + BAR_HEIGHT + BOTTOM_LABEL_HEIGHT + 24,
      MIN_HEIGHT
    );
    let barDataWithPct = barData.map((d) => ({ ...d, pct: d.value / sum }));
    let totalBarWidth = width - 2 * PADDING;
    let pixelWidths = barDataWithPct.map((d) => d.pct * totalBarWidth);
    let minWidthFlags = pixelWidths.map((w) => w < MIN_BAR_SEGMENT_WIDTH);
    let minWidthCount = minWidthFlags.filter(Boolean).length;
    let minWidthTotal = minWidthCount * MIN_BAR_SEGMENT_WIDTH;
    let restWidth = totalBarWidth - minWidthTotal;
    let restPctTotal = barDataWithPct.reduce(
      (acc, d, i) => acc + (!minWidthFlags[i] ? d.pct : 0),
      0
    );
    pixelWidths = barDataWithPct.map((d, i) =>
      minWidthFlags[i]
        ? MIN_BAR_SEGMENT_WIDTH
        : restPctTotal > 0
        ? (d.pct / restPctTotal) * restWidth
        : 0
    );
    svg.attr("width", width).attr("height", svgHeight);
    // Header (title)
    svg
      .selectAll(".header-text")
      .data([null])
      .join("text")
      .attr("class", "header-text")
      .attr("x", PADDING)
      .attr("y", titleY)
      .attr("font-size", HEADER_FONT_SIZE)
      .attr("font-weight", 600)
      .text("Incidences and Outcome");
    // Legend
    const legendGroup = svg
      .selectAll(".legend-group")
      .data([null])
      .join("g")
      .attr("class", "legend-group")
      .attr("transform", `translate(${PADDING},${legendY})`);
    const legendItems = legendGroup
      .selectAll(".legend-item")
      .data(LEGEND_ITEMS)
      .join("g")
      .attr("class", "legend-item")
      .attr(
        "transform",
        (d, i) =>
          `translate(${(i % legendPerRow) * 180},${
            Math.floor(i / legendPerRow) * legendRowHeight
          })`
      );
    legendItems
      .selectAll("circle")
      .data((d) => [d])
      .join("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", LEGEND_CIRCLE_RADIUS)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#eee")
      .attr("stroke-width", 1.5);
    legendItems
      .selectAll("text")
      .data((d) => [d])
      .join("text")
      .attr("x", LEGEND_CIRCLE_RADIUS + 6)
      .attr("y", 5)
      .attr("font-size", LEGEND_FONT_SIZE)
      .attr("font-family", "sans-serif")
      .text((d) => d.label);
    // Stacked Bar background
    svg
      .selectAll(".bar-bg")
      .data([null])
      .join("rect")
      .attr("class", "bar-bg")
      .attr("x", PADDING)
      .attr("y", barY)
      .attr("width", totalBarWidth)
      .attr("height", BAR_HEIGHT)
      .attr("fill", "#fff")
      .attr("stroke", "#bbb")
      .attr("stroke-width", 2)
      .attr("rx", 8);
    // Stacked Bar segments
    let barStart = PADDING;
    const barSegments = svg
      .selectAll(".bar-segment")
      .data(barDataWithPct)
      .join("rect")
      .attr("class", "bar-segment")
      .attr("x", (d, i) => {
        const x = barStart;
        barStart += pixelWidths[i];
        return x;
      })
      .attr("y", barY)
      .attr("width", (d, i) => pixelWidths[i])
      .attr("height", BAR_HEIGHT)
      .attr("fill", (d) => d.color)
      .attr("rx", (d, i) => (i === 0 ? 8 : 0))
      .attr("ry", (d, i) => (i === 0 ? 8 : 0))
      .attr("stroke-width", 0)
      .attr("stroke", "none");
    // Percentage labels
    barStart = PADDING;
    svg
      .selectAll(".bar-label")
      .data(barDataWithPct)
      .join("text")
      .attr("class", "bar-label")
      .attr("x", (d, i) => {
        const x = barStart + pixelWidths[i] / 2;
        barStart += pixelWidths[i];
        return x;
      })
      .attr("y", barY + BAR_HEIGHT / 2 + 7)
      .attr("text-anchor", "middle")
      .attr("fill", (d, i) => (i === 0 ? "#fff" : "#222"))
      .attr("font-size", 16)
      .attr("font-family", "sans-serif")
      .attr("font-weight", 600)
      .text((d) =>
        d.pct < 0.01 && d.value > 0 ? "" : `${Math.round(d.pct * 100)}%`
      )
      .filter((d, i) => pixelWidths[i] <= 14)
      .text("");
    // Bottom labels (0 and total)
    svg
      .selectAll(".bar-label-zero")
      .data([null])
      .join("text")
      .attr("class", "bar-label-zero")
      .attr("x", PADDING)
      .attr("y", barY + BAR_HEIGHT + 28)
      .attr("font-size", 16)
      .attr("fill", "#444")
      .attr("font-family", "sans-serif")
      .text("0");
    svg
      .selectAll(".bar-label-total")
      .data([null])
      .join("text")
      .attr("class", "bar-label-total")
      .attr("x", width - PADDING)
      .attr("y", barY + BAR_HEIGHT + 28)
      .attr("font-size", 16)
      .attr("fill", "#444")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "end")
      .text(data.length.toLocaleString());
  }

  render() {
    const data = this.props.data;
    const loading = this.props.loading;
    const width = Math.max(
      typeof window !== "undefined" ? window.innerWidth - 2 * PADDING : 800,
      MIN_WIDTH
    );
    const titleY = HEADER_FONT_SIZE + 8;
    const legendY = titleY + TITLE_LEGEND_GAP + 4;
    const legendRowHeight = LEGEND_ITEM_HEIGHT + 8;
    const legendPerRow = Math.floor((width - 2 * PADDING) / 180) || 1;
    const legendRows = Math.ceil(LEGEND_ITEMS.length / legendPerRow);
    const barY = legendY + legendRows * legendRowHeight + 8;
    const svgHeight = Math.max(
      barY + BAR_HEIGHT + BOTTOM_LABEL_HEIGHT + 24,
      MIN_HEIGHT
    );
    if (!data || data.length === 0) {
      return (
        <div
          style={{
            minWidth: MIN_WIDTH,
            minHeight: MIN_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {loading ? "Loading" : "No data available"}
        </div>
      );
    }
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
          ref={this.svgRef}
          style={{
            width: "100%",
            minWidth: MIN_WIDTH,
            height: svgHeight,
            minHeight: MIN_HEIGHT,
            display: "block",
          }}
        />
      </div>
    );
  }
}

export default StackedBarChart;
