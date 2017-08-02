import * as types from '../constants/actionTypes';

export default function addDashboardData(data) {
  return {
    type: types.ADD_DASHBOARD_STATE,
    data,
  };
}
