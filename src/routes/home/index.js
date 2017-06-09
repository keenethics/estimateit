import React from 'react';

import styles from './styles.scss';
import Main from '../../components/Main';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import * as actionsHeader from '../../actions/Header';

export default {

  path: '/',

  async action({ store }) {
    return {
      title: 'Estimator',
      component:
        <Layout>
          <Header />
          <Main />
        </Layout>,
    };
  },
};
