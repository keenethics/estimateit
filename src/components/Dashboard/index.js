import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class Dashboard extends React.Component {
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { isAuthenticated, handleSubmit } = this.context;
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
              <a href="/login" className="btn btn-xs btn-danger"><span className="fa fa-user" />
               Login</a>
            </div>
          )}

        </div>
      </div>
    );
  }
}
export default compose(
  graphql(gql`
    mutation EstimateMutation (
      $input: EstimateInputType!
    ) {
      estimateCreate (
        input: $input
      ) {
        url
      }
    },
  `), withStyles(styles))(Dashboard);
