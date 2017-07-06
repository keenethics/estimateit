import React from 'react';
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
            owner,
            header{
              tasks{
                id,
                taskName,
                isChecked,
                minimumHours,
                maximumHours,
                tasks{
                  id,
                  taskName,
                  isChecked,
                  minimumHours,
                  maximumHours,
                  tasks{
                    id,
                    taskName,
                    isChecked,
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

      const { data: { estimate } } = await resp.json();

      if (estimate) store.dispatch(apply(estimate));

      return {
        title: 'Estimator',
        authRequired: true,
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
