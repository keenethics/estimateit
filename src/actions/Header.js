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


// eta
// :
// Object
// field
// :
// "tasks[0].tasks"
// form
// :
// "contact"
// index
// :
// 0
// __proto__
// :
// Object
// type
// :
// "@@redux-form/ARRAY_REMOVE"

export function dispatchRemove({ form, field, index }) {
  return (dispatch, getState) => {
    console.log(form);
    console.log(field);
    console.log(index);

    const selector = formValueSelector(form);
    const removedValue = selector(getState(), field);
    const {
      maximumHours: removedMaxHours = 0,
      minimumHours: removedMinHours = 0,
    } = removedValue;


    console.log('removedValue');
    console.log(removedMinHours);
    console.log(removedMaxHours);
    console.log(field.replace(/\[\d+\]$/, ''));

    dispatch({
      type: '@@redux-form/ARRAY_REMOVE',
      meta: {
        form,
        field: field.replace(/\[\d+\]$/, ''),
        index,
      },
    });
    console.log(field);
    let address = field.replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      console.log(address);

      const element = selector(getState(), address);
      const { minimumHours, maximumHours } = element;

      console.log('in while');
      console.log(element);

      const minPayload = minimumHours - removedMinHours;
      const maxPayload = maximumHours - removedMaxHours;

      console.log('minPayload = ', minPayload);
      console.log('maxPayload = ', maxPayload);

      dispatch({
        type: '@@redux-form/CHANGE',
        meta: {
          form,
          touch: true,
          persistentSubmitErrors: false,
          field: `${address}.minimumHours`,
        },
        payload: minPayload
      });

      dispatch({
        type: '@@redux-form/CHANGE',
        meta: {
          form,
          touch: true,
          persistentSubmitErrors: false,
          field: `${address}.maximumHours`,
        },
        payload: maxPayload
      });

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }
  };
}

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

    let address = field.replace(/\.minimumHours$|\.maximumHours$/, '')
      .replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      const element = selector(getState(), address);
      const newValue = element.tasks.length === 1
        ? payload
        : element[changeType] + difference;

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
