import React from 'react';
import Dashboard from '../../components/Dashboard';
import Layout from '../../components/Layout';
import { addDashboardData } from '../../actions/Main';

export default {

  path: '/dashboard',

  async action({ params, fetch, store }) {
    try {

      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: `{
            allEstimates {
              id
              header {
                headerAdditional {
                	clientName
                  projectName
                  sprintNumber
                  data
              	}
              }
            }
          }`,
        }),
      });

      const { data } = await resp.json();
      console.log(data);
      store.dispatch(addDashboardData(data));

      return {
        title: 'dashboard',
        description: 'test',
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
