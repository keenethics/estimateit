import React from 'react';
import { Pie } from "react-chartjs";

export default class PieChart extends React.Component{
  constructor(props) {
    super(props)
    this.data = [
      {
        color: '#F7464A',
        highlight: '#FF5A5E',
        label: 'bugFixes',
        value: 50,
      },
      {
        color: '#46BFBD',
        highlight: '#5AD3D1',
        label: 'pm',
        value: 20,
      },
      {
        color: '#FDB45C',
        highlight: '#FFC870',
        label: 'qa',
        value: 50,
      },
      {
        color: '#949FB1',
        highlight: '#A8B3C5',
        label: 'risks',
        value: 50,
      },
      {
        color: '#4D5360',
        highlight: '#616774',
        label: 'completing',
        value: 50,
      }
    ]

    this.options = {
      animation:{
        animateScale:true
      }
    }
  }

  generateData() {
    this.data[0].value = this.props.data.bugFixes;
    this.data[1].value = this.props.data.pm;
    this.data[2].value = this.props.data.qa;
    this.data[3].value = this.props.data.risks;
    this.data[4].value = this.props.data.completing;

  }

  render() {
    this.generateData();
    return (
      <div className="pieChartWrapper">
        <Pie data={this.data} options={this.options} width="300" height="300" />
      </div>
    )
  }

}
