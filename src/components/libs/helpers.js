import React from 'react';
import { FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import DateField from 'react-datepicker';
import moment from 'moment';


export const ValidationState = ({ touched, error, warning }) => (
  <div>
    {touched &&
      ((error &&
        <div>
          <span className="text-danger">{error}</span>
        </div>) ||
        (warning &&
          <div>
            <span className="text-warning">{warning}</span>
          </div>))}
  </div>
);

export const renderField = ({ className, input, label, type, meta }) => (
  <FormGroup className={className}>
    <Input
      {...input}
      className={className}
      placeholder={label}
      type={type}
    />
    <ValidationState {...meta} />
  </FormGroup>
);

export const renderOptionsField = ({ className, input: { value, ...input }, label, type, meta, name, onChange }) => {
  return (
    <div className={className}>
      <InputGroup>
        <InputGroupAddon>{label}</InputGroupAddon>
        <Input
          min="0"
          step="1"
          name={name}
          value={value}
          type="text"
          onChange={onChange}
          {...input}
        />
      </InputGroup>
      <ValidationState {...meta} />
    </div>
  )
};

export const renderDateField =
({
  input:{
    onChange,
    value = '',
  },
  fieldClassName,
  wrapperClassName,
}) => (
  <FormGroup
    className={wrapperClassName}
  >
    <DateField
      selected={value ? moment(value, 'YYYY/MM/DD') : moment()}
      onChange={onChange}
      placeholderText="Click to select a date"
      htmlFor="datePicker"
      dateFormat="YYYY/MM/DD"
      className={`react-datepicker-ignore-onclickoutside ${fieldClassName}`}
    />
  </FormGroup>
);
