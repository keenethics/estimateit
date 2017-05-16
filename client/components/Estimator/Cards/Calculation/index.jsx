import React, { Component } from 'react';
import { Card, CardBlock, Col } from 'reactstrap';
import EstimateOptions from '../EstimateOptions';
import PieChart from '../PieChart';
import styles from './styles.scss';

export default class Calculation extends Component {
  render() {
    return (
      <Card className={styles.calculation}>
        <CardBlock className={styles.calculation__wrapper}>
          <Col
            xs="12" lg="4"
            className={styles.calculation__piechart}
          >
            <PieChart data={this.props.data} />
          </Col>
          <Col
            xs="12" lg="8"
            className={styles.calculation__options}
          >
            <EstimateOptions
              hours={this.props.hours}
              onRateChange={this.props.onRateChange}
              addEstimateOptions={this.props.addEstimateOptions}
            />
          </Col>
        </CardBlock>
      </Card>
    );
  }

}
