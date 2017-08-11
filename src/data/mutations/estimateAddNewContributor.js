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
    const userId = user._id.toString();
    const userCanNotEditThisEstimate =
          !(owner === userId || contributors.indexOf(userId) > -1);

    if (userCanNotEditThisEstimate) {
      throw new AccessDenied({});
    }

    if (contributors.indexOf(_id) > -1) {
      throw new MongoError({ message: 'This users alreday added' });
    }

    try {
      let status = ACTIVE;
      let newContributorId = _id;

      if (newUser) {
        status = PENDING;

        let newContributor = await User.findOne({ email });

        if (!newContributor) {
          newContributor = new User({ email, status });
          await newContributor.save();
        }

        newContributorId = newContributor._id.toString();
      }

      await Estimate.update(
        { _id: estimateId },
        { $push: { contributors: newContributorId } },
      );

      sendEmail({
        emails: email,
        text: `Somebody added you to the estimate ${headers.referer}`,
      });

      return { name, email, status, _id: newContributorId };
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimateAddNewContributor;
