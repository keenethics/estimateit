import { GraphQLString as StringType } from 'graphql';
import { EstimateOutputType } from '../types';
import { TokenError } from '../errors';
import Estimate from '../../data/models/estimate';
import isEmpty from '../../utils/index';


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
    const currentEstimate = await Estimate.findOne({ _id });
    if (isEmpty(currentEstimate)) {
      throw new TokenError({});
    }
    if (userId.toString() !== currentEstimate.owner && userRole !== 'manager') {
      throw new TokenError({});
    }
    return currentEstimate;
  },
};

export default estimate;
