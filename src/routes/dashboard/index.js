import React from 'react';
import Wrapper from './wrapper';
import Dashboard from '../../components/Dashboard';
import Layout from '../../components/Layout';

export default {
  path: '/',
  async  action({next, isAuthenticated}) {
    if (isAuthenticated) {
      return {
        title: 'Dashboard',
        component: (
          <Wrapper>
            <Layout>
              <Dashboard />,
            </Layout>
          </Wrapper>
        ),
      };
    }
    return {
      title: 'Dashboard',
      component: (
        <Layout>
          <Dashboard />,
        </Layout>
      ),
    };
  },
};
