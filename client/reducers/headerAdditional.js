import { ADD_HEADER_INFO_DATA } from '../constants/actionTypes';
import initialState from './initialState';

function insertAdditionalData(state, data) {
  const { name, value } = data;
  return { ...state, [name]: value };
}

export default function headerAdditionalData(state = initialState.infoCollector, action) {
  switch (action.type) {
    case ADD_HEADER_INFO_DATA:
      return insertAdditionalData(state, action.payload);

    default:
      return state;
  }
}
