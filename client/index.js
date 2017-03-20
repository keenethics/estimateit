import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
  </Router>,
  document.getElementById('root'));
