import {
  GraphQLString as StringType,
} from 'graphql';

import {
  EstimateOutputType,
} from '../types';
import Estimate from '../../data/models/estimate';


const estimate = {
  type: EstimateOutputType,
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve(root, { id: _id }) {
    try {
      const currentEstimate = await Estimate.findOne({ _id }, (err, res) => {
        if (!err) console.error(err);

        return res;
      });

      return currentEstimate;
    } catch (err) {
      return console.error(err);
    }
  },
};

export default estimate;
