import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import fuelSavings from './tasks';

const rootReducer = combineReducers({
  fuelSavings,
  routing: routerReducer,
});

export default rootReducer;
