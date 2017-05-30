import {
  FETCH_TODOS_REQUEST,
  FETCH_TODOS_SUCCESS,
  FETCH_TODOS_FAILURE,
} from '../constants/actionTypes';
import initialState from './initialState';

export function loading(state = initialState.loading, action) {
  switch (action.type) {
    case FETCH_TODOS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_TODOS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case FETCH_TODOS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    default:
      return state;
  }
}

export default loading;
