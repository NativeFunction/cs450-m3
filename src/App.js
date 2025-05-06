import React, { Component } from "react";
import "./App.css";
import * as d3 from 'd3';
import DropDownFilter from "./DropDownFilter";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      //list of strings containing the current available vehicle types
      vehicleTypeOptions: []
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

  }



  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate() {
    this.renderChart()
  }

  filterData = () => {

  }

  renderChart = () => {

    var margin = { left: 50, right: 150, top: 10, bottom: 100 }, width = 600, height = 600;
    var innerWidth = width - margin.left - margin.right
    var innerHeight = height - margin.top - margin.bottom
    var tooltipWidth = 300, tooltipHeight = 300
    var data = this.state.data;

    const svg = d3.select(".container").attr("width", width * 2).attr("height", height * 2);


  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="header">New York City Motor Vehicle Collisions</div>
          <div className="controls">
            <DropDownFilter label="Borough" options={["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]} />
            <DropDownFilter label="Vehicle Type" options={this.state.vehicleTypeOptions} />
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
            <svg className="incidencesAndOutcome_svg">
              <g className="incidencesAndOutcome_group"></g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default App;