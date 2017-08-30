import _ from 'underscore';

export const required = value =>
  (value && value.replace(/\s/g, '') ? undefined : 'Required');

export const requiredSelect = value =>
  (value && value.value ? undefined : 'Required');

export const taskHourValidation = haveSubTasks => value =>
  (typeof value === 'number' || haveSubTasks ? undefined : 'Required');

export const mixShouldBeLessThenMax = (maxTimeId, haveSubtask) =>
  (value, allValues) => {
    if (!allValues.tasks.length || haveSubtask) return undefined;

    const address = maxTimeId
      .replace(/\]/g, '')
      .replace(/\[/g, '.');

    const maxTime = address.split('.')
      .reduce((obj, i) => obj && obj[i], allValues);

    return ((maxTime || 0) >= (value || 0))
      ? undefined
      : 'min time > max time';
  };


export const requiredArray = value =>
  (value && value.length ? undefined : 'Required');

export const arrayItemMaxLength = max => (value) => {
  const invalidItems = value.filter(item => item.length > 30);
  return invalidItems && invalidItems.length
    ? `Must be ${max} characters or less`
    : undefined;
};

export const maxLength = max => value =>
  (value && value.length > max ? `Must be ${max} characters or less` : undefined);

export const maxLength15 = maxLength(15);

export const minLength = min => value =>
  (value && value.length < min ? `Must be ${min} characters or more` : undefined);

export const minLength2 = minLength(2);

export const number = value =>
  (value && isNaN(Number(value)) ? 'Must be a number' : undefined);

export const minValue = min => value =>
  (value && value < min ? `Must be at least ${min}` : undefined);

export const emailValidation = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
  );

export const emailFromSelect = ({ label }) =>
  (emailValidation(label));

export const newContributorEmail = ({ contributors, owner }) => ({ label }) =>
  ((!_.findWhere(contributors, { email: label }) && label !== owner.email)
    ? undefined
    : 'User with this email alreday added to estimate'
  );


export const phoneNumber = value =>
  (value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined
  );

export const alphaNumeric = value =>
  (value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined
  );

export const currency = (value) => {
  if (value) {
    return /^[1-9]{1}[0-9]*$/.test(value.toString()) ? undefined : 'Should be integer';
  }
  return undefined;
};
