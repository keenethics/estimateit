import React from 'react';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';
import moment from 'moment';
import styles from './style.scss';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      parentTaskId: '',
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.addTask = this.addTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.onEditTask = this.onEditTask.bind(this);
    this.setParentId = this.setParentId.bind(this);
    this.preAddTask = this.preAddTask.bind(this);
    this.findTaskAndModify = this.findTaskAndModify.bind(this);
    this.findTaskAndDelete = this.findTaskAndDelete.bind(this);
    this.deleteParentId = this.deleteParentId.bind(this);
    this.insertTask = this.insertTask.bind(this);
    this.textAreaAdjust = this.textAreaAdjust.bind(this);
    this.headerInfoCollector = this.headerInfoCollector.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextState.date !== this.state.date) {
      this.datefield.setValue(nextState.date);
    }
  }

  headerInfoCollector(e) {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    }, () => {
      history.replaceState({}, "", "/?" + JSON.stringify(this.state));
    })
  }

  onDateChange(dateString, { dateMoment, timestamp }) {
    this.setState({ date: dateString }, () => {
      history.replaceState({}, "", "/?" + JSON.stringify(this.state));
    });
  }

  componentDidMount() {
    if (!location.search) location.search = '{"tasks":[],"parentTaskId":"","newTask":null}';
    const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
    console.log(state, 'stataaaate');
    this.setState(Object.assign({}, state), () => {
      console.log(this.state);
    });
  }

  findTaskAndModify(tasks, id, name, value) {
    for(let i = 0; i < tasks.length; i++) {
      if(tasks[i].id == id){
        tasks[i][name] = value;
        break;
      };
      if(tasks[i].tasks && tasks[i].tasks.length == 0) return;
      if(tasks[i].tasks && tasks[i].tasks.length) this.findTaskAndModify(tasks[i].tasks, id, name, value);
    }
    return tasks;
  }

  findTaskAndDelete(id, tasks) {
    for(let i = 0; i < tasks.length; i++) {
      if(tasks[i].id == id) {
        tasks.splice(i, 1);
        break;
      }
      if(tasks[i].tasks && tasks[i].tasks.length == 0) return;
      if(tasks[i].tasks && tasks[i].tasks.length) this.findTaskAndDelete(id, tasks[i].tasks);
    }
    return tasks;
  }

  onEditTask(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    const newTasks = this.findTaskAndModify(this.state.tasks.slice(), id, name, value);

    this.setState({ tasks: newTasks }, () => {
      history.replaceState({}, "", "/?" + JSON.stringify(this.state));
      this.props.onChangeState(newTasks);
    });
  }

  setParentId(e) {
    const id = e.currentTarget.dataset.id;
    this.setState({ parentTaskId: id });
  }

  renderTasks(tasks, iterator) {
    const { parentTaskId } = this.state;
    console.log(`${parentTaskId ? '30px' : '20px'}`);
    return tasks.map((task, i) =>
      <div key={task.id} style={{marginLeft: `20px` }}>
        <input
          data-id={task.id}
          className={styles.task__input}
          name='taskName'
          value={task.taskName}
          onChange={this.onEditTask}
        />
        <input
          data-id={task.id}
          className={styles.task__input}
          type="number"
          value={task.minimumHours}
          name='minimumHours'
          onChange={this.onEditTask}
        />
        <input
          data-id={task.id}
          className={styles.task__input}
          type="number"
          value={task.maximumHours}
          name='maximumHours'
          onChange={this.onEditTask}
        />
        {(iterator < 2) ?
          <button data-id={task.id} onClick={this.setParentId} >Add subtask</button> :
        ''}
        <button data-id={task.id} onClick={this.deleteTask}>Delete</button>

        {task.tasks && this.renderTasks(task.tasks, iterator + 1)}
        {this.state.parentTaskId == task.id && this.renderAddTaskForm(this.state.parentTaskId)}
      </div>
    )
  }

  preAddTask(e) {
    const newTask = this.state.newTask || {};
    newTask[e.currentTarget.name] = e.currentTarget.value;
    newTask.parentTaskId = e.currentTarget.dataset.parentId || null;
    this.setState({
      newTask,
    }, () => {
      console.log(this.state);
    })
  }

  deleteParentId(e) {
    this.setState({ parentTaskId: null }, () => {
      console.log(this.state.parentTaskId);
    });
  }

  renderAddTaskForm(parentTaskId) {
    return (
      <div className='header--addTaskForm' data-parentId={parentTaskId}>
        <input
          data-parentId={parentTaskId}
          type='text'
          placeholder='task'
          name='taskName'
          onChange={this.preAddTask}
          className={styles.task__input}
        />
        <input
          data-parentId={parentTaskId}
          type='number'
          placeholder='minimum hours'
          name='minimumHours'
          onChange={this.preAddTask}
          className={styles.task__input}
        />
        <input
          data-parentId={parentTaskId}
          type='number'
          placeholder='maximum hours'
          name='maximumHours'
          onChange={this.preAddTask}
          className={styles.task__input}
        />
      <button onClick={this.addTask}>Add task</button>
      </div>
    )
  }

  deleteTask(e) {
    const id = e.currentTarget.dataset.id;
    const tasks = this.state.tasks.slice();
    const newTasks = this.findTaskAndDelete(id, tasks);
    this.setState({ tasks: newTasks }, () => {
      history.replaceState({}, "", "/?" + JSON.stringify(this.state));
    });
    this.props.onChangeState(newTasks);

  }

  insertTask(tasks, id, newTask) {
    for(let i=0; i < tasks.length; i++) {
      if(tasks[i].id == id) {
        if(tasks[i].tasks && tasks[i].tasks.length) {
          tasks[i].tasks.push(newTask);
          break;
        } else {
          tasks[i].tasks = [];
          tasks[i].tasks.push(newTask);
          break;
        }
      }
      if(tasks[i].tasks && tasks[i].tasks.length) this.insertTask(tasks[i].tasks, id, newTask);
    }
    return tasks;
  }

  addTask(e) {
    const parent = e.currentTarget.parentNode.dataset.parentid;
    console.log(parent);
    const newTask = this.state.newTask;
    newTask.id = new Date().getTime();
    const tasks = this.state.tasks.slice();
    let newTasks = [];
    if(!parent) {
      newTasks = [...this.state.tasks, newTask];
      this.setState({ tasks: newTasks, parentTaskId: '', newTask: null} , () => {
        history.replaceState({}, "", "/?" + JSON.stringify(this.state));
      });
    } else {
      newTasks = this.insertTask(tasks, parent, newTask);
      this.setState({ tasks: newTasks, parentTaskId: '', newTask: null} , () => {
        history.replaceState({}, "", "/?" + JSON.stringify(this.state));
      });
    }
    this.props.onChangeState(newTasks);
    e.currentTarget.parentElement.childNodes.forEach(i => i.nodeName =='INPUT' ? i.value = '' : '')
  }

  textAreaAdjust(e) {
    e.target.style.height = '1px';
    e.target.style.height = (10+e.target.scrollHeight)+"px";
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    }, () => {
      history.replaceState({}, "", "/?" + JSON.stringify(this.state));
    })
  }

  render () {
    const tasks = this.state.tasks;
    return (
      <div>
        <div className={styles.left__part}>
          <img
            src={require('../pictures/logo.png')}
            height={50}
            width={50}
          />
          <span className={styles.company__name}>
            Keenethics </span>
          <div className={styles.header__contacts}>
            <span>3, Lytvynenka street, Lviv</span>
            <span>Keenethics Phone: [+38 096 814 72 66]</span>
            <span>e-mail: <a href="mailto:founders@keenethics.com">founders@keenethics.com</a></span>
            <span><a href="https://keenethics.com/">keenethics.com</a></span>
          </div>
        </div>
        <div className={styles.right__part}>
          <div className={styles.emphasize}>ESTIMATE</div>
          <span>
            <label htmlFor="datePicker">Date:</label>
            <DateField
              htmlFor='datePicker'
              dateFormat='YYYY-MM-DD'
              ref={(dateField) => { this.datefield = dateField; }}
              onChange={this.onDateChange}
            />
          </span>
          <span>
            <label htmlFor="clientName">Client name:</label>
            <input
              name='clientName'
              value={this.state.clientName}
              type='text'
              id="clientName"
              className={styles.underlined__input}
              onChange={this.headerInfoCollector}
            />
          </span>
          <span>
            <label htmlFor="projectName">Project name:</label>
            <input
              type='text'
              id="projectName"
              name='projectName'
              value={this.state.projectName}
              className={styles.underlined__input}
              onChange={this.headerInfoCollector}
            />
          </span>
          <span>
            <label htmlFor="sprintNumber">Sprint #</label>
            <input
              type='number'
              id="sprintNumber"
              name='sprintNumber'
              value={this.state.sprintNumber}
              className={styles.underlined__input}
              onChange={this.headerInfoCollector}
            />
          </span>
        </div>
          <div className={styles.clearfix}></div>
          <textarea
            onChange={this.textAreaAdjust}
            placeholder="Technologies, libraries, APIs"
            value={this.state.technologies}
            name='technologies'
          /><br />
          <div className='tasks'>{this.renderTasks(tasks, 0)}</div>
          <br/>
          {this.renderAddTaskForm()}
          <textarea
            onChange={this.textAreaAdjust}
            value={this.state.comments}
            placeholder="Comments"
            name='comments'
          /><br />
      </div>
    )
  }
}
