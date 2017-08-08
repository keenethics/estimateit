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
      additionalTime,
      userCanEditThisEstimate,
      actionChangeAdditionalTime,
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
                shortName="qa"
                component={Slider}
                time={additionalTime.qa}
                name="estimateOptions.qa"
                disabled={!userCanEditThisEstimate}
                handleChange={actionChangeAdditionalTime}
              />
              <Field
                title="PM"
                shortName="pm"
                component={Slider}
                time={additionalTime.pm}
                name="estimateOptions.pm"
                disabled={!userCanEditThisEstimate}
                handleChange={actionChangeAdditionalTime}
              />
              <Field
                title="Bug Fixes"
                component={Slider}
                shortName="bugFixes"
                time={additionalTime.bugFixes}
                name="estimateOptions.bugFixes"
                disabled={!userCanEditThisEstimate}
                handleChange={actionChangeAdditionalTime}
              />
              <Field
                title="Risks"
                shortName="risks"
                component={Slider}
                time={additionalTime.risks}
                name="estimateOptions.risks"
                disabled={!userCanEditThisEstimate}
                handleChange={actionChangeAdditionalTime}
              />
            </div>
          </Col>
        </CardBlock>
      </Card>
    );
  }
}


EstimateOptions.propTypes = {
  additionalTime: PropTypes.number.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
  actionChangeAdditionalTime: PropTypes.func.isRequired,
};

export default withStyles(styles)(EstimateOptions);
