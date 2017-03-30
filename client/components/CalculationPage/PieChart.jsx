import React from 'react';
import { Pie } from "react-chartjs";

export default class PieChart extends React.Component{
  constructor(props) {
    super(props)
    this.data = [
      {
        color: '#F7464A',
        highlight: '#FF5A5E',
        label: 'Red',
        value: 50,
      },
      {
        color: '#46BFBD',
        highlight: '#5AD3D1',
        label: 'Green',
        value: 20,
      },
      {
        color: '#FDB45C',
        highlight: '#FFC870',
        label: 'Yellow',
        value: 50,
      },
    ]
    
    this.options = {
      animation:{
        animateScale:true
      }
    }
  }
  
  render() {

    return (
      <div className="pieChartWrapper">
        <Pie data={this.data} options={this.options} width="200" height="200" />
      </div>
    )
  }
  
}