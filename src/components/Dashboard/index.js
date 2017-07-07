import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class Dashboard extends React.Component {
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };

  render() {
    const { isAuthenticated } = this.context;
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.form_signin} text-center`}>
          <h1 className={styles.form_signin_heading}><span className="fa fa-lock" />Estimator</h1>
          {isAuthenticated ? (
            <div className={styles.form_signin_body}>
              <p>Go to Dashboard</p>
              <a className={`${styles.button__padding} btn btn-xs btn-danger`} href="/estimate">Create Estimate</a>
            </div>
          ) : (
            <div className="">
              <p>Login or Register with:</p>
              <a href="/login" className={`${styles.button__padding} btn btn-primary`}><span className="fa fa-user" />
                Local Login</a>
              <a href="/register" className={`${styles.button__padding} btn btn-primary`}><span className="fa fa-user" />
                Local Signup</a>
              <a href="/auth/google" className={`${styles.button__padding} btn btn-danger`}><span
                className="fa fa-google-plus"
              /> Google+</a>
            </div>
          )}

        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Dashboard);
