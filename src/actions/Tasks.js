import {
  arrayPush,
  arrayRemove,
  formValueSelector,
} from 'redux-form';

import { actionGeneralCalculation } from './Calculation';


const changeWrapper = (dispatch, form, field, payload, touch = true) => {
  dispatch({
    type: '@@redux-form/CHANGE',
    meta: {
      form,
      field,
      touch,
      persistentSubmitErrors: false,
    },
    payload: payload || '',
  });
};

export const actionToggleTask = ({ form, field, payload }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const removedTask = selector(getState(), field);
    const {
      maximumMinutes: removedMaxHours = 0,
      minimumMinutes: removedMinHours = 0,
    } = removedTask;

    let address = field.replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      const element = selector(getState(), address);

      const { isChecked, minimumMinutes = 0, maximumMinutes = 0 } = element;
      const minPayload = minimumMinutes + ((payload || -1) * removedMinHours);
      const maxPayload = maximumMinutes + ((payload || -1) * removedMaxHours);

      changeWrapper(dispatch, form, `${address}.minimumMinutes`, minPayload);
      changeWrapper(dispatch, form, `${address}.maximumMinutes`, maxPayload);

      if (!isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(actionGeneralCalculation(form));
  };


export const actionRemoveTask = ({ form, field, index }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const removedTask = selector(getState(), field);
    const {
      maximumMinutes: removedMaxHours = 0,
      minimumMinutes: removedMinHours = 0,
      isChecked: removedIsChecked,
    } = removedTask;

    dispatch(arrayRemove(form, field.replace(/\[\d+\]$/, ''), index));

    if (!removedIsChecked) return null;

    let address = field.replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      const element = selector(getState(), address);
      const { isChecked, minimumMinutes, maximumMinutes } = element;
      const minPayload = minimumMinutes - removedMinHours;
      const maxPayload = maximumMinutes - removedMaxHours;

      changeWrapper(dispatch, form, `${address}.minimumMinutes`, minPayload);
      changeWrapper(dispatch, form, `${address}.maximumMinutes`, maxPayload);
      if (!isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(actionGeneralCalculation(form));
  };

export const actionChangeTaskHours = ({ form, field, payload }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    let oldValue = selector(getState(), field) || 0;
    const changeType = field.match(/minimumMinutes$|maximumMinutes$/)[0];
    const difference = payload - oldValue;
    changeWrapper(dispatch, form, field, payload);

    let address = field.replace(/\.minimumMinutes$|\.maximumMinutes$/, '')
      .replace(/.?tasks\[\d+\]$/, '');

    // change values of all parent tasks

    while (address) {
      const element = selector(getState(), address);
      oldValue = element[changeType] || 0;
      const newValue = oldValue + difference;

      changeWrapper(dispatch, form, `${address}.${changeType}`, newValue);

      if (!element.isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(actionGeneralCalculation(form));
  };


export const actionAddSubTask = ({ form, field }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const parentTask = field.replace(/.?tasks$/, '');
    const parentTaskObj = selector(getState(), parentTask);

    if (!parentTaskObj.tasks || !parentTaskObj.tasks.length) {
      dispatch(actionChangeTaskHours({
        form,
        payload: 0,
        field: `${parentTask}.minimumMinutes`,
      }));
      dispatch(actionChangeTaskHours({
        form,
        payload: 0,
        field: `${parentTask}.maximumMinutes`,
      }));
    }

    dispatch(arrayPush(form, field, { isChecked: true, minimumMinutes: 0, maximumMinutes: 0 }));
  };
