import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';
import {
  Field,
  arrayPush,
  FieldArray,
  formValueSelector,
} from 'redux-form';

import styles from './styles.scss';
import InputAndPopover from './InputAndPopover';
import { renderField } from '../libs/helpers';
import { required, requiredNumber, mixShouldBeLessThenMax } from '../libs/validation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsHeader from '../../actions/Header';

class Task extends React.Component {

  render() {
    const {
      level,
      fields,
      meta: { form },
      dispatchChange,
      dispatchRemove,
    } = this.props;
    console.log(this.props);
    const { store: { dispatch, getState } } = this.context;

    const selector = formValueSelector(form)

    return (
      <FormGroup>
        {fields.map((task, index) => {
          const taskObj = selector(getState(), task);
          const disabled = !!taskObj.tasks;

          return (
            <FormGroup className={styles.subtasks}>
              <Field
                type="checkbox"
                component="input"
                id={`${task}.isChecked`}
                name={`${task}.isChecked`}
                className={styles.subtasks__item}
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

              <Button
                color="danger"
                className={styles.subtasks__item}
                onClick={() => dispatch(arrayPush(form, `${task}.tasks`, {}))}
              >
                Add subtask
              </Button>
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
                  dispatchRemove={dispatchRemove}
                  dispatchChange={dispatchChange}
                />
              </div>
            </FormGroup>
          )
        })}
        { level === 0 &&
          <Button
            color="danger"
            onClick={() => fields.push({})}
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
  fields: PropTypes.array,
  level: PropTypes.number,
  dispatchChange: PropTypes.func,
  dispatchRemove: PropTypes.func,
};

export default Task;
