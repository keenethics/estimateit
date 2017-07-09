import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { InputGroup, Input, InputGroupAddon, Popover, PopoverContent, Table, Button } from 'reactstrap';

import styles from './styles.scss';

class InputAndPopover extends React.Component {
  constructor(props) {
    super(props);

    const value = this.formatTime(props.input.value);

    this.state = {
      value,
      isPopoverOpen: false,
    };

    this.CONSTANTS = {
      MINUTESINHOUR: 60,
      STEPOFMINUTES: 15,
      TODECIMAL: 100,
    };

    this.toggle = this.toggle.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.changeHoursAndMinutes = this.changeHoursAndMinutes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const value = this.formatTime(nextProps.input.value);
    this.setState({ value });
  }

  toggle() {
    const isPopoverOpen = !this.state.isPopoverOpen;
    this.setState({ isPopoverOpen });
  }

  handleOnChange({ target: { value } }) {
    // const { input: { onChange } } = this.props;
    // onChange(value);
    this.setState({ value });
  }

  formatTime(digit) {
    let hours;
    let minutes;
    let formattedValue;
    let tempDigit = digit;
    console.log('formattedValue');
    if (typeof digit === 'number') {
      console.log('number');
      tempDigit = digit.toString();
    }
    console.log('tempDigit = ', tempDigit);

    if (tempDigit && tempDigit.match(/\d+/) && !tempDigit.match(/[a-zA-z]/)) {
      console.log('only numbers');
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
        console.log({
          formattedValue,
          hours,
          minutes,
        });
        return {
          formattedValue,
          hours,
          minutes,
        };
      }
      hours = parseInt(tempDigit.match(/\d+/) && (tempDigit.match(/\d+/))[0]);
      formattedValue = hours ? `${hours} h` : '';
      console.log({
        formattedValue,
        hours,
        minutes,
      });
      return {
        formattedValue,
        hours,
        minutes: 0,
      };
    }

    hours = tempDigit.match(/\d+(\s+)?h/);
    minutes = tempDigit.match(/\d+(\s+)?m/);
    console.log('tempDigit2 =', tempDigit);
    console.log('1.minutes = ', minutes);
    hours = hours && hours[0] ? parseInt(hours[0]) : 0;
    minutes = minutes && minutes[0] ? parseInt(minutes[0]) : 0;

    console.log('2.minutes = ', minutes);

