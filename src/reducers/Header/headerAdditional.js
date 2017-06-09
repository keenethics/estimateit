import {
  FETCH_TODOS_SUCCESS,
  ADD_HEADER_INFO_DATA,
} from '../../constants/actionTypes';
import initialState from '../initialState';

function insertAdditionalData(state, data) {
  const { name, value } = data;
  return { ...state, [name]: value };
}

export default function headerAdditionalData(state = initialState.header.infoCollector, action) {
  switch (action.type) {
    case ADD_HEADER_INFO_DATA:
      return insertAdditionalData(state, action.payload);

    case FETCH_TODOS_SUCCESS:
      const { headerAdditional } = action.data.data.header;
      return { ...state, ...headerAdditional };
    default:
      return state;
  }
}
