import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Slider from './slider';
import styles from './styles.scss';

class EstimateOptions extends Component {
  constructor(props) {
    super(props);

    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange({ target: { name, value } }) {
    const { estimateOptions, addEstimateOptions } = this.props;
    const newestimateOptions = { ...estimateOptions, [name]: parseInt(value, 10) };

    addEstimateOptions(newestimateOptions);
  }

  render() {
    const {
      rate,
      totalHours,
      onRateChange,
      estimateOptions: {
        qa,
        pm,
        risks,
        bugFixes,
        completing,
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
            onChange={({ target: { value } }) => onRateChange(parseInt(value, 10))}
          />
        </InputGroup>
        <Slider
          name="qa"
          title="QA"
          value={qa}
          totalHours={totalHours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="pm"
          title="PM"
          value={pm}
          totalHours={totalHours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="bugFixes"
          title="Bug Fixes"
          value={bugFixes}
          totalHours={totalHours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="risks"
          title="Risks"
          value={risks}
          totalHours={totalHours}
          handleChange={this.onFieldChange}
        />
        <Slider
          name="completing"
          title="Probability"
          value={completing}
          totalHours={totalHours}
          handleChange={this.onFieldChange}
        />
      </div>
    );
  }
}


EstimateOptions.propTypes = {
  rate: PropTypes.number.isRequired,
  totalHours: PropTypes.number.isRequired,
  onRateChange: PropTypes.func.isRequired,
  estimateOptions: PropTypes.object.isRequired,
  addEstimateOptions: PropTypes.func.isRequired,
};

export default withStyles(styles)(EstimateOptions);
