import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import estimateUpdate from './estimateUpdate';
import estimateCreate from './estimateCreate';
import estimateAddNewContributor from './estimateAddNewContributor';

const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateUpdate,
    estimateCreate,
    estimateAddNewContributor,
  }),
});

export default Mutation;
