import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Button } from 'reactstrap';
import styles from './styles.scss';
import InputAndPopover from './InputAndPopover';


import { Field, FieldArray } from 'redux-form';
import { renderField, renderDateField } from '../libs/helpers';
import { required, currency, requiredArray } from '../libs/validation';
import { arrayPush } from 'redux-form';

export default class Task extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.CONSTANTS = {
  //     MINUTESINHOUR: 60,
  //     STEPOFMINUTES: 15,
  //     TODECIMAL: 100,
  //   };
  //
  //   const minimumHours = this.formatTime(props.minimumHours);
  //   const maximumHours = this.formatTime(props.maximumHours);
  //
  //   this.state = {
  //     minimumHours,
  //     maximumHours,
      // isPopoverOpenForMinHours: false,
      // isPopoverOpenForMaxHours: false,
  //   };
  //
  //   this.deleteTask = this.deleteTask.bind(this);
  //   this.editTask = this.editTask.bind(this);
  //   this.setParentTaskId = this.setParentTaskId.bind(this);
  //   this.handleInputChange = this.handleInputChange.bind(this);
  //   this.toggleForMinHours = this.toggleForMinHours.bind(this);
  //   this.toggleForMaxHours = this.toggleForMaxHours.bind(this);
  //   this.changeHoursAndMinutes = this.changeHoursAndMinutes.bind(this);
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   const minimumHours = this.formatTime(nextProps.minimumHours);
  //   const maximumHours = this.formatTime(nextProps.maximumHours);
  //   this.setState(() => ({
  //     minimumHours,
  //     maximumHours,
  //   }));
  // }
  //
  // formatTime(digit) {
  //   let tempDigit = digit;
  //   if (typeof digit === 'number') {
  //     tempDigit = digit.toString();
  //   }
  //   let formattedValue;
  //   let hours;
  //   let minutes;
  //   if (tempDigit && tempDigit.match(/\d+/) && !tempDigit.match(/[a-zA-z]/)) {
  //     if (tempDigit.match(/\d+.\d+/)) {
  //       const indexOfHours = 0;
  //       const indexOfMinutes = 1;
  //       const minutesAndHours = tempDigit.split('.');
  //       hours = parseInt(minutesAndHours[indexOfHours]);
  //       minutes = parseInt(minutesAndHours[indexOfMinutes]);
  //       if (minutesAndHours[indexOfMinutes] && (minutesAndHours[indexOfMinutes])[0] !== '0' && (minutesAndHours[indexOfMinutes]).length !== 2) {
  //         minutes *= 10;
  //       }
  //       if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
  //         hours += (Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR));
  //         minutes %= this.CONSTANTS.MINUTESINHOUR;
  //       }
  //
  //       const formattedHours = hours ? `${hours} h ` : '';
  //       const formattedMinutes = minutes ? `${minutes} m` : '';
  //       formattedValue = `${formattedHours}${formattedMinutes}`;
  //       return {
  //         formattedValue,
  //         hours,
  //         minutes,
  //       };
  //     }
  //     hours = parseInt(tempDigit.match(/\d+/) && (tempDigit.match(/\d+/))[0]);
  //     formattedValue = hours ? `${hours} h` : '';
  //
  //     return {
  //       formattedValue,
  //       hours,
  //       minutes: 0,
  //     };
  //   }
  //
  //   hours = tempDigit.match(/\d+(\s+)?h/);
  //   minutes = tempDigit.match(/\d+(\s+)?m/);
  //   hours = hours && hours[0] ? parseInt(hours[0]) : 0;
  //   minutes = minutes && minutes[0] ? parseInt(minutes[0]) : 0;
  //   if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
  //     hours += (Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR));
  //     minutes %= this.CONSTANTS.MINUTESINHOUR;
  //   }
  //
  //   const formattedHours = hours ? `${hours} h ` : '';
  //   formattedValue = minutes ? `${formattedHours}${minutes} m` : `${formattedHours}`;
  //   return {
  //     formattedValue,
  //     hours,
  //     minutes,
  //   };
  // }
  //
  // setParentTaskId(event) {
  //   this.props.setParentTaskId(event.target.dataset.id);
  // }
  //
  // handleInputChange({ target }) {
  //   const { name } = target;
  //   const value = {
  //     formattedValue: target.value,
  //     // hours: 0,
  //     // minutes: 0,
  //   };
  //
  //   this.setState(() => ({
  //     [name]: value,
  //   }));
  // }
  //
  // toggleForMinHours() {
  //   this.setState({
  //     isPopoverOpenForMinHours: !this.state.isPopoverOpenForMinHours,
  //   });
  // }
  //
  // toggleForMaxHours() {
  //   this.setState({
  //     isPopoverOpenForMaxHours: !this.state.isPopoverOpenForMaxHours,
  //   });
  // }
  //
  // editTask({ target: { dataset: { parentid, id }, name, type, checked, value } }) {
  //
  //   value = type === 'checkbox' ? checked : value;
  //   let minimumHours;
  //   let maximumHours;
  //
  //   if (name === 'minimumHours') {
  //     minimumHours = this.formatTime(value);
  //     value = (parseInt(minimumHours.hours) + (parseInt(minimumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0;
  //   }
  //   if (name === 'maximumHours') {
  //     maximumHours = this.formatTime(value);
  //     value = (parseInt(maximumHours.hours) + (parseInt(maximumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0;
  //   }
  //   this.props.findTaskAndModify(id, name, value);
  //
  //   /* const { taskName, isChecked } = this.props;
  //   const newTask = {
  //     taskName,
  //     minimumHours: (parseInt(minimumHours.hours) + (parseInt(minimumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0,
  //     maximumHours: (parseInt(maximumHours.hours) + (parseInt(maximumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0,
  //     isChecked,
  //   };
  //   this.props.saveTaskIntoState(parentid, newTask);*/
  // }
  //

