import {
  arrayRemove,
  arrayUnshift,
  formValueSelector,
} from 'redux-form';

import { calculateHours } from './Calculation';


const changeWrapper = (dispatch, form, field, payload, touch = true) => {
  dispatch({
    type: '@@redux-form/CHANGE',
    meta: {
      form,
      field,
      touch,
      persistentSubmitErrors: false,
    },
    payload,
  });
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

    // changeWrapper(dispatch, form, `${field}.isChecked`, '', false);
    // dispatch({
    //   type: '@@redux-form/BLUR',
    //   meta: {
    //     form,
    //     field: `${field}.isChecked`,
    //     touch: true,
    //   },
    //   payload,
    // })
    while (address) {
      const element = selector(getState(), address);

      const { isChecked, minimumHours, maximumHours } = element;
      const minPayload = minimumHours + (payload || -1) * removedMinHours;
      const maxPayload = maximumHours + (payload || -1) * removedMaxHours;

      changeWrapper(dispatch, form, `${address}.minimumHours`, minPayload);
      changeWrapper(dispatch, form, `${address}.maximumHours`, maxPayload);

      if (!isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(calculateHours(form));
  };


export const dispatchRemove = ({ form, field, index }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const removedTask = selector(getState(), field);
    const {
      maximumHours: removedMaxHours = 0,
      minimumHours: removedMinHours = 0,
      isChecked: removedIsChecked
    } = removedTask;

    dispatch(arrayRemove(form, field.replace(/\[\d+\]$/, ''), index));

    if (!removedIsChecked) return null;

    let address = field.replace(/.?tasks\[\d+\]$/, '');

    while (address) {
      const element = selector(getState(), address);
      const { isChecked, minimumHours, maximumHours } = element;
      const minPayload = minimumHours - removedMinHours;
      const maxPayload = maximumHours - removedMaxHours;

      changeWrapper(dispatch, form, `${address}.minimumHours`, minPayload);
      changeWrapper(dispatch, form, `${address}.maximumHours`, maxPayload);
      if (!isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(calculateHours(form));
  };

export const dispatchChange = ({ form, field, payload }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const oldValue = selector(getState(), field) || 0;
    const changeType = field.match(/minimumHours$|maximumHours$/)[0];
    const difference = payload - oldValue;

    changeWrapper(dispatch, form, field, payload);

    let address = field.replace(/\.minimumHours$|\.maximumHours$/, '')
      .replace(/.?tasks\[\d+\]$/, '');

    // change values of all parent tasks
    while (address) {
      const element = selector(getState(), address);
      const newValue = element[changeType] + difference;

      changeWrapper(dispatch, form, `${address}.${changeType}`, newValue)

      if (!element.isChecked) break;

      address = address.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(calculateHours(form));
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
