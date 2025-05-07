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
      if(y == undefined || x == undefined || y == 0)
        return 0;
      var res = x / y;
      if (res == NaN)
        return 0;

      return res;
    }
  
    renderChart = () => {
  
      var svg = d3.select(".geomap_svg");
      var group = d3.select(".geomap_group");
      
      var width = 500;
      var height = 500;

      var path = d3.geoPath()
        .projection(d3.geoConicConformal()
        .parallels([33, 45])
        .rotate([96, -39])
        .fitSize([width, height], nyc_neighborhoods));
    
        console.log(this.props.data)
        console.log(this.props.total)

        const colorScale = d3.scaleThreshold().domain([0.2, 0.4, 0.6, 0.8]).range(["#FED976", "#FEB24C", "#FC4E2A", "#BD0026", "#4D004B"]);

        group.selectAll("path")
        .data(nyc_neighborhoods.features)
        .join("path")
        .attr("d", path)
        .attr("class", "geomap_neighborhood")
        .attr("fill", d => colorScale(this.safeDiv(this.props.data[d.properties.neighborhood], this.props.data["__largest__"])))
        .on("mousemove", function(d) {
          //console.log(d);
          d3.select(this)
          .style("stroke-width", 1.5)
          .style("stroke-dasharray", 0)
    
          d3.select("#neighborhoodDisplay")
          .style("opacity", 1)
          .style("left", (d.x + 10) + "px")
          .style("top", (d.y - 10) + "px")
          .text(d.target.__data__.properties.neighborhood)

          //console.log(d.target.__data__.properties.neighborhood)
        })
        .on("mouseleave", function(d) { 
          d3.select(this)
          .style("stroke-width", .25)
          .style("stroke-dasharray", 1)
    
          d3.select("#neighborhoodDisplay")
          .style("opacity", 0);
        });
      //console.log(nyc_neighborhoods)
    }

  render() {

    return (
      <div className="geomap" width="800" height="500">
          <div id='neighborhoodDisplay'> </div>
          <svg className="geomap_svg" width="500" height="500">
            <g className="geomap_group"></g>
          </svg>
      </div>
    );
  }
}

export default GeoMap;