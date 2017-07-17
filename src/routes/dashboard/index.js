import React from 'react';
import Dashboard from '../../components/Dashboard';
import Layout from '../../components/Layout';

import { addDashboardData } from '../../actions/Main';

export default {
  path: '/',
  async action({ params, fetch, store }) {
    try {
      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: `{
            allEstimates {
              _id
              clientName
              projectName
              sprintNumber
              date
            }
          }`,
        }),
      });

      const { data } = await resp.json();
      store.dispatch(addDashboardData(data));

      return {
        title: 'Dashboard',
        component: (
          <Layout>
            <Dashboard />,
          </Layout>
        ),
      };
    } catch (err) {
      return console.error(err);
    }
  },
};
