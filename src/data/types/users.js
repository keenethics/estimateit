import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';


const UsersOutputType = new ObjectType({
  name: 'ManagersListOutputType',
  fields: () => ({
    name: {
      type: StringType,
    },
    email: {
      type: StringType,
    },
  }),
});


export default UsersOutputType;
