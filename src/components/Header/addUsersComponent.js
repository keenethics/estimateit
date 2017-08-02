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
import {
  usersList,
  estimateGeneralInfo,
  estimateAddNewContributor,
  estimateRemoveContributor,
} from '../../data/queriesClient';
import {
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
    const {
      reset,
      estimateId,
      estimateAddNewContributor: addNewContributor,
    } = this.props;

    addNewContributor({
      variables: { input: { estimateId, userId, username, userEmail } },
      update: (store) => {
        const data = store.readQuery({
          query: estimateGeneralInfo,
          variables: { id: estimateId },
        });

        data.estimate.contributors.push({ userId, username, userEmail });

        store.writeQuery({
          query: estimateGeneralInfo, data, variables: { id: estimateId },
        });
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
    const {
      estimateId,
      estimateRemoveContributor: removeContributor,
    } = this.props;

    removeContributor({
      variables: { input: { userId, estimateId } },
      update: (store) => {
        const data = store.readQuery({
          query: estimateGeneralInfo,
          variables: { id: estimateId },
        });

        data.estimate.contributors =
          data.estimate.contributors.filter(e => e.userId !== userId);

        store.writeQuery({
          query: estimateGeneralInfo, data, variables: { id: estimateId },
        });
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
      owner,
      contributors = [],
      usersList: { usersList: users = [] },
    } = this.props;

    return users
      .filter(({ _id }) => (!_.findWhere(contributors, { userId: _id }) && _id !== owner))
      .map(({ _id, name, email }) => ({
        email,
        value: _id,
        label: name,
      }));
  }

  render() {
    const {
      owner,
      contributors = [],
      usersList: { usersList: users = [] },
    } = this.props;
    const ownerObject = _.findWhere(users, { _id: owner });

    return (
      <div>
        <Form
          form={ADD_USER_TO_ESTIMATE_FORM}
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
              Add contributor
            </Button>
          </div>
        </Form>
        { ownerObject &&
          <div className={styles.owner_item}>
            {ownerObject.name}
            <span>Owner</span>
          </div>
        }
        {
          contributors.map(({ username, userId }) => (
            <div className={styles.contributor_item}>
              {username}
              <Button
                id={userId}
                color="danger"
                onClick={this.removeUser}
              >
                Remove
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
  owner: PropTypes.string.isRequired,
  usersList: PropTypes.object.isRequired,
  estimateId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  contributors: PropTypes.array.isRequired,
  estimateAddNewContributor: PropTypes.func.isRequired,
  estimateRemoveContributor: PropTypes.func.isRequired,
};


AddUsers = reduxForm({
  form: ADD_USER_TO_ESTIMATE_FORM,
})(AddUsers);

function mapStateToProps({ estimate }) {
  const { owner, _id: estimateId, contributors } = estimate;
  return { estimateId, contributors, owner };
}

export default compose(
  connect(mapStateToProps),
  graphql(usersList, { name: 'usersList' }),
  graphql(estimateAddNewContributor, { name: 'estimateAddNewContributor' }),
  graphql(estimateRemoveContributor, { name: 'estimateRemoveContributor' }),
)(AddUsers);
