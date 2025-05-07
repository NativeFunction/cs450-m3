import React, { Component } from "react";
import "./GeoMap.css";
import * as d3 from "d3";
import nyc_neighborhoods from "./nyc_neighborhoods.json"

class GeoMap extends Component {
  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate() {
    this.renderChart()
  }

  safeDiv = (x, y) =>
  {
    if(y === undefined || x === undefined || y === 0)
      return 0;
    var res = x / y;
    if (res === NaN)
      return 0;

    return res;
  }

  getNeighborhoodCrashPercent = (neighborhood) =>
  {
    return this.safeDiv(this.props.data[neighborhood], this.props.data["__largest__"]);
  }

  renderChart = () => {

    var svg = d3.select(".geomap_svg");
    var map = d3.select(".geomap_map");
    var legend = d3.select(".geomap_legend_content");
    
    var width = 500;
    var height = 500;

    var path = d3.geoPath()
      .projection(d3.geoConicConformal()
      .parallels([0, 0])
      .rotate([96, 0])
      .fitSize([width, height], nyc_neighborhoods));
  
      console.log(this.props.data)
      console.log(this.props.total)

      const colorScale = d3.scaleThreshold().domain([0.001, 0.2, 0.4, 0.6, 0.8]).range(["#AFAFAF", "#FED976", "#FEB24C", "#FC4E2A", "#BD0026", "#4D004B"]);

      map.selectAll("path")
      .data(nyc_neighborhoods.features)
      .join("path")
      .attr("d", path)
      .attr("class", "geomap_neighborhood")
      .attr("fill", d => colorScale(this.getNeighborhoodCrashPercent(d.properties.neighborhood)))
      .on("mousemove", (event, d) => {
        d3.select(event.target)
        .style("stroke-width", 1.5)
        .style("stroke-dasharray", 0)
  
        d3.select("#neighborhoodDisplay")
        .style("opacity", 1)
        .style("left", (event.x + 10) + "px")
        .style("top", (event.y - 10) + "px")
        .text(`${d.properties.neighborhood} ${(this.getNeighborhoodCrashPercent(d.properties.neighborhood) * 100).toFixed(2)}%`)

      })
      .on("mouseleave", (event, d) => {
        d3.select(event.target)
        .style("stroke-width", .25)
        .style("stroke-dasharray", 1)
  
        d3.select("#neighborhoodDisplay")
        .style("opacity", 0);
      });
    //console.log(nyc_neighborhoods)

    var legendItemWidth = 20,legendItemHeight = 20,legendXPos=width + 20, legendYPos=30;
    var legendData = [0.8, 0.6, 0.4, 0.2, 0.1, 0]
    var legendTextData = ["≥80%","<80%","<60%","<40%","<20%","0%",]
    
    legend.selectAll("rect")
      .data(legendData)
      .join("rect")
      .attr("x", legendXPos)
      .attr("y", (d, i) => legendYPos + i * (legendItemHeight + 10))
      .attr("width", legendItemWidth)
      .attr("height", legendItemHeight)
      .attr("fill", d => colorScale(d));

    legend.selectAll("text")
      .data(legendTextData)
      .join("text")
      .attr("x", legendXPos+legendItemWidth+2)
      .attr("y", (d, i) => legendYPos + (i * (legendItemHeight + 10)) + (legendItemHeight)/2)
      .attr("alignment-baseline", "middle")
      .text(d => d)
      .style("font-size", "14px")
      .style("fill", "black");

  }

  render() {

    return (
      <div className="geomap" width="800" height="500">
          <div id='neighborhoodDisplay'> </div>
          <svg className="geomap_svg" width="800" height="500">
            <g className="geomap_map"></g>
            <g className="geomap_legend">
              <g className="geomap_legend_title">
                <text x="520" y="15">Crash %</text>
              </g>
              <g className="geomap_legend_content"></g>
            </g>
          </svg>
      </div>
    );
  }
}

export default GeoMap;