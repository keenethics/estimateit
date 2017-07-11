import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { InputGroup, InputGroupAddon } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { renderOptionsField } from '../libs/helpers.js';
import { required, currency } from '../libs/validation.js';

import Slider from './slider';
import styles from './styles.scss';

class EstimateOptions extends Component {
  render() {
    const {
      totalHours,
    } = this.props;

    return (
      <div className={styles.range}>
        <InputGroup className={styles.range__item}>
          <InputGroupAddon>Rate USD</InputGroupAddon>
          <Field
            min="0"
            step="1"
            type="text"
            label="Rate USD"
            name="moneyRate"
            validate={[required, currency]}
            component={renderOptionsField}
            className={styles.range__item}
          />
        </InputGroup>
        <Field
          name="estimateOptions.qa"
          title="QA"
          component={Slider}
          totalHours={totalHours}
        />
        <Field
          name="estimateOptions.pm"
          title="PM"
          component={Slider}
          totalHours={totalHours}
        />
        <Field
          name="estimateOptions.bugFixes"
          title="Bug Fixes"
          component={Slider}
          totalHours={totalHours}
        />
        <Field
          name="estimateOptions.risks"
          title="Risks"
          component={Slider}
          totalHours={totalHours}
        />
        <Field
          name="estimateOptions.completing"
          title="Probability"
          component={Slider}
          totalHours={totalHours}
        />
      </div>
    );
  }
}


EstimateOptions.propTypes = {
  rate: PropTypes.number.isRequired,
  totalHours: PropTypes.number.isRequired,
  estimateOptions: PropTypes.object.isRequired,
};

export default withStyles(styles)(EstimateOptions);
