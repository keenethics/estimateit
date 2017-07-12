import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import styles from './styles.scss';

const Slider = ({
  title,
  totalHours,
  input: {
    value,
    onChange,
  },
  meta: {
    form,
  },
  calculateTotalHours,
}) => {
  const hours = Math.round(totalHours * value / 100);
  const handleChange = ({ target }) => {
    onChange(parseInt(target.value, 10));
    calculateTotalHours(form);
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
        className="radarChartPart"
        onChange={e => handleChange(e)}
      />
      <InputGroupAddon>
        {value}%, {hours} h
      </InputGroupAddon>
    </InputGroup>
  );
};

Slider.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  totalHours: PropTypes.number.isRequired,
  calculateTotalHours: PropTypes.func.isRequired,
};

export default Slider;
