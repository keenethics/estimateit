import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Input, InputGroupAddon, Popover, PopoverContent, Table, Button } from 'reactstrap';
// import styles from './styles.scss';

export default class InputAndPopover extends React.Component {
  render() {
    // const {
    //   id,
    //   taskId,
    //   parentTaskId,
    //   placeholder,
    //   addon,
    //   inputName,
    //   formattedValue,
    //   onInputChange,
    //   onInputBlur,
    //   onToggle,
    //   isOpen,
    //   buttonsNames,
    //   onChangeHoursAndMinutes,
    //   hoursInputName,
    //   minutesInputName,
    //   hours,
    //   minutes,
    // } = this.props;

    return (
      <InputGroup id={id} className={styles.input_group}>
        <Input
          data-id={taskId}
          data-parentId={parentTaskId}
          placeholder="0 h 0 m"
          name={inputName}
          value={formattedValue}
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
      </InputGroup>
    );
  }
}

// <InputGroupAddon className={styles.input_group_addon}>{addon}</InputGroupAddon>
// <InputGroupAddon className={styles.input_group_time} onClick={onToggle}>&#9719;</InputGroupAddon>
// <Popover placement="top" isOpen={isOpen} target={id} toggle={onToggle}>
//   <PopoverContent>
//     <Table>
//       <tbody className={styles.popover_table}>
//         <tr>
//           <td><Button data-id={taskId} className={styles.input_group_plus} id="plusHour" name={buttonsNames.plusHour} onClick={onChangeHoursAndMinutes}>+</Button></td>
//           <td>&nbsp;</td>
//           <td><Button data-id={taskId} className={styles.input_group_plus} id="plusMinute" name={buttonsNames.plusMinute} onClick={onChangeHoursAndMinutes}>+</Button></td>
//           <td>&nbsp;</td>
//         </tr>
//         <tr>
//           <td className={styles.input_group_middle_input}>
//             <Input data-id={taskId} id="changeHours" name={hoursInputName} onChange={onChangeHoursAndMinutes} type="text" maxLength="2" value={hours || ''} />
//           </td>
//           <td className={styles.input_group_time_value}>h</td>
//           <td className={styles.input_group_middle_input}>
//             <Input data-id={taskId} id="changeMinutes" name={minutesInputName} onChange={onChangeHoursAndMinutes} type="text" maxLength="2" value={minutes || ''} />
//           </td>
//           <td className={styles.input_group_time_value}>m</td>
//         </tr>
//         <tr>
//           <td><Button data-id={taskId} className={styles.input_group_minus} id="minusHour" name={buttonsNames.minusHour} onClick={onChangeHoursAndMinutes}>-</Button></td>
//           <td>&nbsp;</td>
//           <td><Button data-id={taskId} className={styles.input_group_minus} id="minusMinute" name={buttonsNames.minusMinute} onClick={onChangeHoursAndMinutes}>-</Button></td>
//           <td>&nbsp;</td>
//         </tr>
//       </tbody>
//     </Table>
//   </PopoverContent>
// </Popover>









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
