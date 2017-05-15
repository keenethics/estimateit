import * as types from '../constants/actionTypes';

export function changeMoneyRate(value) {
  return {
    type: types.CHANGE_MONEY_RATE,
    payload: {
      value,
    },
  };
}

export function calcDevHours(value) {
  return {
    type: types.CALC_DEV_HOURS,
    payload: {
      value,
    },
  };
}

