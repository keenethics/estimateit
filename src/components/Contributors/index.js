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
import SelectAsync from '../SelectAsync';
import {
  requiredSelect,
  newContributorEmail,
} from '../libs/validation';

import {
  usersList,
  estimateGeneralInfo,
  estimateAddNewContributor,
  estimateRemoveContributor,
} from '../../data/queriesClient';
import {
  ADD_COTRIBUTORS_TO_ESTIMATE_FORM,
} from '../../constants';
import {
  PENDING,
} from '../../constants/userStatus';

class Contributors extends React.Component {

  addContributor = (value) => {
    const {
      reset,
      estimateId,
      estimateAddNewContributor: addNewContributor,
    } = this.props;

    const {
      name = '',
      className,
      value: _id,
      label: email,
    } = value.addContributor;
    const newUser = !!className;

    addNewContributor({
      variables: { input: { estimateId, _id, name, email, newUser } },
      update: (store, { data: { estimateAddNewContributor: newContributor } }) => {
        const data = store.readQuery({
          query: estimateGeneralInfo,
          variables: { id: estimateId },
        });

        data.estimate.contributors.push(newContributor);

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

  removeContributor = ({ target: { id: contributorId } }) => {
    const {
      estimateId,
      estimateRemoveContributor: removeContributor,
    } = this.props;

    removeContributor({
      variables: { input: { _id: contributorId, estimateId } },
      update: (store, { data: { estimateRemoveContributor: contributorIsRemoved } }) => {
        if (!contributorIsRemoved) return null;

        const data = store.readQuery({
          query: estimateGeneralInfo,
          variables: { id: estimateId },
        });

        data.estimate.contributors =
          data.estimate.contributors.filter(e => e._id !== contributorId);

        store.writeQuery({
          query: estimateGeneralInfo, data, variables: { id: estimateId },
        });

        return null;
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

  renderOwner = () => {
    const { owner } = this.props;

    return owner && (
      <ListGroupItem className={styles.owner_item}>
        <span>
          {owner.name}
          <span className={styles.emails}> ({owner.email})</span>
        </span>
        <span className={styles.owner_item_label}>Owner</span>
      </ListGroupItem>
    );
  }

  renderContributors = () =>
    this.props.contributors.map(({ name, _id, email, status }) => {
      const isPending = status === PENDING;

      return (
        <ListGroupItem className={styles.contributor_item} key={_id}>
          <span>
            {isPending ? email : name}
            <span className={styles.emails}> ({isPending ? 'pending' : email})</span>
          </span>
          <Button
            size="sm"
            id={_id}
            color="danger"
            onClick={this.removeContributor}
          >
            Remove
          </Button>
        </ListGroupItem>
      );
    })

  render() {
    const { owner, contributors } = this.props;

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
                owner={owner}
                name="addContributor"
                placeholder="Find user"
                component={SelectAsync}
                contributors={contributors}
                validate={[
                  requiredSelect,
                  newContributorEmail({ contributors, owner }),
                ]}
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
          <Notification ref={ref => (this.notificationSystem = ref)} />
        </CardBlock>
      </Card>
    );
  }
}

Contributors.propTypes = {
  reset: PropTypes.func.isRequired,
  owner: PropTypes.string.isRequired,
  estimateId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  estimateAddNewContributor: PropTypes.func.isRequired,
  estimateRemoveContributor: PropTypes.func.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ContributorsWrapper = reduxForm({
  form: ADD_COTRIBUTORS_TO_ESTIMATE_FORM,
})(Contributors);

function mapStateToProps({ estimate }) {
  const { owner, contributors, _id: estimateId } = estimate;
  return { owner, estimateId, contributors };
}

export default compose(
  connect(mapStateToProps),
  graphql(usersList, { name: 'usersList' }),
  graphql(estimateAddNewContributor, { name: 'estimateAddNewContributor' }),
  graphql(estimateRemoveContributor, { name: 'estimateRemoveContributor' }),
)(withStyles(styles)(ContributorsWrapper));
