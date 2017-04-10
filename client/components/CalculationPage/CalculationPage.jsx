import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import DiscreteVector from 'discrete-vector';
import Calculation from './Calculation.jsx';
import FinalEstimate from './FinalEstaimate.jsx';
import Contacts from './Contacts.jsx';
import LineChart from './LineChart.jsx';

export default class CalculationPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      calculationData: {
        qa: 10,
        pm: 10,
        bugFixes: 10,
        risks: 10,
        completing: 90
      },
      rate: 25,
      hours: 0,
    };

    this.T = [];
    this.embodiment = this.embodiment.bind(this);
    this.transformToVector = this.transformToVector.bind(this);
    this.calculateAmountOfHours = this.calculateAmountOfHours.bind(this);
    this.onCalculationChange = this.onCalculationChange.bind(this);
    this.onRateChange = this.onRateChange.bind(this);
    this.parseUrlData = this.parseUrlData.bind(this);
  }

  componentDidMount() {
    if (location.href === location.origin + '/') return;
    const loc = decodeURIComponent(location.href);
    const state = JSON.parse(loc.split('?').pop());
    const tasks = this.parseUrlData(state.tasks);
    this.setState({ tasks }, () => {
      this.calculateAmountOfHours();

    });
  };

  parseUrlData(data) {

    let arr = data.reduce((value, item) => {
      let itemArr = [];
      if (item.tasks) {
        itemArr = item.tasks.reduce((value2, item2) => {
          if (item2.tasks) {
            value2 = value2.concat(item2.tasks.map((task) => [Number(task.minimumHours), Number(task.maximumHours)]))
          }
          value2.push([Number(item2.minimumHours), Number(item2.maximumHours)])
          return value2;
        }, [])
        console.log(itemArr, 'arrrrr');
      }
      itemArr.push([Number(item.minimumHours), Number(item.maximumHours)]);
      return value.concat(itemArr);
    }, []);

    return arr;
  }

  embodiment(a, b) {
    return a.reduce((prev, item, i) => prev + item[b[i]], 0);
  }

  transformToVector() {
    const tasksHours = this.parseUrlData(this.props.someProp);
    const vector = new DiscreteVector(tasksHours);

    this.T = Array(vector.combinations).fill().map((prev, item) => this.embodiment(tasksHours, vector.next())).sort((a, b) => a - b);
    this.labels = this.T.map((item) => Math.round(item));
    this.data = this.T.map((item, i) => Math.round(100 * i / (this.T.length - 1)));
    this.calculateAmountOfHours();
  }

  calculateAmountOfHours() {
    const percent = this.state.calculationData.completing;

    let highestIndex = this.data.findIndex((item) => item > percent);

    if (highestIndex === -1) {
      highestIndex = this.data.length - 1;
    }
    const hours = this.labels[highestIndex];

    const additionalHourse = hours * (this.state.calculationData.pm + this.state.calculationData.qa +
      this.state.calculationData.bugFixes + this.state.calculationData.risks) / 100;

    const totalHours = Math.round(hours + additionalHourse);

    this.hours = totalHours;
  }

  onCalculationChange(calculationData) {
    this.setState({ calculationData });
    this.calculateAmountOfHours();
  }

  onRateChange(rate) {
    this.setState({ rate });
    this.calculateAmountOfHours();
  }

  render() {
    this.transformToVector();
    return (
      <Row>
        <Col xs="12">
          <LineChart
            labels={this.labels}
            data={this.data} />
        </Col>
        <Col xs="12">
          <Calculation
            hours={this.hours}
            data={this.state.calculationData}
            rate={this.state.rate}
            onRateChange={this.onRateChange}
            onCalculationChange={this.onCalculationChange} />
        </Col>
        <Col xs="12">
          <FinalEstimate
            hours={this.hours}
            rate={this.state.rate} />
        </Col>
        <Col xs="12">
          <Contacts />
        </Col>
      </Row>
    )
  }
}
