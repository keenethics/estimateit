import {
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';
import {
  EstimateOutputType,
} from '../types';
import Estimate from '../../data/models/estimate';
import { TokenError } from '../errors';


const estimates = {
  type: new ListType(EstimateOutputType),
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve(_, args, req) {
    const { user: { role: userRole = null, _id: userId } } = req;
    let allEstimates;
    if (userRole !== 'customer') {
      allEstimates = await Estimate.find();
    } else {
      allEstimates = await Estimate.find({ owner: userId });
    }
    if (!req.user) {
      throw new TokenError({});
    }
    return allEstimates;
  },
};

export default estimates;
