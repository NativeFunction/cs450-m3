import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";
import DropDownFilter from "./DropDownFilter";
import StackedBarChart from "./StackedBarChart";
import pako from "pako";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //list of strings containing the current available vehicle types
      vehicleTypeOptions: [],
    };

    var tempData = [];

    //d3.csv(tips, (x) => tempData.push({
    //  total_bill: parseFloat(x.total_bill),
    //  tip:  parseFloat(x.tip),
    //  sex: (x.sex == "Male" ? true : false),//male true, female false
    //  smoker: (x.smoker == "Yes" ? true : false),
    //  day: x.day,
    //  time: x.time,
    //  size: parseInt(x.size)
    //})).then(() => this.setState({ data: tempData }));
    fetch("cs450-m3/NYCrashes2025.gz")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const decompressedData = pako.inflate(new Uint8Array(buffer), {
          to: "string",
        });

        const parsedData = d3.csvParse(decompressedData, (x) => ({
          "CRASH DATE": x["CRASH DATE"],
          BOROUGH: x["BOROUGH"],
          "NUMBER OF PERSONS INJURED": parseInt(x["NUMBER OF PERSONS INJURED"]),
          "NUMBER OF PERSONS KILLED": parseInt(x["NUMBER OF PERSONS KILLED"]),
          "NUMBER OF PEDESTRIANS INJURED": parseInt(
            x["NUMBER OF PEDESTRIANS INJURED"]
          ),
          "NUMBER OF PEDESTRIANS KILLED": parseInt(
            x["NUMBER OF PEDESTRIANS KILLED"]
          ),
          "NUMBER OF CYCLIST INJURED": parseInt(x["NUMBER OF CYCLIST INJURED"]),
          "NUMBER OF CYCLIST KILLED": parseInt(x["NUMBER OF CYCLIST KILLED"]),
          "NUMBER OF MOTORIST INJURED": parseInt(
            x["NUMBER OF MOTORIST INJURED"]
          ),
          "NUMBER OF MOTORIST KILLED": parseInt(x["NUMBER OF MOTORIST KILLED"]),
          "CONTRIBUTING FACTOR VEHICLE 1": x["CONTRIBUTING FACTOR VEHICLE 1"],
          "CONTRIBUTING FACTOR VEHICLE 2": x["CONTRIBUTING FACTOR VEHICLE 2"],
          "CONTRIBUTING FACTOR VEHICLE 3": x["CONTRIBUTING FACTOR VEHICLE 3"],
          "CONTRIBUTING FACTOR VEHICLE 4": x["CONTRIBUTING FACTOR VEHICLE 4"],
          "CONTRIBUTING FACTOR VEHICLE 5": x["CONTRIBUTING FACTOR VEHICLE 5"],
          "VEHICLE TYPE CODE 1": x["VEHICLE TYPE CODE 1"],
          "VEHICLE TYPE CODE 2": x["VEHICLE TYPE CODE 2"],
          "VEHICLE TYPE CODE 3": x["VEHICLE TYPE CODE 3"],
          "VEHICLE TYPE CODE 4": x["VEHICLE TYPE CODE 4"],
          "VEHICLE TYPE CODE 5": x["VEHICLE TYPE CODE 5"],
          NEIGHBORHOOD: x["NEIGHBORHOOD"],
        }));

        console.log(parsedData.length);
        console.log(parsedData[0]);
        this.setState({ data: parsedData });
      })
      .catch((error) => console.error("Error loading GZ:", error));
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  filterData = () => {};

  renderChart = () => {
    var margin = { left: 50, right: 150, top: 10, bottom: 100 },
      width = 600,
      height = 600;
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;
    var tooltipWidth = 300,
      tooltipHeight = 300;
    var data = this.state.data;

    const svg = d3
      .select(".container")
      .attr("width", width * 2)
      .attr("height", height * 2);
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="header">New York City Motor Vehicle Collisions</div>
          <div className="controls">
            <DropDownFilter
              label="Borough"
              options={[
                "Manhattan",
                "Brooklyn",
                "Queens",
                "Bronx",
                "Staten Island",
              ]}
            />
            <DropDownFilter
              label="Vehicle Type"
              options={this.state.vehicleTypeOptions}
            />
          </div>
          <div className="geomap">
            <svg className="geomap_svg">
              <g className="geomap_group"></g>
            </svg>
          </div>
          <div className="contributingFactors">
            <svg className="contributingFactors_svg">
              <g className="contributingFactors_group"></g>
            </svg>
          </div>
          <div className="incidencesAndOutcome">
            <StackedBarChart />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
