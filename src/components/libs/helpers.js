/* eslint-disable */
import React from 'react';
import moment from 'moment';
import DateField from 'react-datepicker';
import { FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import ValidationState, { hintClass } from './ValidationState';


export class renderTaskNameField extends React.Component {
  constructor(props) {
    super(props);
    const { input: { value } } = props;
    this.state = {
      value,
    };

    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { input: { value } } = nextProps;
    this.setState({ value });
  }

  handleOnBlur({ target: { value } }) {
    const {
      fieldName,
      meta: { form },
      actionChangeTaskName,
      input: { name: field },
    } = this.props;

    actionChangeTaskName({ form, field, value, fieldName });
  }

  render() {
    const { className, input, label, type, meta, disabled } = this.props;

    return (
      <FormGroup className={className}>
        <Input
          {...input}
          type={type}
          disabled={disabled}
          placeholder={label}
          className={className + ' ' + hintClass(meta)}
          title={meta.error || meta.warning}
          onChange={({ target: { value } }) => this.setState({ value })}
          value={this.state.value}
          onBlur={this.handleOnBlur}
        />
        <ValidationState {...meta} />
      </FormGroup>
    );
  }
}

export const renderField = ({ className, input, label, type, meta, disabled }) => (
  <FormGroup className={className}>
    <Input
      {...input}
      type={type}
      disabled={disabled}
      placeholder={label}
      className={hintClass(meta)}
      title={meta.error || meta.warning}
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
      className={className + ' ' + hintClass(meta)}
      title={meta.error || meta.warning}
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
        className={hintClass(meta)}
        title={meta.error || meta.warning}
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
