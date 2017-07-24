import {
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';
import {
  UsersOutputType,
} from '../types';
import Users from '../../models/user';
import {
  TokenError,
  MongoError,
} from '../errors';


const usersList = {
  type: new ListType(UsersOutputType),
  args: {
    query: {
      type: StringType,
    },
  },
  async resolve(_, { query }, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    try {
      const res = await Users.find({
        $text: { $search: 'nazar' },
      });

      console.log(res);

      return [{ email: 'e', name: 'aa' }];
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default usersList;
