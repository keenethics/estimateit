import React, { Component } from 'react';
import { Creatable } from 'react-select';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from 'react-select/dist/react-select.css';
import { ValidationState } from '../../libs/helpers';
import s from './styles.scss';

class MultiSelect extends Component {
  constructor(props) {
    super(props);
  }

  multiChangeHandler(handleChange) {
    return function handleMultiHandler(values) {
      handleChange(values.map(value => value.value));
    };
  }

  render() {
    const {
      meta,
      multi,
      titles,
      handler,
      options,
      className,
      searchable,
      placeholder,
      input: { name, value, onBlur, onChange },
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
          onChange={this.multiChangeHandler(onChange)}
          {...elements}
        />
        <ValidationState {...meta} />
      </div>
    );
  }
}

export default withStyles(styles, s)(MultiSelect);
