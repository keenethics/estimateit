import { combineReducers } from 'redux';

import tasks from './Header/tasks';
import parentTaskId from './Header/parentTaskId';
import headerAdditional from './Header/headerAdditional';

const rootReducer = combineReducers({
  tasks,
  parentTaskId,
  headerAdditional,
});

export default rootReducer;
