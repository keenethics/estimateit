import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const EstimateCreateType = new ObjectType({
  name: 'estimateCreateResponse',
  fields: {
    url: {
      type: StringType,
    },
  },
});

export default EstimateCreateType;
