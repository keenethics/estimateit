import React from 'react';

import EstimateOptions from './EstimateOptions.jsx';
import PieChart from './PieChart.jsx';

import './style/calculations.css';

export default class Calculation extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
    
    this.onDataChange = this.onDataChange.bind(this);
  }
  
  onDataChange(data) {
    this.setState({ data });
  }
  
  render() {
    return (
      <div className="calculation">
        <PieChart data={this.state.data}/>
        <EstimateOptions onDataChnage={this.onDataChange}/>
      </div>
    )
  }
  
}