import {
  GraphQLBoolean as BoolType,
} from 'graphql';

import {
  UserError,
  MongoError,
  AccessDenied,
  WarningOfOutdating,
} from '../errors';
import {
  EstimateInputType,
} from '../types';
import { Estimate } from '../models';


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

    const {
      owner,
      contributors = [],
      date
    } = await Estimate.findOne({ _id: input._id });

    const oldDate = new Date(date).toString();
    if (oldDate !== input.date && !input.forceUpdate) {
      throw new WarningOfOutdating({ message: 'current estimate is outdated' });
    }

    const userId = user._id.toString();
    const userCanNotEditThisEstimate =
          !(owner === userId || contributors.includes(userId));

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }

    try {
      const { _id } = input;
      const { ok } = await Estimate.update({ _id }, { $set: { ...input, date: new Date().toISOString() } });
      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateUpdate;
