import {
  arrayPush,
  arrayRemove,
  formValueSelector,
} from 'redux-form';

import { actionGeneralCalculation } from './Calculation';


const changeWrapper = ({ dispatch, form, field, payload, touch = true }) => {
  console.log('wrapper::', form,  field, payload);
  dispatch({
    type: '@@redux-form/CHANGE',
    meta: {
      form,
      field,
      touch,
      persistentSubmitErrors: false,
    },
    payload: payload || 0,
  });
};

const recalculateSubtask = (field, getState, selector, dispatch, form, currentTarget = false) => {
  console.log('1)',field, dispatch);
  const currentTask = selector(getState(), field);
  console.log('2)',currentTask.tasks);

  const sumTasks = (currentTask.tasks && currentTask.tasks.length) ? (
    currentTask.tasks.filter(({ isChecked }) => isChecked).reduce((sum, item) => ({
      min: sum.min + item.minimumMinutes,
      max: sum.max + item.maximumMinutes,
    }), { min: 0, max: 0 })
  ) : ({
    min: currentTask.isChecked ? currentTask.minimumMinutes : 0,
    max: currentTask.isChecked ? currentTask.maximumMinutes : 0,
  });
  console.log('3)',{ min: sumTasks.min/60, max: sumTasks.max/60,  });

  if (!currentTarget) {
    changeWrapper({ dispatch, form, field: `${field}.minimumMinutes`, payload: sumTasks.min });
    changeWrapper({ dispatch, form, field: `${field}.maximumMinutes`, payload: sumTasks.max });
  }

  const parentField = field.replace(/.?tasks\[\d+\]$/, '');
  console.log('4)', parentField);

  if (parentField) return recalculateSubtask(parentField, getState, selector, dispatch, form);


  return null; // ??
}

export const actionToggleTask = ({ form, field, checked }) =>
  (dispatch, getState) => {
    const sign = checked ? 1 : -1;
    const selector = formValueSelector(form);
    const toggledTask = selector(getState(), field);
    const {
      minimumMinutes: toggledMinMinutes = 0,
      maximumMinutes: toggledMaxMinutes = 0,
    } = toggledTask;

    recalculateSubtask(field, getState, selector, dispatch, form, true);


    // let parentField = field.replace(/.?tasks\[\d+\]$/, '');
    //
    // // modify all parent tasks
    // while (parentField) {
    //   const parent = selector(getState(), parentField);
    //   const { isChecked, minimumMinutes = 0, maximumMinutes = 0 } = parent;
    //   const minPayload = +minimumMinutes + (sign * toggledMinMinutes);
    //   const maxPayload = +maximumMinutes + (sign * toggledMaxMinutes);
    //
    //   changeWrapper({ dispatch, form, field: `${parentField}.minimumMinutes`, payload: +minPayload });
    //   changeWrapper({ dispatch, form, field: `${parentField}.maximumMinutes`, payload: +maxPayload });
    //
    //   if (!isChecked) break;
    //   parentField = parentField.replace(/\.?tasks\[\d+\]$/, '');
    // }

    dispatch(actionGeneralCalculation({ form }));
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

    let parentField = field.replace(/.?tasks\[\d+\]$/, '');

    // modify all parent tasks
    while (parentField) {
      const parent = selector(getState(), parentField);
      const { isChecked, minimumMinutes, maximumMinutes } = parent;
      const minPayload = minimumMinutes - removedMinHours;
      const maxPayload = maximumMinutes - removedMaxHours;

      changeWrapper({ dispatch, form, field: `${parentField}.minimumMinutes`, payload: minPayload });
      changeWrapper({ dispatch, form, field: `${parentField}.maximumMinutes`, payload: maxPayload });

      if (!isChecked) break;

      parentField = parentField.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(actionGeneralCalculation({ form }));

    return null;
  };

export const actionChangeTaskHours = ({ form, field, value, fieldName }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    let oldValue = selector(getState(), field) || 0;
    const difference = value - oldValue;

    changeWrapper({ dispatch, form, field, payload: value });

    let parentField = field.replace(/\.minimumMinutes$|\.maximumMinutes$/, '')
      .replace(/.?tasks\[\d+\]$/, '');

    // modify all parent tasks
    while (parentField) {
      const parent = selector(getState(), parentField);
      oldValue = parent[fieldName] || 0;
      const newValue = oldValue + difference;

      changeWrapper({ dispatch, form, field: `${parentField}.${fieldName}`, payload: newValue });

      if (!parent.isChecked) break;

      parentField = parentField.replace(/\.?tasks\[\d+\]$/, '');
    }

    dispatch(actionGeneralCalculation({ form }));
  };


export const actionAddSubTask = ({ form, field }) =>
  (dispatch, getState) => {
    const selector = formValueSelector(form);
    const parent = field.replace(/.?tasks$/, '');
    const parentObj = selector(getState(), parent);


    if (!parentObj.tasks || !parentObj.tasks.length) {
      dispatch(actionChangeTaskHours({
        form,
        value: 0,
        fieldName: 'minimumMinutes',
        field: `${parent}.minimumMinutes`,
      }));
      dispatch(actionChangeTaskHours({
        form,
        value: 0,
        fieldName: 'maximumMinutes',
        field: `${parent}.maximumMinutes`,
      }));
    }

    dispatch(arrayPush(form, field, { isChecked: true, minimumMinutes: 0, maximumMinutes: 0 }));
  };
