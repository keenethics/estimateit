import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './tasks';
import headerAdditional from './headerAdditional';

const rootReducer = combineReducers({
  headerAdditional,
  tasks,
  routing: routerReducer,
});

export default rootReducer;
