import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

const EstimateAddNewContributor = new InputObjectType({
  name: 'estimateAddNewContributor',
  fields: {
    estimateId: {
      type: StringType,
    },
    userId: {
      type: StringType,
    },
    userEmail: {
      type: StringType,
    },
    username: {
      type: StringType,
    },
  },
});

export default EstimateAddNewContributor;
