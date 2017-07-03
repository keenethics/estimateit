import React, { Component } from 'react';
import { Creatable } from 'react-select';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from 'react-select/dist/react-select.css';
import { ValidationState } from '../../libs/helpers';


class MultiSelect extends Component {
  constructor(props) {
    super(props);
  }

  multiChangeHandler(validate, reduxAction) {
    return function handleMultiHandler(values) {
      console.log(values);
      // reduxAction(values);
      validate(values.map(value => value.value));
    };
  }

  render() {
    const { props } = this;
    const {
      titles,
      input: { name, value, onBlur, onChange },
      meta,
      placeholder,
      className,
      multi,
      searchable,
      handler,
      options,
      ...elements
    } = props;
    const values = value && value.length
      ? value.map(e => ({ value: e, label: e }))
      : [];

    console.log(this.props);
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
          options={options}
          multi={multi}
          {...elements}
        />
        <ValidationState {...meta} />
      </div>
    );
  }
}

export default withStyles(styles)(MultiSelect);
