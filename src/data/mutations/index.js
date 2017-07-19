import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import estimateSave from './estimateSave';
import estimateCreate from './createEstimate';

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateSave,
    estimateCreate,
  }),
});

export default Mutation;
