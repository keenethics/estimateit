import * as types from '../constants/actionTypes';

export function addNewClientData(name, value) {
  return {
    type: types.ADD_HEADER_INFO_DATA,
    payload: {
      name,
      value,
    },
  };
}
