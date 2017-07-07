import React from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class RegistrationPage extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(' name, email, password', name, email, password);
    return axios
      .post(
        '/register',
        { name, email, password },
      {
        headers: { 'Content-Type': 'application/json' },
      },
      )
      .then((response) => {
        console.log('response in the auth actions', response);
        if (response.data.err) {
          this.setState({
            error: response.data.errors['0'].msg,
          });
        } else if (!response.data.success) {
          this.setState({
            error: response.data.message,
          });
        } else {
          this.setState({
            error: '',
          });
        }
      })
      .catch((error) => {
        console.log('handle errors', error.message);
      });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <form className={styles.form_signin} onSubmit={this.handleSubmit}>
          <h2 className={styles.form_signin_heading}>Registration</h2>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Your name"
          />
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
            Registration
          </button>
          <span className="text-warning">{this.state.error}</span>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(RegistrationPage);
