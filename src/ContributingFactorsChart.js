import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ContributingFactorsChart = ({ data }) => {
  const svgRef = useRef();
  const [sortedData, setSortedData] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 50, left: 100 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const sorted = data.sort((a, b) => b.count - a.count).slice(0, 5);
    setSortedData(sorted);

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(200)");

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(sorted, (d) => d.count)])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(sorted.map((d) => d.factor))
      .range([0, height])
      .padding(0.1);

    svg
      .selectAll("rect")
      .data(sorted)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.factor))
      .attr("width", (d) => x(d.count))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2")
      .on("mouseenter", (event, d) => {
        setHovered(d);
      })
      .on("mouseleave", () => {
        setHovered(null);
      });

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("g")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x).ticks(5));
  }, [data]);

  return (
    <div className="contributingFactors">
      <h2>Contributing Factors Leading to a Crash</h2>
      <svg ref={svgRef}></svg>
      <div
        style={{
          marginTop: "12px",
          minHeight: "40px",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "600",
          color: hovered ? "#333" : "#999",
          transition: "color 0.3s",
          userSelect: "none",
        }}
      >
        {hovered
          ? hovered.factor + ": " + hovered.count
          : "Hover over a bar to see details"}
      </div>
    </div>
  );
};

export default ContributingFactorsChart;
