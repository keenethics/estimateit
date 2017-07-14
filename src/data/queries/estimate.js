import { GraphQLString as StringType } from 'graphql';
import { EstimateOutputType } from '../types';
import { TokenError } from '../errors';
import Estimate from '../../data/models/estimate';

const estimate = {
  type: EstimateOutputType,
  args: {
    id: {
      type: StringType,
    },
  },
  // TODO: Improve search secure
  async resolve(_, args, req) {
    const { id: _id } = args;
    const { user: { role: userRole = null, id: userId = null } } = req;
    let currentEstimate;
    try {
      currentEstimate = await Estimate.findOne({ _id });
    } catch (err) {
      return console.error(err);
    }
    if (userId.toString() !== currentEstimate.owner && userRole !== 'admin') {
      throw new TokenError({});
    }
    return currentEstimate;
  },
};

export default estimate;
