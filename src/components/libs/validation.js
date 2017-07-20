export const required = value =>
  (value && value.replace(/\s/g, '') ? undefined : 'Required');

export const taskHourValidation = haveSubTasks =>
  value => (typeof value === 'number' || haveSubTasks ? undefined : 'Required');

export const mixShouldBeLessThenMax = maxTimeId =>
  (value, allValues) => {
    if (!allValues.tasks.length) return undefined;

    const address = maxTimeId
      .replace(/\]/g, '')
      .replace(/\[/g, '.');

    const maxTime = address.split('.')
      .reduce((obj, i) => obj[i], allValues);

    return (!maxTime || maxTime >= value)
      ? undefined
      : 'min time > max time';
  };


export const requiredArray = value =>
  (value && value.length ? undefined : 'Required');

export const emailsArray = (value) => {
  const invalidEmails = value && value.filter(e => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(e));
  return (invalidEmails && invalidEmails.length)
    ? 'Invalid email address'
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

export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
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

export const tasksMin = sended => max =>
  (Number(max) < Number(sended)
  ? undefined
  : `Min hours ${max} should be less than Max hours ${sended}`
);

export const tasksMax = sended => max =>
  (Number(sended) < Number(max)
    ? undefined
    : `Max hours ${sended} should be bigger than Min hours ${max}`
  );

export const currency = value =>
  (value && /^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(value) ? undefined : 'Invalid number');
