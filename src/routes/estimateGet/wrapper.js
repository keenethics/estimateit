import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { ESTIMATE_FORM } from '../../constants';
import { calculateAtFirstTime } from '../../actions/Calculation';
import Loading from '../../components/libs/Loading';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { estimate } from '../../data/queriesClient';

class Wrapper extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    id: null,
  };

  constructor(props) {
    super(props);

    this.getEstimate = this.getEstimate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { loading, estimate } = nextProps.data;
    if (!loading && JSON.stringify(estimate) !== JSON.stringify(this.props.data.estimate)) {
      this.getEstimate(nextProps);
    }
  }

  getEstimate(nextProps) {
    const { dispatch } = this.props;
    const { data: { estimate } } = nextProps;
    dispatch({
      type: '@@redux-form/INITIALIZE',
      meta: {
        form: ESTIMATE_FORM,
        keepDirty: false,
      },
      payload: estimate,
    });
    dispatch(calculateAtFirstTime(ESTIMATE_FORM));
  }

  render() {
    const {
      data,
    } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        {
          data.loading
          ? <Loading />
          : <div>
            {this.props.children}
          </div>
        }
      </div>
    );
  }
}


export default compose(
  connect(),
  graphql(estimate, {
    options: props => ({
      variables: {
        id: props.id,
      },
    }),
  }),
)(Wrapper);
