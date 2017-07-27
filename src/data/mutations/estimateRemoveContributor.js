import Estimate from '../models';
import User from '../../models/user';
import { UserError } from '../errors';
import { EstimateRemoveContributor } from '../types';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';


const estimateRemoveContributor = {
  type: BoolType,
  args: {
    input: {
      type: EstimateRemoveContributor,
    },
  },
  async resolve({ request: { user } }, { input: { userId } }) {
    if (!user) {
      throw new UserError({});
    }
    console.log(userId);
    // user already added???
    // const { users = [] } = await Estimate.find({ _id: estimateId });
    // const res = await Estimate.update(
    //   { _id: estimateId },
    //   { $push: { users: { userId, username, userEmail } } },
    // );

    return true;
  },
};

export default estimateRemoveContributor;
