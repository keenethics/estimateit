import {
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

const EstimateRemoveContributor = new InputObjectType({
  name: 'estimateRemoveContributor',
  fields: {
    _id: {
      type: StringType,
    },
    estimateId: {
      type: StringType,
    },
  },
});

export default EstimateRemoveContributor;
