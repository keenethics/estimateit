import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import styles from './styles.scss';

const Slider = ({
  title,
  disabled,
  totalHours,
  probabilityTime,
  input: {
    value,
    onChange,
  },
  meta: {
    form,
  },
  handleChange,
}) => {
  const hours = probabilityTime || Math.round(totalHours * (value / 100));
  const onHandleChange = ({ target }) => {
    onChange(parseInt(target.value, 10));
    handleChange(form);
  };

  return (
    <InputGroup className={styles.range__item}>
      <InputGroupAddon>{title}</InputGroupAddon>
      <Input
        min="0"
        step="1"
        max="100"
        type="range"
        value={value}
        disabled={disabled}
        className="radarChartPart"
        onChange={e => onHandleChange(e)}
      />
      <InputGroupAddon>
        {value}%, {hours} h
      </InputGroupAddon>
    </InputGroup>
  );
};

Slider.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  totalHours: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  probabilityTime: PropTypes.number.isRequired,
};

export default Slider;
