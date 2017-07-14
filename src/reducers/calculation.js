import {
  CALCULATE_TOTAL_HOURS,
  CALCULATE_GENERAL_HOURS,
} from '../constants/actionTypes';

import initialState from './initialState';

export function calculation(state = initialState.calculation, action) {

  switch (action.type) {
    case CALCULATE_GENERAL_HOURS:
      return { ...state, ...action.payload };

    case CALCULATE_TOTAL_HOURS:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export default calculation;
