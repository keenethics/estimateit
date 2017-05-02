import React, { Component } from 'react';
import { Button, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap';
import { DateField } from 'react-date-picker';
import shortid from 'shortid';
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
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
    });
  }

  onDateChange(dateString, { dateMoment, timestamp }) {
    if (dateString) {
      this.setState({ date: dateString }, () => {
        history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
      });
    }
  }


  componentDidMount() {
    if (!location.search) location.search = '{"tasks":[],"parentTaskId":null,"newTask":null}';
    const state = JSON.parse(decodeURIComponent(location.search.slice(1)));
    this.setState(Object.assign({}, state));
  }

  findTaskAndModify(tasks, id, name, value) {
    let parentTaskId;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        tasks[i][name] = value;
        parentTaskId = tasks[i].parentTaskId;
        this.calculateHours(parentTaskId);
        break;
      }
      if (tasks[i].tasks && tasks[i].tasks.length == 0) return;
      if (tasks[i].tasks && tasks[i].tasks.length) this.findTaskAndModify(tasks[i].tasks, id, name, value);
    }
    return tasks;
  }

  findTaskAndDelete(id, tasks) {
    let parentTaskId;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        parentTaskId = tasks[i].parentTaskId;
        tasks.splice(i, 1);
        this.calculateHours(parentTaskId);
        break;
      }
      if (tasks[i].tasks && tasks[i].tasks.length > 0) {
        this.findTaskAndDelete(id, tasks[i].tasks);
      }
    }
    return tasks;
  }

  calculateHours(parentTaskId) {
    const newTask = this.state.newTask;
    if (newTask !== null) {
      parentTaskId = newTask.parentTaskId;
    }
    const tasks = [...this.state.tasks];
    const updateWithIndex = (tree, id, update) => tree.map((node) => {
      if (node.id === id) node = update(node);
      else if (node.tasks) updateWithIndex(node.tasks, id, update);
      return node;
    });
    const findNodeWithIndex = (tree, id) => tree.find((node) => {
      if (node.id === id) {
        return node;
      } else if (node.tasks) {
        return findNodeWithIndex(node.tasks, id);
      }
      return undefined;
    });
    const findHighest = (tree, id) => {
      const node = findNodeWithIndex(tree, id);
      if (node && !node.parentTaskId) {
        return node;
      } else if (node && node.parentTaskId) {
        return findHighest(tree, id);
      }
      return undefined;
    };
    const sumMin = (node) => {
      if (typeof node !== 'undefined') {
        if (node.tasks && node.tasks.length > 0) {
          node.tasks.forEach(sumMin);
          const abc = node.tasks.reduce((acc, value) => ({
            calcMin: acc.calcMin += +value.minimumHours,
            calcMax: acc.calcMax += +value.maximumHours,
          }), { calcMin: 0, calcMax: 0 });
          node.minimumHours = abc.calcMin;
          node.maximumHours = abc.calcMax;
        }
      }
    };
    const par = findHighest(tasks, parentTaskId);
    sumMin(par);
  }


  onEditTask(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    const newTasks = this.findTaskAndModify(this.state.tasks.slice(), id, name, value);

    this.setState({ tasks: newTasks }, () => {
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
      this.props.onChangeState(newTasks);
    });
  }

  setParentId(e) {
    const id = e.currentTarget.dataset.id;
    this.setState({ parentTaskId: id });
  }

  renderTasks(tasks, iterator) {
    return tasks.map((task, i) =>
      <div key={task.id}>
        <FormGroup
          className={styles.subtasks}
        >
          <Input
            data-id={task.id}
            className={styles.subtasks__item}
            name="taskName"
            placeholder="subtask"
            value={task.taskName}
            onChange={this.onEditTask}
          />
          <Input
            data-id={task.id}
            className={styles.subtasks__item}
            type="number"
            value={task.sumMin ? task.sumMin : task.minimumHours}
            name="minimumHours"
            placeholder="min"
            min="0"
            onChange={this.onEditTask}
          />
          <Input
            data-id={task.id}
            className={styles.subtasks__item}
            type="number"
            value={task.sumMin ? task.sumMax : task.maximumHours}
            name="maximumHours"
            placeholder="max"
            min={task.minimumHours}
            onChange={this.onEditTask}
          />

          {(iterator < 2) ?
            <Button
              color="danger"
              className={styles.subtasks__item}
              data-id={task.id}
              onClick={this.setParentId}
            >Add subtask</Button> :
            ''}
          <Button
            color="danger"
            className={styles.subtasks__item}
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
    newTask[e.currentTarget.name] = e.currentTarget.value || 0;
    newTask.parentTaskId = e.currentTarget.dataset.parentid;
    this.setState({
      newTask,
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
        className={styles.tasks__group}
        data-parentId={parentTaskId}
      >
        <Input
          data-parentId={parentTaskId}
          type="text"
          placeholder="Task"
          name="taskName"
          onBlur={this.preAddTask}
          className={styles.tasks__group_item}
        />
        <Input
          data-parentId={parentTaskId}
          type="number"
          placeholder="min"
          name="minimumHours"
          min="0"
          onBlur={this.preAddTask}
          className={styles.tasks__group_item}
        />
        <Input
          data-parentId={parentTaskId}
          type="number"
          placeholder="max"
          name="maximumHours"
          onBlur={this.preAddTask}
          className={styles.tasks__group_item}
        />
        <Button
          color="danger"
          className={styles.tasks__group_item}
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
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
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
    const newTask = this.state.newTask;
    newTask.id = shortid.generate();
    const tasks = this.state.tasks.slice();
    let newTasks = [];
    if (!parent) {
      newTasks = [...this.state.tasks, newTask];
      this.setState({ tasks: newTasks, parentTaskId: '', newTask: null }, () => {
        history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
      });
    } else {
      newTasks = this.insertTask(tasks, parent, newTask);
      this.setState({ tasks: newTasks, parentTaskId: '', newTask: null }, () => {
        history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
      });
    }
    this.props.onChangeState(newTasks);
    e.currentTarget.parentElement.childNodes.forEach(i => i.nodeName == 'INPUT' ? i.value = '' : '');
    this.calculateHours();
  }

  textAreaAdjust(e) {
    e.target.style.height = '1px';
    e.target.style.height = `${10 + e.target.scrollHeight}px`;
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    }, () => {
      history.pushState('', '', `${location.pathname}?${JSON.stringify(this.state)}`);
    });
  }

  render() {
    const tasks = this.state.tasks;
    return (
      <div>
        <Row className={styles.header}>
          <Col xs="12">
            <img
              src={require('../../../../pictures/logo_black.jpg')}
              height={30}
            />
            <CardTitle>ESTIMATE</CardTitle>
          </Col>
          <Col
            xs="12" md="5"
            className={`${styles.header__left} ${styles.left}`}
          >
            <div className={styles.left__contacts}>
              <p>3, Lytvynenka street, Lviv</p>
              <p>Keenethics Phone: [+38 096 814 72 66]</p>
              <p>e-mail: <a href="mailto:founders@keenethics.com">founders@keenethics.com</a></p>
              <p><a href="https://keenethics.com/">keenethics.com</a></p>
            </div>
          </Col>
          <Col
            xs="12" md="7"
            className={styles.header__right}
          >
            <Form className={styles.right}>
              <FormGroup className={styles.right__group}>
                <DateField
                  htmlFor="datePicker"
                  dateFormat="YYYY-MM-DD"
                  ref={(dateField) => {
                    this.datefield = dateField;
                  }}
                  onChange={this.onDateChange}
                  placeholder="Date:"
                  className={styles.right__group_item}
                />
              </FormGroup>
              <FormGroup className={styles.right__group}>
                <Input
                  name="clientName"
                  value={this.state.clientName}
                  type="text"
                  id="clientName"
                  className={styles.right__group_item}
                  onChange={this.headerInfoCollector}
                  placeholder="Client name:"
                />
              </FormGroup>
              <FormGroup className={styles.right__group}>
                <Input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={this.state.projectName}
                  className={styles.right__group_item}
                  onChange={this.headerInfoCollector}
                  placeholder="Project name:"
                />
              </FormGroup>
              <FormGroup className={styles.right__group}>
                <Input
                  type="number"
                  id="sprintNumber"
                  name="sprintNumber"
                  value={this.state.sprintNumber}
                  className={styles.right__group_item}
                  onChange={this.headerInfoCollector}
                  placeholder="Sprint:"
                />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <FormGroup className={styles.right__group}>
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
        <FormGroup className={styles.right__group}>
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
