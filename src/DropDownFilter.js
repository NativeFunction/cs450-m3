import React, { Component } from "react";

class DropDownFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentVal: "All"
        };
    }

  render() {

    const options = this.props.options.map(x => <option value={x}>{x}</option>);

    const handleChange = (event) => {
        this.setState({currentVal: event.target.value})
        this.props.onChange(event.target.value)
    };

    return (
      <div className="control">
        <div className="label">{this.props.label}</div>
        <select className="dropdown" value={this.state.currentVal} onChange={handleChange}>
          <option value="All">All</option>
          {options}
        </select>
      </div>
    );
  }
}

export default DropDownFilter;