import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './tasks';
import headerAdditional from './headerAdditional';
import parentTaskId from './parentTaskId';

import Main from './Main';

const rootReducer = combineReducers({
  headerAdditional,
  tasks,
  parentTaskId,

  Main,
  routing: routerReducer,
});

export default rootReducer;
