import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import estimates from './estimates';
import estimate from './estimate';
import calculation from './calculation';

export default combineReducers({
  form,
  estimate,
  estimates,
  calculation,
});
