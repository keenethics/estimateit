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

    const { owner, contributors = [], date } = await Estimate.findOne({ _id: input._id });

    console.log('<BEGIN>');
    const oldDate = new Date(date).toString();
    console.log(oldDate, '===', (oldDate === input.date),'===', input.date);

    if (oldDate !== input.date && !input.forceSave) throw new MongoError({ message: 'outdated' })

    console.log('<END>');

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
