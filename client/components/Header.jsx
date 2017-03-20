import React from 'react';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';

// history.replaceState({}, "", "/?" + JSON.stringify(obj));
// console.log(decodeURIComponent(location.href));

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
        {
          name: 'TEST',
          min: 2,
          max: 3,
        },
        {
          name: 'add something',
          min: 2,
          max: 3,
        },
      ]
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
  }

  onDateChange(dateString, { dateMoment, timestamp }) {
    console.log(dateString);
  }

  componentDidMount() {
    const loc = decodeURIComponent(location.href);
    const state = loc.split('?state=').pop();
    console.log(loc.split('?state=').pop());
    console.log(JSON.parse(state));
  }

  renderTasks() {
    const { tasks } = this.state;
    return tasks.map(task =>
      <div>
        <input style={{marginRight: '20px'}} value={task.name} />
        <input type="number"
          style={{marginRight: '20px'}}
          value={task.min}
        />
        <input type="number"
          style={{marginRight: '20px'}}
          value={task.max}
        />
        <button>EDIT</button>
        <button>Add subtask</button>
        <button>Delete</button>
      </div>
    )
  }

  addTask() {

  }

  render () {
    return (
      <div>
        <div className="left-part" style={{float: 'left', marginRight: '50px'}}>
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
        </div>
        <div className="right-part">
          ESTIMATE
          <br />
          <DateField
            dateFormat="YYYY-MM-DD"
            onChange={this.onDateChange}
          />
          <br />
          <label htmlFor="clientName">Client name:</label>
          <input type='text' id="clientName"/><br />
          <label htmlFor="projectName">Project name:</label>
          <input type='text' id="projectName"/><br />
          <label htmlFor="sprintNumber">Sprint #</label>
          <input type='number' id="sprintNumber"/><br />
          <textarea placeholder="Technologies, libraries, APIs" /><br />
          <div className='tasks'>{this.renderTasks()}</div>
          <br/>
          <div className='header--addTaskForm'>
            <input type='text' placeholder='task'/>
            <input type='number' placeholder='minimum hours' />
            <input type='number' placeholder='maximum hours'/>
            <button>Add task</button>
          </div>
          <textarea placeholder="Comments" /><br />
        </div>
      </div>
    )
  }
}
