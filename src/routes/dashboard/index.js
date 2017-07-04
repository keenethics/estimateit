import React from 'react';
import Dashboard from '../../components/Dashboard';

export default {

  path: '/dashboard',

  async action() {
    return {
      title: 'dashboard',
      description: 'test',
      component: <Dashboard />,
    };
  },

};
