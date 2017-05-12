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
export function addNewSubTask(parent, subtask) {
  return {
    type: types.ADD_NEW_SUBTASK,
    payload: {
      parent: parent,
      id: subtask.id,
      taskName: subtask.taskName,
      minimumHours: subtask.minimumHours,
      maximumHours: subtask.maximumHours,
    },
  };
}

