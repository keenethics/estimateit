import React from 'react';
import _ from 'underscore';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Form, Field, reduxForm } from 'redux-form';
import Notification from 'react-notification-system';

import styles from './styles.scss';
import { renderSelectField } from '../libs/helpers';
import { requiredSelect } from '../libs/validation';
import { estimate } from '../../data/queriesClient';
import {
  ESTIMATE_FORM,
  ADD_USER_TO_ESTIMATE_FORM,
} from '../../constants';


class AddUsers extends React.Component {
  constructor(props) {
    super(props);

    this.options = this.options.bind(this);
    this.addUser = this.addUser.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  addUser({
    addUser: {
      value: userId,
      label: username,
      email: userEmail,
    },
  }) {
    const { estimateAddNewContributor, estimateId, reset } = this.props;

    estimateAddNewContributor({
      variables: { input: { estimateId, userId, username, userEmail } },
      update: (store) => {
        const data = store.readQuery({
          query: estimate,
          variables: { id: estimateId },
        });

        data.estimate.users.push({ userId, username, userEmail });

        store.writeQuery({ query: estimate, data, variables: { id: estimateId } });
      },
    }).then(() => {
      reset();
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Success',
        level: 'success',
        message: 'User added',
      });
    }).catch((error) => {
      console.error(error.message);
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Error',
        level: 'error',
        message: error.message,
      });
    });
  }

  removeUser({ target: { id: userId } }) {
    const { estimateRemoveContributor, estimateId } = this.props;

    estimateRemoveContributor({
      variables: { input: { userId, estimateId } },
      update: (store) => {
        const data = store.readQuery({
          query: estimate,
          variables: { id: estimateId },
        });

        data.estimate.users = data.estimate.users.filter(e => e.userId !== userId);

        store.writeQuery({ query: estimate, data, variables: { id: estimateId } });
      },
    }).then(() => {
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Success',
        level: 'success',
        message: 'User removed',
      });
    }).catch((error) => {
      console.error(error.message);
      this.notificationSystem.addNotification({
        autoDismiss: 6,
        position: 'br',
        title: 'Error',
        level: 'error',
        message: error.message,
      });
    });
  }

  options = () => {
    const {
      contributors = [],
      data: { usersList = [] },
    } = this.props;

    return usersList
      .filter(({ _id }) => !_.findWhere(contributors, { userId: _id }))
      .map(({ _id, name, email }) => ({
        email,
        value: _id,
        label: name,
      }));
  }

  render() {
    const { contributors = [] } = this.props;
    return (
      <div>
        <Form
          form='add_user_to_estimate'
          onSubmit={this.props.handleSubmit(this.addUser)}
        >
          <div>
            <Field
              multi
              name="addUser"
              placeholder="Find user"
              options={this.options()}
              validate={[requiredSelect]}
              component={renderSelectField}
            />
            <Button
              type="submit"
              color="danger"
            >
              Add new user
            </Button>
          </div>
        </Form>
        {
          contributors.map(({ username, userId }) => (
            <div className={styles.contributor_item}>
              {username}
              <Button
                id={userId}
                color="danger"
                onClick={this.removeUser}
              >
                Remove user
              </Button>
            </div>
          ),
          )
        }
        <Notification ref={ref => this.notificationSystem = ref} />
      </div>
    );
  }
}

AddUsers.propTypes = {
  reset: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  estimateId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  contributors: PropTypes.array.isRequired,
  estimateAddNewContributor: PropTypes.func.isRequired,
  estimateRemoveContributor: PropTypes.func.isRequired,
};


AddUsers = reduxForm({
  form: ADD_USER_TO_ESTIMATE_FORM,
})(AddUsers);

function mapStateToProps({ form }) {
  return {
    contributors: form[ESTIMATE_FORM].values.users,
    estimateId: form[ESTIMATE_FORM].values._id,
  };
}


const userLIst = gql`
  query usersList {
    usersList {
      _id,
      name,
      email,
    }
  },
`;

const addNewContributor = gql`
  mutation Mutation (
    $input: estimateAddNewContributor
  ) {
    estimateAddNewContributor (
      input: $input
    )
  },
`;

const removeContributor = gql`
  mutation Mutation (
    $input: estimateRemoveContributor
  ) {
    estimateRemoveContributor (
      input: $input
    )
  },
`;


export default compose(
  connect(mapStateToProps),
  graphql(userLIst),
  graphql(addNewContributor, { name: 'estimateAddNewContributor' }),
  graphql(removeContributor, { name: 'estimateRemoveContributor' }),
)(AddUsers);
