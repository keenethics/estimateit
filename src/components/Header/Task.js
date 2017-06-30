import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Button } from 'reactstrap';
import styles from './styles.scss';
import InputAndPopover from './InputAndPopover';

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.CONSTANTS = {
      MINUTESINHOUR: 60,
      STEPOFMINUTES: 15,
      TODECIMAL: 100,
    };

    const minimumHours = this.formatTime(props.minimumHours);
    const maximumHours = this.formatTime(props.maximumHours);

    this.state = {
      minimumHours,
      maximumHours,
      isPopoverOpenForMinHours: false,
      isPopoverOpenForMaxHours: false,
    };

    this.deleteTask = this.deleteTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.setParentTaskId = this.setParentTaskId.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleForMinHours = this.toggleForMinHours.bind(this);
    this.toggleForMaxHours = this.toggleForMaxHours.bind(this);
    this.changeHoursAndMinutes = this.changeHoursAndMinutes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const minimumHours = this.formatTime(nextProps.minimumHours);
    const maximumHours = this.formatTime(nextProps.maximumHours);
    this.setState(() => ({
      minimumHours,
      maximumHours,
    }));
  }

  formatTime(digit) {
    let tempDigit = digit;
    if (typeof digit === 'number') {
      tempDigit = digit.toString();
    }
    let formattedValue;
    let hours;
    let minutes;
    if (tempDigit && tempDigit.match(/\d+/) && !tempDigit.match(/[a-zA-z]/)) {
      if (tempDigit.match(/\d+.\d+/)) {
        const indexOfHours = 0;
        const indexOfMinutes = 1;
        const minutesAndHours = tempDigit.split('.');
        hours = parseInt(minutesAndHours[indexOfHours]);
        minutes = parseInt(minutesAndHours[indexOfMinutes]);
        if (minutesAndHours[indexOfMinutes] && (minutesAndHours[indexOfMinutes])[0] !== '0' && (minutesAndHours[indexOfMinutes]).length !== 2) {
          minutes *= 10;
        }
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += (Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR));
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }

        const formattedHours = hours ? `${hours} h ` : '';
        const formattedMinutes = minutes ? `${minutes} m` : '';
        formattedValue = `${formattedHours}${formattedMinutes}`;
        return {
          formattedValue,
          hours,
          minutes,
        };
      }
      hours = parseInt(tempDigit.match(/\d+/) && (tempDigit.match(/\d+/))[0]);
      formattedValue = hours ? `${hours} h` : '';

      return {
        formattedValue,
        hours,
        minutes: 0,
      };
    }

    hours = tempDigit.match(/\d+(\s+)?h/);
    minutes = tempDigit.match(/\d+(\s+)?m/);
    hours = hours && hours[0] ? parseInt(hours[0]) : 0;
    minutes = minutes && minutes[0] ? parseInt(minutes[0]) : 0;
    if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
      hours += (Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR));
      minutes %= this.CONSTANTS.MINUTESINHOUR;
    }

    const formattedHours = hours ? `${hours} h ` : '';
    formattedValue = minutes ? `${formattedHours}${minutes} m` : `${formattedHours}`;
    return {
      formattedValue,
      hours,
      minutes,
    };
  }

  setParentTaskId(event) {
    this.props.setParentTaskId(event.target.dataset.id);
  }

  handleInputChange({ target }) {
    const { name } = target;
    const value = {
      formattedValue: target.value,
      // hours: 0,
      // minutes: 0,
    };

    this.setState(() => ({
      [name]: value,
    }));
  }

  toggleForMinHours() {
    this.setState({
      isPopoverOpenForMinHours: !this.state.isPopoverOpenForMinHours,
    });
  }

  toggleForMaxHours() {
    this.setState({
      isPopoverOpenForMaxHours: !this.state.isPopoverOpenForMaxHours,
    });
  }

  editTask({ target: { dataset: { parentid, id }, name, type, checked, value } }) {

    value = type === 'checkbox' ? checked : value;
    let minimumHours;
    let maximumHours;

    if (name === 'minimumHours') {
      minimumHours = this.formatTime(value);
      value = (parseInt(minimumHours.hours) + (parseInt(minimumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0;
    }
    if (name === 'maximumHours') {
      maximumHours = this.formatTime(value);
      value = (parseInt(maximumHours.hours) + (parseInt(maximumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0;
    }
    this.props.findTaskAndModify(id, name, value);

    /* const { taskName, isChecked } = this.props;
    const newTask = {
      taskName,
      minimumHours: (parseInt(minimumHours.hours) + (parseInt(minimumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0,
      maximumHours: (parseInt(maximumHours.hours) + (parseInt(maximumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0,
      isChecked,
    };
    this.props.saveTaskIntoState(parentid, newTask);*/
  }

  changeHoursAndMinutes ({ target }) {
    let { name } = target;
    const { id } = target.dataset;
    let value;
    const minInputsNames = ['plusMinHour', 'plusMinMinute', 'minusMinHour', 'minusMinMinute', 'minHoursInput', 'minMinutesInput'];
    const maxInputsNames = ['plusMaxHour', 'plusMaxMinute', 'minusMaxHour', 'minusMaxMinute', 'maxHoursInput', 'maxMinutesInput'];
    if (minInputsNames.includes(name)) {
      name = 'minimumHours';
      value = this.state.minimumHours;
    }
    if (maxInputsNames.includes(name)) {
      name = 'maximumHours';
      value = this.state.maximumHours;
    }
    let { hours, minutes } = value;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    switch (target.id) {
      case 'plusHour': {
        value = ++hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.props.findTaskAndModify(id, name, value);
        break;
      }
      case 'plusMinute': {
        minutes += this.CONSTANTS.STEPOFMINUTES;
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }
        value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.props.findTaskAndModify(id, name, value);
        break;
      }
      case 'minusHour': {
        if (hours === 0) {
          return;
        }
        value = --hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.props.findTaskAndModify(id, name, value);
        break;
      }
      case 'minusMinute': {
        if (minutes <= 14) {
          if (hours === 0) {
            minutes = 0;
            value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
          } else {
            minutes = this.CONSTANTS.MINUTESINHOUR - (this.CONSTANTS.STEPOFMINUTES - minutes);
            hours--;
          }
          value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
          this.props.findTaskAndModify(id, name, value);
          return;
        }
        minutes -= this.CONSTANTS.STEPOFMINUTES;
        value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.props.findTaskAndModify(id, name, value);
        break;
      }
      case 'changeHours': {
        hours = parseInt(target.value) || 0;
        value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.props.findTaskAndModify(id, name, value);
        break;
      }
      case 'changeMinutes': {
        minutes = parseInt(target.value) || 0;
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }
        value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.props.findTaskAndModify(id, name, value);
      }
    }
  }

  deleteTask({ target: { dataset: { id, parentid } } }) {
    const { target } = event;
    this.props.removeTask(id);

    const { taskName, minimumHours, maximumHours, isChecked } = this.props;
    const newTask = {
      taskName,
      minimumHours: minimumHours || 0,
      maximumHours: maximumHours || 0,
      isChecked,
    };
    this.props.saveTaskIntoState(parentid, newTask);
  }

  render() {
    const { minimumHours, maximumHours, isPopoverOpenForMinHours, isPopoverOpenForMaxHours } = this.state;
    const { taskId, sumMin, sumMax, iterator, isChecked, taskName } = this.props;

    return (
      <FormGroup className={styles.subtasks}>
        <Input
          data-id={taskId}
          className={styles.subtasks__item}
          type="checkbox"
          name="isChecked"
          checked={isChecked}
          onChange={this.editTask}
        />
        <Input
          data-id={taskId}
          className={styles.subtasks__item}
          type="text"
          name="taskName"
          placeholder={iterator === 0 ? 'Task' : 'Subtask'}
          value={taskName}
          onChange={this.editTask}
        />

        <InputAndPopover
          taskId={taskId}
          id={'popoverForMinHours'}
          placeholder={'0 h 0 m'}
          addon={'min'}
          inputName={'minimumHours'}
          formattedValue={minimumHours.formattedValue}
          onInputChange={this.handleInputChange}
          onInputBlur={this.editTask}
          onToggle={this.toggleForMinHours}
          isOpen={isPopoverOpenForMinHours}
          buttonsNames={{
            plusHour: 'plusMinHour',
            plusMinute: 'plusMinMinute',
            minusHour: 'minusMinHour',
            minusMinute: 'minusMinMinute',
          }}
          onChangeHoursAndMinutes={this.changeHoursAndMinutes}
          hoursInputName={'minHoursInput'}
          minutesInputName={'minMinutesInput'}
          hours={minimumHours.hours}
          minutes={minimumHours.minutes}
          // value={sumMin || minimumHours}
          // onChange={this.editTask}
        />
        <InputAndPopover
          taskId={taskId}
          id={'popoverForMaxHours'}
          placeholder={'0 h 0 m'}
          addon={'max'}
          inputName={'maximumHours'}
          formattedValue={maximumHours.formattedValue}
          onInputChange={this.handleInputChange}
          onInputBlur={this.editTask}
          onToggle={this.toggleForMaxHours}
          isOpen={isPopoverOpenForMaxHours}
          buttonsNames={{
            plusHour: 'plusMaxHour',
            plusMinute: 'plusMaxMinute',
            minusHour: 'minusMaxHour',
            minusMinute: 'minusMaxMinute',
          }}
          onChangeHoursAndMinutes={this.changeHoursAndMinutes}
          hoursInputName={'maxHoursInput'}
          minutesInputName={'maxMinutesInput'}
          hours={maximumHours.hours}
          minutes={maximumHours.minutes}
          // value={sumMax || maximumHours}
          // min={minimumHours}
          // onChange={this.editTask}
        />

        {iterator < 2 ?
          <Button
            data-id={taskId}
            className={styles.subtasks__item}
            color="danger"
            onClick={this.setParentTaskId}
          >
            Add subtask
          </Button>
          : ''}
        <Button
          data-id={taskId}
          className={styles.subtasks__item}
          color="danger"
          onClick={this.deleteTask}
        >
          Delete
        </Button>
      </FormGroup>
    );
  }
}

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
