import {
  change,
  arrayRemove,
  arrayUnshift,
  formValueSelector,
} from 'redux-form';

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

export const dispatchToggle = ({ form, field, payload }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const removedTask = selector(getState(), field);
    const {
      maximumHours: removedMaxHours = 0,
      minimumHours: removedMinHours = 0,
    } = removedTask;

    let address = field.replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      const element = selector(getState(), address);

      const { isChecked, minimumHours, maximumHours } = element;
      const minPayload = minimumHours + (payload || -1) * removedMinHours;
      const maxPayload = maximumHours + (payload || -1) * removedMaxHours;

      dispatch(change(form, `${address}.minimumHours`, minPayload));
      dispatch(change(form, `${address}.maximumHours`, maxPayload));

      if (!isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }
  };


export const dispatchRemove = ({ form, field, index }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const removedTask = selector(getState(), field);
    const {
      maximumHours: removedMaxHours = 0,
      minimumHours: removedMinHours = 0,
      isChecked
    } = removedTask;

    dispatch(arrayRemove(form, field.replace(/\[\d+\]$/, ''), index));

    if (!isChecked) return null;

    let address = field.replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      const element = selector(getState(), address);
      const { isChecked,minimumHours, maximumHours } = element;
      const minPayload = minimumHours - removedMinHours;
      const maxPayload = maximumHours - removedMaxHours;

      dispatch(change(form, `${address}.minimumHours`, minPayload));
      dispatch(change(form, `${address}.maximumHours`, maxPayload));

      if (!isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }
  };

export const dispatchChange = ({ form, field, payload }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const oldValue = selector(getState(), field) || 0;
    const changeType = field.match(/minimumHours$|maximumHours$/)[0];
    const difference = payload - oldValue;

    dispatch(change(form, field, payload));

    let address = field.replace(/\.minimumHours$|\.maximumHours$/, '')
      .replace(/.?tasks\[\d+\]$/, '');

    // change values of all parent tasks
    while (address) {
      const element = selector(getState(), address);
      const newValue = element[changeType] + difference;

      dispatch(change(form, `${address}.${changeType}`, newValue));

      if (!element.isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }
  };


export const dispatchAddSubTask = ({ form, field }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const parentTask = field.replace(/.?tasks$/, '');
    const parentTaskObj = selector(getState(), parentTask);

    if (!parentTaskObj.tasks || !parentTaskObj.tasks.length) {
      dispatch(dispatchChange({
        form,
        payload: 0,
        field: `${parentTask}.minimumHours`,
      }));
      dispatch(dispatchChange({
        form,
        payload: 0,
        field: `${parentTask}.maximumHours`,
      }));
    }

    dispatch(arrayUnshift(form, field, { isChecked: true }));
  };
