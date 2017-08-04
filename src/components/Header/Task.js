import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';
import {
  Field,
  FieldArray,
  formValueSelector,
} from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles.scss';
import { renderField } from '../libs/helpers';
import InputAndPopover from './InputAndPopover';
import * as actionsTasks from '../../actions/Tasks';
import {
  required,
  maxLength,
  taskHourValidation,
  mixShouldBeLessThenMax,
} from '../libs/validation';

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.handleBlurCheckbox = this.handleBlurCheckbox.bind(this);
    this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this);
  }

  handleToggleCheckbox(field, event) {
    const { store } = this.context;
    const { target: { checked: payload } } = event;
    const { meta: { form }, actionToggleTask } = this.props;

    store.dispatch({
      type: '@@redux-form/CHANGE',
      meta: {
        form,
        touch: true,
        field: `${field}isChecked`,
        persistentSubmitErrors: false,
      },
      payload,
    });

    actionToggleTask({ form, field, payload });
  }

  handleBlurCheckbox(field) {
    const { store } = this.context;
    const { target: { value: payload } } = event;
    const { meta: { form } } = this.props;


    store.dispatch({
      type: '@@redux-form/BLUR',
      meta: {
        form,
        touch: true,
        field: `${field}isChecked`,
      },
      payload,
    });
  }

  render() {
    const {
      level,
      fields,
      meta: { form },
      actionToggleTask,
      actionChangeTaskHours,
      actionRemoveTask,
      actionAddSubTask,
      userCanEditThisEstimate,
    } = this.props;
    const selector = formValueSelector(form);
    const disabled = !userCanEditThisEstimate;
    const showButton = userCanEditThisEstimate;
    const { store: { getState } } = this.context;

    return (
      <FormGroup className={styles.tasks}>
        { (level === 0 && showButton) &&
          <Button
            color="danger"
            onClick={() => fields.push(
              { isChecked: true, minimumMinutes: 0, maximumMinutes: 0 },
            )}
            className={styles.tasks__add}
          >
            Add task
          </Button>
        }
        {fields.map((task, index) => {
          const taskObj = selector(getState(), task);
          const haveSubtask = taskObj.tasks && taskObj.tasks.length;

          return (
            <FormGroup
              key={task}
              name="tasks"
              className={styles.subtasks}
            >
              <div className={styles.subtasks__wrapper}>
                <Field
                  type="checkbox"
                  disabled={disabled}
                  component={renderField}
                  id={`${task}.isChecked`}
                  name={`${task}.isChecked`}
                  className={styles.subtasks__checkbox}
                  onChange={e => this.handleToggleCheckbox(task, e)}
                  onBlur={e => this.handleBlurCheckbox(task, taskObj, e)}
                />
                <Field
                  type="text"
                  label="Task name:"
                  disabled={disabled}
                  component={renderField}
                  id={`${task}.taskName`}
                  name={`${task}.taskName`}
                  className={styles.subtasks__item}
                  validate={[required, maxLength(100)]}
                />
                <div>
                  <Field
                    type="text"
                    addon={'min'}
                    component={InputAndPopover}
                    id={`${task}.minimumMinutes`}
                    name={`${task}.minimumMinutes`}
                    actionChangeTaskHours={actionChangeTaskHours}
                    className={styles.subtasks__item}
                    disabled={disabled || haveSubtask}
                    validate={[taskHourValidation(disabled), mixShouldBeLessThenMax(`${task}.maximumMinutes`)]}
                  />
                  <Field
                    type="text"
                    addon={'max'}
                    component={InputAndPopover}
                    id={`${task}.maximumMinutes`}
                    name={`${task}.maximumMinutes`}
                    actionChangeTaskHours={actionChangeTaskHours}
                    className={styles.subtasks__item}
                    disabled={disabled || haveSubtask}
                    validate={[taskHourValidation(disabled)]}
                  />
                </div>
              </div>
              {
                (level < 2 && showButton) &&
                <Button
                  color="danger"
                  className={styles.subtasks__item}
                  onClick={() => actionAddSubTask({ form, field: `${task}.tasks` })}
                >
                  Add subtask
                </Button>
              }
              {
                showButton &&
                <Button
                  color="danger"
                  className={styles.subtasks__item}
                  onClick={() => actionRemoveTask({ index, form, field: task, level })}
                >
                  Delete
                </Button>
              }

              <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
                <FieldArray
                  level={level + 1}
                  component={Task}
                  name={`${task}.tasks`}
                  actionToggleTask={actionToggleTask}
                  actionRemoveTask={actionRemoveTask}
                  actionChangeTaskHours={actionChangeTaskHours}
                  actionAddSubTask={actionAddSubTask}
                  userCanEditThisEstimate={userCanEditThisEstimate}
                />
              </div>
            </FormGroup>
          );
        })}
      </FormGroup>
    );
  }
}

Task.contextTypes = {
  store: PropTypes.object,
};

Task.propTypes = {
  meta: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  actionChangeTaskHours: PropTypes.func.isRequired,
  actionRemoveTask: PropTypes.func.isRequired,
  actionToggleTask: PropTypes.func.isRequired,
  actionAddSubTask: PropTypes.func.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsTasks, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);
