import {
  GraphQLList as ListType,
  GraphQLString as StringType,
} from 'graphql';

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
  async resolve(root, { id: _id = 1 }) {
    try {
      const currentEstimate = await Estimate.find();

      return currentEstimate;
    } catch (err) {
      return console.error(err);
    }
  },
};

export default estimates;
