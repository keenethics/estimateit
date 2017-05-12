import { ADD_NEW_TASK, ADD_NEW_SUBTASK, REMOVE_TASK } from '../constants/actionTypes';
import initialState from './initialState';

function insertSubTask(tasks, id, newTask) {
  return tasks.map((element) => {
    if (element.id === id) {
      if (element.tasks && element.tasks.length) {
        return { ...element, tasks: [...element.tasks, newTask] };
      }
      return { ...element, tasks: [newTask] };
    }
    insertSubTask(element.tasks, id, newTask);
    return element;
  });
}

function findTaskAndDelete(state, id) {
  return state.filter((element) => {
    if (element.id === id) {
      return false;
    }
    if (element.tasks && element.tasks.length > 0) {
      element.tasks = findTaskAndDelete(element.tasks, id);
      if (!element.tasks.length) {
        delete element.tasks;
      }
      return true;
    }
    return true;
  });
}

export default function estimatorTasks(state = initialState.estimator, action) {
  switch (action.type) {
    case ADD_NEW_TASK:
      return [
        ...state,
        action.payload,
      ];

    case ADD_NEW_SUBTASK:
      return insertSubTask(state, action.payload.parent, action.payload);

    case REMOVE_TASK:
      return findTaskAndDelete(state, action.payload.id);

    default:
      return state;
  }
}
