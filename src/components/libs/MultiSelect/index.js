import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Creatable } from 'react-select';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from 'react-select/dist/react-select.css';
import ValidationState from '../ValidationState';
import * as s from './styles.scss';

class MultiSelect extends Component {
  constructor(props) {
    super(props);

    this.multiChangeHandler = this.multiChangeHandler.bind(this);
  }

  multiChangeHandler(values) {
    const { input: { onChange } } = this.props;
    onChange(values.map(value => value.value));
  }

  render() {
    const {
      meta,
      multi,
      options,
      className,
      searchable,
      placeholder,
      input: { name, value, onBlur },
      ...elements
    } = this.props;

    const values = value && value.length
      ? value.map(e => ({ value: e, label: e }))
      : [];

    return (
      <div
        name={name}
      >
        <Creatable
          name={name}
          multi={multi}
          value={values}
          autosize={false}
          options={options}
          className={className}
          searchable={searchable}
          placeholder={placeholder}
          onBlur={() => onBlur(value)}
          onChange={this.multiChangeHandler}
          {...elements}
        />
        <ValidationState {...meta} />
      </div>
    );
  }
}

MultiSelect.propTypes = {
  multi: PropTypes.bool.isRequired,
  searchable: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any).isRequired,
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};


export default withStyles(styles, s)(MultiSelect);
