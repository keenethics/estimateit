import React from 'react';
import Wrapper from './wrapper';
import Main from '../../components/Main';
import Layout from '../../components/Layout';
import Header from '../../components/Header';

export default {

  path: '/estimate/:id',
  async action({ params: { id } }) {
    try {
      return {
        title: 'Estimator',
        authRequired: true,
        component: (
          <Wrapper id={id}>
            <Layout>
              <Header />
              <Main />
            </Layout>
          </Wrapper>
        ),
      };
    } catch (err) {
      return console.error(err);
    }
  },
};
