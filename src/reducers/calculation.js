import {
  RECALCULATION
} from '../constants/actionTypes';

import initialState from './initialState';

export function calculation(state = initialState.calculation, action) {
  switch (action.type) {
    case RECALCULATION:
      const { payload } = action;
      return { ...state, ...payload };

    default:
      return state;
  }
}

export default calculation;
