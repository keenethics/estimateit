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
      calculationData: {
        qa: 10,
        pm: 10,
        bugFixes: 10,
        risks: 10,
        completing: 100,
      },
      estimateFieldsAmount: {
        qa: 0,
        pm: 0,
        bugFixes: 0,
        risks: 0,
        completing: 0,
      },
      rate: 25,
      hours: 0,
    };

    this.T = [];
    this.labels = [];
    this.embodiment = this.embodiment.bind(this);
    this.transformToVector = this.transformToVector.bind(this);
    this.calculateAmountOfHours = this.calculateAmountOfHours.bind(this);
    this.parseTaskHours = this.parseTaskHours.bind(this);
  }

  componentDidMount() {
    this.transformToVector();
    this.calcDeveloperHours(this.parseTaskHours(this.props.tasks));
    this.calculateAmountOfHours();
  }

  componentWillReceiveProps(nextProps) {
    // TODO: Make it more beautiful
    if (JSON.stringify(this.props.tasks) !== JSON.stringify(nextProps.tasks)) {
      this.calcDeveloperHours(this.parseTaskHours(nextProps.tasks));

    }
  }
  componentDidUpdate() {
    this.transformToVector();
    this.calculateAmountOfHours();
  }

  transformToVector() {
    const tasksHours = this.parseTaskHours(this.props.tasks);
    const vector = new DiscreteVector(tasksHours);
    this.T = vector.combinations < 1000
      ? Array(vector.combinations)
          .fill()
          .map((prev, item) => this.embodiment(tasksHours, vector.next()))
          .sort((a, b) => a - b)
      : Array(1000)
          .fill()
          .map((prev, item) => this.embodiment(tasksHours, vector.randomize()))
          .sort((a, b) => a - b);
    this.labels = this.T.map(item => Math.round(item));
    this.data = this.T.map((item, i) =>
      Math.round(100 * i / (this.T.length - 1)),
    );
  }

  embodiment(a, b) {
    return a.reduce((prev, item, i) => prev + item[b[i]], 0);
  }

  calcDeveloperHours(data) {
    const sum = data.reduce(
      (acc, value) => ({
        minHours: (acc.minHours += +value[0]),
        maxHours: (acc.maxHours += +value[1]),
      }),
      { minHours: 0, maxHours: 0 },
    );
    this.props.calcDevHours(sum);
  }

  parseTaskHours(data) {
    return data.map(item => [item.minimumHours, item.maximumHours]);
  }

  calculateAmountOfHours() {
    const { pm, qa, bugFixes, risks, completing } = this.props.options;
    let highestIndex = this.data.findIndex(item => item > completing);
    if (highestIndex === -1) {
      highestIndex = this.data.length - 1;
    }
    const hours = this.labels[highestIndex];
    const additionalHourse = hours * (pm + qa + bugFixes + risks) / 100;
    const totalHours = Math.round(hours + additionalHourse);
    this.state.hours = totalHours;
  }

  render() {
    const { minHours, maxHours } = this.props.devHours;
    this.transformToVector();
    return (
      <Row className={styles.main}>
        <Col xs="12">
          <LineChart labels={this.labels} data={this.data} />
        </Col>
        <Col xs="12">
          <Card className={styles.final}>
            <CardBlock className={styles.final__wrapper}>
              <div className={styles.final__result}>
                <div className={styles.final__result_info}>
                  Total developer min hours: {minHours}
                </div>
              </div>
              <div className={styles.final__result}>
                <div
                  className={styles.final__result_info}
                  onClick={this.calcDeveloperHours}
                >
                  Total developer max hours: {maxHours}
                </div>
              </div>
            </CardBlock>
          </Card>
        </Col>
        <Col xs="12">
          <Calculation
            hours={this.state.hours}
            rate={this.state.rate}
            estimateOptions={this.props.estimateOptions}
            onRateChange={this.props.changeMoneyRate}
            addEstimateOptions={this.props.addEstimateOptions}
            addClientData={this.props.addClientData}
          />
        </Col>
        <Col xs="12">
          <FinalEstimate
            hours={this.state.hours}
            rate={this.state.rate}
            calculationData={this.state.calculationData}
            data={this.props.someProp}
            headerState={this.props.headerState}
            mainState={this.props.mainState}
          />
        </Col>
        <Col xs="12">
          <Contacts addClientData={this.props.addClientData} />
        </Col>
      </Row>
    );
  }
}
