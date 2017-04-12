import React, { Component } from 'react';
import { Card, CardBlock, CardHeader, Input } from 'reactstrap';
import styles from './styles.scss';

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // this.onContactsChange = this.onContactsChange.bind(this);
  }

  onContactsChange(e) {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    }, () => {
      history.replaceState({}, '', `/?${JSON.stringify(Object.assign({}, this.state))}`);
    });
  }

  render() {
    return (

      <Card className={styles.contacts}>
        <CardHeader>If you have any questions about this estimate, please contact</CardHeader>
        <CardBlock>
          <Input
            className={styles.contacts__input}
            type="text"
            placeholder="PM's name"
            name="pm"
            value={this.state.pm}
            onChange={this.onContactsChange.bind(this)}
          />
          <Input
            className={styles.contacts__input}
            type="text"
            placeholder="Position"
            name="position"
            value={this.state.position}
            onChange={this.onContactsChange.bind(this)}
          />
          <Input
            className={styles.contacts__input}
            type="email"
            placeholder="Email"
            name="email"
            value={this.state.email}
            onChange={this.onContactsChange.bind(this)}
          />
          <Input
            className={styles.contacts__input}
            type="text"
            placeholder="Skype"
            name="skype"
            value={this.state.skype}
            onChange={this.onContactsChange.bind(this)}
          />
        </CardBlock>
      </Card>
    );
  }

}
