import { combineReducers } from 'redux';

import tasks from './Header/tasks';
import parentTaskId from './Header/parentTaskId';
import developmentTime from './Header/developmentTime';

const rootReducer = combineReducers({
  tasks,
  parentTaskId,
  developmentTime,
});

export default rootReducer;
