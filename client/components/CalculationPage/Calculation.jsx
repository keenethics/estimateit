import React from 'react';

import EstimateOptions from './EstimateOptions.jsx';
import PieChart from './PieChart.jsx';

import './style/calculations.css';

export default class Calculation extends React.Component{
  constructor(props) {
    super(props)

    this.onDataChange = this.onDataChange.bind(this);
    this.onRateChange = this.onRateChange.bind(this);
  }

  onDataChange(data) {
     this.props.onCalculationChange(data)
  }

  onRateChange(rate) {
    this.props.onRateChange(rate)

  }

  render() {
    return (
      <div className="calculation">
        <PieChart data={this.props.data}/>
        <EstimateOptions
          hours={this.props.hours}
          onRateChange={this.onRateChange}
          onDataChange={this.onDataChange}/>
      </div>
    )
  }

}
