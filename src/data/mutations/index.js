import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import estimateUpdate from './estimateUpdate';
import estimateCreate from './estimateCreate';

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateUpdate,
    estimateCreate,
  }),
});

export default Mutation;
