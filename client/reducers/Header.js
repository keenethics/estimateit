import { combineReducers } from 'redux';
import tasks from './Header/tasks';
import headerAdditional from './Header/headerAdditional';
import parentTaskId from './Header/parentTaskId';

const rootReducer = combineReducers({
  headerAdditional,
  tasks,
  parentTaskId,
});

export default rootReducer;
