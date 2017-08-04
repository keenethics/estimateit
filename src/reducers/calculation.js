import {
  CALCULATE_TOTOAL_HOURS,
  GENERAL_CALCULATION,
  CHANGE_ADDITIONAL_TIME,
  CHANGE_PROBABILITY_TIME,
} from '../constants/actionTypes';

import initialState from './initialState';

export function calculation(state = initialState.calculation, action) {
  switch (action.type) {
    case GENERAL_CALCULATION:
      return { ...state, ...action.payload };

    case CALCULATE_TOTOAL_HOURS:
      return { ...state, ...action.payload };

    case CHANGE_PROBABILITY_TIME:
      return { ...state, ...action.payload };

    case CHANGE_ADDITIONAL_TIME:
      return {
        ...state,
        additionalTime: { ...state.additionalTime, ...action.payload },
      };

    default:
      return state;
  }
}

export default calculation;
