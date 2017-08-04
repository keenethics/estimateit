import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Input, InputGroup, InputGroupAddon } from 'reactstrap';

import styles from './styles.scss';
import parseMinutesToString from '../libs/parseMinutesToString';

const Slider = ({
  title,
  disabled,
  time,
  input: {
    value,
    onChange,
  },
  meta: {
    form,
  },
  shortName,
  handleChange,
}) => {
  const onHandleChange = ({ target }) => {
    onChange(parseInt(target.value, 10));
    handleChange({ field: shortName, form });
  };

  const hours = parseMinutesToString(time) || '0h';
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
        {value}%, {hours}
      </InputGroupAddon>
    </InputGroup>
  );
};

Slider.propTypes = {
  time: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  shortName: PropTypes.string.isRequired,
  totalHours: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  probabilityTime: PropTypes.number.isRequired,
  actionChangeAdditionalTime: PropTypes.func.isRequired,
  meta: PropTypes.objectOf(PropTypes.string).isRequired,
  input: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(Slider);
