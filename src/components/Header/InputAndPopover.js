import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Button,
  Input,
  Popover,
  InputGroup,
  PopoverContent,
  InputGroupAddon,
} from 'reactstrap';

import styles from './styles.scss';
import { ValidationState } from '../libs/helpers';

class InputAndPopover extends React.Component {
  constructor(props) {
    super(props);
    this.CONSTANTS = {
      TODECIMAL: 100,
      STEPOFMINUTES: 15,
      MINUTESINHOUR: 60,
    };

    const value = this.formatTime(props.input.value);

    this.state = {
      value,
      isPopoverOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.dispatchonChange = this.dispatchonChange.bind(this);
    this.onChangeHoursAndMinutes = this.onChangeHoursAndMinutes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const value = this.formatTime(nextProps.input.value);
    this.setState({ value });
  }

  formatTime(digit) {
    let hours;
    let minutes;
    let formattedValue;
    let tempDigit = digit;

    if (typeof digit === 'number') {
      tempDigit = digit.toString();
    }

    // TempDigit does not include any letters
    if (tempDigit && tempDigit.match(/\d+/) && !tempDigit.match(/[a-zA-z]/)) {
      if (tempDigit.match(/\d+.\d+/)) {
        const indexOfHours = 0;
        const indexOfMinutes = 1;
        const minutesAndHours = tempDigit.split('.');
        if (minutesAndHours[indexOfMinutes].length > 2) {
          minutesAndHours[indexOfMinutes] = minutesAndHours[indexOfMinutes].slice(0, 2);
        }
        hours = parseInt(minutesAndHours[indexOfHours], 10);
        minutes = parseInt(minutesAndHours[indexOfMinutes], 10);

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
      hours = parseInt(tempDigit.match(/\d+/) && (tempDigit.match(/\d+/))[0], 10);
      formattedValue = hours ? `${hours} h` : '';

      return {
        formattedValue,
        hours,
        minutes: 0,
      };
    }

    // TempDigit include letters
    hours = tempDigit.match(/\d+(\s+)?h/);
    minutes = tempDigit.match(/\d+(\s+)?m/);
    hours = hours && hours[0] ? parseInt(hours[0], 10) : 0;
    minutes = minutes && minutes[0] ? parseInt(minutes[0], 10) : 0;

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

  onChangeHoursAndMinutes({ target }) {
    let payload = this.state.value;
    let { hours, minutes } = payload;

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    switch (target.id) {
      case 'plusHour': {
        payload = ++hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.dispatchonChange(payload);
        break;
      }
      case 'plusMinute': {
        minutes += this.CONSTANTS.STEPOFMINUTES;
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }
        payload = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.dispatchonChange(payload);
        break;
      }
      case 'minusHour': {
        if (hours === 0) {
          return;
        }
        payload = --hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.dispatchonChange(payload);
        break;
      }
      case 'minusMinute': {
        if (minutes <= 14) {
          if (hours === 0) {
            minutes = 0;
            payload = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
          } else {
            minutes = this.CONSTANTS.MINUTESINHOUR - (this.CONSTANTS.STEPOFMINUTES - minutes);
            hours--;
          }
          payload = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
          this.dispatchonChange(payload);
          return;
        }
        minutes -= this.CONSTANTS.STEPOFMINUTES;
        payload = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.dispatchonChange(payload);
        break;
      }
      case 'changeHours': {
        hours = parseInt(target.value, 10) || 0;
        payload = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.dispatchonChange(payload);
        break;
      }
      case 'changeMinutes': {
        minutes = parseInt(target.value, 10) || 0;
        if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
          hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
          minutes %= this.CONSTANTS.MINUTESINHOUR;
        }
        payload = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
        this.dispatchonChange(payload);
        break;
      }
      default: {
        break;
      }
    }
  }

  toggle() {
    const isPopoverOpen = !this.state.isPopoverOpen;
    this.setState({ isPopoverOpen });
  }

  handleOnChange(event) {
    const { target: { value } } = event;
    this.setState({ value });
  }

  handleOnBlur({ target: { value } }) {
    const string = this.formatTime(value);
    const payload =
      (parseInt(string.hours, 10) + (parseInt(string.minutes, 10) / this.CONSTANTS.TODECIMAL)) || 0;

    this.setState({ value: this.formatTime(payload) });
    this.dispatchonChange(payload);
  }


  dispatchonChange(payload) {
    const {
      meta: { form },
      dispatchChange,
      input: { name: field },
    } = this.props;

    dispatchChange({ form, field, payload: parseFloat(payload, 10) });
  }

  render() {
    const {
      id,
      meta,
      addon,
      input,
      disabled,
      buttonsNames,
      hoursInputName,
      minutesInputName,
    } = this.props;

    // remove from id all characters like .,],[, because it is invalid for querySelector
    // which using inside reactstrap(popover)
    const newId = id.replace(/\.|_|\[|\]/g, '');
    let { isPopoverOpen } = this.state;
    const { value: { hours, minutes, formattedValue } } = this.state;
    isPopoverOpen = !disabled && isPopoverOpen;

    return (
      <InputGroup id={newId} className={styles.input_group}>
        <Input
          {...input}
          disabled={disabled}
          placeholder="0 h 0 m"
          value={formattedValue}
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
        />
        <InputGroupAddon
          className={styles.input_group_addon}
        >
          {addon}
        </InputGroupAddon>
        <InputGroupAddon
          onClick={this.toggle}
          id="isPopoverOpenForMinHours"
          className={styles.input_group_time}
        >
          &#9719;
        </InputGroupAddon>
        <ValidationState {...meta} />
        <Popover placement="top" isOpen={isPopoverOpen} target={newId} toggle={this.toggle}>
          <PopoverContent>
            <Table>
              <tbody className={styles.popover_table}>
                <tr>
                  <td>
                    <Button
                      id="plusHour"
                      name={buttonsNames.plusHour}
                      className={styles.input_group_plus}
                      onClick={this.onChangeHoursAndMinutes}
                    >
                      +
                    </Button>
                  </td>
                  <td>&nbsp;</td>
                  <td>
                    <Button
                      id="plusMinute"
                      name={buttonsNames.plusMinute}
                      className={styles.input_group_plus}
                      onClick={this.onChangeHoursAndMinutes}
                    >
                      +
                    </Button>
                  </td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td className={styles.input_group_middle_input}>
                    <Input
                      type="text"
                      maxLength="2"
                      value={hours}
                      id="changeHours"
                      name={hoursInputName}
                      onClick={this.onChangeHoursAndMinutes}
                    />
                  </td>
                  <td className={styles.input_group_time_value}>h</td>
                  <td className={styles.input_group_middle_input}>
                    <Input
                      type="text"
                      maxLength="2"
                      value={minutes}
                      id="changeMinutes"
                      name={minutesInputName}
                      onClick={this.onChangeHoursAndMinutes}
                    />
                  </td>
                  <td className={styles.input_group_time_value}>m</td>
                </tr>
                <tr>
                  <td>
                    <Button
                      id="minusHour"
                      name={buttonsNames.minusHour}
                      className={styles.input_group_minus}
                      onClick={this.onChangeHoursAndMinutes}
                    >
                      -
                    </Button>
                  </td>
                  <td>&nbsp;</td>
                  <td>
                    <Button
                      id="minusMinute"
                      name={buttonsNames.minusMinute}
                      className={styles.input_group_minus}
                      onClick={this.onChangeHoursAndMinutes}
                    >
                      -
                    </Button>
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </Table>
          </PopoverContent>
        </Popover>
      </InputGroup>
    );
  }
}


InputAndPopover.defaultProps = {
  parentTaskId: undefined,
  taskId: undefined,
};

InputAndPopover.propTypes = {
  dispatchChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  addon: PropTypes.string.isRequired,
  buttonsNames: PropTypes.objectOf(PropTypes.string).isRequired,
  hoursInputName: PropTypes.string.isRequired,
  minutesInputName: PropTypes.string.isRequired,
};

export default InputAndPopover;
