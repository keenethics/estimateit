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

//       } else {
//         next();
//       }
//     });
//   },
// };

// networkInterface.useAfter([logErrors]);


const client = new ApolloClient({
  networkInterface,
  queryDeduplication: true,
  connectToDevTools: true, // REMOVE THIS IN PRODUCTION
  // reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
