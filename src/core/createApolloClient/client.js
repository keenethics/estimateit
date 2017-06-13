import ApolloClient, { createNetworkInterface } from 'apollo-client';
// import { INVALID_TOKEN } from '../../data/errors/types';
import history from '../history';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    // Additional fetch options like `credentials` or `headers`
    credentials: 'include',
  },
});

// const logErrors = {
//   applyAfterware({ response }, next) {
//     response.clone().json().then(({ errors }) => {
//       if (errors) {
//         const tokenError = errors.find(({ name }) => name === INVALID_TOKEN);
//
//         if (tokenError) {
//           const d = new Date();
//           d.setTime(d.getTime() - 1);
//           document.cookie = `token=""; expires=${d.toUTCString()}; path=/`;
//
//           history.push('/login');
//         }
//       } else {
//         next();
//       }
//     });
//   },
// };
//
// networkInterface.useAfter([logErrors]);


const client = new ApolloClient({
  networkInterface,
  queryDeduplication: true,
  // reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
