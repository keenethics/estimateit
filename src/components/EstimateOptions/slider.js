import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import styles from './styles.scss';

const Slider = ({
  id,
  name,
  title,
  totalHours,
  input: {
    onChange,
    value
  },
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
        className="radarChartPart"
        onChange={({ target }) => onChange(parseInt(target.value, 10))}
      />
      <InputGroupAddon>
        {value}%, {hours} h
      </InputGroupAddon>
    </InputGroup>
  );
};

Slider.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  totalHours: PropTypes.number.isRequired,
};

export default Slider;
