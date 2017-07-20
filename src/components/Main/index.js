import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Card, CardBlock, Row, Col } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Reports from '../Reports';
import styles from './styles.scss';
import Contacts from '../Contacts';
import LineChart from '../LineChart';
import Calculation from '../Calculation';
import formatTime from '../libs/formatTime';
import FinalEstimate from '../FinalEstimate';
import { ESTIMATE_FORM } from '../../constants';

class Main extends Component {
  render() {
    const {
      time,
      tasks,
      percent,
      moneyRate,
      totalHours,
      estimateOptions,
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
          <Calculation
            totalHours={totalHours}
            estimateOptions={estimateOptions}
          />
        </Col>
        <Col xs="12">
          <FinalEstimate
            moneyRate={moneyRate}
            totalHours={totalHours}
          />
        </Col>
        <Col xs="12">
          <Contacts />
        </Col>
        <Col xs="12">
          {
            <Reports
              tasks={tasks}
              estimateOptions={estimateOptions}
            />
          }
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
  const { values: { estimateOptions, moneyRate, tasks } } = state.form[ESTIMATE_FORM];

  return {
    time,
    tasks,
    percent,
    devHours,
    moneyRate,
    totalHours,
    estimateOptions,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(Main));
