import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Header from './Header';
import Main from './Main';

const rootReducer = combineReducers({
  Header,
  Main,
  routing: routerReducer,
});

export default rootReducer;
