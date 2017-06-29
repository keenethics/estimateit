import React from 'react';
import LoginPage from '../../components/Auth/LoginPage';

export default {
  path: '/',
  action() {
    return {
      title: 'Login',
      component: (<LoginPage />),
    };
  },
};
