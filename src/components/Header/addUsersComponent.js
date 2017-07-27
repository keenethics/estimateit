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

import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import styles from './styles.scss';
import { renderField } from '../libs/helpers';
import { required, taskHourValidation, mixShouldBeLessThenMax } from '../libs/validation';
import { ESTIMATE_FORM } from '../../constants';

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
    value: _id,
    label: name,
    email: email,
  })

  optionRender = ({ value, label, email }) => {
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
    const { mutate, estimateId } = this.props;

    mutate({
      variables: { input: { estimateId, userId, username, userEmail } },
    }).then((res) => {
      console.log('sucsses');
      console.log(res);
      // this.notificationSystem.addNotification({
      //   autoDismiss: 6,
      //   position: 'br',
      //   title: 'Success',
      //   level: 'success',
      //   message: 'Estimate saved',
      // });
    }).catch((error) => {
      console.error(error.message);
      // this.notificationSystem.addNotification({
      //   autoDismiss: 6,
      //   position: 'br',
      //   title: 'Error',
      //   level: 'error',
      //   message: error.message,
      // });
    });
  }

  removeUser({ target: { id: userId } }) {
    const { estimateRemoveContributor } = this.props;
    estimateRemoveContributor({
      variables: { input: { userId } },
    }).then((res) => {
      console.log('sucsses');
      console.log(res);
      // this.notificationSystem.addNotification({
      //   autoDismiss: 6,
      //   position: 'br',
      //   title: 'Success',
      //   level: 'success',
      //   message: 'Estimate saved',
      // });
    }).catch((error) => {
      console.error(error.message);
      // this.notificationSystem.addNotification({
      //   autoDismiss: 6,
      //   position: 'br',
      //   title: 'Error',
      //   level: 'error',
      //   message: error.message,
      // });
    });

  }


  render() {
    console.log('addUser');
    console.log(this.props);
    const {
      contributors = [],
      data: { usersList = [] }
    } = this.props;
    const options = usersList.map(item => this.mapItemToOption(item));

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
