import React from 'react';

// import Estimate from '../../data/models/estimate';
// import Estimate from '../../data/models';
// import styles from './styles.scss';
import Main from '../../components/Main';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
// import * as actionsHeader from '../../actions/Header';

export default {

  path: '/:id',

  async action({ params: { id  } }) {
    console.log('dasjdkajdaldjhkjdhakjdhakjshdkjahksjh');
    const resp = await fetch('/graphql', {
      body: JSON.stringify({
        query: '{estimate{filed}}',
      }),
    });

    const { data } = await resp.json();

    console.log(data);
    // let estimateIsExist = false;
    // //
    // try {
    //   await Estimate.findOne({ _id: id }, (err, res) => {
    //     if (res) estimateIsExist = true;
    //   });
    // } catch (err) {
    //   console.error(err);
    // }
    //
    // if (estimateIsExist) {
      return {
        title: 'Estimator',
        component:
          <Layout>
            <Header />
            <Main />
          </Layout>,
      };
    // }
  },
};

// `query RollDice($dice: Int!, $sides: Int) {
//  rollDice(numDice: $dice, numSides: $sides)
// }`;

// async action({ fetch }) {
//     const resp = await fetch('/graphql', {
//       body: JSON.stringify({
//         query: '{news{title,link,content}}',
//       }),
//     });
//     const { data } = await resp.json();
//     if (!data || !data.news) throw new Error('Failed to load the news feed.');
//     return {
//       title: 'React Starter Kit',
//       component: <Layout><Home news={data.news} /></Layout>,
//     };
//   },
// app.get('/:id', (req, res) => {
//   const id = req.params.id;
//   UrlEntry.findOne({ _id: id }).then(doc => {
//     if (!doc) {
//       res.status(404).json({ error: 'Page not found' });
//     } else {
//       res.status(200).json({
//         data: {
//           header: doc.Header,
//           main: doc.Main,
//         },
//       });
//     }
//   });
// });
