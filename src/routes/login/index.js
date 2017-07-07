import React from 'react';
import LoginPage from '../../components/Auth/LoginPage';

export default {
  path: '/login',
  action() {
    return {
      title: 'Login',
      denyAuth: true,
      component: (<LoginPage />),
    };
  },
};
