import _ from 'underscore';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';
import Estimate from '../models';

import {
  UserError,
  MongoError,
} from '../errors';
import { EstimateAddNewContributor } from '../types';


const estimateAddNewContributor = {
  type: BoolType,
  args: {
    input: {
      type: EstimateAddNewContributor,
    },
  },
  async resolve({ request: { user } }, { input: { estimateId, username, userId, userEmail } }) {
    if (!user) {
      throw new UserError({});
    }

    const { users = [] } = await Estimate.findOne({ _id: estimateId });

    if (_.findWhere(users, { userId })) {
      throw new MongoError({ message: 'This users alreday added' });
    }

    try {
      const { ok } = await Estimate.update(
        { _id: estimateId },
        { $push: { users: { userId, username, userEmail } } },
      );

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateAddNewContributor;
