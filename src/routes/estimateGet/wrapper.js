import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { compose } from 'react-apollo';
import { apply } from '../../actions/Main';

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

  componentWillMount() {
    this.getEstimate();
  }
  getEstimate() {
    const { client } = this.context;
    const { dispatch } = this.props;
    return client
      .query({
        query: estimate,
        variables: {
          id: this.props.id || null,
        },
      })
      .then(x => {
        console.log('x', x);
        const { estimate: estimateData } = x.data;
        dispatch(apply(estimateData));
        dispatch({
          type: '@@redux-form/INITIALIZE',
          meta: {
            form: 'contact',
            keepDirty: false,
          },
          payload: estimateData,
        });
      })
      .catch(e => console.error(e));
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

const initializeValues = state => {
  const initialValues = {
    moneyRate: '25',
  };
  return { initialValues };
};

export default compose(connect(initializeValues))(Wrapper);
