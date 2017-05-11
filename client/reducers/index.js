import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import estimator from './tasks';

const rootReducer = combineReducers({
  estimator,
  routing: routerReducer,
});

export default rootReducer;
