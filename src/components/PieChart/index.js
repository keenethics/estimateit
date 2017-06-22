import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RC2 from 'react-chartjs2';

import initialData from '../../constants/pieChartInitialData';

export default class PieChart extends Component {
  constructor(props) {
    super(props);

    this.options = {
      options: {
        responsive: true,
      },
    };
  }

  generateData() {
    const { data } = this.props;
    console.log(data);

    initialData.datasets[0].data = initialData.labels.map(e => {
      return data[e]
    });
    console.log(initialData);
    // if (typeof data !== 'undefined') {
    //   Object.keys(data).forEach((key, i) => {
    //     // this.data[i].value = data[key];
    //   });
    // }
  }

  render() {
    this.generateData();
    return (
      <div>
        <RC2
          type="pie"
          data={initialData}
          options={this.options}
        />
      </div>
    );
  }
}

PieChart.propTypes = {
  data: PropTypes.object.isRequired,
};
