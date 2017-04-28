import React, { Component } from 'react';
import { Card, CardBlock, Row, Col } from 'reactstrap';
import DiscreteVector from 'discrete-vector';
import Calculation from '../Calculation';
import FinalEstimate from '../FinalEstimate';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import styles from './styles.scss';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      calculationData: {
        qa: 10,
        pm: 10,
        bugFixes: 10,
        risks: 10,
        completing: 90,
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
    if (location.href === `${location.origin}/`) return;
    const loc = decodeURIComponent(location.href);
    const state = JSON.parse(loc.split('?').pop());
    const tasks = this.parseUrlData(state.tasks);
    this.setState({ tasks }, () => {
      this.calculateAmountOfHours();
    });
  }

  parseUrlData(data) {
    const arr = data.reduce((value, item) => {
      const itemArr = [];
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
    this.T = vector.combinations < 1000 ?
      Array(vector.combinations).fill().map((prev, item) => this.embodiment(tasksHours, vector.next())).sort((a, b) => a - b) :
      Array(1000).fill().map((prev, item) => this.embodiment(tasksHours, vector.randomize())).sort((a, b) => a - b);
    this.labels = this.T.map(item => Math.round(item));
    this.data = this.T.map((item, i) => Math.round(100 * i / (this.T.length - 1)));
    this.calcDeveloperHours(tasksHours);
    this.calculateAmountOfHours();
  }
  calcDeveloperHours(data) {
    this.devHours = data.reduce((acc, value) => ({
      minHours: acc.minHours += +value[1],
      maxHours: acc.maxHours += +value[0],
    }), { minHours: 0, maxHours: 0 });
  }

  calculateAmountOfHours() {
    const percent = this.state.calculationData.completing;

    let highestIndex = this.data.findIndex(item => item > percent);

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
    console.log('onCalculationChange', calculationData);
    this.setState({ calculationData });
    console.info('state', this.state);
    this.calculateAmountOfHours();
  }

  onRateChange(rate) {
    this.setState({ rate });
    this.calculateAmountOfHours();
  }

  render() {
    this.transformToVector();
    return (
      <Row className={styles.main}>
        <Col xs="12">
          <LineChart
            labels={this.labels}
            data={this.data}
          />
        </Col>
        <Col xs="12">
          <Card className={styles.final}>
            <CardBlock className={styles.final__wrapper}>
              <div className={styles.final__result}>
                <div className={styles.final__result_info}>Total developer min hours: {this.devHours.maxHours}</div>
              </div>
              <div className={styles.final__result}>
                <div className={styles.final__result_info}>Total developer max hours: {this.devHours.minHours}</div>
              </div>
            </CardBlock>
          </Card>
        </Col>
        <Col xs="12">
          <Calculation
            hours={this.hours}
            data={this.state.calculationData}
            rate={this.state.rate}
            onRateChange={this.onRateChange}
            onCalculationChange={this.onCalculationChange}
          />
        </Col>
        <Col xs="12">
          <FinalEstimate
            hours={this.hours}
            rate={this.state.rate}
            calculationData={this.state.calculationData}
            data={this.props.someProp}
          />
        </Col>
        <Col xs="12">
          <Contacts />
        </Col>
      </Row>
    );
  }
}
