import ApolloClient, { createNetworkInterface } from 'apollo-client';
import history from '../history';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'include',
  },
});

const logErrors = {
  applyAfterware({ response }, next) {
    response.clone().json().then((res) => {
      if (res.errors && res.errors.length > 0) {
        location.replace('/404');
      }
      next();
    }).catch((e) => {
      console.error('Unhandled networkInterface error: ', e); // eslint-disable-line
      next();
    });
  },
};


networkInterface.useAfter([logErrors]);


const client = new ApolloClient({
  networkInterface,
  queryDeduplication: true,
  // reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
