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


class AddUsers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.optionRender = this.optionRender.bind(this);
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

  render() {
    const { usersList = [] } = this.props.data;
    const options = usersList.map(item => this.mapItemToOption(item));

    return (
      <Form
        form='add_user_to_estimate'
        onKeyPress={this.handleOnKeyPress}
      >
        <div>
          <Select
            backspaceRemoves
            options={options}
            optionRenderer={this.optionRender}
          />
          <button>
            add new user
          </button>
        </div>
      </Form>
    );
  }
}

AddUsers.propTypes = {

};


AddUsers = reduxForm({
  form: 'add_user_to_estimate',
  enableReinitialize: false,
})(AddUsers);


export default compose(
  connect(),
  graphql(gql`
    query usersList {
      usersList {
        _id,
        name,
        email,
      }
    }
  `),
)(AddUsers);
