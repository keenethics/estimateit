import * as types from '../constants/actionTypes';

export function addNewTask(task) {
  return {
    type: types.ADD_NEW_TASK,
    payload: {
      id: task.id,
      taskName: task.taskName,
      isChecked: task.isChecked,
      minimumHours: task.minimumHours,
      maximumHours: task.maximumHours,
    },
  };
}
export function addNewSubTask(parent, subtask) {
  return {
    type: types.ADD_NEW_SUBTASK,
    payload: {
      parent,
      id: subtask.id,
      taskName: subtask.taskName,
      isChecked: subtask.isChecked,
      minimumHours: subtask.minimumHours,
      maximumHours: subtask.maximumHours,
    },
  };
}

export function removeTask(id) {
  return {
    type: types.REMOVE_TASK,
    payload: {
      id,
    },
  };
}

export function findTaskAndModify(id, name, value) {
  return {
    type: types.MODIFY_TASK,
    payload: {
      id,
      name,
      value,
    },
  };
}

export function addNewClientData(name, value) {
  return {
    type: types.ADD_HEADER_INFO_DATA,
    payload: {
      name,
      value,
    },
  };
}

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
