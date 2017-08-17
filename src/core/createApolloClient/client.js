import ApolloClient, { createNetworkInterface } from 'apollo-client';
import {
  ACCESS_DENIED,
  UNAUTHORIZED_USER,
  INVALID_PERMISSION,
} from '../../data/errors/types';

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'include',
  },
});

const logErrors = {
  applyAfterware({ response }, next) {
    response.clone().json().then((res) => {
      if (!res.errors || !res.errors.length) return next();

      res.errors.forEach(({ name }) => {
        if (
          name === ACCESS_DENIED ||
          name === UNAUTHORIZED_USER ||
          name === INVALID_PERMISSION
        ) {
          location.replace('/404');
        }
      });

      return next();
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
  connectToDevTools: true, // REMOVE THIS IN PRODUCTION
  // reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
