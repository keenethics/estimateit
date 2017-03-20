import React from 'react';
import { Line } from "react-chartjs";


export default class LineChart  extends React.Component{
  constructor(props) {
    super(props);
    this.data = {
      datasets:[
        {
          data: [100,200,300,100,50],
          fillColor: 'rgba(220,220,220,0.2)',
          label: 'estimate',
          pointColor: 'rgba(220,220,220,1)',
          pointHighloghtFill: '#fff',
          pointHighloghtStroke: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          strokeColor: 'rgba(220,220,220,1)',
        }
      ],
      labels: [10, 20, 30, 40, 50]
    }
    
    this.options = {
      animation:{
        animateScale:true
      }
    }
  }
  
  render() {
    return (
      <div className="lineChartWrapper">
        <Line data={this.data} options={this.options} width="500" height="200" />
      
      </div>
    )
  }
}