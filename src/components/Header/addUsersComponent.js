import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';
import {
  Field,
  FieldArray,
  formValueSelector,
} from 'redux-form';
import { Form, reduxForm } from 'redux-form';
import Select from 'react-select';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Notification from 'react-notification-system';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import styles from './styles.scss';
import { renderField } from '../libs/helpers';
import { required, taskHourValidation, mixShouldBeLessThenMax } from '../libs/validation';
import { ESTIMATE_FORM } from '../../constants';
import _ from 'underscore';

import { estimate } from '../../data/queriesClient';

const SelectC = ({ options, optionRender, parentProps: { input: { value, onChange } } }) => {
  return (
    <Select
      value={value}
      backspaceRemoves
      options={options}
      onChange={onChange}
      optionRenderer={optionRender}
    />
  );
}


class AddUsers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.removeUser = this.removeUser.bind(this);
    this.optionRender = this.optionRender.bind(this);
    this.submitAddUser = this.submitAddUser.bind(this);
  }

  mapItemToOption = ({ _id, name, email }) =>
  ({
    email,
    value: _id,
    label: name,
  })

  optionRender = ({ label, email }) => {
    return (
      <div>
        <p>{label}</p>
        <p>{email}</p>
      </div>
    )
  }

  handleChange = (option) => {
    const value = option ? option.value : '';
    this.setState({ value });
  }


  multiChangeHandler(handleChange) {
    return function handleMultiHandler(values) {
      handleChange(values.map(value => value.value));
    };
  }

  submitAddUser({ addUser: {
    value: userId,
    label: username,
    email: userEmail,
  } }) {
    const { mutate, estimateId, reset } = this.props;

    mutate({
      variables: { input: { estimateId, userId, username, userEmail } },
      update: (store) => {
        const data = store.readQuery(
          { query: estimate,
            variables: { id: estimateId },
          },
        );
        data.estimate.users.push({
          userId,
          userEmail,
          username,
        });

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
        const data = store.readQuery(
          { query: estimate,
            variables: { id: estimateId },
          },
        );
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


  render() {
    console.log(this.props);
    const {
      contributors = [],
      data: { usersList = [] }
    } = this.props;

    const options = usersList
      .filter(({ _id }) => !_.findWhere(contributors, { userId: _id }))
      .map(user => this.mapItemToOption(user));

    const select = props => (
      <SelectC
        options={options}
        parentProps={props}
        optionRender={this.optionRender}
      />
    );

    return (
      <div>
        <Form
          onSubmit={this.props.handleSubmit(this.submitAddUser)}
          form='add_user_to_estimate'
          onKeyPress={this.handleOnKeyPress}
        >
          <div>
            <Field
              multi
              name="addUser"
              placeholder="Find user"
              validate={[required]}
              component={select}
            />
            <Button
              type="submit"
              color="danger"
            >
              Add new user
            </Button>
          </div>
        </Form>
        <ul>
          {
            contributors.map(({ username, userEmail, userId }) => (
              <li>
                <p>{username}</p>
                <p>{userEmail}</p>
                <Button
                  id={userId}
                  color="danger"
                  onClick={this.removeUser}
                >
                  Remove user
                </Button>
              </li>
            ),
            )
          }
        </ul>
        <Notification ref={ref => this.notificationSystem = ref} />
      </div>
    );
  }
}

AddUsers.propTypes = {

};


AddUsers = reduxForm({
  form: 'add_user_to_estimate',
  enableReinitialize: false,
})(AddUsers);

function mapStateToProps({
  form,
}) {
  return {
    contributors: form.ESTIMATE_FORM.values.users,
    estimateId: form.ESTIMATE_FORM.values._id,
  };
}


export default compose(
  connect(mapStateToProps),
  graphql(gql`
    query usersList {
      usersList {
        _id,
        name,
        email,
      }
    },
  `),
  graphql(gql`
    mutation Mutation (
      $input: estimateAddNewContributor
    ) {
      estimateAddNewContributor (
        input: $input
      )
    },
  `),
  graphql(gql`
    mutation Mutation (
      $input: estimateRemoveContributor
    ) {
      estimateRemoveContributor (
        input: $input
      )
    },
  `, { name: 'estimateRemoveContributor' }),
)(AddUsers);
