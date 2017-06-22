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

  render() {
    const { data } = this.props;

    initialData.datasets[0].data = initialData.labels.map(e => data[e]);

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
