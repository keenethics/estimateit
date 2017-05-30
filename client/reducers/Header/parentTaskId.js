import {
  SET_PARENT_TASK_ID,
  REMOVE_PARENT_TASK_ID,
  FETCH_TODOS_SUCCESS,
} from '../../constants/actionTypes';
import initialState from '../initialState';

export default function estimatorTasks(state = initialState.header.parentTaskId, action) {
  switch (action.type) {
    case SET_PARENT_TASK_ID:
      return {
        ...state, id: action.payload.id,
      };
    case REMOVE_PARENT_TASK_ID:
      return {
        ...state, id: '',
      };
    case FETCH_TODOS_SUCCESS:
      const { parentTaskId } = action.data.data.header;
      return { ...state, ...parentTaskId };
    default:
      return state;
  }
}
