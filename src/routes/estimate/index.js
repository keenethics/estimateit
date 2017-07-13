import React from 'react';
import { initialize } from 'redux-form';
import Main from '../../components/Main';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import { apply } from '../../actions/Main';
import { ESTIMATE_FORM } from '../../constants';
import { calculateAtFirstTime } from '../../actions/Calculation'


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
        // store.dispatch(apply(estimate));
        // store.dispatch(initialize(ESTIMATE_FORM, estimate))
        store.dispatch({
          type: '@@redux-form/INITIALIZE',
          meta: {
            form: ESTIMATE_FORM,
            keepDirty: false,
          },
          payload: estimate,
        });
        store.dispatch(calculateAtFirstTime(ESTIMATE_FORM));
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
