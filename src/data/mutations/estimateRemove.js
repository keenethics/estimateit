import _ from 'underscore';
import {
  GraphQLBoolean as BoolType,
  GraphQLString as StringType,
} from 'graphql';

import {
  UserError,
  MongoError,
  AccessDenied,
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

    const { owner, users: contributors } = await Estimate.findOne({ _id: id });
    const userCanNotEditThisEstimate =
      !(owner === user._id || _.findWhere(contributors, { userId: user._id.toString() }));

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }

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