    if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
      hours += (Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR));
      minutes %= this.CONSTANTS.MINUTESINHOUR;
    }
    console.log('another');

    const formattedHours = hours ? `${hours} h ` : '';
    formattedValue = minutes ? `${formattedHours}${minutes} m` : `${formattedHours}`;

    console.log({
      formattedValue,
      hours,
      minutes,
    });

    return {
      formattedValue,
      hours,
      minutes,
    };
  }

  changeHoursAndMinutes({ target }) {
    console.log(target);
    // let { name } = target;
    // const { id } = target.dataset;
    // let value;
    // const minInputsNames = ['plusMinHour', 'plusMinMinute', 'minusMinHour', 'minusMinMinute', 'minHoursInput', 'minMinutesInput'];
    // const maxInputsNames = ['plusMaxHour', 'plusMaxMinute', 'minusMaxHour', 'minusMaxMinute', 'maxHoursInput', 'maxMinutesInput'];
    // if (minInputsNames.includes(name)) {
    //   name = 'minimumHours';
    //   value = this.state.minimumHours;
    // }
    // if (maxInputsNames.includes(name)) {
    //   name = 'maximumHours';
    //   value = this.state.maximumHours;
    // }
    // let { hours, minutes } = value;
    // hours = parseInt(hours);
    // minutes = parseInt(minutes);
    //
    // switch (target.id) {
    //   case 'plusHour': {
    //     value = ++hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //     this.props.findTaskAndModify(id, name, value);
    //     break;
    //   }
    //   case 'plusMinute': {
    //     minutes += this.CONSTANTS.STEPOFMINUTES;
    //     if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
    //       hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
    //       minutes %= this.CONSTANTS.MINUTESINHOUR;
    //     }
    //     value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //     this.props.findTaskAndModify(id, name, value);
    //     break;
    //   }
    //   case 'minusHour': {
    //     if (hours === 0) {
    //       return;
    //     }
    //     value = --hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //     this.props.findTaskAndModify(id, name, value);
    //     break;
    //   }
    //   case 'minusMinute': {
    //     if (minutes <= 14) {
    //       if (hours === 0) {
    //         minutes = 0;
    //         value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //       } else {
    //         minutes = this.CONSTANTS.MINUTESINHOUR - (this.CONSTANTS.STEPOFMINUTES - minutes);
    //         hours--;
    //       }
    //       value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //       this.props.findTaskAndModify(id, name, value);
    //       return;
    //     }
    //     minutes -= this.CONSTANTS.STEPOFMINUTES;
    //     value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //     this.props.findTaskAndModify(id, name, value);
    //     break;
    //   }
    //   case 'changeHours': {
    //     hours = parseInt(target.value) || 0;
    //     value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //     this.props.findTaskAndModify(id, name, value);
    //     break;
    //   }
    //   case 'changeMinutes': {
    //     minutes = parseInt(target.value) || 0;
    //     if (minutes >= this.CONSTANTS.MINUTESINHOUR) {
    //       hours += Math.floor(minutes / this.CONSTANTS.MINUTESINHOUR);
    //       minutes %= this.CONSTANTS.MINUTESINHOUR;
    //     }
    //     value = hours + (minutes / this.CONSTANTS.TODECIMAL) || 0;
    //     this.props.findTaskAndModify(id, name, value);
    //   }
    // }
  }

  handleOnBlur({ target: { value } }) {
    const {
      meta: {
        form,
        dispatch,
      },
      input: {
        onBlur,
        name: field,
      },
    } = this.props;
    console.log('onblur');
    console.log('value');
    console.log(value);

    const string = this.formatTime(value);
    console.log('string');
    console.log(string);
    const payload =
      (parseInt(string.hours) + (parseInt(string.minutes) / this.CONSTANTS.TODECIMAL)) || 0;
      console.log('payload');
    console.log(payload);
    dispatch({
      type: '@@redux-form/CHANGE',
      meta: {
        form,
        field,
        touch: false,
        persistentSubmitErrors: false,
      },
      payload,
    });
  }

  render() {

    const {
      id,
      name,
    //   taskId,
    //   parentTaskId,
    //   placeholder,
      addon,
      input: {
        value
      },
    //   inputName,
    //   formattedValue,
    //   onInputChange,
    //   onInputBlur,
    //   onToggle,
    //   isOpen,
      buttonsNames,
    //   onChangeHoursAndMinutes,
      hoursInputName,
      minutesInputName,
    //   hours,
    //   minutes,
    } = this.props;
    // remove from id all characters like .,],[, because it is invalid for querySelector
    // which using inside reactstrap(popover)
    const newId = id.replace(/\.|_|\[|\]/g, '');
    const { isPopoverOpen } = this.state;
    const { value: { formattedValue } } = this.state;
    console.log(formattedValue);

    // console.log(this.formatDigitToString(value));

    console.log(this);
    return (
      <InputGroup id={newId} className={styles.input_group}>
        <Input
          value={formattedValue}
          placeholder="0 h 0 m"
          name={name}
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

      <Popover placement="top" isOpen={isPopoverOpen} target={newId} toggle={this.toggle}>
        <PopoverContent>
          <Table>
            <tbody className={styles.popover_table}>
              <tr>
                <td>
                  <Button
                    className={styles.input_group_plus}
                    id="plusHour"
                    name={buttonsNames.plusHour}
                    onClick={this.onChangeHoursAndMinutes}
                  >
                  +
                  </Button>
                  </td>
                <td>&nbsp;</td>
                <td>
                  <Button
                    className={styles.input_group_plus}
                    id="plusMinute"
                    name={buttonsNames.plusMinute}
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
                    id="changeHours"
                    name={hoursInputName}
                    onClick={this.onChangeHoursAndMinutes}
                    type="text"
                    maxLength="2"

                  />
                </td>
                <td className={styles.input_group_time_value}>h</td>
                <td className={styles.input_group_middle_input}>
                  <Input
                    id="changeMinutes"
                    name={minutesInputName}
                    onClick={this.onChangeHoursAndMinutes}
                    type="text"
                    maxLength="2"

                  />
                </td>
                <td className={styles.input_group_time_value}>m</td>
              </tr>
              <tr>
                <td>
                  <Button
                    className={styles.input_group_minus}
                    id="minusHour"
                    name={buttonsNames.minusHour}
                    onClick={this.onChangeHoursAndMinutes}
                  >
                    -
                  </Button>
                </td>
                <td>&nbsp;</td>
                <td>
                  <Button
                    className={styles.input_group_minus}
                    id="minusMinute"
                    name={buttonsNames.minusMinute}
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
  id: PropTypes.string.isRequired,
  taskId: PropTypes.string,
  parentTaskId: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  addon: PropTypes.string.isRequired,
  inputName: PropTypes.string.isRequired,
  formattedValue: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onInputBlur: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  buttonsNames: PropTypes.objectOf(PropTypes.string).isRequired,
  onChangeHoursAndMinutes: PropTypes.func,
  hoursInputName: PropTypes.string.isRequired,
  minutesInputName: PropTypes.string.isRequired,
  hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default InputAndPopover;
