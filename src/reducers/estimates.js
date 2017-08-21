import {
  ADD_DASHBOARD_DATA,
} from '../constants/actionTypes';

import initialState from './initialState';

export default function estimates(state = initialState.estimates, action) {
  switch (action.type) {
    case ADD_DASHBOARD_DATA:
      return Object.assign({}, state, action.data);

    default:
      return state;
  }
}

// export default estimates;
