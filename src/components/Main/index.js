import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import DiscreteVector from 'discrete-vector';
import { Card, CardBlock, Row, Col } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import styles from './styles.scss';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import Calculation from '../Calculation';
import FinalEstimate from '../FinalEstimate';
import * as actionsMain from '../../actions/Main';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalHours: 0,
    };

    this.T = [];
    this.labels = [];
    this.embodiment = this.embodiment.bind(this);
    this.parseTaskHours = this.parseTaskHours.bind(this);
    this.transformToVector = this.transformToVector.bind(this);
    this.calculateAmountOfHours = this.calculateAmountOfHours.bind(this);
  }

  componentDidMount() {
    const { tasks } = this.props.headerState;

    this.transformToVector();
    this.calcDeveloperHours(this.parseTaskHours(tasks));
    this.calculateAmountOfHours();
  }

  componentWillReceiveProps({ headerState: { tasks: newTasks } }) {
    // TODO: Make it more beautiful
    const { tasks } = this.props.headerState;
    if (JSON.stringify(tasks) !== JSON.stringify(newTasks)) {
      this.calcDeveloperHours(this.parseTaskHours(newTasks));
    }
  }

  componentDidUpdate() {
    this.transformToVector();
    this.calculateAmountOfHours();
  }

  transformToVector() {
    const { tasks } = this.props.headerState;
    const tasksHours = this.parseTaskHours(tasks);
    const vector = new DiscreteVector(tasksHours);

    this.T = vector.combinations < 1000
      ? Array(vector.combinations)
          .fill()
          .map(prev => this.embodiment(tasksHours, vector.next()))
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
    return a.reduce((prev, item, i) => prev + +item[b[i]], 0);
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
    const {
      pm,
      qa,
      risks,
      bugFixes,
      completing,
    } = this.props.mainState.estimateOptions;

    let highestIndex = this.data.findIndex(item => item > completing);

    if (highestIndex === -1) {
      highestIndex = this.data.length - 1;
    }

    const hours = this.T[highestIndex];
    const additionalHourse = hours * (pm + qa + bugFixes + risks) / 100;
    const totalHours = Math.round(hours + additionalHourse);
    this.state.totalHours = totalHours;

    // this.setState({ totalHours });
  }

  render() {
    console.log(this.props);
    const {
      mainState: {
        devHours: {
          minHours,
          maxHours,
        },
        contacts,
        moneyRate,
        estimateOptions,
      },
      addClientData,
      changeMoneyRate,
      addEstimateOptions,
    } = this.props;

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
                  onClick={this.calcDeveloperHours}
                  className={styles.final__result_info}
                >
                  Total developer max hours: {maxHours}
                </div>
              </div>
            </CardBlock>
          </Card>
        </Col>
        <Col xs="12">
          <Calculation
            rate={moneyRate}
            onRateChange={changeMoneyRate}
            estimateOptions={estimateOptions}
            totalHours={this.state.totalHours}
            addEstimateOptions={addEstimateOptions}
          />
        </Col>
        <Col xs="12">
          <FinalEstimate
            mainState={this.props.mainState}
            totalHours={this.state.totalHours}
            headerState={this.props.headerState}
          />
        </Col>
        <Col xs="12">
          <Contacts
            contacts={contacts}
            addClientData={addClientData}
          />
        </Col>
      </Row>
    );
  }
}

Main.propTypes = {
  mainState: PropTypes.object.isRequired,
  calcDevHours: PropTypes.func.isRequired,
  headerState: PropTypes.object.isRequired,
  addClientData: PropTypes.func.isRequired,
  changeMoneyRate: PropTypes.func.isRequired,
  addEstimateOptions: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    mainState: state.Main,
    headerState: state.Header,
  };
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsMain, dispatch) }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main));
