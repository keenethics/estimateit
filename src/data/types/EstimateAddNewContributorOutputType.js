import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';


const EstimateAddNewContributorOutputType = new ObjectType({
  name: 'EstimateAddNewContributorOutputType',
  fields: {
    _id: {
      type: StringType,
    },
    email: {
      type: StringType,
    },
    name: {
      type: StringType,
    },
    status: {
      type: StringType,
    },
  },
});

export default EstimateAddNewContributorOutputType;
