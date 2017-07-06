import {
  APPLY_STATE,
  CALC_DEV_HOURS,
  CHANGE_MONEY_RATE,
  ADD_ESTIMATE_OPTIONS,
  ADD_CLIENT_CONTACT_DATA,
} from '../constants/actionTypes';

import initialState from './initialState';

export function main(state = initialState.main, action) {
  switch (action.type) {
    case CHANGE_MONEY_RATE:
      return { ...state, moneyRate: action.payload.value };

    case ADD_ESTIMATE_OPTIONS:
      return { ...state, estimateOptions: action.payload.value };

    case ADD_CLIENT_CONTACT_DATA:
      const { name, value } = action.payload;
      return { ...state, contacts: { ...state.contacts, [name]: value } };

    case APPLY_STATE:
      const { estimateOptions } = action.data;
      return { ...state, estimateOptions };

    default:
      return state;
  }
}

export default main;
