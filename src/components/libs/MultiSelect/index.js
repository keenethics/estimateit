import React, { Component } from 'react';
import { Creatable } from 'react-select';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from 'react-select/dist/react-select.css';
import { ValidationState } from '../../libs/helpers';


class MultiSelect extends Component {
  constructor(props) {
    super(props);
  }
  multiChangeHandler(func, handler) {
    return function handleMultiHandler(values) {
      handler(values);
      func(values.map(value => value.value));
    };
  }

  render() {
    const { props } = this;
    const {
      titles,
      input: { name, value, onBlur, onChange },
      values,
      meta,
      placeholder,
      className,
      multi,
      searchable,
      handler,
      ...elements
    } = props;
    const itemsList = titles.map(element => ({
      value: element,
      label: element,
    }));

    return (
      <div>
        <Creatable
          onChange={this.multiChangeHandler(onChange, handler)}
          onBlur={() => onBlur(value)}
          name={name}
          className={className}
          placeholder={placeholder}
          searchable={searchable}
          value={values}
          options={itemsList}
          multi={multi}
          {...elements}
        />
        <ValidationState {...meta} />
      </div>
    );
  }
}

export default withStyles(styles)(MultiSelect);
