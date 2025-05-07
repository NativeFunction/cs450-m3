import React, { Component } from "react";

class DropDownFilter extends Component {
  render() {

    const options = this.props.options.map(x => <option value={x}>{x}</option>)
    return (
      <div className="control">
        <div className="label">{this.props.label}</div>
        <select /*value={selectedValue} onChange={handleChange}*/>
          <option value="All">All</option>
          {options}
        </select>
      </div>
    );
  }
}

export default DropDownFilter;