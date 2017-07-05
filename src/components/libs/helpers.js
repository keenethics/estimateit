import React from 'react';
import DateField from 'react-datepicker';
import moment from 'moment';
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



  // <DateField
  //   selected={data ? moment(data, 'YYYY/MM/DD') : moment()}
  //   placeholderText="Click to select a date"
  //   htmlFor="datePicker"
  //   dateFormat="YYYY/MM/DD"
  //   className="react-datepicker-ignore-onclickoutside"
  //
  //   onChange={e => this.onDateChange(e)}
  //   ref={(dateField) => {
  //     this.datefield = dateField;
  //   }}
  // />
