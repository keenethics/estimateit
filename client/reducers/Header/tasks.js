import {
  ADD_NEW_TASK,
  ADD_NEW_SUBTASK,
  MODIFY_TASK,
  REMOVE_TASK,
} from '../../constants/actionTypes';
import initialState from '../initialState';

function insertSubTask(tasks, payload) {
  return tasks.map((element) => {
    if (element.id === payload.parent) {
      if (element.tasks && element.tasks.length) {
        return { ...element, tasks: [...element.tasks, payload] };
      }
      return { ...element, tasks: [payload] };
    }
    if (element.tasks && element.tasks.length) {
      // TODO: fix no immutable change state
      element.tasks = insertSubTask(element.tasks, payload);
    }
    return element;
  });
}

function findTaskAndDelete(state, id) {
  return state.filter((element) => {
    if (element.id === id) {
      return false;
    }
    if (element.tasks && element.tasks.length) {
      // TODO: fix no immutable change state
      element.tasks = findTaskAndDelete(element.tasks, id);
      if (!element.tasks.length) {
        delete element.tasks;
      }
      return true;
    }
    return true;
  });
}

function findTaskAndModify(tasks, id, name, value) {
  return tasks.map((element) => {
    if (element.id === id) {

      return { ...element, [name]: value };
    }
    if (element.tasks && element.tasks.length) {
      // TODO: fix no immutable change state
      element.tasks = findTaskAndModify(element.tasks, id, name, value);
    }
    return element;
  });
}

export default function estimatorTasks(state = initialState.header.tasks, action) {
  switch (action.type) {
    case ADD_NEW_TASK:
      return [...state, action.payload];

    case ADD_NEW_SUBTASK:
      return insertSubTask(state, action.payload);

    case REMOVE_TASK:
      return findTaskAndDelete(state, action.payload.id);

    case MODIFY_TASK:
      const { id, name, value } = action.payload;
      return findTaskAndModify(state, id, name, value);

    default:
      return state;
  }
}
