import React from 'react';
import Dashboard from '../../components/Dashboard';

export default {
  path: '/',
  action() {
    return {
      title: 'Dashboard',
      component: (<Dashboard />),
    };
  },
};
