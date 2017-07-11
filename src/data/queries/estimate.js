import invariant from 'invariant';
import {
  GraphQLString as StringType,
} from 'graphql';
import {
  EstimateOutputType,
} from '../types';
import TokenError from '../errors/permissions';
import Estimate from '../../data/models/estimate';


const estimate = {
  type: EstimateOutputType,
  args: {
    id: {
      type: StringType,
    },
  },
  async resolve(_, args, req) {
    const { id: _id } = args;
    const { user } = req;
    const userId = user._id || null;
    try {
      // TODO: Improve secure
      const currentEstimate = await Estimate.findOne({ _id }, (err, res) => {
        if (!err) console.error(err);
        if (userId.toString() !== res.owner || user.role !== 'admin') {
          throw new TokenError({});
        }
        return res;
      });
      return currentEstimate;
    } catch (err) {
      return console.error(err);
    }
  },
};

export default estimate;
