import React from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class LoginPage extends React.Component {
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
      })
      .catch((error) => {
        console.log('response in the auth actions', error.data.message);
      });
  }

  render() {
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
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(LoginPage);
