import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import Mutation from './mutations';


import {
  estimate,
  allEstimates,
  usersByEmail,
} from './queries';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      estimate,
      allEstimates,
      usersByEmail,
    },
  }),
  mutation: Mutation,
});

export default schema;
