import React from 'react';
import moment from 'moment';
import DateField from 'react-datepicker';
import { FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';

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

export const renderField = ({ className, input, label, type, meta, disabled }) => (
  <FormGroup className={className}>
    <Input
      {...input}
      type={type}
      disabled={disabled}
      placeholder={label}
      className={className}
    />
    <ValidationState {...meta} />
  </FormGroup>
);

export const renderPasswordField = ({ className, input, label, type, meta, disabled }) => (
  <FormGroup className={className}>
    <Input
      {...input}
      type="password"
      disabled={disabled}
      placeholder={label}
      className={className}
    />
    <ValidationState {...meta} />
  </FormGroup>
);

export const renderOptionsField = ({ className, input: { value, ...input }, label, type, meta, name, onChange, disabled }) => (
  <div style={{ width: '100%' }}>
    <InputGroup>
      <InputGroupAddon>{label}</InputGroupAddon>
      <Input
        min="0"
        step="1"
        type="text"
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        {...input}
      />
    </InputGroup>
    <ValidationState {...meta} />
  </div>
  );

export const renderDateField =
({
  input: {
    value,
    onChange,
  },
  fieldClassName,
  wrapperClassName,
  meta,
}) => (
  <FormGroup
    className={wrapperClassName}
  >
    <DateField
      htmlFor="datePicker"
      dateFormat="YYYY/MM/DD"
      placeholderText="Click to select a date"
      selected={value ? moment(value) : moment()}
      onChange={momentInstance => onChange(momentInstance && momentInstance.format())}
      className={`react-datepicker-ignore-onclickoutside ${fieldClassName}`}
      readOnly
      disabled={true}
    />
    {(meta.error &&
    <div>
      <span className="text-danger">{meta.error}</span>
    </div>)}
  </FormGroup>
);
