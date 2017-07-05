import React from 'react';
import { DateField } from 'react-date-picker';
import { FormGroup, Input } from 'reactstrap';

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

export const renderDateField =
({
  fieldClassName,
  wrapperClassName,
  input:{
    value = '',
    onChange,
  },
}) => (
  <FormGroup
    className={wrapperClassName}
  >
    <DateField
      value={value}
      onChange={onChange}
      placeholder="Date:"
      htmlFor="datePicker"
      dateFormat="YYYY-MM-DD"
      className={fieldClassName}
    />
  </FormGroup>
);
