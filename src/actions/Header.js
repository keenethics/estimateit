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

export function addNewTask(task) {
  return (dispatch, getState) => {
    dispatch({
      type: types.ADD_NEW_TASK,
      payload: {
        id: task.id,
        taskName: task.taskName,
        isChecked: task.isChecked,
        minimumHours: task.minimumHours,
        maximumHours: task.maximumHours,
      },
    });

    applyAction(dispatch, getState);
  };
}

export function addNewSubTask(parent, subtask) {
  return (dispatch, getState) => {
    dispatch({
      type: types.ADD_NEW_SUBTASK,
      payload: {
        parent,
        id: subtask.id,
        taskName: subtask.taskName,
        isChecked: subtask.isChecked,
        minimumHours: subtask.minimumHours,
        maximumHours: subtask.maximumHours,
      },
    });
    updateParentTaskHours(dispatch, getState, parent);
    applyAction(dispatch, getState);
  };
}

export function removeTask(id) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REMOVE_TASK,
      payload: {
        id,
      },
    });

    applyAction(dispatch, getState);
  };
}

export function findTaskAndModify(id, name, value) {
  return (dispatch, getState) => {
    dispatch({
      type: types.MODIFY_TASK,
      payload: {
        id,
        name,
        value,
      },
    });

    applyAction(dispatch, getState);
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

export function addTechnologies(value) {
  return {
    type: types.ADD_HEADER_INFO_TECHNOLOGIES,
    payload: {
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