  //
  // deleteTask({ target: { dataset: { id } } }) {
  //   this.props.removeTask(id);
  //
  //   const { taskName, minimumHours, maximumHours, isChecked } = this.props;
  //   const newTask = {
  //     taskName,
  //     minimumHours: minimumHours || 0,
  //     maximumHours: maximumHours || 0,
  //     isChecked,
  //   };
  //   this.props.saveTaskIntoState(parentid, newTask);
  // }

  render() {
    console.log(this);
    // const { minimumHours, maximumHours, isPopoverOpenForMinHours, isPopoverOpenForMaxHours } = this.state;
    // const { taskId, sumMin, sumMax, iterator, isChecked, taskName } = this.props;
    let { fields, level } = this.props;
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

// <Input
//   data-id={taskId}
//   className={styles.subtasks__item}
//   type="checkbox"
//   name="isChecked"
//   checked={isChecked}
//   onChange={this.editTask}
// />
// <Input
//   data-id={taskId}
//   className={styles.subtasks__item}
//   type="text"
//   name="taskName"
//   placeholder={iterator === 0 ? 'Task' : 'Subtask'}
//   value={taskName}
//   onChange={this.editTask}
// />
//
// <InputAndPopover
//   taskId={taskId}
//   id={'popoverForMinHours'}
//   placeholder={'0 h 0 m'}
//   addon={'min'}
//   inputName={'minimumHours'}
//   formattedValue={minimumHours.formattedValue}
//   onInputChange={this.handleInputChange}
//   onInputBlur={this.editTask}
//   onToggle={this.toggleForMinHours}
//   isOpen={isPopoverOpenForMinHours}
//   buttonsNames={{
//     plusHour: 'plusMinHour',
//     plusMinute: 'plusMinMinute',
//     minusHour: 'minusMinHour',
//     minusMinute: 'minusMinMinute',
//   }}
//   onChangeHoursAndMinutes={this.changeHoursAndMinutes}
//   hoursInputName={'minHoursInput'}
//   minutesInputName={'minMinutesInput'}
//   hours={minimumHours.hours}
//   minutes={minimumHours.minutes}
//   // value={sumMin || minimumHours}
//   // onChange={this.editTask}
// />
// <InputAndPopover
//   taskId={taskId}
//   id={'popoverForMaxHours'}
//   placeholder={'0 h 0 m'}
//   addon={'max'}
//   inputName={'maximumHours'}
//   formattedValue={maximumHours.formattedValue}
//   onInputChange={this.handleInputChange}
//   onInputBlur={this.editTask}
//   onToggle={this.toggleForMaxHours}
//   isOpen={isPopoverOpenForMaxHours}
//   buttonsNames={{
//     plusHour: 'plusMaxHour',
//     plusMinute: 'plusMaxMinute',
//     minusHour: 'minusMaxHour',
//     minusMinute: 'minusMaxMinute',
//   }}
//   onChangeHoursAndMinutes={this.changeHoursAndMinutes}
//   hoursInputName={'maxHoursInput'}
//   minutesInputName={'maxMinutesInput'}
//   hours={maximumHours.hours}
//   minutes={maximumHours.minutes}
//   // value={sumMax || maximumHours}
//   // min={minimumHours}
//   // onChange={this.editTask}
// />
//
// {iterator < 2 ?
//   <Button
//     data-id={taskId}
//     className={styles.subtasks__item}
//     color="danger"
//     onClick={this.setParentTaskId}
//   >
//     Add subtask
//   </Button>
//   : ''}
// <Button
//   data-id={taskId}
//   className={styles.subtasks__item}
//   color="danger"
//   onClick={this.deleteTask}
// >
//   Delete
// </Button>

Task.contextTypes = {
  store: PropTypes.object,
};

Task.propTypes = {
  taskId: PropTypes.string.isRequired,
  taskName: PropTypes.string.isRequired,
  minimumHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maximumHours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isChecked: PropTypes.bool.isRequired,
  sumMin: PropTypes.number,
  sumMax: PropTypes.number,
  iterator: PropTypes.number.isRequired,
  findTaskAndModify: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  setParentTaskId: PropTypes.func.isRequired,
  saveTaskIntoState: PropTypes.func.isRequired,
};
