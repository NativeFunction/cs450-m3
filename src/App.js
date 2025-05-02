import React, { Component } from "react";
import "./App.css";
import * as d3 from 'd3';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate() {
    this.renderChart()
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
        <div className="parent">
          <div className="child0">
            <svg className="container">
              <g className="inner_chart"></g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
