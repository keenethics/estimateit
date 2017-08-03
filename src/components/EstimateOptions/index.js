import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Card,
  CardBlock,
  Col,
  InputGroup,
} from 'reactstrap';

import Slider from '../Slider';
import styles from './styles.scss';
import { renderOptionsField } from '../libs/helpers';
import { required, currency } from '../libs/validation';

class EstimateOptions extends Component {
  render() {
    const {
      totalHours,
      calculateTotalHours,
      userCanEditThisEstimate,
    } = this.props;

    return (
      <Card className={styles.calculation}>
        <CardBlock className={styles.calculation__wrapper}>
          <Col
            lg="9"
            xs="12"
            className={styles.calculation__options}
          >
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
                  disabled={!userCanEditThisEstimate}
                />
              </InputGroup>
              <Field
                title="QA"
                component={Slider}
                totalHours={totalHours}
                name="estimateOptions.qa"
                handleChange={calculateTotalHours}
                disabled={!userCanEditThisEstimate}
              />
              <Field
                title="PM"
                component={Slider}
                totalHours={totalHours}
                name="estimateOptions.pm"
                handleChange={calculateTotalHours}
                disabled={!userCanEditThisEstimate}
              />
              <Field
                title="Bug Fixes"
                component={Slider}
                totalHours={totalHours}
                name="estimateOptions.bugFixes"
                handleChange={calculateTotalHours}
                disabled={!userCanEditThisEstimate}
              />
              <Field
                title="Risks"
                component={Slider}
                totalHours={totalHours}
                name="estimateOptions.risks"
                handleChange={calculateTotalHours}
                disabled={!userCanEditThisEstimate}
              />
            </div>
          </Col>
        </CardBlock>
      </Card>
    );
  }
}


EstimateOptions.propTypes = {
  totalHours: PropTypes.number.isRequired,
  calculateTotalHours: PropTypes.func.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
};

export default withStyles(styles)(EstimateOptions);
