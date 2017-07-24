import React from 'react';
import Wrapper from './wrapper';
import Layout from '../../components/Layout';
import NavBar from '../../components/NavBar';
import Header from '../../components/Header';
import Main from '../../components/Main';

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
              <NavBar />
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
