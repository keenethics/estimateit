import React from 'react';
import SettingsPage from '../../components/Settings';

export default {
  path: '/',
  action() {
    return {
      title: 'Settings',
      component: (<SettingsPage />),
    };
  },
};
