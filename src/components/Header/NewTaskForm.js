import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, Button } from 'reactstrap';
import shortid from 'shortid';
import styles from './styles.scss';
import InputAndPopover from './InputAndPopover';

export default class NewTaskForm extends React.Component {
  constructor(props) {
    super(props);

    this.CONSTANTS = {
      MINUTESINHOUR: 60,
      STEPOFMINUTES: 15,
      TODECIMAL: 100,
    };

    this.state = {
      taskName: '',
      minimumHours: {
        formattedValue: '',
        hours: 0,
        minutes: 0,
      },
      maximumHours: {
        formattedValue: '',
        hours: 0,
        minutes: 0,
      },
      isChecked: true,
      isPopoverOpenForMinHours: false,
      isPopoverOpenForMaxHours: false,
    };

    this.addTask = this.addTask.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.toggleForMinHours = this.toggleForMinHours.bind(this);
    this.toggleForMaxHours = this.toggleForMaxHours.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.changeHoursAndMinutes = this.changeHoursAndMinutes.bind(this);
  }

  formatTime({ target }) {
    const { name } = target;
    let formattedValue;
    let hours;
    let minutes;
    if (target.name === 'minimumHours') {
      formattedValue = this.state.minimumHours.formattedValue;
    } else {
      formattedValue = this.state.maximumHours.formattedValue;
    }
    if (!formattedValue) {
      return;
    }

    if (formattedValue && formattedValue.match(/\d+/) && !formattedValue.match(/[a-zA-z]/)) {
      if (formattedValue.match(/\d+.\d+/)) {
        const indexOfHours = 0;
        const indexOfMinutes = 1;
        const minutesAndHours = formattedValue.split('.');
        hours = parseInt(minutesAndHours[indexOfHours]);
        minutes = parseInt(minutesAndHours[indexOfMinutes]);
        if (minutesAndHours[indexOfMinutes] && (minutesAndHours[indexOfMinutes]).length === 1) {
          minutes *= 10;
        }
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }

        const formattedHours = hours ? `${hours} h ` : '';
        const formattedMinutes = minutes ? `${minutes} m` : '';
        formattedValue = `${formattedHours}${formattedMinutes}`;
        this.setState(() => ({
          [name]: {
            formattedValue,
            hours,
            minutes,
          },
        }));
        return;
      }
      hours = parseInt((formattedValue.match(/\d+/))[0]);
      formattedValue = hours ? `${hours} h` : '';

      this.setState(() => ({
        [name]: {
          formattedValue,
          hours,
          minutes: 0,
        },
      }));
      return;
    }

