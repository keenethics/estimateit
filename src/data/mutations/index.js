import {
  GraphQLObjectType as ObjectType,
} from 'graphql';

import estimateUpdate from './estimateUpdate';
import estimateCreate from './estimateCreate';
import estimateRemove from './estimateRemove';
import estimateAddNewContributor from './estimateAddNewContributor';
import estimateRemoveContributor from './estimateRemoveContributor';


const Mutation = new ObjectType({
  name: 'EstimateMutation',
  description: 'Estimate',
  fields: () => ({
    estimateUpdate,
    estimateCreate,
    estimateRemove,
    estimateAddNewContributor,
    estimateRemoveContributor,
  }),
});

export default Mutation;
