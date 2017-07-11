import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './styles.scss';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.createEstimate = this.createEstimate.bind(this);
  }
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  createEstimate(values) {
    const { mutate } = this.props;

    mutate({
      variables: { input: { ...values } },
    }).then(({ data: { estimateCreate: { url } } }) => {
      console.log('URL', url);
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
  }
  render() {
    const { isAuthenticated, handleSubmit } = this.context;
    return (
      <div className={styles.wrapper}>
        <div className={`${styles.form_signin} text-center`}>
          <h1 className={styles.form_signin_heading}><span className="fa fa-lock" />Estimator</h1>
          {isAuthenticated ? (
            <div className={styles.form_signin_body}>
              <p>Go to Dashboard</p>
              <button className={`${styles.button__padding} btn btn-xs btn-danger`} onClick={handleSubmit(this.createEstimate)}>Create Estimate</button>
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
