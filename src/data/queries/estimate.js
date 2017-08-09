import _ from 'underscore';
import { GraphQLString as StringType } from 'graphql';
import { EstimateOutputType } from '../types';
import { MongoError } from '../errors';
import { Estimate } from '../models';

const estimate = {
  type: EstimateOutputType,
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve(__, args, { user }) {
    const { id: _id } = args;
    try {
      const userId = user && user._id.toString();
      const currentEstimate = await Estimate.findOne({ _id });
      const { owner, contributors } = currentEstimate;
      currentEstimate.userCanEditThisEstimate = !!user &&
            (owner._id === userId || _.findWhere(contributors, { userId }));

      return currentEstimate;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimate;
