import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import estimateCreate from './createEstimate';

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateCreate,
  }),
});

export default Mutation;
