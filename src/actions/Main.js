import * as types from '../constants/actionTypes';

export function changeMoneyRate(value) {
  return {
    type: types.CHANGE_MONEY_RATE,
    payload: {
      value,
    },
  };
}

export function apply(data) {
  return {
    type: types.APPLY_STATE,
    data,
  };
}

export function addEstimateOptions(value) {
  return {
    type: types.ADD_ESTIMATE_OPTIONS,
    payload: {
      value,
    },
  };
}

export function addClientData(name, value) {
  return {
    type: types.ADD_CLIENT_CONTACT_DATA,
    payload: {
      name,
      value,
    },
  };
}
