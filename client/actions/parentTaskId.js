import * as types from '../constants/actionTypes';

export function setParentTaskId(id) {
  return {
    type: types.SET_PARENT_TASK_ID,
    payload: {
      id,
    },
  };
}

export function removeParentTaskId() {
  return {
    type: types.REMOVE_PARENT_TASK_ID,
  };
}
