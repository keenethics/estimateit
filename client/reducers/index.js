import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './tasks';
import headerAdditional from './headerAdditional';
import parentTaskId from './parentTaskId';

const rootReducer = combineReducers({
  headerAdditional,
  tasks,
  parentTaskId,
  routing: routerReducer,
});

export default rootReducer;
