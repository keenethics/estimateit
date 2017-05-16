import {
  CHANGE_MONEY_RATE,
  CALC_DEV_HOURS,
  ADD_ESTIMATE_OPTIONS,
} from '../constants/actionTypes';
import initialState from './initialState';

export function main(state = initialState.main, action) {
  switch (action.type) {
    case CHANGE_MONEY_RATE:
      return { ...state, moneyRate: action.payload.value };
    case CALC_DEV_HOURS:
      return { ...state, devHours: action.payload.value };
    case ADD_ESTIMATE_OPTIONS:
      return { ...state, estimateOptions: action.payload.value };
    default:
      return state;
  }
}

export default main;
