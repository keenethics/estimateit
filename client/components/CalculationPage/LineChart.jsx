import React from 'react';
import { Line } from "react-chartjs";
import ReactHighcharts from 'react-highcharts';


export default class LineChart  extends React.Component{
  constructor(props) {
    super(props);

    this.getChart = this.getChart.bind(this);
    this.generateData = this.generateData.bind(this);
  }

  getChart(chartComponent) {
    if(chartComponent) {
      console.log(chartComponent.getChart());;
    }
  }

  generateData() {
    const data = this.props.labels.sort((a, b) => a - b)
      .map((item, i) => [ item, Math.round((100 * i / (this.props.labels.length - 1)) * 100) / 100 ]);

    this.config = {
      chart: {
       type: 'spline',
       inverted: false
       },
       title: {
           text: 'Probability of project completing'
       },
       subtitle: {
           text: 'According to filled tasks and params'
       },
       xAxis: {
           title: {
               text: 'Hours'
           },
           labels: {
               formatter: function () {
                   return this.value + 'h';
               }
           },
           lineWidth: 2
       },
       yAxis: {
           reversed: false,
           title: {
               enabled: true,
               text: 'Probability (Code Quality)'
           },
           labels: {
               formatter: function () {
                   return this.value + '%';
               }
           },
           maxPadding: 0.05,
           showLastLabel: false
       },
       legend: {
           enabled: false
       },
       tooltip: {
           headerFormat: '<b>{series.name}</b><br/>',
           pointFormat: '{point.x}h:  {point.y}%'
       },
       plotOptions: {
           spline: {
               marker: {
                   enable: false
               }
           }
       },
       series: [{
           name: 'Probability',
           data: data
       }]
    };
  }

  render() {
    this.generateData();
    return (
      <div className="lineChartWrapper">
        <ReactHighcharts
        config={this.config}
        ref={this.getChart}
        width="800" height="500" />
      </div>
    )
  }
}
