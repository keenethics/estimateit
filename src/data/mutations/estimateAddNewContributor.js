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
import { EstimateAddNewContributor } from '../types';
import sendEmail from '../../core/sendEmail';

const estimateAddNewContributor = {
  type: BoolType,
  args: {
    input: {
      type: EstimateAddNewContributor,
    },
  },
  async resolve(
    { request: { user, headers } },
    { input: { estimateId, username, userId, userEmail } },
  ) {
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

    if (_.findWhere(contributors, { userId })) {
      throw new MongoError({ message: 'This users alreday added' });
    }

    try {
      const { ok } = await Estimate.update(
        { _id: estimateId },
        { $push: { contributors: { userId, username, userEmail } } },
      );

      sendEmail({
        emails: userEmail,
        text: `Somebody added you to the estimate ${headers.referer}`,
      });

      return ok;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateAddNewContributor;
