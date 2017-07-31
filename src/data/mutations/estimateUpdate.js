import _ from 'underscore';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';

import {
  UserError,
  MongoError,
  AccessDenied,
} from '../errors';
import {
  EstimateInputType,
} from '../types';
import Estimate from '../models';

const estimateUpdate = {
  type: BoolType,
  args: {
    input: {
      type: EstimateInputType,
    },
  },
  async resolve({ request: { user } }, { input }) {
    if (!user) {
      throw new UserError({});
    }

    const { owner, users: contributors = [] } = await Estimate.findOne({ _id: input._id });
    const userId = user._id.toString();
    const userCanNotEditThisEstimate =
      !(owner === userId || _.findWhere(contributors, { userId }));

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }

    try {
      const { _id } = input;

      const { ok } = await Estimate.update({ _id }, { $set: { ...input } });

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateUpdate;
