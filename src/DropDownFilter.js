import React, { Component } from "react";

class DropDownFilter extends Component {
  render() {

    const options = this.props.options.map(x => <option value={x}>{x}</option>)

    const handleChange = (event) => {
        this.props.onChange(event.target.value)
    };

    return (
      <div className="control">
        <div className="label">{this.props.label}</div>
        <select onChange={handleChange}>
          <option value="All">All</option>
          {options}
        </select>
      </div>
    );
  }
}

export default DropDownFilter;