import {
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';
import {
  UsersOutputType,
} from '../types';
import Users from '../../data/models/user';
import {
  TokenError,
  MongoError,
} from '../errors';
import Estimate from '../../data/models/estimate';

const usersByEmail = {
  type: new ListType(UsersOutputType),
  args: {
    email: {
      type: StringType,
    },
  },
  async resolve(__, { email }, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    if (/^$|\s+/.test(email)) {
      return [];
    }

    try {
      const regexp = new RegExp(`^${email}`);
      const res = await Users.find({
        $or: [
          { 'google.email': regexp },
          { 'local.email': regexp },
        ] });

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

export default usersByEmail;
