import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import SingleEstimate from './SingleEstimate';
import styles from './styles.scss';
import history from '../../history';


class Dashboard extends React.Component {
  static contextTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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
      .catch(error => console.error(error));
  }

  render() {
    const { isAuthenticated } = this.context;

    return (
      <div className={styles.wrapper}>
        <div className={`${styles.form_signin} text-center`}>
          <h1 className={styles.form_signin_heading}>Estimator</h1>
          {isAuthenticated
            ? <div className={`${styles.form_signin_body} container-fluid`}>
              <div className="row">
                {this.props.allEstimates.length
                  ? this.props.allEstimates.map((estimate, key) =>
                    <SingleEstimate estimate={estimate} key={key} />,
                    )
                  : <div>
                    <p>Go to Dashboard</p>
                  </div>
                }
                <a
                  className={`${styles.button__padding} btn btn-xs btn-danger`}
                  onClick={this.createNewEstimate}
                >
                    Create Estimate
                </a>
              </div>
            </div>
            : <div className="">
              <p>Login or Register with:</p>
              <a href="/login" className="btn btn-xs btn-danger">Login</a>
            </div>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allEstimates: state.Main.allEstimates,
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
