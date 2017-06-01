import axios from 'axios';
import {
  FETCH_TODOS_REQUEST,
  FETCH_TODOS_SUCCESS,
  FETCH_TODOS_FAILURE,
} from '../constants/actionTypes';

export function fetchTodos(path) {
  return function (dispatch) {
    dispatch({
      type: FETCH_TODOS_REQUEST,
    });
    return axios
      .get(`http://localhost:3000${path}`)
      .then((response) => {
        const { data } = response;  
        dispatch({
          type: FETCH_TODOS_SUCCESS,
          data,
        });
      })
      .catch((error) => {
        const { data } = error.response;
        dispatch({
          type: FETCH_TODOS_FAILURE,
          error: data,
        });
      });
  };
}
