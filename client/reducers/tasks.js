import { ADD_NEW_TASK, ADD_NEW_SUBTASK } from '../constants/actionTypes';
import initialState from './initialState';

function insertSubTask(tasks, id, newTask) {
  return tasks.map((element) => {
    if (element.id === id) {
      if (element.tasks && element.tasks.length) {
        return { ...element, tasks: [...element.tasks, newTask] };
      }
      return { ...element, tasks: [newTask] };
    }
    element.tasks = insertSubTask(element.tasks, id, newTask);
    return element;
  }).filter(t => t);
}

export default function fuelSavingsReducer(state = initialState.estimator, action) {
  switch (action.type) {
    case ADD_NEW_TASK:
      return [
        ...state,
        action.payload,
      ];
    case ADD_NEW_SUBTASK:
      return insertSubTask(state, action.payload.parent, action.payload);
    default:
      return state;
  }
}
