import {
  GraphQLBoolean as BoolType,
} from 'graphql';

import {
  UserError,
  MongoError,
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
