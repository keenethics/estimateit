import { combineReducers } from 'redux';
import {reducer as form} from 'redux-form'

import Main from './Main';
import Header from './Header';

export default combineReducers({
  Main,
  Header,
  form,
});
