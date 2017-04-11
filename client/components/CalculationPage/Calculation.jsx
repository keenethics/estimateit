import React from 'react';
import { Card, CardBlock, Col } from 'reactstrap';
import EstimateOptions from './EstimateOptions.jsx';
import PieChart from './PieChart.jsx';
import styles from './style/calculations.scss';

export default class Calculation extends React.Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.onRateChange = this.onRateChange.bind(this);
  }

  onDataChange(data) {
    this.props.onCalculationChange(data);
  }

  onRateChange(rate) {
    this.props.onRateChange(rate);
  }

  render() {
    return (
      <Card className={styles.calculation}>
        <CardBlock className={styles.calculation__wrapper}>
          <Col
            xs="12" lg="4"
            className={styles.calculation__pie}
          >
            <PieChart data={this.props.data} />
          </Col>
          <Col
            xs="12" lg="8"
            className={styles.calculation__options}
          >
            <EstimateOptions
              hours={this.props.hours}
              onRateChange={this.onRateChange}
              onDataChange={this.onDataChange}
            />
          </Col>
        </CardBlock>
      </Card>
    );
  }

}
