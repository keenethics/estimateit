import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';

import styles from './styles.scss';
import formatTime from '../libs/formatTime';
import { ValidationState } from '../libs/helpers';
import parseMinutesToString from '../libs/parseMinutesToString';


class InputAndPopover extends React.Component {
  constructor(props) {
    super(props);
    const { input: { value: minutes = 0 } } = props;
    const value = parseMinutesToString(minutes);

    this.state = {
      value,
    };

    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { input: { value = 0 } } = nextProps;
    this.setState({ value: parseMinutesToString(value) });
  }

  handleOnChange({ target: { value } }) {
    this.setState({ value });
  }

  handleOnBlur({ target: { value } }) {
    const { totalMinutes: payload } = formatTime(value);
    const {
      meta: { form },
      actionChangeTaskHours,
      input: { name: field },
    } = this.props;

    actionChangeTaskHours({ form, field, payload });
  }

  render() {
    const {
      id,
      meta,
      addon,
      input,
      disabled,
    } = this.props;
    // remove from id all characters like .,],[, because it is invalid for querySelector
    // which using inside reactstrap(popover)
    const newId = id.replace(/\.|_|\[|\]/g, '');
    const { value } = this.state;

    return (
      <div>
        <div>
          <InputGroup id={newId} className={styles.input_group}>
            <Input
              {...input}
              disabled={disabled}
              placeholder="0 h 0 m"
              value={value}
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

          </InputGroup>
        </div>
        <div>
          <ValidationState {...meta} />
        </div>
      </div>
    );
  }
}


InputAndPopover.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  addon: PropTypes.string.isRequired,
  actionChangeTaskHours: PropTypes.func.isRequired,
  meta: PropTypes.objectOf(PropTypes.string).isRequired,
  input: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default InputAndPopover;
