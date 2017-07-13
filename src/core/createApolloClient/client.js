import ApolloClient, { createNetworkInterface } from 'apollo-client';


const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'include',
  },
});

const logErrors = {
  applyAfterware({ response }, next) {
    response.clone().json().then((res) => {
      console.log('res', res);
      if (res.errors && res.errors.length > 0) {
        res.errors.forEach(e => console.log('Client Error: ', e.message)); // eslint-disable-line
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
