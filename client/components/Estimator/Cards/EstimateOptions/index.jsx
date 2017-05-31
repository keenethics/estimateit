import React, { Component } from 'react';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import Slider from './slider';
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
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  componentDidMount() {
    this.props.addEstimateOptions(this.state.calculationData, this.state.estimateFieldsAmount);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hours === nextProps.hours) return;
    this.calcOptionsData(nextProps);
  }

  onFieldChange({ target: { name, value } }) {
    const { estimateOptions } = this.props;
    const newestimateOptions = { ...estimateOptions, [name]: parseInt(value, 10) };

    this.props.addEstimateOptions(newestimateOptions);
  }

  calcOptionsData(nextProps) {
    const { estimateFieldsAmount, calculationData } = this.state;
    const round = key => Math.round(nextProps.hours * calculationData[key] / 100);
    Object.keys(estimateFieldsAmount).forEach(key => estimateFieldsAmount[key] = round(key));
  }

  render() {
    const {
      rate,
      hours,
      onRateChange,
      estimateOptions: {
        qa,
        pm,
        risks,
        bugFixes,
        completing
      },
    } = this.props;

    return (
      <div className={styles.range}>
        <InputGroup className={styles.range__item}>
          <InputGroupAddon>Rate USD</InputGroupAddon>
          <Input
            min="0"
            step="1"
            name="rate"
            value={rate}
            type="number"
            className="radarChartPart estimate"
            onChange={({ target: value }) => onRateChange(value)}
          />
        </InputGroup>
        <Slider
          name="qa"
          title="QA"
          value={qa}
          totalHours={hours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="pm"
          title="PM"
          value={pm}
          totalHours={hours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="bugFixes"
          title="Bug Fixes"
          value={bugFixes}
          totalHours={hours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="risks"
          title="Risks"
          value={risks}
          totalHours={hours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="completing"
          title="Probability"
          value={completing}
          totalHours={hours}
          handleChange={this.onFieldChange}
        />
      </div>
    );
  }
}
