import React from 'react';

// import Estimate from '../../data/models/estimate';
// import Estimate from '../../data/models';
// import styles from './styles.scss';
import Main from '../../components/Main';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import { apply } from '../../actions/Main';

export default {

  path: '/:id',

  async action({ params: { id }, fetch, store }) {
    try {
      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: `{estimate(id: "${id}"){
            header{
              tasks{
                id,
                taskName,
                minimumHours,
                maximumHours,
                tasks{
                  id,
                  taskName,
                  minimumHours,
                  maximumHours,
                  tasks{
                    id,
                    taskName,
                    minimumHours,
                    maximumHours,
                  },
                },
              },
              headerAdditional{
                technologies,
                sprintNumber,
                data,
                projectName,
                clientName,
                comments
              }
            },
            main{
              moneyRate,
              estimateOptions{
                qa,
                pm,
                risks,
                bugFixes,
                completing
              }
              devHours{
                minHours,
                maxHours
              },
              contacts{
                pm,
                skype,
                email,
                position
              }
            }
          }
        }`,
        }),
      });

      const data = await resp.json();
      store.dispatch(apply(data));

      return {
        title: 'Estimator',
        component: (
          <Layout>
            <Header />
            <Main />
          </Layout>
        ),
      };
    } catch (err) {
      return console.error(err);
    }
  },
};
