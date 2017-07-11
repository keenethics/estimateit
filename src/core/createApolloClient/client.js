import ApolloClient, { createNetworkInterface } from 'apollo-client';
// import { INVALID_TOKEN } from '../../data/errors/types';
import history from '../history';

const networkInterface = createNetworkInterface({
  uri: '/graphql',

});

const logErrors = {
  applyAfterware(response, next) {
    console.log('applyAfterware', response);
    response.clone().json().then((res) => {
      const { errors, code } = res;
      console.log('response.clone', errors, code);
      if (errors) {
        console.log('Error, response.clone', code);
        history.push('/');
      } else {
        next();
      }
      next();
    });
  },
};

const loggingAfterware = {
  applyAfterware(res, next) {
    console.log('res', res.responses);
    next();
  },
};


networkInterface.useAfter([loggingAfterware, logErrors]);


const client = new ApolloClient({
  networkInterface,
  queryDeduplication: true,
  // reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
