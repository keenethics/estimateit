import React from 'react';
import { Line } from "react-chartjs";


export default class LineChart  extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    }
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

    this.getChart = this.getChart.bind(this);
    this.generateData = this.generateData.bind(this);
  }

  getChart(chartComponent) {
    if(chartComponent) {
      console.log(chartComponent.getChart());;
    }
  }

  generateData() {
      this.data = {
        datasets:[
        {
          data: this.props.data,
          fillColor: 'rgba(220,220,220,0.2)',
          label: 'estimate',
          pointColor: 'rgba(220,220,220,1)',
          pointHighloghtFill: '#fff',
          pointHighloghtStroke: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          strokeColor: 'rgba(220,220,220,1)',
        }
      ],
      labels: this.props.labels,
    }
  }

  render() {
    this.generateData();
    return (
      <div className="lineChartWrapper">
        <Line
          data={this.data}
          ref={this.getChart}
          options={this.options}
          width="800"
          height="500" />

      </div>
    )
  }
}
