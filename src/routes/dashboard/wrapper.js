import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { addDashboardData } from '../../actions/Main';
import Loading from '../../components/libs/Loading';

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
    const { loading, allEstimates } = nextProps.data;
    if (!loading && allEstimates !== this.props.data.allEstimates) {
      this.getEstimate(nextProps);
    }
  }

  getEstimate(props) {
    const { dispatch, data: { allEstimates } } = props;
    dispatch(addDashboardData({ allEstimates }));
  }

  render() {
    const {
      data,
    } = this.props;
    return (
      <div>
        {data.loading
          ? <Loading />
          : <div>
            {this.props.children}
          </div>}
      </div>
    );
  }
}

const initializeValues = (state) => {
  const initialValues = {
    moneyRate: '25',
  };
  return { initialValues };
};
const estimates = gql`
query allEstimates {
  allEstimates {
    _id
    clientName
    projectName
    sprintNumber
    date
  }
}
`;

export default compose(
  connect(initializeValues),
  graphql(estimates),
)(Wrapper);
