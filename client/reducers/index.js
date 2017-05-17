import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import loading from './loading';
import Header from './Header';
import Main from './Main';

const rootReducer = combineReducers({
  loading,
  Header,
  Main,
  routing: routerReducer,
});

export default rootReducer;
