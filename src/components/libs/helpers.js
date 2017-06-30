import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

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
