import * as types from '../constants/actionTypes';

export function saveFuelSavings(settings) {
  return function (dispatch) {
    return dispatch({
      type: types.SAVE_FUEL_SAVINGS,
      settings,
    });
  };
}
