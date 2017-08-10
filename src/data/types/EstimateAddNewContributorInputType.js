import {
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
  GraphQLInputObjectType as InputObjectType,
} from 'graphql';

const EstimateAddNewContributorInputType = new InputObjectType({
  name: 'EstimateAddNewContributorInputType',
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

export default EstimateAddNewContributorInputType;
