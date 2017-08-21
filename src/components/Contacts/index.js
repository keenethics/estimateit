import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock, CardHeader } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { Field } from 'redux-form';
import { renderField } from '../libs/helpers';
import { emailValidation, alphaNumeric, maxLength } from '../libs/validation';

import * as styles from './styles.scss';

class Contacts extends Component {
  render() {
    const { userCanEditThisEstimate = false } = this.props;

    return (
      <Card className={styles.contacts}>
        <CardHeader>If you have any questions about this estimate, please contact</CardHeader>
        <CardBlock>
          <Field
            name="pm"
            type="text"
            label="PM's name"
            component={renderField}
            className={styles.contacts__input}
            disabled={!userCanEditThisEstimate}
            validate={[alphaNumeric, maxLength(100)]}
          />
          <Field
            type="text"
            name="position"
            label="Position"
            component={renderField}
            className={styles.contacts__input}
            disabled={!userCanEditThisEstimate}
            validate={[alphaNumeric, maxLength(100)]}
          />
          <Field
            type="email"
            name="email"
            label="Email"
            component={renderField}
            className={styles.contacts__input}
            disabled={!userCanEditThisEstimate}
            validate={[emailValidation, maxLength(60)]}
          />
          <Field
            type="text"
            name="skype"
            label="Skype"
            component={renderField}
            className={styles.contacts__input}
            disabled={!userCanEditThisEstimate}
            validate={[alphaNumeric, maxLength(60)]}
          />
        </CardBlock>
      </Card>
    );
  }

}

Contacts.propTypes = {
  userCanEditThisEstimate: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Contacts);
