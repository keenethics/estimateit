import React, { Component } from 'react';
import {
  Button,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from 'reactstrap';
import { DateField } from 'react-date-picker';
import shortid from 'shortid';
import 'react-date-picker/index.css';
import styles from './styles.scss';

// TODO: Add props validation
export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      parentTaskId: '',
      infoCollector: {
        clientName: '',
        projectName: '',
        sprintNumber: '',
      },
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.preAddTask = this.preAddTask.bind(this);
    this.textAreaAdjust = this.textAreaAdjust.bind(this);
    this.createTaskAction = this.createTaskAction.bind(this);
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.date !== this.state.date) {
      this.datefield.setValue(nextState.date);
    }
  }

  createTaskAction(e, type) {
    const newTask = this.state.newTask;
    const parent = e.currentTarget.parentNode.dataset.parentid;
    const id = e.currentTarget.dataset.id;
    const { name, value } = e.currentTarget;

    switch (type) {
      case 'ADD_TASK':
        newTask.id = shortid.generate();
        newTask.minimumHours = newTask.minimumHours || 0;
        newTask.maximumHours = newTask.maximumHours || 0;
        if (!parent) {
          this.props.addNewTask(newTask);
          this.props.removeParentTaskId();
        } else {
          this.props.addNewSubTask(parent, newTask);
          this.props.removeParentTaskId();
        }
        e.currentTarget.parentElement.childNodes.forEach(
          i => (i.nodeName === 'INPUT' ? (i.value = '') : ''),
        );
        this.calculateHours();
        break;

      case 'EDIT_TASK':
        this.props.findTaskAndModify(id, name, value);
        this.calculateHours(parent);
        break;

      case 'DELETE_TASK':
        this.props.removeTask(id);
        this.calculateHours(parent);
        break;

      case 'SET_PARENT_TASK_ID':
        this.props.setParentTaskId(id);
        break;

      case 'ADD_NEW_CLIENT_DATA':
        this.props.addNewClientData(name, value);
        break;

      default:
        return '';
    }
  }
  onDateChange(dateString) {
    if (dateString) {
      this.setState({ date: dateString });
      this.props.addNewClientData('data', dateString);
    }
  }
  calculateHours(parentTaskId) {
    const newTask = this.state.newTask;
    if (newTask !== null) {
      parentTaskId = newTask.parentTaskId;
    }
    const tasks = [...this.props.tasks];
    const updateWithIndex = (tree, id, update) =>
      tree.map((node) => {
        if (node.id === id) node = update(node);
        else if (node.tasks) updateWithIndex(node.tasks, id, update);
        return node;
      });
    const findNodeWithIndex = (tree, id) =>
      tree.find((node) => {
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
          const abc = node.tasks.reduce(
            (acc, value) => ({
              calcMin: (acc.calcMin += +value.minimumHours),
              calcMax: (acc.calcMax += +value.maximumHours),
            }),
            { calcMin: 0, calcMax: 0 },
          );
          node.minimumHours = abc.calcMin;
          node.maximumHours = abc.calcMax;
        }
      }
    };
    const par = findHighest(tasks, parentTaskId);
    sumMin(par);
  }

  preAddTask(e) {
    const newTask = this.state.newTask || {};
    newTask[e.currentTarget.name] = e.currentTarget.value || 0;
    newTask.parentTaskId = e.currentTarget.dataset.parentid;
    this.setState({
      newTask,
    });
  }

  textAreaAdjust(e) {
    e.target.style.height = '1px';
    e.target.style.height = `${10 + e.target.scrollHeight}px`;
  }
  renderTasks(tasks, iterator) {
    return tasks.map((task, i) => (
      <div key={task.id}>
        <FormGroup className={styles.subtasks}>
          <Input
            data-id={task.id}
            className={styles.subtasks__item}
            name="taskName"
            placeholder="subtask"
            value={task.taskName}
            onChange={(e) => {
              this.createTaskAction(e, 'EDIT_TASK');
            }}
          />
          <Input
            data-id={task.id}
            className={styles.subtasks__item}
            type="number"
            value={task.sumMin ? task.sumMin : task.minimumHours}
            name="minimumHours"
            placeholder="min"
            min="0"
            onChange={(e) => {
              this.createTaskAction(e, 'EDIT_TASK');
            }}
          />
          <Input
            data-id={task.id}
            className={styles.subtasks__item}
            type="number"
            value={task.sumMin ? task.sumMax : task.maximumHours}
            name="maximumHours"
            placeholder="max"
            min={task.minimumHours}
            onChange={(e) => {
              this.createTaskAction(e, 'EDIT_TASK');
            }}
          />

          {iterator < 2
            ? <Button
              color="danger"
              className={styles.subtasks__item}
              data-id={task.id}
              onClick={(e) => {
                this.createTaskAction(e, 'SET_PARENT_TASK_ID');
              }}
            >
                Add subtask
              </Button>
            : ''}
          <Button
            color="danger"
            className={styles.subtasks__item}
            data-id={task.id}
            onClick={(e) => {
              this.createTaskAction(e, 'DELETE_TASK');
            }}
          >
            Delete
          </Button>
        </FormGroup>
        <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
          {task.tasks && this.renderTasks(task.tasks, iterator + 1)}
          {this.props.parentId.id === task.id &&
            this.renderAddTaskForm(this.props.parentId.id)}
        </div>
      </div>
    ));
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
          onClick={(e) => {
            this.createTaskAction(e, 'ADD_TASK');
          }}
        >
          Add task
        </Button>
      </FormGroup>
    );
  }

  render() {
    const tasks = this.props.tasks;
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
            xs="12"
            md="5"
            className={`${styles.header__left} ${styles.left}`}
          >
            <div className={styles.left__contacts}>
              <p>3, Lytvynenka street, Lviv</p>
              <p>Keenethics Phone: [+38 096 814 72 66]</p>
              <p>
                e-mail:
                {' '}
                <a href="mailto:founders@keenethics.com">
                  founders@keenethics.com
                </a>
              </p>
              <p><a href="https://keenethics.com/">keenethics.com</a></p>
            </div>
          </Col>
          <Col xs="12" md="7" className={styles.header__right}>
            <Form className={styles.right}>
              <FormGroup className={styles.right__group}>
                <DateField
                  htmlFor="datePicker"
                  dateFormat="YYYY-MM-DD"
                  ref={(dateField) => {
                    this.datefield = dateField;
                  }}
                  onChange={(e) => {
                    this.onDateChange(e);
                  }}
                  placeholder="Date:"
                  className={styles.right__group_item}
                />
              </FormGroup>
              <FormGroup className={styles.right__group}>
                <Input
                  name="clientName"
                  // value={this.state.infoCollector.clientName}
                  type="text"
                  id="clientName"
                  className={styles.right__group_item}
                  onBlur={(e) => {
                    this.createTaskAction(e, 'ADD_NEW_CLIENT_DATA');
                  }}
                  placeholder="Client name:"
                />
              </FormGroup>
              <FormGroup className={styles.right__group}>
                <Input
                  type="text"
                  id="projectName"
                  name="projectName"
                  // value={this.state.infoCollector.projectName}
                  className={styles.right__group_item}
                  onBlur={(e) => {
                    this.createTaskAction(e, 'ADD_NEW_CLIENT_DATA');
                  }}
                  placeholder="Project name:"
                />
              </FormGroup>
              <FormGroup className={styles.right__group}>
                <Input
                  type="number"
                  id="sprintNumber"
                  name="sprintNumber"
                  // value={this.state.infoCollector.sprintNumber}
                  className={styles.right__group_item}
                  onBlur={(e) => {
                    this.createTaskAction(e, 'ADD_NEW_CLIENT_DATA');
                  }}
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
            onBlur={(e) => {
              this.createTaskAction(e, 'ADD_NEW_CLIENT_DATA');
            }}
            placeholder="Technologies, libraries, APIs"
            // value={this.state.technologies}
            name="technologies"
          />
        </FormGroup>
        <FormGroup className="tasks">{this.renderTasks(tasks, 0)}</FormGroup>
        {this.renderAddTaskForm()}
        <FormGroup className={styles.right__group}>
          <Input
            type="textarea"
            onChange={this.textAreaAdjust}
            onBlur={(e) => {
              this.createTaskAction(e, 'ADD_NEW_CLIENT_DATA');
            }}
            // value={this.state.comments}
            placeholder="Comments"
            name="comments"
          />
        </FormGroup>
      </div>
    );
  }
}
