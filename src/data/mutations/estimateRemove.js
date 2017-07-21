import {
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
} from 'graphql';

import {
  UserError,
  MongoError,
} from '../errors';
import Estimate from '../models';

const estimateRemove = {
  type: BoolType,
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve({ request: { user } }, { id }) {
    if (!user) {
      throw new UserError({});
    }

    console.log(id);

    try {
      const { ok } = await Estimate.update({ _id: id }, { $set: { isRemoved: true } });

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateRemove;
