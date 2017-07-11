import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';
import {
  Field,
  FieldArray,
  formValueSelector,
} from 'redux-form';

import styles from './styles.scss';
import InputAndPopover from './InputAndPopover';
import { renderField } from '../libs/helpers';
import { required, requiredNumber, mixShouldBeLessThenMax } from '../libs/validation';

import * as R from 'redux-form';
console.log(R);
class Task extends React.Component {
  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(field, event) {
    const { target: { checked: payload } } = event;
    const { meta: { form }, dispatchToggle } = this.props;

    dispatchToggle({ form, field, payload });
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

    const selector = formValueSelector(form)
    return (
      <FormGroup>
        { level === 0 &&
          <Button
            color="danger"
            onClick={() => fields.unshift({ isChecked: true })}
          >
            Add task
          </Button>
        }
        {fields.map((task, index) => {
          const taskObj = selector(getState(), task);
          const disabled = taskObj.tasks && taskObj.tasks.length;

          return (
            <FormGroup className={styles.subtasks}>
              <Field
                type="checkbox"
                component={renderField}
                id={`${task}.isChecked`}
                name={`${task}.isChecked`}
                className={styles.subtasks__item}
                onChange={e => this.handleToggle(task, e)}
              />
              <Field
                type="text"
                label="Task name:"
                validate={[required]}
                component={renderField}
                id={`${task}.taskName`}
                name={`${task}.taskName`}
                className={styles.right__group_item}
              />
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
                minutesInputName={'maxMinutesInput'}
              />

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
                  level={level+1}
                  component={Task}
                  name={`${task}.tasks`}
                  dispatchToggle={dispatchToggle}
                  dispatchRemove={dispatchRemove}
                  dispatchChange={dispatchChange}
                  dispatchAddSubTask={dispatchAddSubTask}
                />
              </div>
            </FormGroup>
          )
        })}
      </FormGroup>
    );
  }
}

Task.contextTypes = {
  store: PropTypes.object,
};

Task.propTypes = {
  fields: PropTypes.array,
  level: PropTypes.number,
  dispatchChange: PropTypes.func,
  dispatchRemove: PropTypes.func,
  dispatchToggle: PropTypes.func,
  dispatchAddSubTask: PropTypes.func,
};

export default Task;
