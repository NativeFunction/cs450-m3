import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const DateRangeSlider = ({ startDate, endDate, onChange }) => {
  const sliderRef = useRef();
  const [range, setRange] = useState([startDate, endDate]);
  const range2 = [startDate, endDate]

  useEffect(() => {
    const svg = d3.select(sliderRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 50;
    const margin = { left: 20, right: 20 };

    const x = d3.scaleTime()
      .domain([new Date(2012, 0, 1), new Date(2025, 11, 31)])
      .range([margin.left, width - margin.right])
      .clamp(true);

    const drag = d3.drag()
      .on("start drag", function (event, d) {
        const xDate = x.invert(event.x);
        const roundedDate = new Date(xDate.getFullYear(), xDate.getMonth());
        const index = event.subject;
        range2[index] = roundedDate;
        setRange((prev) => {
          const newRange = [...prev];
          newRange[d] = roundedDate;
          if (d === 0 && newRange[0] > newRange[1]) newRange[1] = newRange[0];
          if (d === 1 && newRange[1] < newRange[0]) newRange[0] = newRange[1];
          return newRange;
        });
      })
      .on("end", () => {
        onChange(range2);
      });

    svg.append("line")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 4);

    svg.selectAll("circle")
      .data([0, 1])
      .enter()
      .append("circle")
      .attr("r", 8)
      .attr("fill", "steelblue")
      .attr("cy", height / 2)
      .attr("cx", (d) => x(range[d]))
      .call(drag);

  }, [range]);

  const formatDate = (date) => d3.timeFormat("%b %Y")(date);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Date Range</h2> {/* Add this line for the header */}
      <svg ref={sliderRef} width={400} height={50}></svg>
      <div style={{ display: "flex", gap: "20px", marginTop: "5px", alignItems: "flex-end" }}>
        <div style={{ textAlign: "center" }}>
          <small>Earliest</small> {/* Add this line for the small header */}
          <input type="text" readOnly value={formatDate(range[0])} />
        </div>
        <div style={{ textAlign: "center" }}>
          <small>Latest</small> {/* Add this line for the small header */}
          <input type="text" readOnly value={formatDate(range[1])} />
        </div>
      </div>
    </div>
  );
};
export default DateRangeSlider;

