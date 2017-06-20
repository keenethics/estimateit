import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from 'reactstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DateField } from 'react-date-picker';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import calendar from 'react-date-picker/index.css';
import * as actionsHeader from '../../actions/Header';

import { Field } from 'redux-form';
import { renderField, renderTextarea } from '../libs/helpers.js';
import { required, number } from '../libs/validation.js';

import Task from './Task';
import NewTaskForm from './NewTaskForm';
import styles from './styles.scss';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    // this.preAddTask = this.preAddTask.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.textAreaAdjust = this.textAreaAdjust.bind(this);
    // this.createTaskAction = this.createTaskAction.bind(this);
    this.handleAddNewClientData = this.handleAddNewClientData.bind(this);
    this.calculateHours = this.calculateHours.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.date !== this.state.date) {
      this.datefield.setValue(nextState.date);
    }
  }

  // createTaskAction(e, type) {
  //   const { dispatch } = this.props;
  //   const newTask = this.state.newTask;
  //   const id = e.currentTarget.dataset.id;
  //   const { name, value } = e.currentTarget;
  //   const parent = e.currentTarget.parentNode.dataset.parentid;
  //
  //   switch (type) {
  //     case 'ADD_TASK':
  //       newTask.id = shortid.generate();
  //       newTask.minimumHours = newTask.minimumHours || 0;
  //       newTask.maximumHours = newTask.maximumHours || 0;
  //       if (!parent) {
  //         this.props.addNewTask(newTask);
  //         this.props.removeParentTaskId();
  //       } else {
  //         this.props.addNewSubTask(parent, newTask);
  //         this.props.removeParentTaskId();
  //       }
  //       e.currentTarget.parentElement.childNodes.forEach(
  //         i => (i.nodeName === 'INPUT' ? (i.value = '') : ''),
  //       );
  //       this.calculateHours();
  //       break;
  //
  //     case 'EDIT_TASK':
  //       this.props.findTaskAndModify(id, name, value);
  //       this.calculateHours(parent);
  //       break;
  //
  //     case 'DELETE_TASK':
  //       this.props.removeTask(id);
  //       this.calculateHours(parent);
  //       break;
  //
  //     case 'SET_PARENT_TASK_ID':
  //       this.props.setParentTaskId(id);
  //       break;
  //
  //     case 'ADD_NEW_CLIENT_DATA':
  //       this.props.addNewClientData(name, value);
  //       break;
  //
  //     default:
  //       return '';
  //   }
  // }

  onDateChange(dateString) {
    if (dateString) {
      const { dispatch } = this.props;
      this.props.addNewClientData('data', dateString);
    }
  }

  handleAddNewClientData(event) {
    const newTask = this.state.newTask;
    const { name, value } = event.target;
    this.props.addNewClientData(name, value);
  }

  calculateHours(parentTaskId, newTask) {
    // const newTask = this.state.newTask;
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

  // preAddTask({ currentTarget: { name, value, dataset: { parentid } } }) {
  //   const { newTask = {} } = this.state;
  //   newTask[name] = value || 0;
  //   newTask.parentTaskId = parentid;
  //   this.setState({
  //     newTask,
  //   });
  // }

  textAreaAdjust(e) {
    e.target.style.height = '1px';
    e.target.style.height = `${10 + e.target.scrollHeight}px`;
  }

  renderTasks(tasks = [], iterator) {
    return tasks.map((task) => {
      const {
        tasks,
        sumMin,
        sumMax,
        taskName,
        isChecked,
        id: taskId,
        minimumHours,
        maximumHours,
      } = task;
      const { parentTaskId } = this.props;
      return (
        <div key={taskId}>
          <Task
            taskId={taskId}
            taskName={taskName}
            minimumHours={minimumHours}
            maximumHours={maximumHours}
            isChecked={isChecked}
            sumMin={sumMin}
            sumMax={sumMax}
            iterator={iterator}
            findTaskAndModify={this.props.findTaskAndModify}
            removeTask={this.props.removeTask}
            setParentTaskId={this.props.setParentTaskId}
            calculateHours={this.calculateHours}
          />
          <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
            {tasks && this.renderTasks(tasks, iterator + 1)}
            {parentTaskId === taskId &&
              <NewTaskForm
                parentTaskId={parentTaskId}
                isSubtask
                addNewTask={this.props.addNewTask}
                removeParentTaskId={this.props.removeParentTaskId}
                addNewSubTask={this.props.addNewSubTask}
                calculateHours={this.calculateHours}
              />}
          </div>
        </div>
      );
    });
  }

  // renderAddTaskForm(parentTaskId) {
  //   return (
  //     <FormGroup
  //       id="screenShot"
  //       className={styles.tasks__group}
  //       data-parentId={parentTaskId}
  //     >
  //       <Input
  //         data-parentId={parentTaskId}
  //         type="text"
  //         placeholder="Task"
  //         name="taskName"
  //         onBlur={this.preAddTask}
  //         className={styles.tasks__group_item}
  //       />
  //       <Input
  //         data-parentId={parentTaskId}
  //         type="number"
  //         placeholder="min"
  //         name="minimumHours"
  //         min="0"
  //         onBlur={this.preAddTask}
  //         className={styles.tasks__group_item}
  //       />
  //       <Input
  //         data-parentId={parentTaskId}
  //         type="number"
  //         placeholder="max"
  //         name="maximumHours"
  //         onBlur={this.preAddTask}
  //         className={styles.tasks__group_item}
  //       />
  //       <Button
  //         color="danger"
  //         className={styles.tasks__group_item}
  //         onClick={(e) => {
  //           this.createTaskAction(e, 'ADD_TASK');
  //         }}
  //       >
  //         Add task
  //       </Button>
  //     </FormGroup>
  //   );
  // }

  renderHeader() {
    const {
      data,
      clientName,
      projectName,
      sprintNumber,
    } = this.props.headerAdditional;

    return (
      <div className={styles.right}>
        <FormGroup className={styles.right__group}>
          <DateField
            value={data}
            placeholder="Date:"
            htmlFor="datePicker"
            dateFormat="YYYY-MM-DD"
            className={styles.right__group_item}
            onChange={e => this.onDateChange(e)}
            ref={(dateField) => {
              this.datefield = dateField;
            }}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="clientName"
            name="clientName"
            value={clientName}
            label="Client name:"
            validate={[required]}
            component={renderField}
            className={styles.right__group_item}
            onBlur={this.handleAddNewClientData}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="projectName"
            name="projectName"
            value={projectName}
            label="Project name:"
            validate={[required]}
            component={renderField}
            className={styles.right__group_item}
            onBlur={this.handleAddNewClientData}
          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="number"
            id="sprintNumber"
            name="sprintNumber"
            value={sprintNumber}
            label="Sprint:"
            validate={[required, number]}
            component={renderField}
            className={styles.right__group_item}
            onBlur={this.handleAddNewClientData}
          />
        </FormGroup>
      </div>
    );
  }

  render() {
    const { tasks, headerAdditional: { comments, technologies } } = this.props;
    return (
      <div>
        <Row className={styles.header}>
          <Col xs="12">
            <img src={require('../../../public/logo_black.jpg')} height={30} />
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
            {this.renderHeader()}
          </Col>
        </Row>
        <FormGroup className={styles.right__group}>
          <Field
            type="textarea"
            name="technologies"
            value={technologies}
            validate={[required]}
            component={renderField}
            label="Technologies, libraries, APIs"
            onChange={this.textAreaAdjust}
            onBlur={e => this.createTaskAction(e, 'ADD_NEW_CLIENT_DATA')}
          />
        </FormGroup>
        <FormGroup className="tasks">{this.renderTasks(tasks, 0)}</FormGroup>
        <NewTaskForm
          addNewTask={this.props.addNewTask}
          removeParentTaskId={this.props.removeParentTaskId}
          addNewSubTask={this.props.addNewSubTask}
          calculateHours={this.calculateHours}
        />
        <FormGroup className={styles.right__group}>
          <Field
            type="textarea"
            name="comments"
            value={comments}
            validate={[required]}
            component={renderField}
            label="Comments"
            onChange={this.textAreaAdjust}
            onBlur={this.handleAddNewClientData}
          />
        </FormGroup>
      </div>
    );
  }
}

Header.propTypes = {
  tasks: PropTypes.array.isRequired,
  removeTask: PropTypes.func.isRequired,
  addNewTask: PropTypes.func.isRequired,
  addNewSubTask: PropTypes.func.isRequired,
  parentTaskId: PropTypes.string.isRequired,
  setParentTaskId: PropTypes.func.isRequired,
  addNewClientData: PropTypes.func.isRequired,
  findTaskAndModify: PropTypes.func.isRequired,
  headerAdditional: PropTypes.object.isRequired,
  removeParentTaskId: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { ...state.Header };
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsHeader, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(calendar, styles)(Header),
);
