import {
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';
import {
  UsersOutputType,
} from '../types';
import { User } from '../models';
import {
  TokenError,
  MongoError,
} from '../errors';

const usersByEmail = {
  type: new ListType(UsersOutputType),
  args: {
    email: {
      type: StringType,
    },
  },
  async resolve(__, { email: inputEmail }, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    if (/^$|\s+/.test(inputEmail)) {
      return [];
    }

    try {
      const regexp = new RegExp(`^${inputEmail}`);
      const res = await User.find({ email: regexp });

      return res.map(({ _id, name, email }) => ({
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

export default usersByEmail;
