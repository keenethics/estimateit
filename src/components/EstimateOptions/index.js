import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { InputGroup, InputGroupAddon } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { renderOptionsField } from '../libs/helpers.js';
import { required, currency } from '../libs/validation.js';

import * as actionsCalculate from '../../actions/Calculation';

import Slider from './slider';
import styles from './styles.scss';

class EstimateOptions extends Component {
  render() {
    const {
      totalHours,
      calculateTotalHours,
    } = this.props;

    return (
      <div className={styles.range}>
        <InputGroup className={styles.range__item}>
          <Field
            min="0"
            step="1"
            type="text"
            label="Rate USD"
            name="moneyRate"
            validate={[required, currency]}
            component={renderOptionsField}
          />
        </InputGroup>
        <Field
          name="estimateOptions.qa"
          title="QA"
          component={Slider}
          totalHours={totalHours}
          calculateTotalHours={calculateTotalHours}
        />
        <Field
          name="estimateOptions.pm"
          title="PM"
          component={Slider}
          totalHours={totalHours}
          calculateTotalHours={calculateTotalHours}
        />
        <Field
          name="estimateOptions.bugFixes"
          title="Bug Fixes"
          component={Slider}
          totalHours={totalHours}
          calculateTotalHours={calculateTotalHours}
        />
        <Field
          name="estimateOptions.risks"
          title="Risks"
          component={Slider}
          totalHours={totalHours}
          calculateTotalHours={calculateTotalHours}
        />
        <Field
          name="estimateOptions.completing"
          title="Probability"
          component={Slider}
          totalHours={totalHours}
          calculateTotalHours={calculateTotalHours}
        />
      </div>
    );
  }
}


EstimateOptions.propTypes = {
  totalHours: PropTypes.number.isRequired,
  estimateOptions: PropTypes.object.isRequired,
  calculateTotalHours: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return { };
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsCalculate, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(EstimateOptions),
);
