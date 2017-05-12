import { ADD_NEW_TASK, ADD_NEW_SUBTASK } from '../constants/actionTypes';
import initialState from './initialState';

export default function fuelSavingsReducer(state = initialState.estimator, action) {
  let newState;
  switch (action.type) {
    case ADD_NEW_TASK:
      return [
        ...state,
        action.payload,
      ];
    default:
      return state;
  }
}
