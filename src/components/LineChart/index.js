import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, CardBlock } from 'reactstrap';
import ReactHighcharts from 'react-highcharts';

import Slider from '../Slider';

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.getChart = this.getChart.bind(this);
    this.generateData = this.generateData.bind(this);
  }

  getChart(chartComponent) {
    if (chartComponent) {
      chartComponent.getChart();
    }
  }

  generateData() {
    const { percent } = this.props;
    const data = this.props.time.map((item, i) => [item, percent[i]]);
    const {
      probabilityTime,
      probabilityPercent,
      time,
    } = this.props;

    const veriticalLine = [
      [probabilityTime, 0],
      [probabilityTime, probabilityPercent],
    ]
    const horizontalLine = [
      [time[0], probabilityPercent],
      [probabilityTime, probabilityPercent],
    ]
    console.log(veriticalLine);
    this.config = {
      chart: {
        type: 'spline',
        inverted: false,
      },
      title: {
        text: 'Probability of project completing',
      },
      subtitle: {
        text: 'According to filled tasks and params',
      },
      xAxis: {
        title: {
          text: 'Hours',
        },
        labels: {
          formatter() {
            return `${this.value}h`;
          },
        },
        lineWidth: 2,
      },
      yAxis: {
        reversed: false,
        title: {
          enabled: true,
          text: 'Probability (Code Quality)',
        },
        labels: {
          formatter() {
            return `${this.value}%`;
          },
        },
        maxPadding: 0.05,
        showLastLabel: false,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        enable: false,
      },
      plotOptions: {
        spline: {
          marker: {
            enable: false,
          },
        }
      },
      // chart.plotOptions.line.marker.enabled = false
      series: [
        {
          name: 'Probability',
          data,
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x}h:  {point.y}%',
          },
          zIndex: 9999,
        },
        {
          type: 'line',
          data: veriticalLine,
          lineWidth: 1,
          color: 'black',
          dashStyle: 'Dash',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
          states: {
            hover: {
              enabled: false,
            },
          },
        },
        {
          type: 'line',
          data: horizontalLine,
          lineWidth: 1,
          color: 'black',
          dashStyle: 'Dash',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      ],
    };
  }

  render() {
    this.generateData();
    const {
      probabilityTime,
      userCanEditThisEstimate,
      calculateProbabilityTime,
    } = this.props;

    return (
      <Card>
        <CardBlock>
          <ReactHighcharts
            width="800"
            height="500"
            ref={this.getChart}
            config={this.config}
          />
        </CardBlock>
        <CardBlock>
          <Field
            title="Probability"
            component={Slider}
            probabilityTime={probabilityTime}
            name="estimateOptions.probability"
            disabled={!userCanEditThisEstimate}
            handleChange={calculateProbabilityTime}
          />
        </CardBlock>
      </Card>
    );
  }
}

LineChart.propTypes = {
  time: PropTypes.array.isRequired,
  percent: PropTypes.array.isRequired,
  probabilityTime: PropTypes.number.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
  calculateProbabilityTime: PropTypes.func.isRequired,
};

export default LineChart;
