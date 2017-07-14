import { combineReducers } from 'redux';
import {reducer as form} from 'redux-form'

import Main from './Main';
import calculation from './calculation';

export default combineReducers({
  Main,
  form,
  calculation,
});
