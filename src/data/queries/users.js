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
  args: {},
  async resolve(_, { query }, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    try {
      const res = await Users.find({ _id: { $nin: req.user._id } });

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
