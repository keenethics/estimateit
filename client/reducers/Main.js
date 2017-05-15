import {
  CHANGE_MONEY_RATE,
  CALC_DEV_HOURS,
} from '../constants/actionTypes';
import initialState from './initialState';


export default function Main(state = initialState.moneyRate, action) {
  switch (action.type) {
    case CHANGE_MONEY_RATE:
      return { ...state, moneyRate: action.payload.value };

    case CALC_DEV_HOURS:
      return { ...state, devHours: action.payload.value };

    default:
      return state;
  }
}
