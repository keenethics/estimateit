import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';
import {
  Field,
  FieldArray,
  formValueSelector,
} from 'redux-form';

import InputAndPopover from './InputAndPopover';
import { renderField } from '../libs/helpers';
import { required, requiredNumber, mixShouldBeLessThenMax } from '../libs/validation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './styles.scss';

import * as actionsTasks from '../../actions/Tasks';

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
        field: `${field}isChecked`,
        touch: true,
        persistentSubmitErrors: false,
      },
      payload,
    });

    dispatchToggle({ form, field, payload });
  }

  handleBlur(field, task, e) {
    const { store } = this.context;
    const { target: { value: payload } } = event;
    const { meta: { form } } = this.props;


    store.dispatch({
      type: '@@redux-form/BLUR',
      meta: {
        form,
        field: `${field}isChecked`,
        touch: true,
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
    } = this.props;

    const { store: { getState } } = this.context;

    const selector = formValueSelector(form);
    return (
      <FormGroup className={styles.tasks}>
        {level === 0 &&
        <Button
          color="danger"
          onClick={() => fields.unshift({ isChecked: true })}
          className={styles.tasks__add}
        >
          Add task
        </Button>
        }
        {fields.map((task, index) => {
          const taskObj = selector(getState(), task);
          const disabled = taskObj.tasks && taskObj.tasks.length;

          return (
            <FormGroup
              key={task}
              name="tasks"
              className={styles.subtasks}
            >
              <div className={styles.subtasks__wrapper}>
                <Field
                  type="checkbox"
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
                  validate={[required]}
                  component={renderField}
                  id={`${task}.taskName`}
                  name={`${task}.taskName`}
                  className={styles.subtasks__item}
                />
                <div>
                  <Field
                    type="text"
                    addon={'min'}
                    disabled={disabled}
                    component={InputAndPopover}
                    id={`${task}.minimumHours`}
                    name={`${task}.minimumHours`}
                    dispatchChange={dispatchChange}
                    buttonsNames={{
                      plusHour: 'plusMinHour',
                      minusHour: 'minusMinHour',
                      plusMinute: 'plusMinMinute',
                      minusMinute: 'minusMinMinute',
                    }}
                    hoursInputName={'minHoursInput'}
                    minutesInputName={'minMinutesInput'}
                    className={styles.subtasks__item}
                    validate={[requiredNumber, mixShouldBeLessThenMax(`${task}.maximumHours`)]}
                  />
                  <Field
                    type="text"
                    addon={'max'}
                    disabled={disabled}
                    component={InputAndPopover}
                    validate={[requiredNumber]}
                    id={`${task}.maximumHours`}
                    name={`${task}.maximumHours`}
                    dispatchChange={dispatchChange}
                    buttonsNames={{
                      plusHour: 'plusMaxHour',
                      minusHour: 'minusMaxHour',
                      plusMinute: 'plusMaxMinute',
                      minusMinute: 'minusMaxMinute',
                    }}
                    hoursInputName={'maxHoursInput'}
                    className={styles.subtasks__item}
                    minutesInputName={'maxMinutesInput'}
                  />
                </div>
              </div>

              {
                level < 2 &&
                <Button
                  color="danger"
                  className={styles.subtasks__item}
                  onClick={() => dispatchAddSubTask({ form, field: `${task}.tasks` })}
                >
                  Add subtask
                </Button>
              }
              <Button
                color="danger"
                className={styles.subtasks__item}
                onClick={() => dispatchRemove({ index, form, field: task })}
              >
                Delete
              </Button>

              <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
                <FieldArray
                  level={level + 1}
                  component={Task}
                  name={`${task}.tasks`}
                  dispatchToggle={dispatchToggle}
                  dispatchRemove={dispatchRemove}
                  dispatchChange={dispatchChange}
                  dispatchAddSubTask={dispatchAddSubTask}
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
  level: PropTypes.number,
  fields: PropTypes.object,
  dispatchChange: PropTypes.func,
  dispatchRemove: PropTypes.func,
  dispatchToggle: PropTypes.func,
  dispatchAddSubTask: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return { ...bindActionCreators(actionsTasks, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Task);
