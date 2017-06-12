import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

const EstimateType = new ObjectType({
  name: 'estimate',
  fields: {
    Main: { type: ObjectType },
    Header: { type: ObjectType },
    original: { type: StringType },
  },
});

export default EstimateType;
