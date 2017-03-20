import React from 'react';

import './style/contacts.css';

export default class Contacts extends React.Component{
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div className="contacts">
        <div>If you have any questions about this estimate, please contact</div>
        <div>
          <input className="contactInput" type="text" placeholder="PM's name" />
          <input className="contactInput" type="text" placeholder="position" />
          <input className="contactInput" type="email" placeholder="email" />
          <input className="contactInput" type="text" placeholder="skype" />
        </div>
      </div>
    )
  }
  
}