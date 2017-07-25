import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import Mutation from './mutations';


import {
  estimate,
  usersList,
  allEstimates,
} from './queries';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      estimate,
      usersList,
      allEstimates,
    },
  }),
  mutation: Mutation,
});

export default schema;
