import React from 'react';

import './style/contacts.css';
import styles from '../style.scss';

export default class Contacts extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    };
    //this.onContactsChange = this.onContactsChange.bind(this);
  }

  onContactsChange(e) {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    }, () => {
      history.replaceState({}, "", "/?" + JSON.stringify(Object.assign({}, this.state)))
    });
  }

  render() {
    return (
      <div className="contacts">
        <div>If you have any questions about this estimate, please contact</div>
        <div>
          <br/>
          <input
            className={styles.underlined__input}
            type="text"
            placeholder="PM's name"
            name='pm'
            value={this.state.pm}
            onChange={this.onContactsChange.bind(this)}
          /><br/>
          <input
            className={styles.underlined__input}
            type="text"
            placeholder="position"
            name='position'
            value={this.state.position}
            onChange={this.onContactsChange.bind(this)}
          /><br/>
          <input
            className={styles.underlined__input}
            type="email"
            placeholder="email"
            name='email'
            value={this.state.email}
            onChange={this.onContactsChange.bind(this)}
          /><br/>
          <input
            className={styles.underlined__input}
            type="text"
            placeholder="skype"
            name='skype'
            value={this.state.skype}
            onChange={this.onContactsChange.bind(this)}
          /><br/>
        </div>
      </div>
    )
  }

}
