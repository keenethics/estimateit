import React from 'react';
import Main from '../../components/Main';
import Layout from '../../components/Layout';
import Header from '../../components/Header';

export default {
  path: '/estimate',
  children: [{
    path: '/',
    action: () => ({
      title: 'Estimator',
      authRequired: true,
      component: (
        <Layout>
          <Header />
          <Main />
        </Layout>),
    }),
  }],
};
