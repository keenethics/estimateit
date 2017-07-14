import {
  APPLY_STATE,
} from '../constants/actionTypes';

import initialState from './initialState';

export function main(state = initialState.main, action) {
  switch (action.type) {

    case APPLY_STATE:
      const { estimateOptions } = action.data;
      return { ...state, estimateOptions };

    default:
      return state;
  }
}

export default main;
