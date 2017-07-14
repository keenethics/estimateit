import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { apply } from '../../actions/Main';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.getEstimate = this.getEstimate.bind(this);
  }

  static contextTypes = {
    client: PropTypes.object,
  };
  static propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
  };
  static defaultProps = {
    id: null,
  };

  componentWillReceiveProps(nextProps) {
    const { loading, estimate } = nextProps.data;
    if (!loading && estimate !== this.props.data.estimate) {
      this.getEstimate(nextProps);
    }
  }

  getEstimate(props) {
    const { dispatch, data: { estimate } } = props;
    dispatch(apply(estimate));
    dispatch({
      type: '@@redux-form/INITIALIZE',
      meta: {
        form: 'contact',
        keepDirty: false,
      },
      payload: estimate,
    });
  }

  render() {
    const {
      data,
    } = this.props;
    console.log('\t  New data in our app', data);
    return (
      <div>
        {data.loading
          ? <h3>Loading</h3>
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
const estimate = gql`
  query estimate($id: String) {
    estimate(id: $id) {
      owner
      date
      clientName
      projectName
      sprintNumber
      comments
      pm
      skype
      email
      position
      moneyRate
      technologies
      estimateOptions {
        qa
        pm
        risks
        bugFixes
        completing
      }
      devHours {
        minHours
        maxHours
      }
      tasks {
        id
        taskName
        isChecked
        minimumHours
        maximumHours
        tasks {
          id
          taskName
          isChecked
          minimumHours
          maximumHours
          tasks {
            id
            taskName
            isChecked
            minimumHours
            maximumHours
          }
        }
      }
    }
  }
`;

export default compose(
  connect(initializeValues),
  graphql(estimate, {
    options: props => ({
      variables: {
        id: props.id,
      },
    }),
  }),
)(Wrapper);
