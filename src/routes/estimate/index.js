import React from 'react';
import Wrapper from './wrapper';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Main from '../../components/Main';

export default {

  path: '/estimate/:id',
  async action({ params: { id } }) {
    try {
      return {
        title: 'Estimator',
        authRequired: false,
        component: (
          <Wrapper id={id}>
            <Layout>
              <Header />
              <Main estimateId={id} />
            </Layout>
          </Wrapper>
        ),
      };
    } catch (err) {
      return console.error(err);
    }
  },
};
