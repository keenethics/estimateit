import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import Notification from 'react-notification-system';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import * as styles from './styles.scss';
import history from '../../history';
import SingleEstimate from './SingleEstimate';


class Dashboard extends React.Component {
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  static propTypes = {
    mutate: PropTypes.func.isRequired,
    allEstimates: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    allEstimates: [],
  };

  constructor(props) {
    super(props);

    this.createNewEstimate = this.createNewEstimate.bind(this);
  }


  createNewEstimate(e) {
    e.preventDefault();

    this.props.mutate()
      .then(({ data: { estimateCreate: { url } } }) => {
        history.replace(url);
      })
      .catch((error) => {
        console.error(error);
        this.notificationSystem.addNotification({
          autoDismiss: 6,
          position: 'br',
          title: 'Error',
          level: 'error',
          message: 'internal server error',
        });
      });
  }

  render() {
    const { isAuthenticated } = this.context;

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.estimate} text-center`}>
          <h1 className={styles.estimate__header}>Estimator</h1>
          {isAuthenticated
            ? <div className={`${styles.estimate__body} container-fluid`}>
              <div className={styles.estimate__body_items}>
                <div className="row">
                  <button
                    className={`${styles.estimate__body_btn} btn btn-xs btn-danger`}
                    onClick={this.createNewEstimate}
                  >
                    Create Estimate
                  </button>
                </div>

                <div className="row">
                  {!!this.props.allEstimates.length &&
                    this.props.allEstimates.map(estimate =>
                      <SingleEstimate estimate={estimate} key={estimate._id} />,
                    )
                  }
                </div>
              </div>
            </div>
            : <div>
              <p>Login or Register with:</p>
              <a href="/login" className="btn btn-xs btn-danger">Login</a>
            </div>}
        </div>
        <Notification ref={ref => (this.notificationSystem = ref)} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allEstimates: state.estimates.allEstimates,
  };
}

export default compose(
  connect(mapStateToProps),
  graphql(gql`
    mutation Mutation{
      estimateCreate {
        url
      }
    }
  `),
  withStyles(styles),
)(Dashboard);
