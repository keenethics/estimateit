import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      error: '',
    };
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron text-center">
          <h1><span className="fa fa-lock" />Estimator</h1>
          <p>Login or Register with:</p>
          <a href="/login" className={`${styles.button__padding} btn btn-primary`}><span className="fa fa-user" /> Local Login</a>
          <a href="/register" className={`${styles.button__padding} btn btn-primary`}><span className="fa fa-user" /> Local Signup</a>
          <a href="/auth/google" className={`${styles.button__padding} btn btn-danger`}><span className="fa fa-google-plus" /> Google+</a>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Dashboard);
