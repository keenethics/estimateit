import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import estimateUpdate from './estimateUpdate';
import estimateCreate from './estimateCreate';
import estimateRemove from './estimateRemove';

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateUpdate,
    estimateCreate,
    estimateRemove,
  }),
});

export default Mutation;
