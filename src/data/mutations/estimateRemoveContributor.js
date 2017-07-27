import Estimate from '../models';
import User from '../../models/user';
import {
  UserError,
  MongoError,
} from '../errors';
import { EstimateRemoveContributor } from '../types';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';


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

    try {
      const { ok } = await Estimate.update(
        { _id: estimateId },
        { $pull: { users: { userId } } },
      );

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateRemoveContributor;
