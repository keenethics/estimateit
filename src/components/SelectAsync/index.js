import React from 'react';
import _ from 'underscore';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';

import ValidationState, { hintClass } from '../libs/ValidationState';

import {
  usersByEmail,
} from '../../data/queriesClient';


class SelectAsync extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  getUser = (value) => {
    this.setState({ isLoading: true });

    return this.context.client.query({
      query: usersByEmail,
      variables: { email: value },
    }).then(({ data: { usersByEmail: usersLIst } }) => {
      this.setState({ isLoading: false });
      const options = this.filterUsers(usersLIst);

      return { options };
    }).catch((e) => {
      console.error(e);
    });
  }

  filterUsers = (usersList) => {
    const { contributors, owner } = this.props;

    return usersList.filter(({ _id }) =>
      (!_.findWhere(contributors, { _id }) && _id !== owner._id),
    )
    .map(({ _id, email, name }) => ({
      name,
      value: _id,
      label: email,
    }));
  }

  render() {
    const {
      meta,
      className,
      input: { value, onChange },
    } = this.props;
    const { isLoading } = this.state;

    return (
      <FormGroup className={className} title={meta.error || meta.warning}>
        <Select.AsyncCreatable
          create
          value={value}
          backspaceRemoves
          onChange={onChange}
          isLoading={isLoading}
          loadOptions={v => (this.getUser(v))}
          className={hintClass(meta)}
        />
        <ValidationState {...meta} />
      </FormGroup>
    );
  }
}

SelectAsync.contextTypes = {
  client: PropTypes.objectOf(PropTypes.func).isRequired,
};

SelectAsync.propTypes = {
  className: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  owner: PropTypes.objectOf(PropTypes.string).isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SelectAsync;
