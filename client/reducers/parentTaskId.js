import {
  SET_PARENT_TASK_ID,
  REMOVE_PARENT_TASK_ID,
} from '../constants/actionTypes';
import initialState from './initialState';

export default function estimatorTasks(state = initialState.parentTaskId, action) {
  switch (action.type) {
    case SET_PARENT_TASK_ID:
      return {
        ...state, id: action.payload.id,
      };
    case REMOVE_PARENT_TASK_ID:
      return {
        ...state, id: '',
      };

    default:
      return state;
  }
}
