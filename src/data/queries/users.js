import {
  GraphQLList as ListType,
} from 'graphql';
import {
  UsersOutputType,
} from '../types';
import Users from '../../data/models/user';
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
      const res = await Users.find();

      return res.map(({ _id, google, local }) => ({
        _id,
        name: google.name ? google.name : local.name,
        email: google.email ? google.email : local.email,
      }));
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default usersList;
