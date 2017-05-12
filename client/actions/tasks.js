import * as types from '../constants/actionTypes';

export function addNewTask(task) {
  return {
    type: types.ADD_NEW_TASK,
    payload: {
      id: task.id,
      taskName: task.taskName,
      minimumHours: task.minimumHours,
      maximumHours: task.maximumHours,
    },
  };
}
