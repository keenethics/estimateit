import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Card, CardBlock, Row, Col } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Reports from '../Reports';
import styles from './styles.scss';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import EstimateOptions from '../EstimateOptions';
import formatTime from '../libs/formatTime';
import FinalEstimate from '../FinalEstimate';
import Contributors from '../Contributors';
import { ESTIMATE_FORM } from '../../constants';

class Main extends Component {
  render() {
    const {
      time,
      tasks,
      percent,
      moneyRate,
      totalHours,
      estimateId,
      estimateOptions,
      userCanEditThisEstimate = false,
      devHours: {
        minHours,
        maxHours,
      },
    } = this.props;

    return (
      <Row className={styles.main}>
        <Col xs="12">
          {
            <LineChart labels={time} data={percent} />
          }
        </Col>
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
          <EstimateOptions
            totalHours={totalHours}
            estimateOptions={estimateOptions}
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
    estimateOptions,
    userCanEditThisEstimate,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(Main));
