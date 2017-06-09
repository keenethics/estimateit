import React from 'react';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import * as actionsHeader from '../../actions/Header';
import styles from './styles.scss';

export default {

  path: '/',

  async action({ store }) {
    return {
      title: 'Estimator',
      component:
        <Layout>
          <Header />
        </Layout>,
    };
  },

};
