import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form'

import Main from './Main';
import estimate from './estimate';
import calculation from './calculation';

export default combineReducers({
  Main,
  form,
  estimate,
  calculation,
});
