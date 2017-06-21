import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,

} from 'graphql';
import Mutation from './mutations/createEstimate';


import {
  estimate,
} from './queries';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      estimate,
    },
  }),
  mutation: Mutation,
});

export default schema;
