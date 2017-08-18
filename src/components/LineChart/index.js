import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Card, CardBlock } from 'reactstrap';
import ReactHighcharts from 'react-highcharts';

import Slider from '../Slider';

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.generateData = this.generateData.bind(this);
  }

  getChart = (chartComponent) => {
    if (chartComponent) {
      chartComponent.getChart();
    }
  }

  generateData() {
    const { percents } = this.props;
    const data = this.props.time.map((item, i) => [Math.round(item / 60), percents[i]]);
    const {
      probabilityTime,
      probabilityPercent,
      time,
    } = this.props;

    const veriticalLine = [
      [Math.round(probabilityTime / 60), 0],
      [Math.round(probabilityTime / 60), probabilityPercent],
    ];
    const horizontalLine = [
      [Math.round(time[0] / 60), probabilityPercent],
      [Math.round(probabilityTime / 60), probabilityPercent],
    ];

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
          text: 'Probability',
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
      plotOptions: {
        spline: {
          marker: {
            enable: false,
          },
        },
      },
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
      actionChangeProbabilityTime,
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
            time={probabilityTime}
            shortName="probability"
            name="estimateOptions.probability"
            disabled={!userCanEditThisEstimate}
            handleChange={actionChangeProbabilityTime}
          />
        </CardBlock>
      </Card>
    );
  }
}

LineChart.propTypes = {
  probabilityTime: PropTypes.number.isRequired,
  probabilityPercent: PropTypes.number.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
  time: PropTypes.arrayOf(PropTypes.number).isRequired,
  actionChangeProbabilityTime: PropTypes.func.isRequired,
  percents: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default LineChart;
