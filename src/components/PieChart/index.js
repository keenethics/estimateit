import React, { Component } from 'react';
import { Pie } from 'react-chartjs';

export default class PieChart extends Component {
  constructor(props) {
    super(props);
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
      },
    ];

    this.options = {
      animation: {
        animateScale: true,
      },
      options: {
        responsive: true,
      },
    };
  }

  generateData() {
    const { data } = this.props;

    if (typeof data !== 'undefined') {
      Object.keys(data).forEach((key, i) => {
        this.data[i].value = data[key];
      });
    }
  }

  render() {
    this.generateData();
    return (
      <div>
        <Pie
          data={this.data}
          options={this.options}
        />
      </div>
    );
  }

}
