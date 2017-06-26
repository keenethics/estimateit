import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  CardTitle,
  Col,
  FormGroup,
  Row,
} from 'reactstrap';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DateField } from 'react-date-picker';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import calendar from 'react-date-picker/index.css';

import Task from './Task';
import styles from './styles.scss';
import NewTaskForm from './NewTaskForm';
import { renderField } from '../libs/helpers';
import * as actionsHeader from '../../actions/Header';
import { required, number } from '../libs/validation';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentTaskId: '',
      newTask: '',
    };

    this.renderTasks = this.renderTasks.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.textAreaAdjust = this.textAreaAdjust.bind(this);
    this.handleAddNewClientData = this.handleAddNewClientData.bind(this);
    this.calculateHours = this.calculateHours.bind(this);
    this.saveTaskIntoState = this.saveTaskIntoState.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.date !== this.state.date) {
      this.datefield.setValue(nextState.date);
    }
    if (nextProps.tasks !== this.props.tasks) {
      this.props = nextProps;
      this.calculateHours(nextState.parentTaskId, nextState.newTask);
    }
  }

  saveTaskIntoState(parentTaskId = undefined, newTask = null) {
    this.setState({
      parentTaskId,
      newTask,
    });
  }

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
    if (newTask !== null) {
      parentTaskId = newTask.parentTaskId;
    }
    const tasks = [...this.props.tasks];
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

  textAreaAdjust(e) {
    e.target.style.height = '1px';
    e.target.style.height = `${10 + e.target.scrollHeight}px`;
  }

  renderTasks(tasks = [], iterator) {
    return tasks.map((task) => {
      const {
        tasks: tasksList,
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
            saveTaskIntoState={this.saveTaskIntoState}
          />
          <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
            {tasksList && this.renderTasks(tasksList, iterator + 1)}
            {parentTaskId === taskId &&
              <NewTaskForm
                parentTaskId={parentTaskId}
                isSubtask
                addNewTask={this.props.addNewTask}
                removeParentTaskId={this.props.removeParentTaskId}
                addNewSubTask={this.props.addNewSubTask}
                saveTaskIntoState={this.saveTaskIntoState}
              />}
          </div>
        </div>
      );
    });
  }

  renderHeader() {
    const { data } = this.props.headerAdditional;

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
              <p><a href="https://keenethics.com/" target="_blank" rel="noreferrer">keenethics.com</a></p>
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
          />
        </FormGroup>
        <FormGroup className="tasks">{this.renderTasks(tasks, 0)}</FormGroup>
        <NewTaskForm
          addNewTask={this.props.addNewTask}
          removeParentTaskId={this.props.removeParentTaskId}
          addNewSubTask={this.props.addNewSubTask}
          saveTaskIntoState={this.saveTaskIntoState}
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
