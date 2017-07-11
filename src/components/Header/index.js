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
import MultiSelect from '../libs/MultiSelect';
import { renderField, renderDateField } from '../libs/helpers';
import * as actionsHeader from '../../actions/Header';
import { required, currency, requiredArray } from '../libs/validation';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTask: '',
    };

    this.renderTasks = this.renderTasks.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  renderTasks(tasks = [], iterator) {
    const {
      dispatchToggle,
      dispatchChange,
      dispatchRemove,
      dispatchAddSubTask
    } = this.props;

    return (
      <FieldArray
        level={0}
        name="tasks"
        component={Task}
        dispatchToggle={dispatchToggle}
        dispatchRemove={dispatchRemove}
        dispatchChange={dispatchChange}
        dispatchAddSubTask={dispatchAddSubTask}
      />
    );
  }

  renderHeader() {
    return (
      <div className={styles.right}>
        <Field
          id="date"
          name="date"
          component={renderDateField}
          fieldClassName={styles.right__group_item}
          wrapperClassName={styles.right__group_item}
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
            label="Sprint:"
            id="sprintNumber"
            name="sprintNumber"
            component={renderField}
            validate={[required, currency]}
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
            multi
            creatable
            searchable
            options={options}
            name="technologies"
            component={MultiSelect}
            validate={[requiredArray]}
            placeholder="Technologies"
            handler={this.props.addTechnologies}
          />
        </FormGroup>
        {this.renderTasks(tasks)}
        <FormGroup className={styles.right__group}>
          <Field
            name="comments"
            type="textarea"
            label="Comments"
            validate={[required]}
            component={renderField}
          />
        </FormGroup>
      </div>
    );
  }
}

Header.propTypes = {
  tasks: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  dispatchToggle: PropTypes.func.isRequired,
  dispatchChange: PropTypes.func.isRequired,
  dispatchRemove: PropTypes.func.isRequired,
  addTechnologies: PropTypes.func.isRequired,
  dispatchAddSubTask: PropTypes.func.isRequired,
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
