import React from 'react';
import RegistrationPage from '../../components/Auth/RegistrationPage';

export default {
  path: '/register',
  action() {
    return {
      title: 'Registation',
      denyAuth: true,
      component: (<RegistrationPage />),
    };
  },
};