    hours = formattedValue.match(/\d+(\s+)?h/);
    minutes = formattedValue.match(/\d+(\s+)?m/);
    hours = hours && hours[0] ? parseInt(hours[0]) : 0;
    minutes = minutes && minutes[0] ? parseInt(minutes[0]) : 0;
    if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
      hours += (Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR));
      minutes %= this.CONSTANTS.MINUTESINHOUR;
    }

    const formattedHours = hours ? `${hours} h ` : '';
    formattedValue = minutes ? `${formattedHours}${minutes} m` : `${formattedHours}`;
    this.setState(() => ({
      [name]: {
        formattedValue,
        hours,
        minutes,
      },
    }));
  }

  changeHoursAndMinutes ({ target }) {
    let { name } = target;
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
    let { formattedValue, hours, minutes } = value;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    switch (target.id) {
      case 'plusHour': {
        const formattedMinutes = minutes ? `${minutes} m` : '';
        formattedValue = `${++hours} h ${formattedMinutes}`;
        this.setState(() => ({
          [name]: {
            formattedValue,
            hours,
            minutes,
          },
        }));
        break;
      }
      case 'plusMinute': {
        minutes += this.CONSTANTS.STEPOFMINUTES;
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
          const formattedHours = hours ? `${hours} h ` : '';
          const formattedMinutes = minutes ? `${minutes} m` : '';
          formattedValue = `${formattedHours}${formattedMinutes}`;
          this.setState(() => ({
            [name]: {
              formattedValue,
              hours,
              minutes,
            },
          }));
          return;
        }
        const formattedHours = hours ? `${hours} h ` : '';
        this.setState(() => ({
          [name]: {
            formattedValue: `${formattedHours}${minutes} m`,
            hours,
            minutes,
          },
        }));
        break;
      }
      case 'minusHour': {
        if (hours === 0) {
          return;
        }
        const formattedHours = --hours ? `${hours} h ` : '';
        const formattedMinutes = minutes ? `${minutes} m` : '';
        formattedValue = `${formattedHours}${formattedMinutes}`;
        this.setState(() => ({
          [name]: {
            formattedValue,
            hours,
            minutes,
          },
        }));
        break;
      }
      case 'minusMinute': {
        if (minutes <= 14) {
          if (hours === 0) {
            minutes = 0;
            formattedValue = '';
            this.setState(() => ({
              [name]: {
                formattedValue,
                hours,
                minutes,
              },
            }));
            return;
          }
          const formattedHours = --hours ? `${hours} h ` : '';
          minutes = this.CONSTANTS.MINUTESINHOUR - (this.CONSTANTS.STEPOFMINUTES - minutes);
          formattedValue = `${formattedHours}${minutes} m`;
          this.setState(() => ({
            [name]: {
              formattedValue,
              hours,
              minutes,
            },
          }));
          return;
        }
        minutes -= this.CONSTANTS.STEPOFMINUTES;
        const formattedMinutes = minutes ? `${minutes} m` : '';
        const formattedHours = hours ? `${hours} h ` : '';
        this.setState(() => ({
          [name]: {
            formattedValue: `${formattedHours}${formattedMinutes}`,
            hours,
            minutes,
          },
        }));
        break;
      }
      case 'changeHours': {
        hours = parseInt(target.value) || 0;
        const formattedHours = hours ? `${hours} h ` : '';
        const formattedMinutes = minutes ? `${minutes} m` : '';
        this.setState(() => ({
          [name]: {
            formattedValue: `${formattedHours}${formattedMinutes}`,
            hours,
            minutes,
          },
        }));
        break;
      }
      case 'changeMinutes': {
        minutes = parseInt(target.value) || 0;
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }
        const formattedHours = hours ? `${hours} h ` : '';
        const formattedMinutes = minutes ? `${minutes} m` : '';
        this.setState(() => ({
          [name]: {
            formattedValue: `${formattedHours}${formattedMinutes}`,
            hours,
            minutes,
          },
        }));
      }
    }
  }

  addTask(event) {
    event.preventDefault();
    const { taskName, minimumHours, maximumHours, isChecked } = this.state;
    const target = event.target;
    const parentTaskId = target.dataset.parentid;

    const newTask = {
      id: shortid.generate(),
      taskName,
      minimumHours: (parseInt(minimumHours.hours) + (parseInt(minimumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0,
      maximumHours: (parseInt(maximumHours.hours) + (parseInt(maximumHours.minutes) / this.CONSTANTS.TODECIMAL)) || 0,
      isChecked,
      parentTaskId,
    };

    if (!parentTaskId) {
      this.props.addNewTask(newTask);
      this.props.removeParentTaskId();
    } else {
      this.props.addNewSubTask(parentTaskId, newTask);
      this.props.removeParentTaskId();
    }

    this.setState({
      taskName: '',
      minimumHours: {
        formattedValue: '',
        hours: 0,
        minutes: 0,
      },
      maximumHours: {
        formattedValue: '',
        hours: 0,
        minutes: 0,
      },
      isChecked: true,
      parentTaskId: undefined,
      isPopoverOpenForMinHours: false,
      isPopoverOpenForMaxHours: false,
    });
    this.taskNameInput.focus();
    this.props.saveTaskIntoState(parentTaskId, newTask);
  }

  handleInputChange({ target }) {
    const { name } = target;
    let value;
    if (name === 'minimumHours' || name === 'maximumHours') {
      value = {
        formattedValue: target.value,
        hours: 0,
        minutes: 0,
      };
    } else {
      value = target.type === 'checkbox' ? target.checked : target.value;
    }

    this.setState(() => ({
      [name]: value,
      parentTaskId: target.dataset.parentid,
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

  render() {
    const { taskName, minimumHours, maximumHours, isChecked, isPopoverOpenForMinHours, isPopoverOpenForMaxHours } = this.state;
    const { parentTaskId, isSubtask } = this.props;
    return (
      <FormGroup
        id="screenShot"
        data-parentId={parentTaskId}
        className={styles.tasks__group}
      >
        <Input
          data-parentId={parentTaskId}
          className={styles.tasks__group_item}
          type="checkbox"
          name="isChecked"
          checked={isChecked}
          onChange={this.handleInputChange}
        />
        <Input
          data-parentId={parentTaskId}
          className={styles.tasks__group_item}
          type="text"
          placeholder={isSubtask ? 'Subtask' : 'Task'}
          name="taskName"
          getRef={input => (this.taskNameInput = input)}
          value={taskName}
          onChange={this.handleInputChange}
        />

        <InputAndPopover
          id={'popoverForMinHours'}
          parentTaskId={parentTaskId}
          placeholder={'0 h 0 m'}
          addon={'min'}
          inputName={'minimumHours'}
          formattedValue={minimumHours.formattedValue}
          onInputChange={this.handleInputChange}
          onInputBlur={this.formatTime}
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
        />
        <InputAndPopover
          id={'popoverForMaxHours'}
          parentTaskId={parentTaskId}
          placeholder={'0 h 0 m'}
          addon={'max'}
          inputName={'maximumHours'}
          formattedValue={maximumHours.formattedValue}
          onInputChange={this.handleInputChange}
          onInputBlur={this.formatTime}
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
        />

        <Button
          className={styles.tasks__group_item}
          color="danger"
          data-parentId={parentTaskId}
          onClick={this.addTask}
        >
          {isSubtask ? 'Add subtask' : 'Add task'}
        </Button>
      </FormGroup>
    );
  }
}

NewTaskForm.defaultProps = {
  parentTaskId: undefined,
  isSubtask: false,
};

NewTaskForm.propTypes = {
  parentTaskId: PropTypes.string,
  isSubtask: PropTypes.bool,
  addNewTask: PropTypes.func.isRequired,
  removeParentTaskId: PropTypes.func.isRequired,
  addNewSubTask: PropTypes.func.isRequired,
  saveTaskIntoState: PropTypes.func.isRequired,
};
