import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBlock, CardHeader, Input } from 'reactstrap';
import styles from './styles.scss';

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.onContactsChange = this.onContactsChange.bind(this);
  }

  onContactsChange({ currentTarget: { name, value } }) {
    this.props.addClientData(name, value);
  }

  render() {
    const {
      pm,
      email,
      skype,
      position,
    } = this.props.contacts;

    return (
      <Card className={styles.contacts}>
        <CardHeader>If you have any questions about this estimate, please contact</CardHeader>
        <CardBlock>
          <Input
            name="pm"
            value={pm}
            type="text"
            placeholder="PM's name"
            onChange={this.onContactsChange}
            className={styles.contacts__input}
          />
          <Input
            type="text"
            name="position"
            value={position}
            placeholder="Position"
            onChange={this.onContactsChange}
            className={styles.contacts__input}
          />
          <Input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={this.onContactsChange}
            className={styles.contacts__input}
          />
          <Input
            type="text"
            name="skype"
            value={skype}
            placeholder="Skype"
            onChange={this.onContactsChange}
            className={styles.contacts__input}
          />
        </CardBlock>
      </Card>
    );
  }

}

Contacts.propTypes = {
  contacts: PropTypes.object.isRequired,
  addClientData: PropTypes.func.isRequired,
};
