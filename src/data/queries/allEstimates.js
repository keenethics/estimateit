import {
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';

import {
  TokenError,
  MongoError,
} from '../errors';
import {
  EstimateOutputType,
} from '../types';
import Estimate from '../../data/models/estimate';


const estimates = {
  type: new ListType(EstimateOutputType),
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve(_, args, req) {
    if (!req.user) {
      throw new TokenError({});
    }

    try {
      const { user: { _id: userId } } = req;
      const allEstimates = await Estimate.find({
        $or: [
          { owner: userId },
          { 'contributors.userId': userId.toString() },
        ],
        isRemoved: { $exists: false },
      });

      return allEstimates;
    } catch (error) {
      console.error(error);
      throw new MongoError({ message: error.message });
    }
  },
};

export default estimates;
