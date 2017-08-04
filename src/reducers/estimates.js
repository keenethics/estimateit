import {
  ADD_DASHBOARD_STATE,
} from '../constants/actionTypes';

import initialState from './initialState';

export function estimates(state = initialState.estimates, action) {
  switch (action.type) {
    case ADD_DASHBOARD_STATE:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}

export default estimates;
