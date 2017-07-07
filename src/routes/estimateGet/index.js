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
            date,
            clientName,
            projectName,
            sprintNumber,
            comments,
            pm,
            skype,
            email,
            position,
            moneyRate,
            technologies,
            estimateOptions{
              qa,
              pm,
              risks,
              bugFixes,
              completing
            },
            devHours{
              minHours,
              maxHours
            },
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
            }
          }
        }`,
        }),
      });

      const { data: { estimate } } = await resp.json();

      if (estimate) {
        store.dispatch(apply(estimate));
        store.dispatch({
          type: '@@redux-form/INITIALIZE',
          meta: {
            form: 'contact',
            keepDirty: false,
          },
          payload: estimate,
        });
      }

      return {
        title: 'Estimator',
        authRequired: true,
        component: (
          <Layout>
            <Header />
            <Main web="isEditable" />
          </Layout>
        ),
      };
    } catch (err) {
      return console.error(err);
    }
  },
};
