import * as types from '../constants/actionTypes';

export default function actionChangeGeneralEstimateInfo(value) {
  return {
    type: types.CHANGE_GENERAL_ESTIMATE_INFO,
    payload: {
      value,
    },
  };
}
