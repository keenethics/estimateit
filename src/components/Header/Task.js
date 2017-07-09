import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Button } from 'reactstrap';
import styles from './styles.scss';
import InputAndPopover from './InputAndPopover';


import { Field, FieldArray } from 'redux-form';
import { renderField } from '../libs/helpers';
import { required } from '../libs/validation';
import { arrayPush } from 'redux-form';

export default class Task extends React.Component {

  render() {
    const { fields, level } = this.props;
    const { store: { dispatch } } = this.context;
    return (
      <FormGroup>
        {fields.map((task, index) =>
          <FormGroup className={styles.subtasks}>
            <Field
              type="checkbox"
              id={`${task}.isChecked`}
              name={`${task}.isChecked`}
              component="input"
              className={styles.subtasks__item}
            />
            <Field
              type="text"
              id={`${task}.taskName`}
              name={`${task}.taskName`}
              label="Task name:"
              validate={[required]}
              component={renderField}
              className={styles.right__group_item}
            />
            <Field
              type="text"
              addon={'min'}
              id={`${task}.minTime`}
              name={`${task}.minTime`}
              component={InputAndPopover}
              buttonsNames={{
                plusHour: 'plusMinHour',
                plusMinute: 'plusMinMinute',
                minusHour: 'minusMinHour',
                minusMinute: 'minusMinMinute',
              }}
              hoursInputName={'minHoursInput'}
              minutesInputName={'minMinutesInput'}
            />
            <Field
              type="text"
              addon={'max'}
              id={`${task}.maxTime`}
              name={`${task}.maxTime`}
              component={InputAndPopover}
              buttonsNames={{
                plusHour: 'plusMaxHour',
                plusMinute: 'plusMaxMinute',
                minusHour: 'minusMaxHour',
                minusMinute: 'minusMaxMinute',
              }}
              hoursInputName={'maxHoursInput'}
              minutesInputName={'maxMinutesInput'}
            />

            <Button
              color="danger"
              className={styles.subtasks__item}
              onClick={() => dispatch(arrayPush('contact', `${task}.tasks`, {}))}
            >
              Add subtask
            </Button>
            <Button
              color="danger"
              className={styles.subtasks__item}
              onClick={() => fields.remove(index)}
            >
              Delete
            </Button>

            <div className={styles.item__wrapper} style={{ marginLeft: '20px' }}>
              <FieldArray
                name={`${task}.tasks`}
                level={level+1}
                component={Task}
              />
            </div>
          </FormGroup>
        )}
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
};
