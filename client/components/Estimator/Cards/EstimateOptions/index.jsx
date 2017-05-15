import React, { Component } from 'react';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import styles from './styles.scss';

export default class EstimateOptions extends Component {
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
    };
    this.onRateChange = this.onRateChange.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  componentDidMount() {
    this.props.onDataChange(this.state.calculationData);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hours === nextProps.hours) return;
    this.calcOptionsData(nextProps);
    // this.state.estimateFieldsAmount.qa = Math.round(nextProps.hours * this.state.calculationData.qa / 100);
    // this.state.estimateFieldsAmount.pm = Math.round(nextProps.hours * this.state.calculationData.pm / 100);
    // this.state.estimateFieldsAmount.bugFixes = Math.round(nextProps.hours * this.state.calculationData.bugFixes / 100);
    // this.state.estimateFieldsAmount.risks = Math.round(nextProps.hours * this.state.calculationData.risks / 100);
    // this.state.estimateFieldsAmount.completing = Math.round(nextProps.hours * this.state.calculationData.completing / 100);
  }

  onRateChange(e) {
    this.state.rate = e.target.value;
    this.props.onRateChange(this.state.rate);
  }

  onFieldChange(e) {
    this.state.calculationData[e.target.name] = parseInt(e.target.value);
    this.state.estimateFieldsAmount[e.target.name] = Math.round(this.props.hours * this.state.calculationData[e.target.name] / 100);
    this.props.onDataChange(this.state.calculationData, this.state.estimateFieldsAmount);
  }
  
  calcOptionsData(nextProps) {
    const { estimateFieldsAmount, calculationData } = this.state;
    const round = key => Math.round(nextProps.hours * calculationData[key] / 100);
    Object.keys(estimateFieldsAmount).forEach(key => estimateFieldsAmount[key] = round(key));
  }

  render() {
    return (
      <div className={styles.range}>
        <InputGroup className={styles.range__item}>
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
        <InputGroup className={styles.range__item}>
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
          <InputGroupAddon>{this.state.calculationData.qa}%, {this.state.estimateFieldsAmount.qa} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.range__item}>
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
          <InputGroupAddon>{this.state.calculationData.pm}%, {this.state.estimateFieldsAmount.pm} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.range__item}>
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
          <InputGroupAddon>{this.state.calculationData.bugFixes}%, {this.state.estimateFieldsAmount.bugFixes} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.range__item}>
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
          <InputGroupAddon>{this.state.calculationData.risks}%, {this.state.estimateFieldsAmount.risks} h</InputGroupAddon>
        </InputGroup>
        <InputGroup className={styles.range__item}>
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
          <InputGroupAddon>{this.state.calculationData.completing}%, {this.state.estimateFieldsAmount.completing} h</InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
}
