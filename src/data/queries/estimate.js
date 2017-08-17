import { GraphQLString as StringType } from 'graphql';
import { EstimateOutputType } from '../types';
import {
  TokenError,
  MongoError,
  AccessDenied,
} from '../errors';
import {
  ACCESS_DENIED,
} from '../errors/types';

import {
  User,
  Estimate,
} from '../models';

const estimate = {
  type: EstimateOutputType,
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve(__, args, { user }) {
    const { id: _id } = args;


    if (!user) {
      throw new TokenError({});
    }

    try {
      const userId = user && user._id.toString();
      const currentEstimate = await Estimate.findOne({ _id });
      const { owner, contributors = [] } = currentEstimate;

      const userCanEditThisEstimate = !!user &&
            (owner === userId || contributors.indexOf(userId) > -1);

      if (!userCanEditThisEstimate) {
        throw new AccessDenied();
      }

      const contributorsObjs = await User.find(
        { _id: { $in: contributors } },
        { email: 1, name: 1, status: 1 },
      );

      const ownerObj = await User.findOne(
        { _id: owner },
        { email: 1, name: 1, status: 1 },
      );

      return {
        ...currentEstimate._doc,
        owner: ownerObj,
        userCanEditThisEstimate,
        contributors: contributorsObjs,
      };
    } catch (error) {
      if (error.name === ACCESS_DENIED) {
        throw new AccessDenied();
      }
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimate;
