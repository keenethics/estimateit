import {
  CHANGE_GENERAL_ESTIMATE_INFO,
} from '../constants/actionTypes';


export function estimate(state = {}, action) {
  switch (action.type) {
    case CHANGE_GENERAL_ESTIMATE_INFO:
      return { ...state, ...action.payload.value };

    default:
      return state;
  }
}

export default estimate;
