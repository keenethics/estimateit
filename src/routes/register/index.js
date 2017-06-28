import React from 'react';
import RegistrationPage from '../../components/Auth/RegistrationPage';

export default {
  path: '/',
  action() {
    return {
      title: 'Registation',
      component: (<RegistrationPage />),
    };
  },
};
