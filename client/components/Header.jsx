import React from 'react';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
    this.state = {

    };
  }

  onDateChange(dateString, { dateMoment, timestamp }) {
    console.log(dateString);
  }



  render () {
    return (
      <div className="left-part">
        <img
          src={require('../pictures/logo.png')}
          height={50}
          width={50}
        />
        <span>
          Keenethics
        </span>
        <div className="header--contacts">
          <span>3, Lytvynenka street, Lviv</span><br />
          <span>Keenethics Phone: [+38 096 814 72 66]</span><br />
          <span>e-mail: <a href="mailto:founders@keenethics.com">founders@keenethics.com</a></span><br />
          <span><a href="https://keenethics.com/">keenethics.com</a></span>
        </div>
        <div className="right-part">
          ESTIMATE
          <DateField
            dateFormat="YYYY-MM-DD"
            onChange={this.onDateChange}
          />
          <label htmlFor="clientName">Client name:</label>
          <input type='text' id="clientName"/>
          <label htmlFor="projectName">Project name:</label>
          <input type='text' id="projectName"/>
          <label htmlFor="sprintNumber">Sprint #</label>
          <input type='number' id="sprintNumber"/>
          <textarea>Technologies, libraries, APIs</textarea>
        </div>
      </div>
    )
  }
}
