import _ from 'underscore';

import {
  User,
  Estimate,
} from '../models';

import {
  UserError,
  MongoError,
  AccessDenied,
} from '../errors';
import {
  EstimateAddNewContributorInputType,
  EstimateAddNewContributorOutputType,
} from '../types';
import sendEmail from '../../core/sendEmail';
import {
  ACTIVE,
  PENDING,
} from '../../constants/userStatus';

const estimateAddNewContributor = {
  type: EstimateAddNewContributorOutputType,
  args: {
    input: {
      type: EstimateAddNewContributorInputType,
    },
  },
  async resolve(
    { request: { user, headers } },
    { input: { estimateId, name, _id, email, newUser } },
  ) {
    if (!user) {
      throw new UserError({});
    }

    const { owner, contributors = [] } = await Estimate.findOne({ _id: estimateId });
    const currentUserId = user._id.toString();
    const userCanNotEditThisEstimate =
          !(owner._id === currentUserId || _.findWhere(contributors, { userId: currentUserId }));

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }

    if (_.findWhere(contributors, { _id })) {
      throw new MongoError({ message: 'This users alreday added' });
    }

    try {
      if (newUser) {
        let newContributor = User.findOne({ email });

        if (!newContributor) {
          newContributor = new User({ email, status: PENDING });
          await newContributor.save();
        }

        await Estimate.update(
          { _id: estimateId },
          { $push: { contributors: {
            email,
            status: PENDING,
            _id: newContributor._id.toString(),
          } } },
        );

        sendEmail({
          emails: email,
          text: `Somebody added you to the estimate ${headers.referer}`,
        });

        return { name, email, status: PENDING, _id: newContributor._id.toString() };
      }

      await Estimate.update(
        { _id: estimateId },
        { $push: { contributors: { _id, name, email, status: ACTIVE } } },
      );

      sendEmail({
        emails: email,
        text: `Somebody added you to the estimate ${headers.referer}`,
      });

      return { email, satus: ACTIVE, name, _id };
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateAddNewContributor;
