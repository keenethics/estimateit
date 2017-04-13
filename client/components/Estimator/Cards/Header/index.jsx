import React, { Component } from 'react';
import { Button, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';
import styles from './styles.scss';

export default class Header extends Component {
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
    if (nextState.date !== this.state.date) {
      this.datefield.setValue(nextState.date);
    }
  }

  headerInfoCollector(e) {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    }, () => {
      history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
    });
  }

  onDateChange(dateString, { dateMoment, timestamp }) {
    if (dateString) {
      this.setState({ date: dateString }, () => {
        history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
      });
    }
  }


  componentDidMount() {
    if (!location.search) location.search = '{"tasks":[],"parentTaskId":"","newTask":null}';
    const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
    this.setState(Object.assign({}, state), () => {
      console.log(this.state);
    });
  }

  findTaskAndModify(tasks, id, name, value) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        tasks[i][name] = value;
        break;
      }
      if (tasks[i].tasks && tasks[i].tasks.length == 0) return;
      if (tasks[i].tasks && tasks[i].tasks.length) {
        this.findTaskAndModify(tasks[i].tasks, id, name, value);
      }
    }
    return tasks;
  }

  findTaskAndDelete(id, tasks) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        tasks.splice(i, 1);
        break;
      }
      if (tasks[i].tasks && tasks[i].tasks.length == 0) return;
      if (tasks[i].tasks && tasks[i].tasks.length) this.findTaskAndDelete(id, tasks[i].tasks);
    }
    return tasks;
  }

  onEditTask(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    const newTasks = this.findTaskAndModify(this.state.tasks.slice(), id, name, value);

    this.setState({ tasks: newTasks }, () => {
      history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
      this.props.onChangeState(newTasks);
    });
  }

  setParentId(e) {
    const id = e.currentTarget.dataset.id;
    this.setState({ parentTaskId: id });
  }

  renderTasks(tasks, iterator) {
    return tasks.map((task, i) =>
      <div>
        <FormGroup
          className={styles.subTasks}
          key={task.id}
          style={{ marginLeft: '20px' }}
        >
          <Input
            data-id={task.id}
            className={styles.subTasks__item}
            name="taskName"
            placeholder="subtask"
            value={task.taskName}
            onChange={this.onEditTask}
          />
          <Input
            data-id={task.id}
            className={styles.subTasks__item}
            type="number"
            value={task.minimumHours}
            name="minimumHours"
            placeholder="min"
            onChange={this.onEditTask}
          />
          <Input
            data-id={task.id}
            className={styles.subTasks__item}
            type="number"
            value={task.maximumHours}
            name="maximumHours"
            placeholder="max"
            onChange={this.onEditTask}
          />
          {(iterator < 2) ?
            <Button
              color="danger"
              className={styles.subTasks__item}
              data-id={task.id}
              onClick={this.setParentId}
            >Add subtask</Button> :
            ''}
          <Button
            color="danger"
            className={styles.subTasks__item}
            data-id={task.id}
            onClick={this.deleteTask}
          >Delete</Button>
        </FormGroup>
        <div
          className={styles.item__wrapper}
          style={{ marginLeft: '20px' }}
        >
          {task.tasks && this.renderTasks(task.tasks, iterator + 1)}
          {this.state.parentTaskId == task.id && this.renderAddTaskForm(this.state.parentTaskId)}
        </div>
      </div>,
    );
  }

  preAddTask(e) {
    const newTask = this.state.newTask || {};
    newTask[e.currentTarget.name] = e.currentTarget.value;
    newTask.parentTaskId = e.currentTarget.dataset.parentId || null;
    this.setState({
      newTask,
    }, () => {
      console.log(this.state);
    });
  }

  deleteParentId(e) {
    this.setState({ parentTaskId: null }, () => {
      console.log(this.state.parentTaskId);
    });
  }

  renderAddTaskForm(parentTaskId) {
    return (
      <FormGroup
        id="screenShot"
        className={styles.tasks__inputGroup}
        data-parentId={parentTaskId}
      >
        <Input
          data-parentId={parentTaskId}
          type="text"
          placeholder="task"
          name="taskName"
          onChange={this.preAddTask}
          className={styles.tasks__inputGroup_item}
        />
        <Input
          data-parentId={parentTaskId}
          type="number"
          placeholder="min"
          name="minimumHours"
          onChange={this.preAddTask}
          className={styles.tasks__inputGroup_item}
        />
        <Input
          data-parentId={parentTaskId}
          type="number"
          placeholder="max"
          name="maximumHours"
          onChange={this.preAddTask}
          className={styles.tasks__inputGroup_item}
        />
        <Button
          color="danger"
          className={styles.tasks__inputGroup_item}
          onClick={this.addTask}
        >Add task</Button>
      </FormGroup>
    );
  }

  deleteTask(e) {
    const id = e.currentTarget.dataset.id;
    const tasks = this.state.tasks.slice();
    const newTasks = this.findTaskAndDelete(id, tasks);
    this.setState({ tasks: newTasks }, () => {
      history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
    });
    this.props.onChangeState(newTasks);
  }

  insertTask(tasks, id, newTask) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        if (tasks[i].tasks && tasks[i].tasks.length) {
          tasks[i].tasks.push(newTask);
          break;
        } else {
          tasks[i].tasks = [];
          tasks[i].tasks.push(newTask);
          break;
        }
      }
      if (tasks[i].tasks && tasks[i].tasks.length) this.insertTask(tasks[i].tasks, id, newTask);
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
    if (!parent) {
      newTasks = [...this.state.tasks, newTask];
      this.setState({ tasks: newTasks, parentTaskId: '', newTask: null }, () => {
        history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
      });
    } else {
      newTasks = this.insertTask(tasks, parent, newTask);
      this.setState({ tasks: newTasks, parentTaskId: '', newTask: null }, () => {
        history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
      });
    }
    this.props.onChangeState(newTasks);
    e.currentTarget.parentElement.childNodes.forEach(i => i.nodeName == 'INPUT' ? i.value = '' : '');
  }

  textAreaAdjust(e) {
    e.target.style.height = '1px';
    e.target.style.height = `${10 + e.target.scrollHeight}px`;
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    }, () => {
      history.replaceState({}, '', `/?${JSON.stringify(this.state)}`);
    });
  }

  render() {
    const tasks = this.state.tasks;
    return (
      <div>
        <Row className={styles.header}>
          <Col
            xs="12" md="5"
            className={`${styles.header__left} ${styles.left}`}
          >
            <img
              src={require('../../../../pictures/logo.png')}
              height={50}
              width={50}
            />
            <span className={styles.left__company}>
            Keenethics </span>
            <div className={styles.left__contacts}>
              <span>3, Lytvynenka street, Lviv</span>
              <span>Keenethics Phone: [+38 096 814 72 66]</span>
              <span>e-mail: <a href="mailto:founders@keenethics.com">founders@keenethics.com</a></span>
              <span><a href="https://keenethics.com/">keenethics.com</a></span>
            </div>
          </Col>
          <Col
            xs="12" md="7"
            className={styles.header__right}
          >
            <Form className={styles.right}>
              <CardTitle>ESTIMATE</CardTitle>
              <FormGroup className={styles.right__inputGroup}>
                <DateField
                  htmlFor="datePicker"
                  dateFormat="YYYY-MM-DD"
                  ref={(dateField) => {
                    this.datefield = dateField;
                  }}
                  onChange={this.onDateChange}
                  placeholder="Date:"
                  className={styles.right__inputGroup_item}
                />
              </FormGroup>
              <FormGroup className={styles.right__inputGroup}>
                <Input
                  name="clientName"
                  value={this.state.clientName}
                  type="text"
                  id="clientName"
                  className={styles.right__inputGroup_item}
                  onChange={this.headerInfoCollector}
                  placeholder="Client name:"
                />
              </FormGroup>
              <FormGroup className={styles.right__inputGroup}>
                <Input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={this.state.projectName}
                  className={styles.right__inputGroup_item}
                  onChange={this.headerInfoCollector}
                  placeholder="Project name:"
                />
              </FormGroup>
              <FormGroup className={styles.right__inputGroup}>
                <Input
                  type="number"
                  id="sprintNumber"
                  name="sprintNumber"
                  value={this.state.sprintNumber}
                  className={styles.right__inputGroup_item}
                  onChange={this.headerInfoCollector}
                  placeholder="Sprint:"
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <FormGroup className={styles.right__inputGroup}>
          <Input
            type="textarea"
            onChange={this.textAreaAdjust}
            placeholder="Technologies, libraries, APIs"
            value={this.state.technologies}
            name="technologies"
          />
        </FormGroup>
        <FormGroup className="tasks">{this.renderTasks(tasks, 0)}</FormGroup>
        {this.renderAddTaskForm()}
        <FormGroup className={styles.right__inputGroup}>
          <Input
            type="textarea"
            onChange={this.textAreaAdjust}
            value={this.state.comments}
            placeholder="Comments"
            name="comments"
          />
        </FormGroup>
      </div>
    );
  }
}
