import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import styles from './styles.scss';

const Slider = ({
  id,
  name,
  title,
  value,
  totalHours,
  handleChange,
}) => {
  const hours = Math.round(totalHours * value / 100);

  return (
    <InputGroup className={styles.range__item}>
      <InputGroupAddon>{title}</InputGroupAddon>
      <Input
        id={id}
        min="0"
        step="1"
        max="100"
        name={name}
        type="range"
        value={value}
        onChange={handleChange}
        className="radarChartPart"
      />
      <InputGroupAddon>
        {value}%, {hours} h
      </InputGroupAddon>
    </InputGroup>
  );
};

Slider.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  totalHours: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Slider;
