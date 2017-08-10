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
import {
  ACTIVE,
} from '../../constants/userStatus';

const usersList = {
  type: new ListType(UsersOutputType),
  args: {},
  async resolve(_, { query }, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    try {
      const res = await User.find();

      const activeUsers = [];

      res.reduce((acc, item, index) => {
        if (index === 1 && acc.statuc === ACTIVE) {
          activeUsers.push(acc);
        }

        if (item.status === ACTIVE) {
          activeUsers.push(item);
        }
        return item;
      });

      return activeUsers;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default usersList;
