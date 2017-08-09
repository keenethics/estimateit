import {
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

const EstimateAddNewContributor = new InputObjectType({
  name: 'estimateAddNewContributor',
  fields: {
    estimateId: {
      type: StringType,
    },
    _id: {
      type: StringType,
    },
    email: {
      type: StringType,
    },
    name: {
      type: StringType,
    },
    newUser: {
      type: BoolType,
    },
  },
});

export default EstimateAddNewContributor;
