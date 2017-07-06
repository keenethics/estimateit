import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };

  handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    return axios
      .post(
        '/login',
        { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
      },
      )
      .then((response) => {
        console.log('response in the auth actions', response.data.message);
        if (response.data.err) {
          this.setState({
            error: response.data.err[0].msg,
          });
        } else if (!response.data.success) {
          this.setState({
            error: response.data.message,
          });
        } else if (response.data.success) {
          this.setState({
            error: response.data.message,
          });
        } else {
          this.setState({
            error: '',
          });
        }
      });
  }

  render() {
    const { isAuthenticated } = this.context;
    return (
      <div className={styles.wrapper}>
        <form className={styles.form_signin} onSubmit={this.handleSubmit}>
          <h2 className={styles.form_signin_heading}>Login</h2>
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="Email Address"
          />
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
          />
          <button className="btn btn-xs btn-danger btn-block" type="submit">
            Login
          </button>
          <a className="btn btn-xs btn-danger btn-block" href="/register">
            Register
          </a>
          <a className="btn btn-xs btn-primary btn-block" href="/auth/google">
            Sign In with Google
          </a>
          <span className="text-warning">
            {this.state.error}
          </span>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(LoginPage);
