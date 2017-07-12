import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock, CardHeader } from 'reactstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { Field } from 'redux-form';
import { renderField } from '../libs/helpers.js';
import { required, email, alphaNumeric } from '../libs/validation.js';

import styles from './styles.scss';


class Contacts extends Component {
  render() {
    return (
      <Card className={styles.contacts}>
        <CardHeader>If you have any questions about this estimate, please contact</CardHeader>
        <CardBlock>
          <Field
            name="pm"
            type="text"
            label="PM's name"
            validate={[required, alphaNumeric]}
            component={renderField}
            className={styles.contacts__input}
          />
          <Field
            type="text"
            name="position"
            label="Position"
            validate={[required, alphaNumeric]}
            component={renderField}
            className={styles.contacts__input}
          />
          <Field
            type="email"
            name="email"
            label="Email"
            validate={[required, email]}
            component={renderField}
            className={styles.contacts__input}
          />
          <Field
            type="text"
            name="skype"
            label="Skype"
            validate={[required, alphaNumeric]}
            component={renderField}
            className={styles.contacts__input}
          />
        </CardBlock>
      </Card>
    );
  }

}

Contacts.propTypes = {
};

export default withStyles(styles)(Contacts);
