import Estimate from '../models';
import User from '../../models/user';
import { UserError } from '../errors';
import { EstimateAddNewContributor } from '../types';
import {
  GraphQLBoolean as BoolType,
} from 'graphql';


const estimateAddNewContributor = {
  type: BoolType,
  args: {
    input: {
      type: EstimateAddNewContributor,
    },
  },
  async resolve({ request: { user } }, { input: { estimateId, username, userId, userEmail }}) {
    if (!user) {
      throw new UserError({});
    }
    // user already added???
    const { users = [] } = await Estimate.find({ _id: estimateId });
    const res = await Estimate.update(
      { _id: estimateId },
      { $push: { users: { userId, username, userEmail } } },
    );

    // let url;
    // const { _id: userId } = user;
    //
    // try {
    //   const newEstimate = new Estimate({ owner: userId });
    //   const { _id } = await newEstimate.save();
    //
    //   url = `estimate/${_id}`;
    // } catch (error) {
    //   return console.error(error);
    // }

    return true;
  },
};

export default estimateAddNewContributor;
