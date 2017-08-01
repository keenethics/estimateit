import _ from 'underscore';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';
import Estimate from '../models';
import {
  UserError,
  MongoError,
  AccessDenied,
} from '../errors';
import { EstimateRemoveContributor } from '../types';

const estimateRemoveContributor = {
  type: BoolType,
  args: {
    input: {
      type: EstimateRemoveContributor,
    },
  },
  async resolve({ request: { user } }, { input: { userId, estimateId } }) {
    if (!user) {
      throw new UserError({});
    }

    const { owner, contributors = [] } = await Estimate.findOne({ _id: estimateId });

    const currentUserId = user._id.toString();
    const userCanNotEditThisEstimate =
          !(owner === currentUserId || _.findWhere(contributors, { userId: currentUserId }));

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }


    try {
      const { ok } = await Estimate.update(
        { _id: estimateId },
        { $pull: { contributors: { userId } } },
      );

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateRemoveContributor;
