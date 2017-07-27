import React from 'react';
import moment from 'moment';
import Select from 'react-select';
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

export const renderOptionsField = ({ className, input: { value, ...input }, label, type, meta, name, onChange }) => (
  <div style={{ width: '100%' }}>
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
    />
    {(meta.error &&
    <div>
      <span className="text-danger">{meta.error}</span>
    </div>)}
  </FormGroup>
);

export const renderSelectField = ({
  meta,
  options,
  className,
  input: { value, onChange },
}) => (
  <FormGroup className={className}>
    <Select
      value={value}
      backspaceRemoves
      options={options}
      onChange={onChange}
    />
    <ValidationState {...meta} />
  </FormGroup>
);
