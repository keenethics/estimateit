import React from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';
import { Field, reduxForm } from 'redux-form';
import {
  notEmpty,
  emailValidation,
  minLength,
} from '../libs/validation';
import { renderField, renderPasswordField } from '../libs/helpers';

class RegistrationPage extends React.Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(value) {
    const { name, email, password } = value;
    return axios
      .post(
        '/register',
        { name, email, password },
      {
        headers: { 'Content-Type': 'application/json' },
      },
      )
      .then((response) => {
        if (!response.data.success) {
          this.setState({
            message: response.data.message || response.data.err['0'].msg,
          });
        } else {
          this.setState({
            message: response.data.message,
          });
          setTimeout(() => {
            location.replace(response.data.redirectUrl);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log('handle errors', error.message);
      });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <form
          className={styles.form_signin}
          onSubmit={this.props.handleSubmit(this.handleSubmit)}
        >
          <h2 className={styles.form_signin_heading}>Registration</h2>
          <Field
            name="name"
            component={renderField}
            placeholder="Your name"
            validate={[notEmpty, minLength(2)]}
          />
          <Field
            name="email"
            component={renderField}
            placeholder="Email Address"
            validate={[emailValidation]}
          />
          <Field
            name="password"
            component={renderPasswordField}
            placeholder="Password"
            validate={[minLength(6)]}
          />
          <button className="btn btn-xs btn-danger btn-block" type="submit">
            Registration
          </button>
          <a className="btn btn-xs btn-primary btn-block" href="/login">
            Back
          </a>
          <span className="text-warning">
            {this.state.message}
          </span>
        </form>
      </div>
    );
  }
}


const RegistrationWrapper = reduxForm({
  form: 'AUTH',
})(RegistrationPage);


export default withStyles(styles)(RegistrationWrapper);
