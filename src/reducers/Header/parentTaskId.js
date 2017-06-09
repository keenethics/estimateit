import {
  SET_PARENT_TASK_ID,
  FETCH_TODOS_SUCCESS,
  REMOVE_PARENT_TASK_ID,
} from '../../constants/actionTypes';
import initialState from '../initialState';

export default function estimatorTasks(state = initialState.header.parentTaskId, action) {
  switch (action.type) {
    case SET_PARENT_TASK_ID:
      return action.payload.id;

    case REMOVE_PARENT_TASK_ID:
      return '';

    case FETCH_TODOS_SUCCESS:
      const { parentTaskId } = action.data.data.header;
      return parentTaskId;

    default:
      return state;
  }
}
