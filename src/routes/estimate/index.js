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
