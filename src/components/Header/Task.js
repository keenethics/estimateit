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

    this.handleToggle = this.handleToggle.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleToggle(field, event) {
    const { store } = this.context;
    const { target: { checked: payload } } = event;
    const { meta: { form }, dispatchToggle } = this.props;

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

    dispatchToggle({ form, field, payload });
  }

  handleBlur(field) {
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
      dispatchToggle,
      dispatchChange,
      dispatchRemove,
      dispatchAddSubTask,
      userCanEditThisEstimate,
    } = this.props;
    const selector = formValueSelector(form);
    const disabled = !userCanEditThisEstimate;
    const showButton = userCanEditThisEstimate;
    const { store: { getState } } = this.context;

    return (
      <FormGroup className={styles.tasks}>
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
                  onChange={e => this.handleToggle(task, e)}
                  onBlur={e => this.handleBlur(task, taskObj, e)}
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
                    id={`${task}.minimumHours`}
                    name={`${task}.minimumHours`}
                    dispatchChange={dispatchChange}
                    hoursInputName={'minHoursInput'}
                    className={styles.subtasks__item}
                    disabled={disabled || haveSubtask}
                    minutesInputName={'minMinutesInput'}
                    validate={[taskHourValidation(disabled), mixShouldBeLessThenMax(`${task}.maximumHours`)]}
                    buttonsNames={{
                      plusHour: 'plusMinHour',
                      minusHour: 'minusMinHour',
                      plusMinute: 'plusMinMinute',
                      minusMinute: 'minusMinMinute',
                    }}
                  />
                  <Field
                    type="text"
                    addon={'max'}
                    component={InputAndPopover}
                    id={`${task}.maximumHours`}
                    name={`${task}.maximumHours`}
                    dispatchChange={dispatchChange}
                    hoursInputName={'maxHoursInput'}
                    className={styles.subtasks__item}
                    disabled={disabled || haveSubtask}
                    minutesInputName={'maxMinutesInput'}
                    validate={[taskHourValidation(disabled)]}
                    buttonsNames={{
                      plusHour: 'plusMaxHour',
                      minusHour: 'minusMaxHour',
                      plusMinute: 'plusMaxMinute',
                      minusMinute: 'minusMaxMinute',
                    }}
                  />
                </div>
              </div>
              {
                (level < 2 && showButton) &&
                <Button
                  color="danger"
                  className={styles.subtasks__item}
                  onClick={() => dispatchAddSubTask({ form, field: `${task}.tasks` })}
                >
                  Add subtask
                </Button>
              }
              {
                showButton &&
                <Button
                  color="danger"
                  className={styles.subtasks__item}
                  onClick={() => dispatchRemove({ index, form, field: task, level })}
                >
                  Delete
                </Button>
              }

              <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
                <FieldArray
                  level={level + 1}
                  component={Task}
                  name={`${task}.tasks`}
                  dispatchToggle={dispatchToggle}
                  dispatchRemove={dispatchRemove}
                  dispatchChange={dispatchChange}
                  dispatchAddSubTask={dispatchAddSubTask}
                  userCanEditThisEstimate={userCanEditThisEstimate}
                />
              </div>
            </FormGroup>
          );
        })}
        { (level === 0 && showButton) &&
          <Button
            color="danger"
            onClick={() => fields.push({ isChecked: true })}
            className={styles.tasks__add}
          >
            Add task
          </Button>
        }
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
  dispatchChange: PropTypes.func.isRequired,
  dispatchRemove: PropTypes.func.isRequired,
  dispatchToggle: PropTypes.func.isRequired,
  dispatchAddSubTask: PropTypes.func.isRequired,
  userCanEditThisEstimate: PropTypes.bool.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsTasks, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);
