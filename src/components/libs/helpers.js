import React from 'react';
import { FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';

const ValidationState = ({ touched, error, warning }) => (
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

export const renderOptionsField = ({ className, input: { value, ...input}, label, type, meta, name, rate, onChange }) => {
  return (
  <div className={className}>
    <InputGroup>
      <InputGroupAddon>{label}</InputGroupAddon>
      <Input
        min="0"
        step="1"
        name={name}
        value={rate}
        type="text"
        onChange={onChange}
        {...input}
      />
    </InputGroup>
    <ValidationState {...meta} />
  </div>
  )
};
