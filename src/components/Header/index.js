import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  FormGroup,
  CardTitle,
} from 'reactstrap';
import { Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import datepicker from 'react-datepicker/dist/react-datepicker.css';
import 'react-select/dist/react-select.css';

import Task from './Task';
import styles from './styles.scss';
import NewTaskForm from './NewTaskForm';
import MultiSelect from '../libs/MultiSelect';
import { renderField, renderDateField } from '../libs/helpers';
import * as actionsHeader from '../../actions/Header';
import { required, currency, requiredArray } from '../libs/validation';


const renderTaskss = (props) => {
  console.log(props);

  const { fields } = props;

  return (
    <ul>
      {fields.map((member, index) =>
        <li key={index}>
          <button
            type="button"
            title="Remove Member"
            onClick={() => fields.remove(index)}
          >
            remove
          </button>
          <Field
            name={`${member}.name`}
            type="text"
            component={renderField}
            label="Task name"
          />
        </li>
      )}
      <li>
        <button type="button" onClick={() => fields.push({})}>Add tasks</button>
      </li>
    </ul>
  )
}


class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentTaskId: '',
      newTask: '',
    };

    this.renderTasks = this.renderTasks.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.tasks !== this.props.tasks) {
      this.props = nextProps;
      // this.calculateHours(nextState.parentTaskId, nextState.newTask);
    }
  }


  renderTasks(tasks = [], iterator) {
    return(
      <FieldArray
        name="tasks"
        level={0}
        component={Task}
      />
    )
    // return tasks.map((task) => {
    //   const {
    //     tasks: tasksList,
    //     sumMin,
    //     sumMax,
    //     taskName,
    //     isChecked,
    //     id: taskId,
    //     minimumHours,
    //     maximumHours,
    //   } = task;
    //
    //   const { parentTaskId } = this.props;
    //   return (
    //     <div key={taskId}>
    //       <Task
    //         taskId={taskId}
    //         taskName={taskName}
    //         minimumHours={minimumHours}
    //         maximumHours={maximumHours}
    //         isChecked={isChecked}
    //         sumMin={sumMin}
    //         sumMax={sumMax}
    //         iterator={iterator}
    //         findTaskAndModify={this.props.findTaskAndModify}
    //         removeTask={this.props.removeTask}
    //         setParentTaskId={this.props.setParentTaskId}
    //       />
    //       <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
    //         {tasksList && this.renderTasks(tasksList, iterator + 1)}
    //         {parentTaskId === taskId &&
    //           <NewTaskForm
    //             parentTaskId={parentTaskId}
    //             isSubtask
    //             addNewTask={this.props.addNewTask}
    //             removeParentTaskId={this.props.removeParentTaskId}
    //             addNewSubTask={this.props.addNewSubTask}
    //           />
    //         }
    //       </div>
    //     </div>
    //   );
    // });
  }

  renderHeader() {
    return (
      <div className={styles.right}>
        <Field
          id="date"
          name="date"
          component={renderDateField}
          wrapperClassName={styles.right__group_item}
          fieldClassName={styles.right__group_item}
        />
        <FormGroup className={styles.right__group}>
          <Field
            type="text"
            id="clientName"
            name="clientName"
            label="Client name:"
            validate={[required]}
            component={renderField}
            className={styles.right__group_item}
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

          />
        </FormGroup>
        <FormGroup className={styles.right__group}>
          <Field
            type="number"
            id="sprintNumber"
            name="sprintNumber"
            label="Sprint:"
            validate={[required, currency]}
            component={renderField}
            className={styles.right__group_item}

          />
        </FormGroup>
      </div>
    );
  }

  render() {
    const { tasks } = this.props;
    const technologiesList = [
      'Angular.js',
      'Aurelia',
      'Backbone.js',
      'Bootstrap',
      'Ember.js',
      'Express',
      'Ionic',
      'LoDash',
      'Firebase',
      'Hapi',
      'Meteor.js',
      'Mocha',
      'MongoDB',
      'MEAN',
      'MERN',
      'MobX',
      'Node.js',
      'NodeBots',
      'Phonegap',
      'Polymer',
      'PWA',
      'React.js',
      'Redux',
      'RxJS',
      'Sinon',
      'Socket.io',
      'Sails',
      'Underscore.js',
      'SQL',
      'GraphQL',
      'Unit Testing',
      'Vue.js',
      'd3',
      'jQuery',
    ];

    const options = technologiesList.map(element => ({
      value: element,
      label: element,
    }));

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
            name="technologies"
            component={MultiSelect}
            validate={[requiredArray]}
            options={options}
            handler={this.props.addTechnologies}
            placeholder="Technologies"
            multi
            searchable
            creatable
          />
        </FormGroup>
        {this.renderTasks(tasks)}
      {
        // <FormGroup className="tasks">
        //   {this.renderTasks(tasks, 0)}
        // </FormGroup>
      //   <NewTaskForm
      //   addNewTask={this.props.addNewTask}
      //   removeParentTaskId={this.props.removeParentTaskId}
      //   addNewSubTask={this.props.addNewSubTask}
      // />
  }
        <FormGroup className={styles.right__group}>
          <Field
            type="textarea"
            name="comments"
            validate={[required]}
            component={renderField}
            label="Comments"
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
  removeParentTaskId: PropTypes.func.isRequired,
  addTechnologies: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return { ...state.Header };
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsHeader, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, datepicker)(Header),
);
