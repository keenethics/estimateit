import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Card, CardBlock, Row, Col } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Reports from '../Reports';
import styles from './styles.scss';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import Contributors from '../Contributors';
import formatTime from '../libs/formatTime';
import FinalEstimate from '../FinalEstimate';
import { ESTIMATE_FORM } from '../../constants';
import EstimateOptions from '../EstimateOptions';
import * as actionsCalculate from '../../actions/Calculation';

class Main extends Component {
  render() {
    const {
      time,
      tasks,
      percent,
      moneyRate,
      totalHours,
      estimateId,
      probabilityTime,
      estimateOptions,
      probabilityPercent,
      calculateTotalHours,
      calculateProbabilityTime,
      userCanEditThisEstimate = false,
      devHours: {
        minHours,
        maxHours,
      },
    } = this.props;

    return (
      <Row className={styles.main}>
        <Col xs="12">
          <Card className={styles.final}>
            <CardBlock className={styles.final__wrapper}>
              <div className={styles.final__result}>
                <div className={styles.final__result_info}>
                  Total developer min hours: {formatTime(minHours).formattedValue}
                </div>
              </div>
              <div className={styles.final__result}>
                <div
                  className={styles.final__result_info}
                >
                  Total developer max hours: {formatTime(maxHours).formattedValue}
                </div>
              </div>
            </CardBlock>
          </Card>
        </Col>
        <Col xs="12">
          <LineChart
            time={time}
            percent={percent}
            probabilityTime={probabilityTime}
            probabilityPercent={probabilityPercent}
            userCanEditThisEstimate={userCanEditThisEstimate}
            calculateProbabilityTime={calculateProbabilityTime}
          />
        </Col>
        <Col xs="12">
          <EstimateOptions
            totalHours={totalHours}
            calculateTotalHours={calculateTotalHours}
            userCanEditThisEstimate={userCanEditThisEstimate}
          />
        </Col>
        <Col xs="12">
          <FinalEstimate
            moneyRate={moneyRate}
            totalHours={totalHours}
          />
        </Col>
        <Col xs="12">
          <Contacts
            userCanEditThisEstimate={userCanEditThisEstimate}
          />
        </Col>
        {
          userCanEditThisEstimate &&
          <Col xs="12">
            <Contributors />
          </Col>
        }
        <Col xs="12">
          <Reports
            tasks={tasks}
            estimateId={estimateId}
            estimateOptions={estimateOptions}
            userCanEditThisEstimate={userCanEditThisEstimate}
          />
        </Col>
      </Row>
    );
  }
}

Main.propTypes = {
};

function mapStateToProps(state) {
  const { calculation: {
    time,
    percent,
    devHours,
    totalHours,
    probabilityTime,
    probabilityPercent,
  } } = state;
  const { values: {
    tasks,
    moneyRate,
    estimateOptions,
  } } = state.form[ESTIMATE_FORM];
  const { estimate: { userCanEditThisEstimate = false } } = state;
  return {
    time,
    tasks,
    percent,
    devHours,
    moneyRate,
    totalHours,
    probabilityTime,
    estimateOptions,
    probabilityPercent,
    userCanEditThisEstimate,
  };
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsCalculate, dispatch) };
}


export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Main),
);
