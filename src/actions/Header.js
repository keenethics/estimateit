import { formValueSelector } from 'redux-form';

import * as types from '../constants/actionTypes';

const applyAction = (dispatch, getState) => {
  const { Header: { tasks }, Main: { estimateOptions } } = getState();

  dispatch({
    type: types.UPDATE_DEVELOPMENT_TIME,
    payload: {
      tasks,
      estimateOptions,
    },
  });
};

const updateParentTaskHours = (dispatch, getState, parentId) => {
  const { tasks } = getState().Header;

  const parent = tasks.find(task => {
    if (task.id === parentId) return true;

    const сontainsCurrentSubtask = task.tasks && task.tasks.length
      ? task.tasks.filter(t => t.id === parentId).length
      : false;

    return сontainsCurrentSubtask;
  });

  const calculationSumSubTasks = subTasks =>
    subTasks.reduce((acc, task, index) => {
      console.log(acc);
      console.log(task);
      console.log(index);

      let sum = acc;

      if (index === 1) {
        sum = {
          minimumHours: +acc.minimumHours,
          maximumHours: +acc.maximumHours,
        };
      }
      console.log(sum);

      sum.minimumHours = sum.minimumHours + +task.minimumHours;
      sum.maximumHours = sum.maximumHours + +task.maximumHours;

      console.log(sum);

      return sum;
    });

  console.log(parent);
  console.log(calculationSumSubTasks(parent.tasks));
};

export function dispatchChange({ form, field, payload }) {
  return (dispatch, getState) => {
    const selector = formValueSelector(form);
    const oldValue = selector(getState(), field) || 0;
    const changeType = field.match(/minimumHours$|maximumHours$/)[0];
    const difference = payload - oldValue;

    dispatch({
      type: '@@redux-form/CHANGE',
      meta: {
        form,
        field,
        touch: true,
        persistentSubmitErrors: false,
      },
      payload,
    });
    console.log(field);


    console.log(difference);
    console.log(payload);
    console.log(oldValue);
    console.log('field = ', field);

    let address = field.replace(/\.minimumHours$|\.maximumHours$/, '')
      .replace(/.?tasks\[\d+\]$/, '');


    console.log(address);

    while (address) {

      console.log('in the while = ', address);

      const element = selector(getState(), address);

      console.log('element = ', element);

      const newValue = element.tasks.length === 1
        ? payload
        : element[changeType] + difference;

      console.log('newValue = ', newValue);

      dispatch({
        type: '@@redux-form/CHANGE',
        meta: {
          form,
          touch: true,
          persistentSubmitErrors: false,
          field: `${address}.${changeType}`,
        },
        payload: newValue,
      });

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }
  };
}
