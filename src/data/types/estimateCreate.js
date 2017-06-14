import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const EstimateCreateType = new ObjectType({
  name: 'estimate',
  fields: {
    url: {
      type: StringType,
    },
  },
});

export default EstimateCreateType;
