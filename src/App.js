import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";
import DropDownFilter from "./DropDownFilter";
import StackedBarChart from "./StackedBarChart";
import GeoMap from "./GeoMap";
import ContributingFactorsChart from './ContributingFactorsChart'
import DateRangeSlider from "./DateRangeSlider";
import pako from "pako";

class App extends Component {
  constructor(props) {
    super(props);
    this.savedData = [];
    this.borough = "All";
    this.vehType = "All";
    this.state = {
      data: [],
      geoData: {},
      vehicleTypeOptions: [],
      loading: true,
      startDate: new Date(2012, 0, 1),
      endDate: new Date(2025, 11, 31),
    };

    fetch("cs450-m3/NYCrashes2025.gz")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const decompressedData = pako.inflate(new Uint8Array(buffer), {
          to: "string",
        });

        this.savedData = d3.csvParse(decompressedData, (x) => {
          const [month, day, year] = x["CRASH DATE"].split("/");
          return {
            "CRASH DATE": new Date(year, month - 1, day),
            BOROUGH: x["BOROUGH"],
            "NUMBER OF PERSONS INJURED": parseInt(
              x["NUMBER OF PERSONS INJURED"]
            ),
            "NUMBER OF PERSONS KILLED": parseInt(x["NUMBER OF PERSONS KILLED"]),
            "NUMBER OF PEDESTRIANS INJURED": parseInt(
              x["NUMBER OF PEDESTRIANS INJURED"]
            ),
            "NUMBER OF PEDESTRIANS KILLED": parseInt(
              x["NUMBER OF PEDESTRIANS KILLED"]
            ),
            "NUMBER OF CYCLIST INJURED": parseInt(
              x["NUMBER OF CYCLIST INJURED"]
            ),
            "NUMBER OF CYCLIST KILLED": parseInt(x["NUMBER OF CYCLIST KILLED"]),
            "NUMBER OF MOTORIST INJURED": parseInt(
              x["NUMBER OF MOTORIST INJURED"]
            ),
            "NUMBER OF MOTORIST KILLED": parseInt(
              x["NUMBER OF MOTORIST KILLED"]
            ),
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
          };
        });

        console.log(this.savedData.length);
        console.log(this.savedData[0]);
        this.setState({ data: this.savedData, loading: false });
        this.setData(this.savedData);
      })
      .catch((error) => console.error("Error loading GZ:", error));
  }

  componentDidMount() {
    this.renderChart();
  }
/*
  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      this.renderChart();
    }
  }
*/
  setData = (data) => {
    var geoDataTemp = {};
    var vehTypeTemp = {};
    
    
    var largest = 0;
    for (var i = 0; i < data.length; i++) {
      var key = data[i].NEIGHBORHOOD;
      if (geoDataTemp.hasOwnProperty(key)) geoDataTemp[key]++;
      else geoDataTemp[key] = 1;

      if(geoDataTemp[key] > largest)
        largest = geoDataTemp[key];

      for(var j = 1; j <= 5 ; j++)
      {
        var key = data[i][`VEHICLE TYPE CODE ${j}`];
        if (vehTypeTemp.hasOwnProperty(key))
          vehTypeTemp[key]++;
        else
          vehTypeTemp[key] = 1;
      }
    }

    geoDataTemp["__largest__"] = largest;

    this.setState({ geoData: geoDataTemp, vehicleTypeOptions: Object.entries(vehTypeTemp)
      .filter(([key, value]) => value > 1000 && key !== "" && key !== "UNKNOWN")
      .map(([key]) => key) });

  };


  filterData = () => {
    const filteredData = this.savedData.filter(
      (row) =>
        (this.vehType === "All" ||
          row["VEHICLE TYPE CODE 1"] === this.vehType ||
          row["VEHICLE TYPE CODE 2"] === this.vehType ||
          row["VEHICLE TYPE CODE 3"] === this.vehType ||
          row["VEHICLE TYPE CODE 4"] === this.vehType ||
          row["VEHICLE TYPE CODE 5"] === this.vehType) &&
        (this.borough === "All" ||
          row.BOROUGH === this.borough.toUpperCase()) &&
        row["CRASH DATE"] >= this.startDate &&
        row["CRASH DATE"] <= this.endDate
    );

    this.setState({ data: filteredData, loading: false });
    this.setData(filteredData);
  };

  filterBoroughData = (borough) => {
    this.borough = borough;
    this.filterData();
  };

  computeContributingFactors = () => {
    const factorCounts = {};

    this.state.data.forEach((row) => {
      for (let i = 1; i <= 5; i++) {
        const factor = row[`CONTRIBUTING FACTOR VEHICLE ${i}`];
        if (factor && factor !== "" && factor !== "Unspecified") {
          factorCounts[factor] = (factorCounts[factor] || 0) + 1;
        }
      }
    });

    return Object.entries(factorCounts)
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  handleDateRangeChange = ([start, end]) => {
    this.startDate = start;
    this.endDate = end;
    this.setState({ startDate: start, endDate: end });
    setTimeout(() => {
      this.filterData();
    }, 0);
  };
   
  renderChart = () => {
    const width = 600, height = 600;
    d3.select(".container").attr("width", width * 2).attr("height", height * 2);
  };

  render() {
    return (
      <div>
        <div className="container">
          <div className="header">New York City Motor Vehicle Collisions</div>
          <div className="controls">
            <DropDownFilter
              onChange={this.filterBoroughData}
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
              onChange={this.filterVehTypeData}
              label="Vehicle Type"
              options={this.state.vehicleTypeOptions}
            />
            <DateRangeSlider
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.handleDateRangeChange}
            />
          </div>
          <div className="geoMapAndContFactors">
            <GeoMap data={this.state.geoData} />
            <div className="contributingFactors">
            <ContributingFactorsChart data={this.computeContributingFactors()} />
            </div>
          </div>

          <div className="incidencesAndOutcome">
            <StackedBarChart
              data={this.state.data}
              loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
