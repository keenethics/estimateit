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
  async resolve(_, args) {
    const { id: _id } = args;

    const currentEstimate = await Estimate.findOne({ _id });
    if (isEmpty(currentEstimate)) {
      throw new TokenError({});
    }

    return currentEstimate;
  },
};

export default estimate;
