import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <Route exact path="/" component={App} />
  </Router>,
  document.getElementById('root'));
