import React from 'react';

import EstimateOptions from './EstimateOptions.jsx';
import PieChart from './PieChart.jsx';

import './style/calculations.css';

export default class Calculation extends React.Component{
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className="calculation">
        <PieChart />
        <EstimateOptions />
      </div>
    )
  }
  
}