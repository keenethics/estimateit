import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Form, Field, reduxForm } from 'redux-form';
import Notification from 'react-notification-system';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Card,
  Button,
  CardBlock,
  ListGroup,
  CardHeader,
  ListGroupItem,
} from 'reactstrap';

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
  ADD_COTRIBUTORS_TO_ESTIMATE_FORM,
} from '../../constants';


class Contributors extends React.Component {
  constructor(props) {
    super(props);

    this.options = this.options.bind(this);
    this.renderOwner = this.renderOwner.bind(this);
    this.addContributor = this.addContributor.bind(this);
    this.removeContributor = this.removeContributor.bind(this);
    this.renderContributors = this.renderContributors.bind(this);
  }

  addContributor({
    addContributor: {
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

  removeContributor({ target: { id: userId } }) {
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

  renderOwner() {
    const { owner, usersList: { usersList: users = [] } } = this.props;
    const ownerObject = _.findWhere(users, { _id: owner });

    return ownerObject && (
      <ListGroupItem className={styles.owner_item}>
        {ownerObject.name}
        <span>Owner</span>
      </ListGroupItem>
    );
  }

  renderContributors() {
    const { contributors = [] } = this.props;

    return contributors.map(({ username, userId }) => (
      <ListGroupItem className={styles.contributor_item}>
        {username}
        <Button
          size="sm"
          id={userId}
          color="danger"
          onClick={this.removeContributor}
        >
          Remove
        </Button>
      </ListGroupItem>
    ));
  }

  render() {
    return (
      <Card>
        <CardHeader>Contributors</CardHeader>
        <CardBlock>
          <Form
            form={ADD_COTRIBUTORS_TO_ESTIMATE_FORM}
            onSubmit={this.props.handleSubmit(this.addContributor)}
          >
            <div>
              <Field
                multi
                name="addContributor"
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
          <ListGroup>
            {this.renderOwner()}
            {this.renderContributors()}
          </ListGroup>
          <Notification ref={ref => this.notificationSystem = ref} />
        </CardBlock>
      </Card>
    );
  }
}

Contributors.propTypes = {
  reset: PropTypes.func.isRequired,
  owner: PropTypes.string.isRequired,
  usersList: PropTypes.object.isRequired,
  estimateId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  contributors: PropTypes.array.isRequired,
  estimateAddNewContributor: PropTypes.func.isRequired,
  estimateRemoveContributor: PropTypes.func.isRequired,
};


Contributors = reduxForm({
  form: ADD_COTRIBUTORS_TO_ESTIMATE_FORM,
})(Contributors);

function mapStateToProps({ estimate }) {
  const { owner, contributors, _id: estimateId } = estimate;
  return { estimateId, contributors, owner };
}

export default compose(
  connect(mapStateToProps),
  graphql(usersList, { name: 'usersList' }),
  graphql(estimateAddNewContributor, { name: 'estimateAddNewContributor' }),
  graphql(estimateRemoveContributor, { name: 'estimateRemoveContributor' }),
)(withStyles(styles)(Contributors));
