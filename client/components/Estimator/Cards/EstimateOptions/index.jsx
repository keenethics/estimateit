import React, { Component } from 'react';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import styles from './styles.scss';

export default class EstimateOptions extends Component {
  constructor(props) {
    super(props);
    this.estimateFields = {
      qa: 10,
      pm: 10,
      bugFixes: 10,
      risks: 10,
      completing: 90,
    };

    this.estimateFieldsAmount = {};

    this.rate = 25;
    this.onRateChange = this.onRateChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(e) {
    this.estimateFields[e.target.name] = +e.target.value;
    this.estimateFieldsAmount[e.target.name] = Math.round(this.props.hours * this.estimateFields[e.target.name] / 100);
    this.props.onDataChange(this.estimateFields);
  }

  onRateChange(e) {
    this.rate = e.target.value;
    this.props.onRateChange(this.rate);
  }

  componentDidMount() {
    this.props.onDataChange(this.estimateFields);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.hours === nextProps.hours) return;
    this.estimateFieldsAmount.qa = Math.round(nextProps.hours * this.estimateFields.qa / 100);
    this.estimateFieldsAmount.pm = Math.round(nextProps.hours * this.estimateFields.pm / 100);
    this.estimateFieldsAmount.bugFixes = Math.round(nextProps.hours * this.estimateFields.bugFixes / 100);
    this.estimateFieldsAmount.risks = Math.round(nextProps.hours * this.estimateFields.risks / 100);
    this.estimateFieldsAmount.completing = Math.round(nextProps.hours * this.estimateFields.completing / 100);
  }

  render() {
    return (
      <div className={styles.estimateOptions}>
        <InputGroup className={styles.estimateOptions__item}>
          <InputGroupAddon>Rate USD</InputGroupAddon>
          <Input
            className="radarChartPart estimate"
            name="qa"
            type="number"
            min="0"
            step="1"
            onChange={this.onRateChange}
            defaultValue="25"
          />
        </InputGroup>
        <InputGroup className={styles.estimateOptions__item}>
          <InputGroupAddon>QA</InputGroupAddon>
          <Input
            className="radarChartPart"
            id="radarChartPart"
            name="qa"
            type="range"
            min="0"
            max="100"
            step="1"
            onChange={this.onFieldChange}
            defaultValue="10"
          />
          <InputGroupAddon>{this.estimateFields.qa}%, {this.estimateFieldsAmount.qa} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.estimateOptions__item}>
          <InputGroupAddon>PM </InputGroupAddon>
          <Input
            className="radarChartPart"
            name="pm"
            type="range"
            min="0"
            max="100"
            step="1"
            onChange={this.onFieldChange}
            defaultValue="10"
          />
          <InputGroupAddon>{this.estimateFields.pm}%, {this.estimateFieldsAmount.pm} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.estimateOptions__item}>
          <InputGroupAddon>Bug Fixes</InputGroupAddon>
          <Input
            className="radarChartPart"
            name="bugFixes"
            type="range"
            min="0"
            max="100"
            step="1"
            onChange={this.onFieldChange}
            defaultValue="10"
          />
          <InputGroupAddon>{this.estimateFields.bugFixes}%, {this.estimateFieldsAmount.bugFixes} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.estimateOptions__item}>
          <InputGroupAddon>Risks</InputGroupAddon>
          <Input
            className="radarChartPart"
            name="risks"
            type="range"
            min="0"
            max="100"
            step="1"
            onChange={this.onFieldChange}
            defaultValue="10"
          />
          <InputGroupAddon>{this.estimateFields.risks}%, {this.estimateFieldsAmount.risks} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.estimateOptions__item}>
          <InputGroupAddon>Probability </InputGroupAddon>
          <Input
            className="radarChartPart"
            name="completing"
            type="range"
            min="0"
            max="100"
            step="1"
            onChange={this.onFieldChange}
            defaultValue="90"
          />
          <InputGroupAddon>{this.estimateFields.completing}%, {this.estimateFieldsAmount.completing} h</InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
}
