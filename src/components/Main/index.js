import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Card, CardBlock, Row, Col } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Disclaimer from '../Disclaimer';
import Reports from '../Reports';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import * as styles from './styles.scss';
import Contributors from '../Contributors';
import FinalEstimate from '../FinalEstimate';
import { ESTIMATE_FORM } from '../../constants';
import EstimateOptions from '../EstimateOptions';
import * as actionsCalculate from '../../actions/Calculation';
import parseMinutesToString from '../libs/parseMinutesToString';

class Main extends Component {
  render() {
    const {
      time,
      tasks,
      percents,
      moneyRate,
      totalHours,
      estimateId,
      additionalTime,
      probabilityTime,
      estimateOptions,
      probabilityPercent,
      actionChangeAdditionalTime,
      actionChangeProbabilityTime,
      userCanEditThisEstimate = false,
      devTimes: {
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
                  Total developer min hours: {parseMinutesToString(minHours) || '0h'}
                </div>
              </div>
              <div className={styles.final__result}>
                <div
                  className={styles.final__result_info}
                >
                  Total developer max hours: {parseMinutesToString(maxHours) || '0h'}
                </div>
              </div>
            </CardBlock>
          </Card>
        </Col>
        <Col xs="12">
          <LineChart
            time={time}
            percents={percents}
            probabilityTime={probabilityTime}
            probabilityPercent={probabilityPercent}
            userCanEditThisEstimate={userCanEditThisEstimate}
            actionChangeProbabilityTime={actionChangeProbabilityTime}
          />
        </Col>
        <Col xs="12">
          <EstimateOptions
            additionalTime={additionalTime}
            probabilityTime={probabilityTime}
            actionChangeAdditionalTime={actionChangeAdditionalTime}
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
          <Disclaimer />
        </Col>
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
  totalHours: PropTypes.number.isRequired,
  estimateId: PropTypes.string.isRequired,
  additionalTime: PropTypes.number.isRequired,
  probabilityTime: PropTypes.number.isRequired,
  probabilityPercent: PropTypes.number.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
  tasks: PropTypes.objectOf(PropTypes.any).isRequired,
  time: PropTypes.arrayOf(PropTypes.number).isRequired,
  actionChangeAdditionalTime: PropTypes.func.isRequired,
  actionChangeProbabilityTime: PropTypes.func.isRequired,
  percents: PropTypes.arrayOf(PropTypes.number).isRequired,
  moneyRate: PropTypes.arrayOf(PropTypes.number).isRequired,
  devTimes: PropTypes.objectOf(PropTypes.number).isRequired,
  estimateOptions: PropTypes.objectOf(PropTypes.number).isRequired,
};

function mapStateToProps(state) {
  const { calculation: {
    time,
    percents,
    devTimes,
    totalHours,
    additionalTime,
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
    percents,
    devTimes,
    moneyRate,
    totalHours,
    additionalTime,
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
