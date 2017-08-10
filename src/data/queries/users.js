import {
  GraphQLList as ListType,
} from 'graphql';
import {
  UsersOutputType,
} from '../types';
import { User } from '../models';
import {
  TokenError,
  MongoError,
} from '../errors';

const usersList = {
  type: new ListType(UsersOutputType),
  args: {},
  async resolve(_, { query }, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    try {
      const res = await User.find();

      return res.map(({ _id, email, name }) => ({
        _id,
        name,
        email,
      }));
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default usersList;
