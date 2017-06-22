import React, { Component } from 'react';
import Select, { Creatable } from 'react-select';
import { ValidationState } from '../../libs/helpers';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from 'react-select/dist/react-select.css';

class MultiSelect extends Component {
  singleChangeHandler(func) {
    return function handleSingleChange(value) {
      func(value ? value.value : '');
    };
  }

  multiChangeHandler(func) {
    return function handleMultiHandler(values) {
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
      ...elements
    } = props;
    const itemsList = titles.map(element => ({
      value: element,
      label: element,
    }));
    return (
      <div>
        {!this.props.creatable
          ? <Select
            onChange={
                multi
                  ? this.multiChangeHandler(onChange)
                  : this.singleChangeHandler(onChange)
              }
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
          : <Creatable
            onChange={
                multi
                  ? this.multiChangeHandler(onChange)
                  : this.singleChangeHandler(onChange)
              }
            onBlur={() => onBlur(value)}
            name={name}
            className={className}
            placeholder={placeholder}
            searchable={searchable}
            value={values}
            options={itemsList}
            multi={multi}
            {...elements}
          />}
        <ValidationState {...meta} />
      </div>
    );
  }
}

export default withStyles(styles)(MultiSelect);
