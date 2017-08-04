import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import addDashboardData from '../../actions/Estimates';
import Loading from '../../components/libs/Loading';
import { estimateAll } from '../../data/queriesClient';


class Wrapper extends React.Component {
  static contextTypes = {
    client: PropTypes.object,
  };
  static propTypes = {
    children: PropTypes.node.isRequired,
  };
  constructor(props) {
    super(props);
    this.getEstimate = this.getEstimate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { loading, allEstimates } = nextProps.estimates;
    if (!loading && allEstimates !== this.props.estimates.allEstimates) {
      this.getEstimate(nextProps);
    }
  }

  getEstimate(props) {
    const { dispatch, estimates: { allEstimates } } = props;
    dispatch(addDashboardData({ allEstimates }));
  }

  render() {
    const {
      estimates,
    } = this.props;

    return (
      <div>
        {estimates.loading
          ? <Loading />
          : <div>
            {this.props.children}
          </div>}
      </div>
    );
  }
}

export default compose(
  connect(),
  graphql(estimateAll, { name: 'estimates' }),
)(Wrapper);
