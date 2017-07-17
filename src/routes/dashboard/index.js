import React from 'react';
import Dashboard from '../../components/Dashboard';
import Layout from '../../components/Layout';


export default {
  path: '/',
  action() {
    return {
      title: 'Dashboard',
      component: (
        <Layout>
          <Dashboard />
        </Layout>
      ),
    };
  },
};
