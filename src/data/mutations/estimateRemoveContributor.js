import {
  GraphQLBoolean as BoolType,
} from 'graphql';
import { Estimate } from '../models';
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
  async resolve({ request: { user } }, { input: { _id, estimateId } }) {
    if (!user) {
      throw new UserError({});
    }

    const userId = user._id.toString();
    const { owner, contributors = [] } = await Estimate.findOne({ _id: estimateId });
    const userCanNotEditThisEstimate =
          !(owner === userId || contributors.indexOf(userId) > -1);

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }


    try {
      const { ok } = await Estimate.update(
        { _id: estimateId },
        { $pull: { contributors: _id } },
      );

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateRemoveContributor;
